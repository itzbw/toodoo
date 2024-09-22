const express = require("express");

const router = express.Router();

const { getCopnnectedClient } = require("./db");
const { ObjectID, ObjectId } = require("mongodb");

// transform _id to ObjectID
// mongoDB tables are called collections
// each object in the collection is called a document
const getCollection = () => {
  const client = getCopnnectedClient();
  const collection = client.db("tododb").collection("todo");
  return collection;
};

// GET

router.get("/todo", async (req, res) => {
  const collection = getCollection();
  const todo = await collection.find({}).toArray();
  res.status(200).json(todo);
});

// POST
router.post("/todo", async (req, res) => {
  const collection = getCollection();
  let { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ message: "you have nothing to do" });
  }

  todo = typeof todo === "string" ? todo : JSON.stringify(todo);

  const newTodo = await collection.insertOne({ todo, status: false });

  res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// Delete
router.delete("/todo/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deletedTodo = await collection.deleteOne({ _id });

  res.status(200).json(deletedTodo);
});

// PUT = update
router.put("/todo/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;

  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "status must be a boolean" });
  }

  const updatedTodo = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );

  res.status(201).json(updatedTodo);
});

module.exports = router;
