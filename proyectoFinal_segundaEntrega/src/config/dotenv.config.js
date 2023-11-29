import dotenv from 'dotenv';

dotenv.config({path:"./.env"});

export const config = {
	MODE: process.env.MODE,
	PORT: process.env.PORT,
	MONGO_URL: process.env.MONGO_URL,
	PRIVATE_KEY: process.env.PRIVATE_KEY
}