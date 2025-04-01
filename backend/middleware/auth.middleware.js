import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token =
      req.cookies.token || req.headers["authorization"].split(" ")[1];

    // console.log(token);

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decode);

    // const user = await User.findById(decode.id).select("-password");
    // if (!user) {
    //   return res.status(404).json({
    //     message: "Invalid token",
    //     success: false,
    //   });
    // }

    req.userId = decode.id;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
