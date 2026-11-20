const express = require("express");
const store = require("../data/store");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const { status, priority } = req.query;
  let tasks = store.tasks;

  if (status === "completed") {
    tasks = tasks.filter((task) => task.completed = true);
  } else if (status === "pending") {
    tasks = tasks.filter((task) => task.completed === false);
  }

  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  res.json(tasks);
});

router.post("/", (req, res) => {
  const { title, description, priority } = req.body;

  const task = {
    id: store.nextTaskId++,
    title,
    description: description || "",
    priority: priority || "Medium",
    completed: false,
    userId: req.user.id
  };

  store.tasks.push(task);
  res.status(201).json(task);
});

router.patch("/:id", (req, res) => {
  const task = store.tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  Object.assign(task, req.body);
  res.json(task);
});

router.delete("/:id", (req, res) => {
  const index = store.tasks.findIndex(
    (item) => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  store.tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted" });
});

module.exports = router;
