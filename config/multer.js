const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        // Genera un nombre único para cada archivo subido
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Nombre único
    }
});

// Filtros para tipos de archivo válidos
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } 
    else {
        cb(new Error('Solo se permiten archivos .jpeg, .jpg o .png'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
