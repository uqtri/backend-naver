import { prisma } from "../config/db.js";
import {
  deleteServiceOrderDetailsValidator,
  createServiceOrderDetailsValidator,
  updateServiceOrderDetailsValidator,
  getServiceOrderDetailsValidator,
} from "../validation/serviceOrderDetailsValidation.js";
export const getServiceOrderDetails = async (req, res) => {
  const { service_order_id, service_id } = req.params;
  console.log(req.params);

  try {
    await getServiceOrderDetailsValidator.validateAsync(req.params);
    const serviceOrderDetail = await prisma.service_order_details.findUnique({
      where: {
        service_order_id_service_id: {
          service_id,
          service_order_id,
        },
      },
      include: {
        service: true,
        service_order: {
          include: {
            client: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      data: serviceOrderDetail,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.toString(),
      message: "Internal server error",
    });
  }
};
export const createServiceOrderDetails = async (req, res) => {
  const { service_order_id, service_id, quantity, total_price } = req.body;
  // const { service_order_id, service_id } = req.body;
  try {
    await createServiceOrderDetailsValidator.validateAsync({
      ...req.body,
      ...req.params,
    });
    console.log(service_order_id, service_id);
    console.log(req.body, req.params, "REQ BODY AND PARAMS");
    const existingServiceOrderDetail =
      await prisma.service_order_details.findMany({
        where: {
          service_order_id,
          service_id,
        },
      });

    console.log(existingServiceOrderDetail);
    if (existingServiceOrderDetail.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Service order detail already exists",
      });
    }
    const newServiceOrderDetail = await prisma.service_order_details.create({
      data: req.body,
      include: {
        service: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Service order detail created successfully",
      data: newServiceOrderDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateServiceOrderDetails = async (req, res) => {
  const { service_order_id, service_id } = req.params;
  try {
    // await updateServiceOrderDetailsValidator.validateAsync({
    //   ...req.body,
    //   ...req.params,
    // });
    console.log(req.body, req.params, "@@");
    const updatedServiceOrderDetail = await prisma.service_order_details.update(
      {
        where: {
          service_order_id_service_id: {
            service_order_id,
            service_id,
          },
        },

        data: req.body,
        include: {
          service: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Service order detail updated successfully",
      data: updatedServiceOrderDetail,
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

export const deleteServiceOrderDetails = async (req, res) => {
  const { service_id, service_order_id } = req.params;
  console.log("TRI");
  try {
    await deleteServiceOrderDetailsValidator.validateAsync(req.params);
    await prisma.service_order_details.delete({
      where: {
        service_order_id_service_id: {
          service_order_id,
          service_id,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "Service order detail deleted successfully",
    });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({
      success: false,
      error: error.toString(),
    });
  }
};

// ... existing code ...
export const getAllServiceOrderDetails = async (req, res) => {
  const { service_order_id } = req.params;
  try {
    const serviceOrderDetails = await prisma.service_order_details.findMany({
      where: {
        service_order_id,
      },
      include: {
        service: true,
        service_order: {
          include: {
            client: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: serviceOrderDetails,
    });
  } catch (error) {
    console.log(error.toString());
    return res.status(500).json({
      success: false,
      error: error.toString(),
      message: "Internal server error",
    });
  }
};
