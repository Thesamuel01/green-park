import { type BillAttrDTO, type BillDTO } from '../../dtos';
import { type Repository } from '..';
import { Bill } from '../../database/models/Bill.model';

export type BillKeys = keyof Bill & keyof BillAttrDTO;

export class SequelizeBillRepository
  implements Repository<BillAttrDTO, BillDTO, BillKeys>
{
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
}
