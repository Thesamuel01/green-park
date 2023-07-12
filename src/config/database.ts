import 'dotenv/config';
import { Sequelize, type Options } from 'sequelize';

const evironment = process.env.NODE_ENV ?? 'development';
enum Sufix {
  production = '',
  development = '-dev',
  test = '-test'
}

const config: Options = {
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: `${process.env.MYSQL_DATABASE ?? 'green-park'}${
    Sufix[evironment as keyof typeof Sufix]
  }`,
  host: process.env.HOST ?? 'localhost',
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Z'
  },
  logging: false
};

export default new Sequelize(config);
