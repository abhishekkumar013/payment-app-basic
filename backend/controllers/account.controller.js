import { Account } from "../model/account.model.js";
import mongoose from "mongoose";

export const GetBalancce = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log(userId);

    const account = await Account.findOne({ userId: userId });

    return res.status(200).json({
      message: "Balance fetched successfully",
      success: true,
      balance: account.balance,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const TransferAmount = async (req, res) => {
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(
      session
    );

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
        success: false,
      });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Invalid account",
        success: false,
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);
    await session.commitTransaction();

    return res.status(200).json({
      message: "Transferred successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
