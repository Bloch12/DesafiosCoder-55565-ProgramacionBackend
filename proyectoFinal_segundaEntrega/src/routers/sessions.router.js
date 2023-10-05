import {Router} from 'express';
import crypto from 'crypto';
import { usersModel } from '../dao/models/users.model.js';
export const router = Router();

router.post('/registro', async (req, res) => {
    let {name, email, password,role} = req.body;
    if(!name || !email || !password)
        return res.status(400).json({error:"Error - Invalid body format"});

    let exist = await usersModel.findOne({email});
    if(exist)
        return res.status(400).json({error:"Error - Email already exist"});

    password = crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64');

    await usersModel.create({name, email, password,role});

    res.redirect('/login?usuarioCreado=${email}');

});

router.post('/login', async (req, res) => {
    let {email, password} = req.body;
    if(!email || !password)
        return res.status(400).json({error:"Error - Invalid body format"});

    password = crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64');

    let usuario=await usersModel.findOne({email, password});
    if(!usuario)
        return res.status(400).json({error:"Error - Invalid email or password"});

    req.session.user = {
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
    };
    res.redirect('/products');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(!err)
            res.redirect('/login');
        else
            res.status(500).json({error: 'Error - Intente nuevamente'});
    });
});
