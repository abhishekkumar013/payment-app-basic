import { Account } from "../model/account.model.js";
import { User } from "../model/user.model.js";
import { z as zod } from "zod";

const signupBody = zod.object({
  username: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(6),
});
const signinBody = zod.object({
  username: zod.string(),
  password: zod.string().min(6),
});
const ModifyDetailsBody = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().min(6).optional(),
});

export const SingUp = async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
        success: false,
      });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
        success: false,
      });
    }

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    const sanitizedUser = await User.findById(user._id).select("-password");

    //
    await Account.create({
      userId: user._id,
      balance: 0,
    });

    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: sanitizedUser,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Information",
        success: false,
      });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const ispasswodvalid = await user.isPasswordCorrect(req.body.password);
    if (!ispasswodvalid) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // generate token and
    const token = await user.generateJwtToken();

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };

    return res.cookie("token", token, options).status(200).json({
      message: "Login successful",
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const ModifyDetails = async (req, res) => {
  try {
    const parsedBody = ModifyDetailsBody.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid input",
        success: false,
      });
    }

    const { firstName, lastName, password } = parsedBody.data;

    if (Object.keys(parsedBody.data).length === 0) {
      return res.status(400).json({
        message: "At least one field is required",
        success: false,
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "User details updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const GetFilterUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { username: { $regex: filter, $options: "i" } },
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    const filterUsers = users.filter(
      (user) => user._id.toString() !== req.userId
    );

    if (users && users.length > 0) {
      return res.status(200).json({
        users: filterUsers.map((user) => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        })),
        success: true,
        message: "Users fetched successfully",
      });
    }
    return res.status(200).json({
      success: false,
      message: "No users found matching the filter",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const AllUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const allUsers = await User.find({}).select("-password");

    const filterUsers = allUsers.filter(
      (user) => user._id.toString() !== userId
    );

    return res.status(200).json({
      users: filterUsers,
      success: true,
      message: "All users fetched successfully",
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};
