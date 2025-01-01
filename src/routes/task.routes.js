import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getAllTask, getTaskById, updateTaskStatus } from "../controllers/task.controller.js";

const router = Router();

//authenticated routes

//create task end-point
router.route("/").post(verifyJWT, createTask)
  .get(verifyJWT, getAllTask);
//get task by id
router.route("/:id")
  .get(verifyJWT, getTaskById)
  .put(verifyJWT, updateTaskStatus)
  .delete(verifyJWT, deleteTask);


export default router;

