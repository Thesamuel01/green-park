import {
  HttpError,
  HttpResponse,
  type Request,
  type Response
} from '../../helpers';
import { type ProcessCSVService } from '../../services/processCsv.service';

export class ProcessCsvController {
  constructor(private readonly processCsvService: ProcessCSVService) {}

  async handle(req: Request): Promise<Response> {
    const { logger, file } = req;

    if (file == null) {
      throw HttpError.badRequest('File was not received');
    }

    const response = await this.processCsvService.handle(logger, file);

    return HttpResponse.ok(response);
  }
}
