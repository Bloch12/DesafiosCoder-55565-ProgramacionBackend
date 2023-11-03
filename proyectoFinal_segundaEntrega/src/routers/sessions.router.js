import {Router} from 'express';
import sessionsController from '../controllers/sessionsController.js';
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

router.post('/registro',passport.authenticate('registro',{failureRedirect:"api/session/errorRegistro"}), sessionsController.register);

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/errorLogin'}) ,sessionsController.login);

router.get('/github', passport.authenticate('github',{scope: ["user: email"]}),(req,res)=>{})

router.get('/callbackGithub',passport.authenticate('github',{failureRedirect:'/api/sessions/errorGithub'}), sessionsController.github);

router.get('/current', sessionsController.current);

router.get('/logout', sessionsController.logout);
