import { prisma } from "../config/db.js";

const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    return res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error("Error fetching tags: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};

export { getTags };
