import connectDB from "../Database/db.js";

// Admin routes :-
// GET - api/tasks/admin/all_tasks
export const getAllTasksByAdmin = async (req, res) => {
  try {
    const [tasks] = await connectDB.query(
      `SELECT t.*,
            u1.username AS creator_name,
            u2.username As assigned_name 
            FROM tasks t
            JOIN users u1 ON t.creator_id = u1.id
            LEFT JOIN users u2 ON t.assigned_to = u2.id
            ORDER BY t.created_at DESC`,
    );
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({
      message: "Server error during get all tasks by admin...",
      error: error.message,
    });
  }
};

// PUT - api/tasks/assign/:task_id
export const assignTaskToUser = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const { assigned_to } = req.body;

    if (!taskId || !assigned_to) {
      return res
        .status(400)
        .json({ message: "Task ID and assigned user are required" });
    }

    await connectDB.query(`UPDATE tasks SET assigned_to=? WHERE id=?`, [
      assigned_to,
      taskId,
    ]);
    res.json({
      message: `Task ${taskId} is assigned to the user ${assigned_to} succuessfully!!!`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while Assign task to user...",
      error: error.message,
    });
  }
};

// PUT - api/tasks/admin/upadte/:task_id
export const updateTaskByAdmin = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const { status, priority, due_date } = req.body;

    if (!taskId) {
      res.status(400).json({
        message: "Task not found!!!",
      });
    }
    await connectDB.query(
      `UPDATE tasks SET
       status = COALESCE(?, status),
       priority = COALESCE(?, priority),
       due_date = COALESCE(?, due_date)
       WHERE id=?`,
      [status, priority, due_date, taskId],
    );
    res.json({ message: "Task updated by admin" });
  } catch (error) {
    res.status(500).json({
      message: "Server error while update task by admin...",
      error: error.message,
    });
  }
};

// DELETE - api/tasks/admin/delete/:task_id
export const deleteTaskByAdmin = async (req, res) => {
  try {
    const taskId = req.params.task_id;

    if (!taskId) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    const [task] = await connectDB.query(
      "SELECT id FROM tasks WHERE id = ?",
      [taskId]
    );

    if (task.length === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await connectDB.query(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    return res.status(200).json({
      message: "Task deleted successfully by admin",
      taskId: taskId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while deleting task by admin",
      error: error.message,
    });
  }
};


// User routes :-
// POST - Create Task - api/tasks/create
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const creator_id = req.user?.id;

    if (!creator_id) {
      return res.status(401).json({
        message: "Unauthorized : User not logged in...",
      });
    }

    if (!title) {
      return res.status(400).json({
        message: "Title is required!!!",
      });
    }

    const [result] = await connectDB.query(
      `INSERT INTO tasks (title,description,creator_id,priority,due_date)
        VALUES (?,?,?,?,?)`,
      [
        title,
        description || null,
        creator_id,
        priority || "medium",
        due_date || null,
      ],
    );

    res.status(201).json({
      message: "Task created successfully!!!",
      taskId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Serevre error during Task creation",
      error: error.message,
    });
  }
};

// GET - Get task by Id - api/tasks/task_id
export const getTaskByID = async (req, res) => {
  try {
    const taskId = req.params.task_id;
    const userId = req.user?.id;

    const [task] = await connectDB.query(
      `SELECT * FROM tasks
            WHERE id=?
            AND(creator_id=? OR assigned_to=?)`,
      [taskId, userId, userId],
    );
    if (task.length === 0) {
      return res.status(404).json({
        message: "Task not found or access denied...",
      });
    }
    res.status(200).json({
      message: "Task fetched successfully!!!",
      task: task[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks...",
      error: error.message,
    });
  }
};

// PUT - Update task - api/tasks/update/task_id
export const updateTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.task_id;
    let { title, description, status, priority, due_date } = req.body;

    title = title?.trim() || null;
    description = description?.trim() || null;

    const [task] = await connectDB.query(
      "SELECT * FROM tasks WHERE id=? AND (creator_id=? OR assigned_to=?)",
      [taskId, userId, userId],
    );

    if (task.length === 0) {
      return res.status(404).json({
        message: "Task not found or unauthorized...",
      });
    }

    await connectDB.query(
      `UPDATE tasks SET
      title = COALESCE(?,title),
      description = COALESCE(?,description), 
      status = COALESCE(?,status),
      priority = COALESCE(?,priority),
      due_date = COALESCE(?,due_date)
      WHERE id=? AND creator_id=?`,
      [title, description, status, priority, due_date, taskId, userId],
    );
    const [updatedTask] = await connectDB.query(
      `SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date,
        t.created_at,
        t.updated_at,
        creator.id AS creator_id,
        creator.username AS creator_name,
        assignee.id AS assigned_to,
        assignee.username AS assigned_to_name
      FROM tasks t
      JOIN users creator ON t.creator_id = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      WHERE t.id = ?`,
      [taskId],
    );
    return res.status(200).json({
      message: "Task updated successfully!!!",
      task: updatedTask[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating task",
    });
  }
};

// DELETE - Delete Task - api/tasks/delete/task_id
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user?.id;
    const taskId = req.params.task_id;

    if (!userId) {
      return res.status(404).json({
        message: "Unauthorized Access!!!",
      });
    }

    const [result] = await connectDB.query(
      `DELETE FROM tasks WHERE id=? AND creator_id=?`,
      [taskId, userId],
    );

    if (!result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found or unauthorized...",
      });
    }

    res.json({ message: "Task deleted successfully!!!", taskID: taskId });
  } catch (error) {
    res.status(500).json({
      message: "Server error while Delete task...",
      error: error.message,
    });
  }
};
