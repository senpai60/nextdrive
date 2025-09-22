const express = require('express');
const router = express.Router()

router.get('/',(req,res)=>{
const folderNames = [
  "Work", "Personal", "Photos", "Videos", "Projects", "Music", "College", "Travel",
  "Books", "Movies", "Games", "Designs", "Coding", "Assignments", "Notes",
  "Clients", "Invoices", "Ideas", "Archive", "Important", "Downloads", "Uploads",
  "Wallpapers", "Screenshots", "Research", "Backups", "Secrets", "Resume",
  "Certificates", "References"
]
    res.render('pages/drivehome',{folderNames})
})
module.exports = router