import { prisma } from "../config/db.js";
import {
  createUnitValidator,
  updateUnitValidator,
} from "../validation/unitValidation.js";

export const getAllUnits = async (req, res) => {
  try {
    const units = await prisma.units.findMany();

    return res.status(200).json({ success: true, data: units });
  } catch (error) {
    console.log("Error get all units: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getUnit = async (req, res) => {
  const unit_id = req.params.id;
  try {
    const unit = await prisma.units.findUnique({ where: { unit_id } });

    if (unit) {
      return res.status(200).json({ success: true, data: unit });
    }

    return res
      .status(404)
      .json({ success: false, message: "No unit was found" });
  } catch (error) {
    console.log("Error get unit: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const createUnit = async (req, res) => {
  const data = req.body;
  try {
    await createUnitValidator.validateAsync(data);

    const existingUnitName = await prisma.units.findUnique({
      where: { name: data.name },
    });

    if (existingUnitName) {
      return res
        .status(409)
        .json({ success: false, message: "Unit name already exists" });
    }

    const newUnit = await prisma.units.create({ data });

    return res.status(201).json({ success: true, data: newUnit });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.error("Error creating unit:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteUnit = async (req, res) => {
  const unit_id = req.params.id;
  try {
    const checkUnit = await prisma.units.findUnique({
      where: { unit_id },
    });

    if (!checkUnit) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    await prisma.units.delete({ where: { unit_id } });

    return res
      .status(200)
      .json({ success: true, message: "Delete unit successfully" });
  } catch (error) {
    console.log("Error delete unit:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const unit_id = req.params.id;
    const data = req.body;

    if (!Object.keys(data).length) {
      return res
        .status(400)
        .json({ success: false, message: "No updated data provided" });
    }

    await updateUnitValidator.validateAsync(data);

    const existingUnit = await prisma.units.findUnique({ where: { unit_id } });

    if (!existingUnit) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    if (data.name) {
      const existingName = await prisma.units.findUnique({
        where: { name: data.name },
      });
      if (existingName && existingName.unit_id !== unit_id) {
        return res
          .status(409)
          .json({ success: false, message: "Unit name already exists" });
      }
    }

    const updatedUnit = await prisma.units.update({
      where: { unit_id },
      data,
    });

    return res.status(200).json({ success: true, data: updatedUnit });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    console.error("Error updating unit:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
