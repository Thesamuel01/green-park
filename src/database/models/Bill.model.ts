import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import Lot from './Lot.model';

@Table({
  modelName: 'bill',
  tableName: 'bills',
  underscored: true,
  timestamps: true
})
class Bill extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  recipientName!: string;

  @ForeignKey(() => Lot)
  @Column
  lotId!: boolean;

  @BelongsTo(() => Lot)
  lot!: Lot;

  @Column
  value!: number;

  @Column
  barcode!: string;

  @Column
  active!: boolean;
}

export default Bill;
