import { Router } from "express";

import { signup, login, me, dashboard } from "./auth.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", auth, me);
router.get("/dashboard", auth, dashboard);

export default router;
