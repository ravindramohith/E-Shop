const multer = require('multer');
const errorHandler = require('../utils/errorHandler')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const error = FILE_TYPE_MAP[file.mimetype] ? null : new Error('Invalid Image Type: ' + file.mimetype)
        cb(error, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.replace(' ', '-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}_${Date.now()}.${extension}`)
    }
})

exports.uploadOptions = multer({ storage: storage })
