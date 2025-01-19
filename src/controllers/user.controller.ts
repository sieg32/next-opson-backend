import { Request, Response } from "express";
import { UserBasicService } from "../services/user/userBasic.service";

const userBasicService = new UserBasicService();

export const setUserTypeController = async (req: Request, res: Response) => {
  const { userId, type }: { userId: string; type: "owner" | "broker" | "agent" | "builder" } = req.body;

  // Validate required fields
  if (!userId || !type) {
    return res.status(400).json({ success: false, message: "Invalid userId or type" });
  }

  try {
    // Call the service to set the user type
    const updatedUser = await userBasicService.setUserType(userId, type);

    // Respond with the updated user
    res.status(200).json({ success: true, message: "User type updated successfully", data: updatedUser });
  } catch (error: any) {
    // Handle specific errors
    if (error.message === "UserNotExist") {
      res.status(404).json({ success: false, message: "User does not exist" });
    } else if (error.message === "UserAlreadySet") {
      res.status(403).json({ success: false, message: "User type is already set" });
    } else {
      // Handle unexpected errors
      console.error("Unexpected error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};
