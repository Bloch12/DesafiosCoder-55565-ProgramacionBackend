import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import { usersModel } from '../dao/models/users.model.js'
import { createPassword, isValidPassword } from '../utils/util.js';
import UserDTO from '../dao/dto/user.dto.js';


export const inicializarPassport = () => {
    passport.use("registro",new local.Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try{
                let {first_name,last_name,age, email, password,role} = req.body;
                if(!first_name || !last_name || age || !email || !password)
                    return done(null, false, {message: "Error - Invalid body format"});
                let exist = await usersModel.findOne({email});
                if(exist)
                    return done(null, false, {message: "Error - Email already exist"});
                password = createPassword(password);
                
                let newUser = new UserDTO({first_name,last_name,age, email, password,role})
                const user = await usersModel.create(newUser);
                return done(null, user);
            }catch(err){
                return done(err);
            }
        }
    ))

    passport.use('github', new github.Strategy(
        {
            clientID: 'Iv1.15cd63028aefa345', 
            clientSecret: 'c4ac10172d133dfe49290c98a3f0430531bac2a2',
            callbackURL: 'http://localhost:8080/api/sessions/callbackGithub'
        },
        async(token, tokenRefresh, profile, done)=>{
            try {
                let user=await usersModel.findOne({email:profile._json.email})
                    if(!user){
                        let newUser= new UserDTO({
                            first_name: profile._json.name,
                            last_name: "",
                            age: 18,
                            email: profile._json.email,
                            password: ""
                        })
                        let result = await usersModel.create(newUser)
                        done(null, result)
                    }else{
                        done(null, user)
                    }                
            } catch (error) {
                return done(null,user);
            }
        }
    ))

    
    passport.use('login', new local.Strategy(
        {
            usernameField:'email'
        },
        async(email, password, done)=>{
            try {
                if(!email || !password)
                    return done(null, false, {message: "Error - Invalid body format"});

                let user = await usersModel.findOne({email},{email:1, password:1, role:1, name:1});
                if(!user)
                    return done(null, false, {message: "Error - Invalid email"});

                if(!isValidPassword(user, password))
                    return done(null, false, {message: "Error - Invalid password"});

                return done(null, user)
            
            } catch (error) {
                return done(error)
            }
        }
    ) )
    
    passport.serializeUser((user,done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id,done) => {
            const user = await usersModel.findById(id);
            done(null, user);
    });

};
export default inicializarPassport
