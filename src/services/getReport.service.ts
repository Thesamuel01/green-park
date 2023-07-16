import { type BillRepositoryInterface } from '../repositories';
import { type BillFilterDTO, type BillDTO, type FileBase64 } from '../dtos';
import { type PDFHandler, type Logger } from '../adapters';
import { type ReportQueryDTO } from '../dtos/reportQuery.dto';
import { formatDateToMySQLTimestamp } from '../helpers';

export class GetReportService {
  constructor(
    private readonly billRepository: BillRepositoryInterface,
    private readonly pdfHandlerAdapter: PDFHandler
  ) {}

  public async handle(
    logger: Logger,
    query: ReportQueryDTO
  ): Promise<BillDTO[] | FileBase64> {
    logger.info('Refining the search with filtered values.', query);

    const filters = Object.keys(query).reduce<BillFilterDTO>((acc, key) => {
      switch (key) {
        case 'name':
          acc[key] = query[key];
          break;

        case 'minAmount':
          acc[key] = Number(query[key]);
          break;

        case 'maxAmount':
          acc[key] = Number(query[key]);
          break;

        case 'lotId':
          acc[key] = Number(query[key]);
          break;

        default:
          break;
      }

      return acc;
    }, {});

    const result: BillDTO[] = await this.billRepository.filterBills(filters);

    if (query.report === '1') {
      logger.info('Gerando arquivo.');

      const data = result.map(
        ({ id, recipientName, lotId, value, barcode, active, createdAt }) => ({
          id,
          recipientName,
          lotId,
          value,
          barcode,
          active,
          createdAt:
            createdAt != null
              ? formatDateToMySQLTimestamp(createdAt)
              : undefined
        })
      );

      return await this.pdfHandlerAdapter.createBase64PDF(data);
    }

    logger.info('Operação finalizada.');

    return result.map((data) => {
      data.value = Number(data.value);

      return data;
    });
  }
}
