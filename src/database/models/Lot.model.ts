import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import Bill from './Bill.model';

@Table({
  modelName: 'lot',
  tableName: 'lots',
  underscored: true,
  timestamps: true
})
class Lot extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  active!: boolean;

  @HasMany(() => Bill)
  bills!: Bill[];
}

export default Lot;
