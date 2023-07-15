import { type BillFilterDTO, type BillAttrDTO, type BillDTO } from '../../dtos';
import { type BillRepositoryInterface } from '..';
import { Bill } from '../../database/models/Bill.model';
import { Op, type WhereAttributeHash } from 'sequelize';

export class SequelizeBillRepository implements BillRepositoryInterface {
  constructor(private readonly BillModel = Bill) {}

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

  async filterBills(filters: BillFilterDTO): Promise<BillDTO[]> {
    const where: WhereAttributeHash = {};

    if (filters.name != null) {
      where.recipientName = { [Op.like]: `%${filters.name}%` }; // Usar operador LIKE para correspondência case-insensitive
    }

    if (filters.minAmount != null) {
      where.value = { [Op.gte]: filters.minAmount };
    }

    if (filters.maxAmount != null) {
      where.value = { ...where.value, [Op.lt]: filters.maxAmount };
    }

    if (filters.lotId != null) {
      where.lotId = filters.lotId;
    }

    if (Object.keys(where).length === 0) {
      return await Bill.findAll();
    }

    return await Bill.findAll({ where });
  }
}
