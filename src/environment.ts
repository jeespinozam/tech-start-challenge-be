import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' })
export const environment = {
	PORT: +process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,

	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS
}
