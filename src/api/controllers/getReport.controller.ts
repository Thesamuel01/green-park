import { type ReportQueryDTO } from 'src/dtos/reportQuery.dto';
import {
  HttpResponse,
  snakeToCamel,
  type Request,
  type Response
} from '../../helpers';
import { type GetReportService } from '../../services';

export class GetReportController {
  constructor(private readonly getReportService: GetReportService) {}

  async handle(req: Request): Promise<Response> {
    const { logger, query } = req;
    const filters: ReportQueryDTO = {};

    if (query != null) {
      Object.entries(query).forEach(([key, value]) => {
        const keyParsed = snakeToCamel(key);
        if (keyParsed !== undefined && value !== undefined) {
          filters[keyParsed as keyof ReportQueryDTO] = value;
        }
      });
    }

    const response = await this.getReportService.handle(logger, filters);

    return HttpResponse.created(response);
  }
}
