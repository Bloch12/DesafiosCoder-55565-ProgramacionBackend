import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { fakerES_MX as faker } from '@faker-js/faker'
import winston from 'winston';
import { config } from './config/dotenv.config.js';

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


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
		fatal: 'red',
		error: 'red',
		warning: 'yellow',
		info: 'blue',
        http: 'green',
		debug: 'white'
	}
}

const productionTransport = new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.timestamp(),
        winston.format.simple()
    )
});

const developmentTransport = new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.timestamp(),
        winston.format.simple()
    )
});

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

if(config.MODE === "development")
    logger.add(developmentTransport);
else if (config.MODE === "production")
    logger.add(productionTransport);

export const middLogger = (req, res, next) => {
    req.logger = logger;
    next();
}
