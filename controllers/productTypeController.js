import { prisma } from "../config/db.js";
import {
  createProductTypeValidator,
  updateProductTypeValidator,
} from "../validation/productTypeValidation.js";

export const getAllTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || undefined;

    const query = { skip: (page - 1) * limit || 0 };
    if (limit) {
      query.take = limit;
    }
    const types = await prisma.product_types.findMany({
      include: { products: true },
      where: { is_deleted: false },
      ...query,
    });

    return res.status(200).json({ success: true, data: types });
  } catch (error) {
    console.log("Error get all types", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getType = async (req, res) => {
  const type_id = req.params.id;

  try {
    const type = await prisma.product_types.findUnique({
      where: { type_id },
      include: { products: true },
    });

    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Product type not found" });
    }

    return res.status(200).json({ success: true, data: type });
  } catch (error) {
    console.log("Error get type: ", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const createType = async (req, res) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await createProductTypeValidator.validateAsync(data);

    const [checkTypeName] = await Promise.all([
      prisma.product_types.findUnique({ where: { name: data.name } }),
    ]);

    if (checkTypeName) {
      return res
        .status(409)
        .json({ success: false, message: "Product type name already exists" });
    }

    const newType = await prisma.product_types.create({ data });

    return res.status(201).json({ success: true, data: newType });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }
    console.log(error);
    console.error("Error creating product type:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteType = async (req, res) => {
  const type_id = req.params.id;

  try {
    const checkType = await prisma.product_types.findUnique({
      where: { type_id },
    });

    if (!checkType) {
      return res
        .status(404)
        .json({ success: false, messages: "Product type not found" });
    }

    await prisma.product_types.update({
      where: { type_id },
      data: { is_deleted: true },
    });

    return res
      .status(200)
      .json({ success: true, messages: "Delete product type successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, messages: "Internal Server Error" });
  }
};

export const updateType = async (req, res) => {
  try {
    const type_id = req.params.id;
    const data = req.body;

    console.log("Data to update:", data);
    console.log("Type ID:", type_id);
    if (!Object.keys(data).length) {
      return res
        .status(400)
        .json({ success: false, message: "No updated data provided" });
    }

    await updateProductTypeValidator.validateAsync(data);

    const existingType = await prisma.product_types.findUnique({
      where: { type_id },
    });

    if (!existingType) {
      return res
        .status(404)
        .json({ success: false, message: "Product type not found" });
    }
    console.log(data, "!!");
    if (data.type_id && data.type_id !== type_id) {
      const checkTypeId = await prisma.product_types.findUnique({
        where: { type_id: data.type_id },
      });
      if (checkTypeId) {
        return res
          .status(409)
          .json({ success: false, message: "Product type ID already exists" });
      }
    }

    if (data.name) {
      const checkTypeName = await prisma.product_types.findUnique({
        where: { name: data.name },
      });
      if (checkTypeName && checkTypeName.type_id !== type_id) {
        return res.status(409).json({
          success: false,
          message: "Product type name already exists",
        });
      }
    }

    const updatedType = await prisma.product_types.update({
      where: { type_id },
      data,
    });
    console.log(data, "DATAHERE");
    return res.status(200).json({ success: true, data: updatedType });
  } catch (error) {
    if (error?.details) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.error("Error updating product type:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
