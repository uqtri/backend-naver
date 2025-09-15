import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

export const getCurrentIntervalByUser = async (req, res) => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;
  try {
    let currentInterval = await prisma.sessionInterval.findFirst({
      where: { userId, endTime: null },
    });
    if (!currentInterval) {
      currentInterval = await prisma.sessionInterval.findFirst({
        where: { userId },
        orderBy: { startTime: "desc" },
      });
    }
    const session = await prisma.session.findUnique({
      where: { id: currentInterval.sessionId },
    });
    const intervals = await prisma.sessionInterval.findMany({
      where: { sessionId: session.id },
    });
    console.log("intervals", intervals);
    const seconds =
      intervals?.reduce((total, interval) => {
        if (!interval.endTime) return total;
        const start = new Date(interval.startTime);
        const end = interval.endTime ? new Date(interval.endTime) : new Date();
        const diffInSeconds = Math.floor((end - start) / 1000);
        return total + diffInSeconds;
      }, 0) || 0;

    return res.status(200).json({
      success: true,
      data: session,
      interval: currentInterval,
      totalTime: seconds,
    });
  } catch (error) {
    console.error("Error fetching current interval: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
export const getTimeOfSessions = async (req, res) => {
  // const jwtCookie = req.cookies.jwt;
  // if (!jwtCookie) {
  //   return res.status(401).json({ success: false, message: "Unauthorized" });
  // }
  // const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  // const userId = user.userId;
  const sessionId = parseInt(req.params.sessionId);
  try {
    const intervals = await prisma.sessionInterval.findMany({
      where: { sessionId },
    });
    const seconds =
      intervals?.reduce((total, interval) => {
        const start = interval.startedAt;
        const end = interval.endedAt ? interval.endedAt : new Date();
        const diffInSeconds = Math.floor((end - start) / 1000);
        return total + diffInSeconds;
      }, 0) || 0;
    return res
      .status(200)
      .json({ success: true, data: intervals, totalTime: seconds });
  } catch (error) {
    console.error("Error fetching intervals: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};

export const createInterval = async function (req, res) {
  const jwtCookie = req.cookies.jwt;
  if (!jwtCookie) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const user = jwt.verify(jwtCookie, process.env.JWT_SECRET);
  const userId = user.userId;

  let currentInterval = await prisma.sessionInterval.findFirst({
    where: { userId, endTime: null },
  });
  // if (!currentInterval) {
  //   currentInterval = await prisma.sessionInterval.findFirst({
  //     where: { userId },
  //     orderBy: { startTime: "desc" },
  //   });
  // }
  if (currentInterval) {
    await prisma.sessionInterval.update({
      where: { id: currentInterval.id },
      data: { endTime: new Date().toString() },
    });
  }
  const newInterval = await prisma.sessionInterval.create({
    data: {
      userId,
      startTime: new Date().toString(),
      sessionId: req.body.sessionId,
    },
  });
  return res.status(201).json({ success: true, data: newInterval });
};
export const updateInterval = async function (req, res) {
  const intervalId = parseInt(req.params.intervalId);
  const { endTime } = req.body;
  try {
    const updatedInterval = await prisma.sessionInterval.update({
      where: { id: intervalId },
      data: { endTime },
    });
    return res.status(200).json({ success: true, data: updatedInterval });
  } catch (error) {
    console.error("Error updating interval: ", error);
    return res.status(500).json({ success: false, message: error.toString() });
  }
};
