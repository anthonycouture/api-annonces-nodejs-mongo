import express from "express";
import annonces from "./annoncesControllers";

const router = express.Router();
router.use('/annonces',annonces);

export default router;