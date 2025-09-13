import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import cookieSession from "cookie-session";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://jewelry-store-qk81.vercel.app",
    ],
    credentials: true,
  })
);
app.use(morgan("dev")); // log the requests
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: "ancks",
  })
);
app.use(passport.initialize());
app.use(passport.session());

routes(app);
app.listen(PORT, () => {
  console.log("Server is listening on port 5000");
});
