const express = require("express");
const app = express();
const port = 3000;
import tasks from "./task.json";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validateTaskInput = (task) => {
  const errors = [];

  if (
    !task.title ||
    typeof task.title !== "string" ||
    task.title.trim() === ""
  ) {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (
    !task.description ||
    typeof task.description !== "string" ||
    task.description.trim() === ""
  ) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (task.completed !== undefined && typeof task.completed !== "boolean") {
    errors.push("Completed status must be a boolean value.");
  }

  return errors;
};

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id: Retrieve a specific task by its ID
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found");
  res.json(task);
});

//  Create a new task with the required fields (title, description, completed).
app.post("/tasks", (req, res) => {
  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description, completed } = req.body;
  const newTask = {
    id: tasks.length + 1, // Simple ID assignment
    title,
    description,
    completed: completed || false, // Default to false if not provided
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).send("Task not found");

  const errors = validateTaskInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description, completed } = req.body;
  if (title) task.title = title;
  if (description) task.description = description;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETE /tasks/:id: Delete a task by its ID.
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).send("Task not found");

  tasks.splice(taskIndex, 1);
  res.status(204).send(); // No Task
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
