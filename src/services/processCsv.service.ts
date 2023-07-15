import { type BillDTO, type FileDTO, type BillFileDTO } from '../dtos';
import {
  type BillRepositoryInterface,
  type LotRepositoryInterface
} from '../repositories';
import { type Logger, type CsvReader } from '../adapters';

export class ProcessCSVService {
  constructor(
    private readonly lotRepository: LotRepositoryInterface,
    private readonly billRepository: BillRepositoryInterface,
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
          const insertData = {
            lotId: id,
            recipientName: nome,
            value: Number(valor),
            barcode: linha_digitavel,
            active: true
          };

          logger.info('Inserting data', JSON.stringify(insertData));

          const bill = await this.billRepository.create(insertData);

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

    logger.info('Operação finalizada.');

    return result;
  }
}
