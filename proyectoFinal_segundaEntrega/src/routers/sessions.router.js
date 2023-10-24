import {Router} from 'express';
import { usersModel } from '../dao/models/users.model.js';
import { createPassword } from '../util.js';
import { isValidPassword } from '../util.js';
import passport from 'passport';
export const router = Router();


router.get('/errorRegistro',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error:'Error de registro'
    });
});

router.get('/errorLogin',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error:'Error Login'
    });
});

router.get('/errorGithub',(req,res)=>{
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        error:'Error en Github'
    });
});

router.post('/registro',passport.authenticate('registro',{failureRedirect:"api/session/errorRegistro"}), async (req, res) => {
    let {first_name,last_name,age, email, password,role} = req.body;
    res.redirect('/login?usuarioCreado=${email}');

});

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}) ,async (req, res) => {
    const user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");

});

router.get('/github', passport.authenticate('github',{scope: ["user: email"]}),(req,res)=>{})

router.get('/callbackGithub',passport.authenticate('github',{failureRedirect:'/api/sessions/errorGithub'}),async (req,res)=>{
    console.log(req.user);
    req.session.user = req.user;
    res.redirect('/products');
});

this.get('/current', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({user: req.session.user});
});



router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(!err)
            res.redirect('/login');
        else
            res.status(500).json({error: 'Error - Intente nuevamente'});
    });
});
