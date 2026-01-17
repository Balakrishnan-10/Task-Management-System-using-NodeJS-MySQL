import express from "express";
import { assignTaskToUser, createTask, deleteTask, deleteTaskByAdmin, getAllTasksByAdmin, getTaskByID, updateTaskByAdmin, updateTasks } from "../Controllers/taskController.js";
import authUser from "../Middleware/tokenVerify.js";
import isAdmin from "../Middleware/role.js";

const router = express.Router();

// Admin routes :-
router.get('/admin/all_tasks',authUser,isAdmin,getAllTasksByAdmin)
router.put('/admin/assign/:task_id',authUser,isAdmin,assignTaskToUser)
router.put('/admin/update/:task_id',authUser,isAdmin,updateTaskByAdmin)
router.delete('/admin/delete/:task_id',authUser,isAdmin,deleteTaskByAdmin)

// User routes :-
router.post('/create',authUser,createTask);
router.get('/:task_id',authUser,getTaskByID);
router.put('/update/:task_id',authUser,updateTasks)
router.delete('/delete/:task_id',authUser,deleteTask)

export default router;