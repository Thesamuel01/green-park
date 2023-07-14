import { Sequelize } from 'sequelize-typescript';
import * as config from '../config/database';
import { Lot } from './Lot.model';
import { Bill } from './Bill.model';

const sequelize = new Sequelize(config);

sequelize.addModels([Lot, Bill]);

export default sequelize;
