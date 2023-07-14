import { type LotDTO, type LotAttrDTO } from '../../dtos';
import { type Repository } from '..';
import { Lot } from '../../database/models/Lot.model';

export type LotKeys = keyof Lot & keyof LotAttrDTO;

export class SequelizeLotRepository
  implements Repository<LotAttrDTO, LotDTO, LotKeys>
{
  constructor(private readonly LotModel = Lot) {}

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

  async findOneBy(
    key: 'name' | 'active' | 'id' | 'createdAt' | 'updatedAt',
    value: unknown
  ): Promise<LotDTO | null> {
    return await this.LotModel.findOne({ where: { [key]: value } });
  }
}
