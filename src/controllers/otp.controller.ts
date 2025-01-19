import { Request, Response } from "express";
import { OtpService } from "../services/otp.service";

const otpService = new OtpService();

export const sendOtpController = async (req: Request, res: Response) => {
  const { email }: { email: string } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid email." });
  }

  try {
    const otpSent = await otpService.sendOtp(email);

    if (otpSent) {
      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully." });
    }
  } catch (error: any) {
    if (error.message === "EmailError") {
      return res
        .status(500)
        .json({ success: false, message: "Error while sending email." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

/**
 * Controller to verify an OTP for the given email.
 * @param req - Express Request object.
 * @param res - Express Response object.
 */
export const verifyOtpController = async (req: Request, res: Response) => {
  const { email, otp }: { email: string; otp: string } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide email and OTP." });
  }

  try {
    const otpVerified = await otpService.verifyOtp(email, otp);

    if (otpVerified) {
      return res
        .status(200)
        .json({ success: true, message: "OTP verified successfully." });
    }
    return res
      .status(401)
      .json({ success: false, message: "OTP verification failed." });
  } catch (error: any) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
