import {
  AllowNull,
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { Bill } from './Bill.model';

@Table({
  modelName: 'lot',
  tableName: 'lots',
  underscored: true
})
export class Lot extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  active!: boolean;

  @HasMany(() => Bill)
  bills!: Bill[];
}
