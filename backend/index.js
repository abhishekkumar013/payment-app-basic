import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

Connectdb();

import AuthRoutes from "./routes/auth.routes.js";
import AccountRoutes from "./routes/account.routes.js";
import { Connectdb } from "./utils/db.connect.js";

app.use("/api/v1/user", AuthRoutes);
app.use("/api/v1/account", AccountRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
