import {Router} from 'express';
import usersController from '../controllers/usersController.js';
import { permit, __dirname } from "../utils/util.js";
import multer from 'multer';
export const router = new Router();

const alreadyAuthenticated = (req, res, next) => {
    if(req.cookies.coderCookie) {
        return res.sendAuthorizationError("Already authenticated.");
    }

    next();
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads/documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.params.uid + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const checkCookie = (req, res, next) => {
    if(!req.cookies.restorePasswordCookie) {
        return res.sendUserError("Missing or expired JWT token. Please, request a new password reset");
    }

    next();
}


router.get('/',permit("admin"), usersController.getUsers);

router.post('/restorePassword', alreadyAuthenticated, usersController.restorePassword);

router.post('/newPassword', alreadyAuthenticated, checkCookie, usersController.newPassword);

router.put('/premium/:uid',permit("admin"), usersController.premium);

router.post('/:uid/documents', upload.single("document"), usersController.addDocument);
