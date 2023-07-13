import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  modelName: 'lot',
  tableName: 'lots',
  underscored: true
})
class Lot extends Model {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  active!: boolean;
}

export default Lot;
