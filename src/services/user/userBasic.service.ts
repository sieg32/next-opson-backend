import logger from "../../config/logger";
import User from "../../models/users/user.model";

export class UserBasicService {
  /**
   * Sets the user type for a given user.
   * @param userId - ID of the user to update.
   * @param type - Type of the user ('owner', 'broker', 'agent', or 'builder').
   * @returns The updated user.
   * @throws Error if the user does not exist or the user type is already set.
   */
  public async setUserType(
    userId: string,
    type: "owner" | "broker" | "agent" | "builder"
  ) {
    try {
      // Find the user by primary key
      const user = await User.findByPk(userId);

      // Throw error if user does not exist
      if (!user) {
        throw new Error("UserNotExist");
      }

      // Check if user type is already set
      if (user.user_type !== null) {
        throw new Error("UserAlreadySet");
      }

      // Update the user type
      user.user_type = type;

      // Save the updated user
      await user.save(); // `save()` is more idiomatic and commonly used than `update()` for model instances

      return user;
    } catch (error) {
      // Log the error if you have a logger configured
      logger.error(error);

      // Re-throw the error for the calling function to handle
      throw error;
    }
  }
}
