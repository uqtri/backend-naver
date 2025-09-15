import { prisma } from "../config/db.js";

const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    return res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    console.error("Error fetching subjects: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
export { getSubjects };
