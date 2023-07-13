import path from 'path';
import 'dotenv/config';
import { type SequelizeOptions } from 'sequelize-typescript';

const evironment = process.env.NODE_ENV ?? 'development';
enum Sufix {
  production = '',
  development = '-dev',
  test = '-test'
}

const config: SequelizeOptions = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: `green-park${Sufix[evironment as keyof typeof Sufix]}`,
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 4000),
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Z'
  },
  logging: false,
  models: [path.join(__dirname, '/**/*.model.ts')]
};

module.exports = config;
