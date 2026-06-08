import { Router } from "express";

import { signup, login, dashboard } from "./auth.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", auth, dashboard);

export default router;
