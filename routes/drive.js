const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const path = require('path');

const isAuthenticated = require('../middlewares/auth');
// Make sure the path to your multer config is correct
const upload = require('../middlewares/multerconfig'); 

const Folder = require("../models/folder");
const File = require("../models/file");

// Helper to get auth status
function getAuthStatus(req) {
  return req.user ? true : false;
}

// GET root drive home (all root folders and files)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const rootFolders = await Folder.find({ parent: null, user: req.user.id });
    const rootFiles = await File.find({ folder: null, user: req.user.id }); // Find files in root
    res.render("pages/drivehome", { 
      folders: rootFolders, 
      files: rootFiles, // Pass files to the template
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

    // --- BREADCRUMB LOGIC START ---
    const breadcrumbs = [];
    let currentParent = await Folder.findById(folder.parent);
    while (currentParent) {
      breadcrumbs.push(currentParent);
      currentParent = await Folder.findById(currentParent.parent);
    }
    breadcrumbs.reverse(); // Arrange from root to current parent
    // --- BREADCRUMB LOGIC END ---

    const subfolders = await Folder.find({ parent: folderId, user: req.user.id });
    const files = await File.find({ folder: folderId, user: req.user.id });

    res.render("pages/folder", { 
      folder, 
      folders: subfolders, 
      files, 
      breadcrumbs: breadcrumbs, // Pass breadcrumbs to the template
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

// --- CORRECTED File Upload Route ---
router.post('/uploadfile', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    // If no file is uploaded, handle the error
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { parentFolder } = req.body;

    const filetype = path.extname(req.file.originalname).slice(1)

    const newFile = await File.create({
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`, // URL to access the file
      folder: parentFolder || null,
      filetype,
      // Get the user ID from the authenticated user session
      user: req.user.id 
    });

    // Redirect back to the folder where the file was uploaded
    if (parentFolder) {
      res.redirect(`/drive/folder/${parentFolder}`);
    } else {
      res.redirect('/drive');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


module.exports = router;