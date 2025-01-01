import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



//create Task controller
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  //validation
  if (!title || !description) {
    throw new ApiError(400,
      "Title Or Decription can not be empty !!");
  }

  const task = new Task({
    title,
    description,
    user: req.user._id
  });
  //save task into db
  const createdTask = await task.save();

  if (!createTask) {
    throw new ApiError(404,
      "Error during the created Task in Db");
  }

  return res.status(201).json(
    new ApiResponse(201, createdTask, "Task has be created !")
  )
})


//getAll Task of that user
const getAllTask = asyncHandler(async (req, res) => {

  const myTasks = await Task.find({ user: req.user._id });
  if (!myTasks) {
    throw new ApiError(404,
      "There is no tasks added by user !!")
  }

  return res.status(200).json(
    new ApiResponse(200, myTasks,
      "All tasks are fetched !!")
  );
})


//get task by id 
const getTaskById = async (req, res) => {

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!task) {
    throw new ApiError(404, "Task not found !!")
  }

  return res.status(200).json(
    new ApiResponse(200, task, "Task fetched sucessfully ")
  )

}

//update task status
const updateTaskStatus = asyncHandler(async (req, res) => {

  const { status } = req.body;
  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    {
      status
    },
    {
      new: true
    }
  );

  if (!updatedTask) {
    throw new ApiError(404,
      "Task not found !!")
  }

  return res.status(200).json(
    new ApiResponse(200, updatedTask,
      "Task update successfully !!")
  )
})


const deleteTask = asyncHandler(async (req, res) => {

  const task = await Task.findOneAndDelete(
    {
      _id: req.params.id,
      user: req.user._id
    }
  )
  if (!task) {
    throw new ApiError(404, "Task not found !!")
  }
  return res.status(200).json(
    new ApiResponse(204, {}, "Task deleted successfully !")
  )
})




export {
  createTask, getAllTask,
  getTaskById, updateTaskStatus,
  deleteTask
}
