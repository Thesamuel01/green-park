import { type LotDTO, type LotAttrDTO } from '../../dtos';
import { type LotRepositoryInterface } from '..';
import { Lot } from '../../database/models/Lot.model';

export class SequelizeLotRepository implements LotRepositoryInterface {
  constructor(private readonly LotModel = Lot) {}

  async findOneBy<Key extends 'name' | 'active'>(
    key: Key,
    value: LotAttrDTO[Key] extends string | number ? LotAttrDTO[Key] : never
  ): Promise<LotDTO | null> {
    return await this.LotModel.findOne({ where: { [key]: value } });
  }

  async create(data: LotAttrDTO): Promise<LotDTO> {
    const { name: lotName, active: lotActive } = data;
    const {
      id,
      name: createdName,
      active: createdActive,
      createdAt,
      updatedAt
    } = await this.LotModel.create({ name: lotName, active: lotActive });

    return {
      id,
      name: createdName,
      active: createdActive,
      createdAt,
      updatedAt
    };
  }
}
