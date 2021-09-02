import express, {Router} from "express";
import annoncesRoutes from "./annoncesRoutes";
import usersRoutes from "./usersRoutes";

const router : Router = express.Router();
router.use('/annonces', annoncesRoutes);
router.use('/users', usersRoutes);

export default router;