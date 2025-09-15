import authRouter from "./authRouter.js";
import sessionRouter from "./session.js";
import subjectRouter from "./subject.js";
import priorityRouter from "./priority.js";
import tagRouter from "./tag.js";
import intervalRouter from "./interval.js";
export const routes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/api/subjects", subjectRouter);
  app.use("/api/priorities", priorityRouter);
  app.use("/api/tags", tagRouter);
  app.use("/api/intervals", intervalRouter);
};
