const express = require("express");
const router = express.Router();
const List = require("../models/List");
const auth = require("../middleware/auth");

// Save List
router.post("/saveList", auth, async (req, res) => {
  const { name, codes } = req.body; // Accept list name and codes
  const userId = req.user.id;

  try {
    // Log the received data and user ID
    console.log(`Saving list for user ${userId}:`, name, codes);

    // Find an existing list with the same name for the user
    let list = await List.findOne({ userId, name });
    if (list) {
      // Update the existing list
      list.codes = codes;
      list.lastSaved = new Date();
    } else {
      // Create a new list
      list = new List({ userId, name, codes, lastSaved: new Date() });
    }
    await list.save();

    res
      .status(200)
      .json({ message: "List saved successfully", lastSaved: list.lastSaved });
  } catch (err) {
    console.error("Error saving list:", err.message);
    res.status(500).send("Server error");
  }
});

// Fetch All User's Lists
router.get("/getList", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Log the user ID
    console.log(`Fetching lists for user ${userId}`);

    const lists = await List.find({ userId });
    if (!lists || lists.length === 0) {
      return res.status(404).send("No lists found");
    }
    res.json({ lists });
  } catch (err) {
    console.error("Error fetching lists:", err.message);
    res.status(500).send("Server error");
  }
});
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    console.log(`Attempting to delete list with id: ${id} for user: ${userId}`);
    const list = await List.findById(id);
    if (!list) {
      console.log("List not found");
      return res.status(404).send("List not found");
    }

    if (list.userId.toString() !== userId) {
      console.log("User not authorized");
      return res.status(401).send("User not authorized");
    }

    await List.deleteOne({ _id: id });
    console.log("List deleted successfully");
    res.status(200).json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Error deleting list:", err.message, err.stack);
    res.status(500).send("Server error");
  }
});
router.put("/:id/deleteItem", auth, async (req, res) => {
  try {
    const { code } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    if (list.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    list.codes = list.codes.filter((itemCode) => itemCode !== code);

    await list.save();

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
