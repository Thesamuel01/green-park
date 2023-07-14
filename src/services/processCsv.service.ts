import {
  type BillDTO,
  type LotDTO,
  type FileDTO,
  type LotAttrDTO,
  type BillAttrDTO,
  type BillFileDTO
} from '../dtos';
import { type Repository, type Keys } from '../repositories';
import { type Logger, type CsvReader } from '../adapters';
import type { Bill } from '../database/models/Bill.model';
import type { Lot } from '../database/models/Lot.model';

export class ProcessCSVService {
  constructor(
    private readonly lotRepository: Repository<
      LotAttrDTO,
      LotDTO,
      Keys<Lot, LotAttrDTO>
    >,
    private readonly billRepository: Repository<
      BillAttrDTO,
      BillDTO,
      Keys<Bill, BillAttrDTO>
    >,
    private readonly csvReaderAdapter: CsvReader
  ) {}

  public async handle(logger: Logger, file: FileDTO): Promise<BillDTO[]> {
    logger.info('Processando arquivo.');

    const fileData = await this.csvReaderAdapter.read<BillFileDTO>(file.buffer);
    const result: BillDTO[] = [];

    await Promise.all(
      fileData.map(async (billData) => {
        const isValidLot = await this.lotRepository.findOneBy(
          'name',
          billData.unidade.padStart(4, '0')
        );

        if (isValidLot != null) {
          const { id } = isValidLot;
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { nome, valor, linha_digitavel } = billData;
          const bill = await this.billRepository.create({
            lotId: id,
            recipientName: nome,
            value: Number(valor),
            barcode: linha_digitavel,
            active: true
          });

          result.push({
            active: bill.active,
            id: bill.id,
            recipientName: bill.recipientName,
            lotId: bill.lotId,
            value: bill.value,
            barcode: bill.barcode,
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt
          });
        } else {
          logger.error(`External lot id: ${billData.unidade} not found`);
        }
      })
    );

    return result;
  }
}
