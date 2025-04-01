import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  GetBalancce,
  TransferAmount,
} from "../controllers/account.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/get-balance").get(GetBalancce);
router.route("/transfer").put(TransferAmount);

export default router;
