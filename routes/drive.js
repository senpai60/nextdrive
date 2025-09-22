const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Folder = require("../models/folder");
const File = require("../models/file");

router.get("/", async (req, res) => {
  const folders = await Folder.find({});
  res.render("pages/drivehome", { folders });
});

router.post("/createfolder", async (req, res) => {
  try {
    let { name } = req.body;         // <-- use 'name', not foldername
    name = name?.trim() || "NewFolder";
    const newFolder = await Folder.create({ name });
    res.json({ _id: newFolder._id, name: newFolder.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
