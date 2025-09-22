const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const isAuthenticated = require('../middlewares/auth');

const Folder = require("../models/folder");
const File = require("../models/file");

// Helper to get auth status
function getAuthStatus(req) {
  return req.user ? true : false;
}

// GET root drive home (all root folders)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const rootFolders = await Folder.find({ parent: null, user: req.user.id });
    res.render("pages/drivehome", { 
      folders: rootFolders, 
      authenticated: getAuthStatus(req) 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET a specific folder
router.get("/folder/:id", isAuthenticated, async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findOne({ _id: folderId, user: req.user.id });
    if (!folder) return res.status(404).send("Folder not found");

    const subfolders = await Folder.find({ parent: folderId, user: req.user.id });
    const files = await File.find({ folder: folderId, user: req.user.id });

    res.render("pages/folder", { 
      folder, 
      folders: subfolders, 
      files, 
      authenticated: getAuthStatus(req) 
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// POST create folder
router.post("/createfolder", isAuthenticated, async (req, res) => {
  try {
    let { name, parent } = req.body;
    name = name?.trim() || "NewFolder";

    const newFolder = await Folder.create({ name, parent: parent || null, user: req.user.id });
    res.json({ _id: newFolder._id, name: newFolder.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
