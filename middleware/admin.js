import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default adminMiddleware;