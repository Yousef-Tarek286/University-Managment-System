import materialService from "../services/material.service.js";

const parsePositiveInt = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : null;
};

const uploadMaterial = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.id);
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { title, description } = req.body;
    const material = await materialService.uploadMaterial({
      courseId,
      file: req.file,
      title,
      description,
      uploadedById: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      data: material,
    });
  } catch (error) {
    console.error("Upload material error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to upload material",
    });
  }
};

const getCourseMaterials = async (req, res) => {
  try {
    const courseId = parsePositiveInt(req.params.id);
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const materials = await materialService.getMaterialsByCourse(courseId);

    return res.status(200).json({
      success: true,
      message: "Materials retrieved successfully",
      data: materials,
    });
  } catch (error) {
    console.error("Get materials error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch materials",
    });
  }
};

const downloadMaterial = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid material ID",
      });
    }

    const result = await materialService.getMaterialDownloadUrl(id);

    return res.status(200).json({
      success: true,
      message: "Download link generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Download material error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to download material",
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const id = parsePositiveInt(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid material ID",
      });
    }

    await materialService.deleteMaterial(id);

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Delete material error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete material",
    });
  }
};

export default {
  uploadMaterial,
  getCourseMaterials,
  downloadMaterial,
  deleteMaterial,
};
