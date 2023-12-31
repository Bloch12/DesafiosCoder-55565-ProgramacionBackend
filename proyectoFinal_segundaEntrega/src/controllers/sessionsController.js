import UserDTO from "../dao/dto/user.dto.js"

async function register(req, res){
    let {first_name,last_name,age, email, password,role} = req.body;
    res.redirect('/login?usuarioCreado=${email}');

}

async function login(req, res){
    const user = req.user;
    delete user.password;
    req.session.user = user;
    res.redirect("/products");

}


async function github (req,res){
    console.log(req.user);
    req.session.user = req.user;
    res.redirect('/products');
}

async function current (req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.session.user;
    res.status(200).json({user: user});
}

async function logout (req, res) {
    req.session.destroy((err) => {
        if(!err)
            res.redirect('/login');
        else
            res.status(500).json({error: 'Error - Intente nuevamente'});
    });
}

export default { register, login, github, logout, current };