import { prisma } from "../config/db.js";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.services.findMany({
      include: {
        service_order_details: {
          include: {
            service_order: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.log("Error get all services:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  const service_id = req.params.id;
  try {
    const service = await prisma.services.findUnique({
      where: { service_id },
      include: {
        service_order_details: {
          include: {
            service_order: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    });

    if (service) {
      return res.status(200).json({ success: true, data: service });
    }

    return res
      .status(404)
      .json({ success: false, message: "No service was found" });
  } catch (error) {
    console.log("Error get details service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    const { name, base_price } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    // Validate required fields
    if (!name || !base_price) {
      return res
        .status(400)
        .json({ success: false, message: "Name and base price are required" });
    }

    // Check if service name already exists
    const existingService = await prisma.services.findUnique({
      where: { name },
    });

    if (existingService) {
      return res
        .status(400)
        .json({ success: false, message: "Service name already exists" });
    }

    const service = await prisma.services.create({
      data: {
        name,
        base_price: parseFloat(base_price),
      },
    });

    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error("Error creating service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Update service
export const updateService = async (req, res) => {
  const service_id = req.params.id;
  const { name, base_price, is_deleted } = req.body;

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided" });
    }

    // Check if service exists
    const existingService = await prisma.services.findUnique({
      where: { service_id },
    });

    if (!existingService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // If name is being changed, check if new name already exists
    if (name && name !== existingService.name) {
      const nameExists = await prisma.services.findUnique({
        where: { name },
      });

      if (nameExists) {
        return res
          .status(400)
          .json({ success: false, message: "Service name already exists" });
      }
    }

    const updatedService = await prisma.services.update({
      where: { service_id },
      data: {
        name: name || existingService.name,
        base_price: base_price
          ? parseFloat(base_price)
          : existingService.base_price,
        is_deleted:
          is_deleted !== undefined ? is_deleted : existingService.is_deleted,
      },
    });

    return res.status(200).json({ success: true, data: updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  const service_id = req.params.id;
  console.log(service_id);
  try {
    const existingService = await prisma.services.findUnique({
      where: { service_id },
    });

    if (!existingService) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Check if service is being used in any service orders
    // const serviceOrders = await prisma.service_order_details.findFirst({
    //   where: { service_id },
    // });

    // if (serviceOrders) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Cannot delete service that is associated with service orders",
    //   });
    // }

    // await prisma.services.delete({
    //   where: { service_id },
    // });

    await prisma.services.update({
      where: { service_id: service_id },
      data: { is_deleted: true },
    });

    return res
      .status(200)
      .json({ success: true, message: "Delete service successfully" });
  } catch (error) {
    console.log("Error delete service:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
