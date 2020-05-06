const multer = require('multer');
// const sharp = require('sharp');
// const path = require('path');
// const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img/profiles')
    },
    filename: function (req, file, cb) {
      cb(null, "user" + req.session.userID + "pic.jpg"); // modified here  or user file.mimetype
    }
});

module.exports = multer({ storage: storage });

// module.exports.resize = function(req, res, next) {
//     console.log(path.join(__dirname, '..', req.file.path));
//     sharp(path.join(__dirname, '..', req.file.path))
//         .resize(100)
//         .toFile(path.join(__dirname, '..', '/public/img/profiles/user.jpg'))
//         .then(() => {
//             try {
//                 fs.renameSync(path.join(__dirname, '..', '/public/img/profiles/user.jpg'), path.join(__dirname, '..', '/public/img/profiles/user' + req.session.userID + 'pic.jpg'))
//             } catch(err) {
//                 console.log(err);
//             }
//             next();
//         })
//         .catch(() => {
//             next();
//         });
// }

