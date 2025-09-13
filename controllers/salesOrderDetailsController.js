import {
  createSalesOrderDetailsValidator,
  getSalesOrderDetailsValidator,
  updateSalesOrderDetailsValidator,
  deleteSalesOrderDetailsValidator,
} from "../validation/salesOrderDetailsValidation.js";
import { prisma } from "../config/db.js";

export const getAllSalesOrderDetails = async (req, res) => {
  const sales_order_id = req.params.sales_order_id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalItems = await prisma.sales_order_details.count({
      where: { sales_order_id },
    });

    const salesOrderDetails = await prisma.sales_order_details.findMany({
      where: { sales_order_id },
      skip,
      take: limit,
      include: {
        product: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sales order details retrieved successfully",
      data: salesOrderDetails,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSalesOrderDetails = async (req, res) => {
  const { sales_order_id, product_id } = req.params;

  try {
    await getSalesOrderDetailsValidator.validateAsync(req.params);
    const salesOrderDetails = await prisma.sales_order_details.findMany({
      where: {
        sales_order_id: sales_order_id,
        product_id: product_id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sales order details retrieved successfully",
      data: salesOrderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const createSalesOrderDetails = async (req, res) => {
  const { sales_order_id, product_id, quantity, total_price } = req.body;

  try {
    await createSalesOrderDetailsValidator.validateAsync(req.body);

    const existingDetail = await prisma.sales_order_details.findUnique({
      where: {
        sales_order_id_product_id: {
          sales_order_id,
          product_id,
        },
      },
    });

    if (existingDetail) {
      const updatedDetail = await prisma.sales_order_details.update({
        where: {
          sales_order_id_product_id: {
            sales_order_id,
            product_id,
          },
        },
        data: {
          quantity: existingDetail.quantity + quantity,
          total_price: existingDetail.total_price + total_price,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm trong đơn hàng thành công",
        data: updatedDetail,
      });
    }

    const newSalesOrderDetail = await prisma.sales_order_details.create({
      data: {
        sales_order_id,
        product_id,
        quantity,
        total_price,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Thêm sản phẩm vào đơn hàng thành công",
      data: newSalesOrderDetail,
    });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateSalesOrderDetails = async (req, res) => {
  const { quantity, total_price } = req.body;
  const { product_id, sales_order_id } = req.params;
  try {
    await updateSalesOrderDetailsValidator.validateAsync({
      quantity,
      total_price,
      product_id,
      sales_order_id,
    });
    const updatedSalesOrderDetail = await prisma.sales_order_details.update({
      where: {
        sales_order_id_product_id: {
          sales_order_id,
          product_id,
        },
      },
      data: {
        quantity,
        total_price,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sales order detail updated successfully",
      data: updatedSalesOrderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteSalesOrderDetails = async (req, res) => {
  const { sales_order_id, product_id } = req.params;
  console.log(sales_order_id, product_id);
  try {
    await deleteSalesOrderDetailsValidator.validateAsync(req.params);

    const existing = await prisma.sales_order_details.findUnique({
      where: {
        sales_order_id_product_id: {
          sales_order_id,
          product_id,
        },
      },
    });
    console.log(existing);

    await prisma.sales_order_details.delete({
      where: {
        sales_order_id_product_id: {
          sales_order_id,
          product_id,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Sales order detail deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.toString(),
    });
  }
};
