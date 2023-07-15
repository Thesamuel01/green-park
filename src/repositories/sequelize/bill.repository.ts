import { type BillAttrDTO, type BillDTO } from '../../dtos';
import { type BillRepositoryInterface } from '..';
import { Bill } from '../../database/models/Bill.model';
import { type WhereOptions, Op } from 'sequelize';

export class SequelizeBillRepository implements BillRepositoryInterface {
  constructor(private readonly BillModel = Bill) {}
  async findByParams(params: Partial<BillAttrDTO>): Promise<BillDTO[]> {
    const whereConditions: WhereOptions = {};

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key as keyof BillAttrDTO];

        if (key === 'valor_inicial') {
          whereConditions.valor = {
            [Op.gte]: value
          };
        } else if (key === 'valor_final') {
          whereConditions.valor = {
            ...whereConditions.valor,
            [Op.lte]: value
          };
        } else {
          whereConditions[key] = value;
        }
      }
    }

    return await this.BillModel.findAll({ where: whereConditions });
  }

  async create(data: BillAttrDTO): Promise<BillDTO> {
    const { active, recipientName, lotId, value, barcode } = data;
    const {
      id,
      active: createdActive,
      recipientName: createdRecipientName,
      lotId: createdLotId,
      value: createdValue,
      barcode: createdBarcode,
      createdAt,
      updatedAt
    } = await this.BillModel.create({
      active,
      recipientName,
      lotId,
      value,
      barcode
    });
    const result: BillDTO = {
      id,
      active: createdActive,
      recipientName: createdRecipientName,
      lotId: createdLotId,
      value: createdValue,
      barcode: createdBarcode,
      createdAt,
      updatedAt
    };

    return result;
  }

  async findOneBy(
    key: 'recipientName' | 'lotId' | 'value' | 'barcode' | 'active',
    value: string | number | boolean
  ): Promise<BillDTO | null> {
    return await this.BillModel.findOne({ where: { [key]: value } });
  }
}
