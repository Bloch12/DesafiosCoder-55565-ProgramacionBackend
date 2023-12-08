import {Router} from 'express';
import usersController from '../controllers/usersController.js';
import { permit } from "../utils/util.js";
export const router = new Router();

const alreadyAuthenticated = (req, res, next) => {
    if(req.cookies.coderCookie) {
        return res.sendAuthorizationError("Already authenticated.");
    }

    next();
}

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
