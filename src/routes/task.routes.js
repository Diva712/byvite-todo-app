import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask, deleteTask,
  getAllTask, getTaskById,
  updateTaskStatus
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT)
//create and get all task routes
router.route("/")
  .post(createTask)
  .get(getAllTask)

router.route("/:id")
  .get(getTaskById)
  .put(updateTaskStatus)
  .delete(deleteTask)




export default router;

