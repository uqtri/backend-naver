import { prisma } from "../config/db.js";
const getPriorities = async (req, res) => {
  try {
    const priorities = await prisma.priority.findMany();
    return res.status(200).json({ success: true, data: priorities });
  } catch (error) {
    console.error("Error fetching priorities: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
export { getPriorities };
