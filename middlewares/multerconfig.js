const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname,'../uploads'))
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(15,(err,bytes)=>{
        const fn =bytes.toString("hex")+path.extname(file.originalname)
        cb(null, fn)
    })
   
  }
})

const upload = multer({ storage: storage })

module.exports = upload