import { type BillRepositoryInterface } from '../repositories';
import { type BillFilterDTO, type BillDTO } from '../dtos';
import { type Logger } from '../adapters';
import { type ReportQueryDTO } from 'src/dtos/reportQuery.dto';

export class GetReportService {
  constructor(private readonly billRepository: BillRepositoryInterface) {}

  public async handle(
    logger: Logger,
    query: ReportQueryDTO
  ): Promise<BillDTO[]> {
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

    return await this.billRepository.filterBills(filters);
  }
}
