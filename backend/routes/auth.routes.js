import express from "express";
import {
  AllUsers,
  GetFilterUser,
  Login,
  ModifyDetails,
  SingUp,
} from "../controllers/auth.controllers.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(SingUp);
router.route("/signin").post(Login);

//
router.use(isAuthenticated);
router.route("/update").put(ModifyDetails);
router.route("/search").get(GetFilterUser);
router.route("/get-all").get(AllUsers);

export default router;
