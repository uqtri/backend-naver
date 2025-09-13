import { prisma } from "../config/db.js";
import {
  createInventoryReportDetailValidator,
  updateInventoryReportDetailValidator,
} from "../validation/inventoryReportDetailsValidation.js";

export const getAllInventoryReportDetails = async (req, res) => {
  try {
    const inventoryReportDetails =
      await prisma.inventory_report_details.findMany({
        include: {
          belongs_to: true,
          product: true,
        },
      });
    return res
      .status(200)
      .json({ success: true, data: inventoryReportDetails });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const getInventoryReportDetail = async (req, res) => {
  const report_id = req.params.reportId;
  const product_id = req.params.productId;

  try {
    const inventoryReportDetail =
      await prisma.inventory_report_details.findUnique({
        where: {
          report_id_product_id: {
            report_id,
            product_id,
          },
        },
        include: {
          belongs_to: true,
          product: true,
        },
      });

    if (inventoryReportDetail) {
      return res
        .status(200)
        .json({ success: true, data: inventoryReportDetail });
    }

    return res.status(404).json({
      success: false,
      message: "No inventory report detail was found",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const createInventoryReportDetail = async (req, res) => {
  const { report_id, product_id, begin_stock, buy_quantity, sell_quantity } =
    req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await createInventoryReportDetailValidator.validateAsync(req.body);

    const [checkReport, checkProduct] = await Promise.all([
      prisma.inventory_reports.findUnique({ where: { report_id } }),
      prisma.products.findUnique({ where: { product_id } }),
    ]);

    if (!checkReport)
      return res
        .status(404)
        .json({ success: false, message: "Inventory report not found" });
    if (!checkProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const newInventoryReportDetail =
      await prisma.inventory_report_details.create({
        data: {
          report_id,
          product_id,
          begin_stock,
          buy_quantity,
          sell_quantity,
          end_stock: begin_stock + buy_quantity - sell_quantity,
        },
        include: {
          belongs_to: true,
          product: true,
        },
      });

    return res
      .status(201)
      .json({ success: true, data: newInventoryReportDetail });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteInventoryReportDetail = async (req, res) => {
  const report_id = req.params.reportId;
  const product_id = req.params.productId;

  try {
    const checkInventoryReportDetail =
      await prisma.inventory_report_details.findUnique({
        where: {
          report_id_product_id: {
            report_id,
            product_id,
          },
        },
      });

    if (checkInventoryReportDetail) {
      await prisma.inventory_report_details.delete({
        where: {
          report_id_product_id: {
            report_id,
            product_id,
          },
        },
      });
      return res.status(200).json({
        success: true,
        message: "Delete inventory report detail successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No inventory report detail was found",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateInventoryReportDetail = async (req, res) => {
  const report_id = req.params.reportId;
  const product_id = req.params.productId;
  const { begin_stock, buy_quantity, sell_quantity } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    await updateInventoryReportDetailValidator.validateAsync(req.body);

    const oldInventoryReportDetail =
      await prisma.inventory_report_details.findUnique({
        where: {
          report_id_product_id: {
            report_id,
            product_id,
          },
        },
      });

    if (!oldInventoryReportDetail) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory report detail not found" });
    }

    const [checkReport, checkProduct] = await Promise.all([
      prisma.inventory_reports.findUnique({ where: { report_id } }),
      prisma.products.findUnique({ where: { product_id } }),
    ]);

    if (!checkReport)
      return res
        .status(404)
        .json({ success: false, message: "Inventory report not found" });
    if (!checkProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const updatedInventoryReportDetail =
      await prisma.inventory_report_details.update({
        where: {
          report_id_product_id: {
            report_id,
            product_id,
          },
        },
        data: {
          begin_stock: begin_stock ?? oldInventoryReportDetail.begin_stock,
          buy_quantity: buy_quantity ?? oldInventoryReportDetail.buy_quantity,
          sell_quantity:
            sell_quantity ?? oldInventoryReportDetail.sell_quantity,
          end_stock:
            (begin_stock ?? oldInventoryReportDetail.begin_stock) +
            (buy_quantity ?? oldInventoryReportDetail.buy_quantity) -
            (sell_quantity ?? oldInventoryReportDetail.sell_quantity),
        },
        include: {
          belongs_to: true,
          product: true,
        },
      });

    return res
      .status(200)
      .json({ success: true, data: updatedInventoryReportDetail });
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
