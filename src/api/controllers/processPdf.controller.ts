import {
  HttpError,
  HttpResponse,
  type Request,
  type Response
} from '../../helpers';
import { type ProcessPdfService } from '../../services';

export class ProcessPdfController {
  constructor(private readonly processPdfService: ProcessPdfService) {}

  async handle(req: Request): Promise<Response> {
    const { logger, file } = req;

    if (file == null) {
      throw HttpError.badRequest('File was not received');
    }

    const response = await this.processPdfService.handle(logger, file);

    return HttpResponse.created(response);
  }
}
