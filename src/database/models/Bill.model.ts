import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { Lot } from './Lot.model';

@Table({
  modelName: 'bill',
  tableName: 'bills',
  underscored: true
})
export class Bill extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  recipientName!: string;

  @AllowNull(false)
  @ForeignKey(() => Lot)
  @Column
  lotId!: number;

  @BelongsTo(() => Lot)
  lot!: Lot;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  value!: number;

  @AllowNull(false)
  @Column
  barcode!: string;

  @AllowNull(false)
  @Column
  active!: boolean;
}
