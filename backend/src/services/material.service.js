import path from "path";
import prisma from "../config/prisma.js";
import supabase from "../supabase.js";

const STORAGE_BUCKET = "materials";

const sanitizeFileName = (originalName) => {
  const baseName = path.basename(originalName || "file");
  return baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const uploadMaterial = async ({ courseId, file, title, description, uploadedById }) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const safeName = sanitizeFileName(file.originalname);
  const storagePath = `courses/${courseId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) {
    const error = new Error(uploadError.message || "Storage upload failed");
    error.statusCode = 500;
    throw error;
  }

  return prisma.courseMaterial.create({
    data: {
      title: title?.trim() || file.originalname,
      description: description?.trim() || null,
      fileName: file.originalname,
      filePath: storagePath,
      fileType: file.mimetype,
      fileSize: file.size,
      courseId,
      uploadedById,
    },
  });
};

const getMaterialsByCourse = async (courseId) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.courseMaterial.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
};

const getMaterialDownloadUrl = async (id) => {
  const material = await prisma.courseMaterial.findUnique({ where: { id } });

  if (!material) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(material.filePath, 60, {
      download: material.fileName,
    });

  if (error || !data?.signedUrl) {
    const err = new Error("Failed to generate download link");
    err.statusCode = 500;
    throw err;
  }

  return {
    downloadUrl: data.signedUrl,
    fileName: material.fileName,
  };
};

const deleteMaterial = async (id) => {
  const material = await prisma.courseMaterial.findUnique({ where: { id } });

  if (!material) {
    const error = new Error("Material not found");
    error.statusCode = 404;
    throw error;
  }

  const { error: removeError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([material.filePath]);

  if (removeError) {
    console.error("Supabase remove warning:", removeError);
  }

  await prisma.courseMaterial.delete({ where: { id } });
};

export default {
  uploadMaterial,
  getMaterialsByCourse,
  getMaterialDownloadUrl,
  deleteMaterial,
};
