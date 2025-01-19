import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/controllers/authenticatedRequest.type";

const JWT_SECRET = 'your_jwt_secret'; // Make sure to keep this secret safe

const authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Assuming the format is "Bearer <token>"

  // Check if token is provided
  if (!token) {
     res.status(401).json({ success: false, message: "No token provided" });
     return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user information to the request object for further use
    req.user  = decoded as AuthenticatedUser; // You can modify this based on your user data structure

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
     res.status(401).json({ success: false, message: "Invalid token" });
     return;
  }
};

export default authorize;
