import { addAdmin, addDoctor, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import express from "express";

const adminrouter = express.Router();

// adminrouter.post("/add-admin", addAdmin);

export default adminrouter;
