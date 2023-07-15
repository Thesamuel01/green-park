import { type LotDTO, type LotAttrDTO } from '../../dtos';
import { type LotRepositoryInterface } from '..';
import { Lot } from '../../database/models/Lot.model';

export class SequelizeLotRepository implements LotRepositoryInterface {
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

  async findByParams(params: Partial<LotAttrDTO>): Promise<LotDTO[]> {
    return await this.LotModel.findAll({ where: params });
  }
}
