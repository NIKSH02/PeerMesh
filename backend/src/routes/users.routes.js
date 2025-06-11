import { Router } from "express";


const router = Router();

router.route("/login");
router.route("/regester");
router.routes("/add_to_activity");
router.route("/get_all_activity");

export default router ;