import {
  createSupplierValidation,
  updateSupplierValidator,
} from "../validation/supplierValidation.js";
import { prisma } from "../config/db.js";

export const getAllSuppliers = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  try {
    const totalItems = await prisma.suppliers.count({
      where: { is_deleted: false },
    });
    const suppliers = await prisma.suppliers.findMany({
      where: { is_deleted: false },
      skip,
      take: limitNumber,
      include: {
        products: true,
        purchase_orders: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: suppliers,
      totalItems,
      totalPages: page ? Math.ceil(totalItems / parseInt(limit)) : 1,
      currentPage: page ? parseInt(page) : 1,
    });
  } catch (error) {
    console.log("Error get all suppliers:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getSupplier = async (req, res) => {
  const supplier_id = req.params.id;
  try {
    const supplier = await prisma.suppliers.findUnique({
      where: { supplier_id },
      include: { products: true, purchase_orders: true },
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    return res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    console.log("Error get supplier:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const createSupplier = async (req, res) => {
  const data = req.body;
  try {
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await createSupplierValidation.validateAsync(data);

    const newSupplier = await prisma.suppliers.create({ data: data });

    return res.status(200).json({ sucess: true, data: newSupplier });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.log("Error creating supplier:", error);

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteSupplier = async (req, res) => {
  const supplier_id = req.params.id;

  try {
    const checkSupplier = await prisma.suppliers.findUnique({
      where: { supplier_id },
    });

    if (!checkSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    await prisma.suppliers.update({
      where: { supplier_id },
      data: { is_deleted: true },
    });

    return res
      .status(200)
      .json({ success: true, message: "Delete supplier successfully" });
  } catch (error) {
    console.log("Error delete supplier:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSupplier = async (req, res) => {
  const supplier_id = req.params.id;
  const data = req.body;

  try {
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No updated data provided" });
    }

    await updateSupplierValidator.validateAsync(data);

    const checkSupplier = await prisma.suppliers.findUnique({
      where: { supplier_id },
    });

    if (!checkSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found" });
    }

    if (data.supplier_id && data.supplier_id !== supplier_id) {
      const checkTypeId = await prisma.suppliers.findUnique({
        where: { supplier_id: data.supplier_id },
      });
      if (checkTypeId) {
        return res.status(409).json({
          success: false,
          message: "Supplier ID already exists",
        });
      }
    }
    const updatedSupplier = await prisma.suppliers.updateManyAndReturn({
      where: { supplier_id },
      data: data,
    });

    return res.status(200).json({ success: true, data: updatedSupplier });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    } else {
      console.log("Error update supplier:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};
