import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { fakerES_MX as faker } from '@faker-js/faker'
import jwt from 'jsonwebtoken';


const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


export const createPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export function permit(...allowedRoles) {
    return (req, res, next) => {
        sessionsController.current(req, res, (err, user) => {
            if (err) {
                res.status(500).json({message: "Internal Server Error"});
            } else if (user && allowedRoles.includes(user.role)) {
                req.user = user;
                next();  // role is allowed, so continue on the next middleware
            } else {
                res.status(403).json({message: "Forbidden"});  // user is forbidden
            }
        });
    }
}

export const generateJWT = user => jwt.sign({ user }, PRIVATE_KEY, {expiresIn:'1h'});

export const generateProduct = () => {
    let title = faker.commerce.productName();
    let description = faker.commerce.productDescription();
    let code = faker.string.alphanumeric({ casing: 'upper', length:6 });
    let price = faker.commerce.price({ min: 50, max: 4500, dec: 0 });
    let stock = faker.number.int({min:1, max:100});
    let thumbnail = [faker.image.url()];
    let category = faker.commerce.productMaterial();
    let status = true;
    return {title, description, code, price, stock, thumbnail, category, status};
}


