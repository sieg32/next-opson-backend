import axios from "axios";
import redisClient from "../config/redis";
import { createOTP } from "../utils/createOtp";
import logger from "../config/logger";
import config from "../config/config";

export class OtpService {
  /**
   * Sends an OTP to the given email.
   * @param email - Recipient's email address.
   * @returns Promise resolving to true if OTP is sent successfully, or throws an error.
   */
  public async sendOtp(email: string): Promise<boolean> {
    if (!email) {
      throw new Error("InvalidEmail");
    }

    const otp = createOTP(6);

    const options = {
      method: "POST",
      url: "https://control.msg91.com/api/v5/email/send",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: config.MAIL_AUTH,
      },
      data: {
        recipients: [
          {
            to: [{ name: "Yogesh", email }],
            variables: {
              otp,
              company_name: "NEXTOPSON",
            },
          },
        ],
        from: { name: "Verification NEXTOPSON", email: "otp@nextopson.in" },
        domain: "nextopson.in",
        template_id: "global_otp",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response)
      if (!response.data) {
        throw new Error("EmailError");
      }

      // Store OTP in Redis with a 5-minute expiration
      await redisClient.setEx(`otp-${email}`, 300, otp);

      return true;
    } catch (error: any) {
      logger.error(error);

      // Handle specific error cases
      if (error.message === "EmailError") {
        throw new Error("Failed to send email");
      } else {
        throw new Error("InternalError");
      }
    }
  }

  /**
   * Verifies the OTP for a given email.
   * @param email - The email address for which OTP verification is performed.
   * @param otp - The OTP provided for verification.
   * @returns Promise resolving to true if OTP matches, false otherwise.
   */
  public async verifyOtp(email: string, otp: string): Promise<boolean> {
    if (!email || !otp) {
      throw new Error("InvalidCredentials");
    }

    try {
      const storedOtp = await redisClient.get(`otp-${email}`);

      // Check if OTP matches
      if (storedOtp === otp) {
        // Optionally, delete the OTP from Redis after successful verification
        await redisClient.del(`otp-${email}`);
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error(error);
      throw new Error("InternalError");
    }
  }
}
