import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || '3000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CONCURRENCY: parseInt(process.env.CONCURRENCY) || 20
};