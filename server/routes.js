const express = require("express");
const { ObjectId } = require("mongodb");
const { getConnectedClient } = require("./db");

const router = express.Router();

const getCollection = () => {
  const client = getConnectedClient();
  return client.db("tododb").collection("todo");
};

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
//  ensures that the result of fn is always a Promise
// If the Promise is rejected,  it calls the next function pass errors to error-handling middleware

// GET all todos
router.get(
  "/todo",
  asyncHandler(async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  })
);

// GET single todo
router.get(
  "/todo/:id",
  asyncHandler(async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const todo = await collection.findOne({ _id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  })
);

// POST new todo
router.post(
  "/todo",
  asyncHandler(async (req, res) => {
    const collection = getCollection();
    const { todo } = req.body;

    if (!todo) {
      return res.status(400).json({ message: "Todo content is required" });
    }

    const todoString = typeof todo === "string" ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({
      todo: todoString,
      status: false,
    });

    res
      .status(201)
      .json({ todo: todoString, status: false, _id: newTodo.insertedId });
  })
);

// DELETE todo
router.delete(
  "/todo/:id",
  asyncHandler(async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  })
);

// PUT (update) todo
router.put(
  "/todo/:id",
  asyncHandler(async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ message: "Status must be a boolean" });
    }

    const result = await collection.updateOne(
      { _id },
      { $set: { status: !status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo updated successfully" });
  })
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred" });
});

module.exports = router;
