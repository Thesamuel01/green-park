import {
  type LotRepositoryInterface,
  type BillRepositoryInterface
} from '../repositories';
import { type BillDTO, type FileDTO, type BillPDFFileDTO } from '../dtos';
import { type Logger } from '../adapters';
import { type PDFHandler } from 'src/adapters/pdfHandler.interface';
import path from 'path';

export class ProcessPdfService {
  constructor(
    private readonly lotRepository: LotRepositoryInterface,
    private readonly billRepository: BillRepositoryInterface,
    private readonly pdfHandlerAdapter: PDFHandler
  ) {}

  public async handle(logger: Logger, file: FileDTO): Promise<BillDTO[]> {
    logger.info('Processando arquivo.');

    const fileData = await this.pdfHandlerAdapter.readBillPDF<BillPDFFileDTO>(
      file.buffer
    );
    const result: BillDTO[] = [];

    const dataSorted = await Promise.all(
      fileData.map(async (billData) => {
        const isValidLot = await this.lotRepository.findOneBy(
          'name',
          billData.data.unidade.padStart(4, '0')
        );

        if (isValidLot != null) {
          const { id: lotId } = isValidLot;

          return { ...billData, lotId };
        } else {
          logger.error(`External lot id: ${billData.data.unidade} not found`);
        }
      })
    );

    await Promise.all(
      dataSorted.map(async (billData) => {
        if (billData != null) {
          const { lotId } = billData;
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { nome, valor, linha_digitavel } = billData.data;
          const insertData = {
            lotId,
            recipientName: nome,
            value: Number(valor),
            barcode: linha_digitavel,
            active: true
          };

          logger.info('Inserting data', JSON.stringify(insertData));

          const {
            active: createdActive,
            id: createdId,
            recipientName: createdRecipientName,
            lotId: createdLotId,
            value: createdValue,
            barcode: createdBarcode,
            createdAt: createdCreatedAt,
            updatedAt: createdUpdatedAt
          } = await this.billRepository.create(insertData);

          result.push({
            active: createdActive,
            id: createdId,
            recipientName: createdRecipientName,
            lotId: createdLotId,
            value: createdValue,
            barcode: createdBarcode,
            createdAt: createdCreatedAt,
            updatedAt: createdUpdatedAt
          });

          const folderPath = `./storage`;
          const fileName = `${createdId}.pdf`;
          logger.info(`Creating ${fileName} in ${folderPath}`);

          await this.pdfHandlerAdapter.save(
            billData.buffer,
            path.join(__dirname, '..', folderPath, fileName)
          );
        }
      })
    );

    logger.info('Operação finalizada.');

    return result;
  }
}
