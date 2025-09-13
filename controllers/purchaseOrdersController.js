import { prisma } from "../config/db.js";
import {
  createPurchaseOrderValidator,
  updatePurchaseOrderValidator,
} from "../validation/purchaseOrdersValidation.js";

export const getAllPurchaseOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await prisma.purchase_orders.count();

    const purchaseOrders = await prisma.purchase_orders.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        supplier: true,
        purchase_order_details: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      error2: error.toString(),
    });
  }
};

export const getPurchaseOrder = async (req, res) => {
  const purchase_order_id = req.params.orderId;

  try {
    const purchaseOrder = await prisma.purchase_orders.findUnique({
      where: { purchase_order_id },
      include: {
        supplier: true,
        purchase_order_details: {
          include: {
            product: true,
          },
        },
      },
    });

    if (purchaseOrder) {
      return res.status(200).json({ success: true, data: purchaseOrder });
    }

    return res
      .status(404)
      .json({ success: false, message: "No purchase order was found" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const createPurchaseOrder = async (req, res) => {
  const { supplier_id } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    // await createPurchaseOrderValidator.validateAsync(req.body);

    const checkSupplier = await prisma.suppliers.findUnique({
      where: { supplier_id: supplier_id },
    });

    if (!checkSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier was not valid" });

    const newPurchaseOrder = await prisma.purchase_orders.create({
      data: {
        supplier_id,
      },
      include: {
        supplier: true,
        purchase_order_details: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(201).json({ success: true, data: newPurchaseOrder });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  const purchase_order_id = req.params.orderId;
  try {
    const checkPurchaseOrder = await prisma.purchase_orders.findMany({
      where: { purchase_order_id },
    });

    if (checkPurchaseOrder) {
      await prisma.purchase_order_details.deleteMany({
        where: { purchase_order_id },
      });
      await prisma.purchase_orders.deleteMany({ where: { purchase_order_id } });
      return res
        .status(200)
        .json({ success: true, message: "Delete purchase order successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No purchase order was found" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.toString(),
    });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  const purchase_order_id = req.params.id;
  const { supplier_id } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await updatePurchaseOrderValidator.validateAsync(req.body);

    const oldPurchaseOrder = await prisma.purchase_orders.findUnique({
      where: { purchase_order_id },
    });
    if (!oldPurchaseOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase order not found" });
    }

    const checkSupplier = await prisma.users.findUnique({
      where: { supplier_id: supplier_id },
    });

    if (!checkSupplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier was not valid" });

    const updatedPurchaseOrder = await prisma.purchase_orders.update({
      where: { purchase_order_id },
      data: {
        supplier_id: supplier_id ?? oldPurchaseOrder.supplier_id,
      },
      include: {
        supplier: true,
        purchase_order_details: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: updatedPurchaseOrder });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
