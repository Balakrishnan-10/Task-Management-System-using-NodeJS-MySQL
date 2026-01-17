import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cd) => {
        cd(null,"uploads/");
    },
    filename:(req,file,cd) => {
        const ext = path.extname(file.originalname); // e.g .jpg
        cd(null,`${Date.now()}${ext}`); //e.g 14523223.jpg
    },
});

const upload = multer({
    storage,
    fileFilter:(req,file,cd) => {
        const fileType = /jpeg|jpg|png/;
        const extname = fileType.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileType.test(file.mimetype);
        if (extname && mimeType) {
            return cd(null,true);
        }
        cd (new Error("Only images (JPEG,JPG<PNG) are allowed"));
    },
    limits: {fieldSize:10*1024*1024},
});

export default upload;