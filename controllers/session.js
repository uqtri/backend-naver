import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
const getSessions = async (req, res) => {
  const jwtCookie = req.cookies.jwt;
  if (!jwtCookie) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;
  const page = parseInt(req.query.page) || undefined;
  const limit = parseInt(req.query.limit) || undefined;
  const { priorityId, subjectId, title } = req.query;

  try {
    const totalSessions = await prisma.session.count({
      where: {
        userId,
        priorityId: priorityId ? parseInt(priorityId) : undefined,
        subjectId: subjectId ? parseInt(subjectId) : undefined,
        title: { contains: title },
      },
    });
    res.setHeader("X-Total-Count", totalSessions);
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        priorityId: priorityId ? parseInt(priorityId) : undefined,
        subjectId: subjectId ? parseInt(subjectId) : undefined,
        title: { contains: title },
      },
      skip: page ? (page - 1) * limit : undefined,
      take: limit,
      include: {
        tags: true,
        priority: true,
        subject: true,
      },
      orderBy: { id: "asc" },
    });
    for (let session of sessions) {
      const intervals = await prisma.sessionInterval.findMany({
        where: { sessionId: session.id },
      });
      const seconds =
        intervals?.reduce((total, interval) => {
          const start = new Date(interval.startTime);
          const end = interval.endTime
            ? new Date(interval.endTime)
            : new Date();
          const diffInSeconds = Math.floor((end - start) / 1000);
          return total + diffInSeconds;
        }, 0) || 0;
      session.totalTime = seconds;
    }
    return res
      .status(200)
      .json({ success: true, data: sessions, total: totalSessions });
  } catch (error) {
    console.error("Error fetching sessions: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
const deleteSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  try {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
      cascade: true,
    });
    return res
      .status(200)
      .json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};

const updateSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const data = req.body;
  data.tags = {
    set: [],
    connect: data.tags.map((tagId) => ({ id: tagId })),
  };
  console.log(data);
  try {
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data,
    });
    return res.status(200).json({
      success: true,
      data: updatedSession,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error("Error updating session: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
const createSession = async (req, res) => {
  const jwtCookie = req.cookies.jwt;
  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;
  const { data } = req.body;
  data.tags = { connect: data.tags.map((tagId) => ({ id: tagId })) };

  try {
    const newSession = await prisma.session.create({
      data: { ...data, userId },
    });
    return res.status(201).json({
      success: true,
      data: newSession,
      message: "Session created successfully",
    });
  } catch (error) {
    console.error("Error creating session: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
const getCurrentSession = async (req, res) => {
  const jwtCookie = req.cookies.jwt;
  if (!jwtCookie) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }
  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;
  try {
    const currentSession = await prisma.currentSession.findUnique({
      where: { userId },
      include: {
        session: {
          include: {
            tags: true,
            priority: true,
            subject: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: currentSession });
  } catch (error) {
    console.error("Error fetching current session: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
const setCurrentSession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const jwtCookie = req.cookies.jwt;
  if (!jwtCookie) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }
  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;
  try {
    const existingCurrentSession = await prisma.currentSession.findUnique({
      where: { userId },
    });
    if (existingCurrentSession) {
      await prisma.currentSession.update({
        where: { userId },
        data: { sessionId },
      });
    } else {
      await prisma.currentSession.create({
        data: { userId, sessionId },
      });
    }
  } catch (error) {
    console.error("Error setting current session: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};

export {
  getSessions,
  deleteSession,
  updateSession,
  createSession,
  setCurrentSession,
};
// const getCurrentSession = async (req, res) => {
//   const sessionId = req.user.sessionId;
