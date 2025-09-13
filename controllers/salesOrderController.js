import { cli } from "@mermaid-js/mermaid-cli";
import { prisma } from "../config/db.js";

export const getAllSalesOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [salesOrders, total] = await Promise.all([
      prisma.sales_orders.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        include: {
          client: true,
          sales_order_details: {
            include: {
              product: true,
            },
          },
        },
      }),
      prisma.sales_orders.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: salesOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      error2: error.toString(),
    });
  }
};

export const getSalesOrder = async (req, res) => {
  const sales_order_id = req.params.sales_order_id;

  try {
    const salesOrder = await prisma.sales_orders.findMany({
      where: { sales_order_id },
      include: {
        client: true,
        sales_order_details: true,
      },
    });

    if (salesOrder) {
      return res.status(200).json({ success: true, data: salesOrder });
    }

    return res
      .status(404)
      .json({ success: false, message: "No sales order was found" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const createSalesOrder = async (req, res) => {
  const { client_id } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    const [checkClient] = await Promise.all([
      prisma.users.findUnique({ where: { user_id: client_id } }),
    ]);

    if (!checkClient)
      return res
        .status(404)
        .json({ success: false, message: "Client was not valid" });

    const newSalesOrder = await prisma.sales_orders.create({
      data: {
        client_id,
      },
    });

    return res.status(201).json({ success: true, data: newSalesOrder });
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

export const deleteSalesOrder = async (req, res) => {
  const sales_order_id = req.params.sales_order_id;
  try {
    const checkSalesOrder = await prisma.sales_orders.findMany({
      where: { sales_order_id },
    });

    if (checkSalesOrder) {
      await prisma.sales_order_details.deleteMany({
        where: { sales_order_id },
      });
      await prisma.sales_orders.deleteMany({ where: { sales_order_id } });
      return res
        .status(200)
        .json({ success: true, message: "Delete sales order successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No sales order was found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateSalesOrder = async (req, res) => {
  const sales_order_id = req.params.id;
  const { client_id } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    const oldSalesOrder = await prisma.sales_orders.findUnique({
      where: { sales_order_id },
    });
    if (!oldSalesOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Sales order not found" });
    }

    const [checkClient] = await Promise.all([
      prisma.suppliers.findUnique({ where: { client_id } }),
    ]);

    if (!checkClient)
      return res
        .status(404)
        .json({ success: false, message: "Client was not valid" });

    const updatedSalesOrder = await prisma.sales_orders.update({
      where: { sales_order_id },
      data: {
        client_id: client_id ?? oldProduct.client_id,
      },
    });

    return res.status(200).json({ success: true, data: updatedSalesOrder });
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
