import { prisma } from "../config/db.js";
import {
  createServiceOrderValidator,
  updateServiceOrderValidator,
  getServiceOrderValidator,
  deleteServiceOrderValidator,
} from "../validation/serviceOrdersValidation.js";
export const createServiceOrders = async (req, res) => {
  let { client_id, status } = req.body;

  let total_paid = 0,
    total_price = 0,
    total_remaining = 0;

  status = "NOT_DELIVERED";
  try {
    // await createServiceOrderValidator.validateAsync(req.body);
    const newServiceOrder = await prisma.service_orders.create({
      data: {
        client_id,
        status,
        total_price,
        total_paid,
        total_remaining,
      },
      include: {
        client: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Service order created successfully",
      data: newServiceOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.toString(),
    });
  }
};

export const getAllServiceOrders = async (req, res) => {
  try {
    const serviceOrder = await prisma.service_orders.findMany({
      include: {
        client: true,
        service_order_details: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!serviceOrder) {
      return res.status(404).json({
        success: false,
        message: "Service order detail not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service order detail retrieved successfully",
      data: serviceOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getServiceOrder = async (req, res) => {
  const { service_order_id } = req.params;
  try {
    await getServiceOrderValidator.validateAsync({
      service_order_id,
    });
    const serviceOrder = await prisma.service_orders.findUnique({
      where: {
        service_order_id,
      },
      include: {
        client: true,
        service_order_details: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!serviceOrder) {
      return res.status(404).json({
        success: false,
        message: "Service order detail not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service order detail retrieved successfully",
      data: serviceOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateServiceOrder = async (req, res) => {
  // const {
  //   client_id,
  //   status,
  //   quantity,
  //   total_price,
  //   total_paid,
  //   total_remaining,
  // } = req.body;
  const { service_order_id } = req.params;
  try {
    // await updateServiceOrderValidator.validateAsync({
    // ...req.body,
    // service_order_id,
    //});
    const updatedServiceOrderDetail = await prisma.service_orders.update({
      where: {
        service_order_id: service_order_id,
      },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Service order updated successfully",
      data: updatedServiceOrderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteServiceOrder = async (req, res) => {
  const { service_order_id } = req.params;
  try {
    await deleteServiceOrderValidator.validateAsync(req.params);

    // Check if service order exists
    const existingServiceOrder = await prisma.service_orders.findUnique({
      where: {
        service_order_id,
      },
    });

    if (!existingServiceOrder) {
      return res.status(404).json({
        success: false,
        message: "Service order not found",
      });
    }

    // Delete all related service order details first
    await prisma.service_order_details.deleteMany({
      where: {
        service_order_id,
      },
    });

    // Delete the service order
    await prisma.service_orders.delete({
      where: {
        service_order_id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Service order and its details deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
