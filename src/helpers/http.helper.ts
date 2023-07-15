import { type Logger } from '../adapters';

export interface Controller {
  handle: (req: Request) => Promise<Response>;
}

export interface Response {
  statusCode: number;
  body: unknown;
}

export interface HttpFile {
  buffer: Buffer;
  mimetype: string;
  fileName?: string;
  size: number;
}

export interface Request {
  query?: unknown;
  body: unknown;
  file?: HttpFile | undefined;
  logger: Logger;
}

enum statusCodes {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

enum errorName {
  BAD_REQUEST = 'HttpErrorBadRequest',
  UNAUTHORIZED = 'HttpErrorUnauthorized',
  NOT_FOUND = 'HttpErrorNotFound'
}

export class HttpResponse implements Response {
  private constructor(
    private readonly _statusCode: number,
    private readonly _body: unknown
  ) {}

  get statusCode(): number {
    return this._statusCode;
  }

  get body(): unknown {
    return this._body;
  }

  static ok(body: unknown): HttpResponse {
    return new HttpResponse(statusCodes.OK, body);
  }

  static created(body: unknown): HttpResponse {
    return new HttpResponse(statusCodes.CREATED, body);
  }
}

export class HttpError extends Error implements Response {
  private constructor(
    private readonly _statusCode: number,
    private readonly _body: string,
    private readonly _errName: string
  ) {
    super(_body);
  }

  get statusCode(): number {
    return this._statusCode;
  }

  get body(): string {
    return this._body;
  }

  get errName(): string {
    return this._errName;
  }

  static badRequest(message: string): HttpError {
    return new HttpError(
      statusCodes.BAD_REQUEST,
      message,
      errorName.BAD_REQUEST
    );
  }

  static unauthorized(message: string): HttpError {
    return new HttpError(
      statusCodes.UNAUTHORIZED,
      message,
      errorName.UNAUTHORIZED
    );
  }

  static notFound(message: string): HttpError {
    return new HttpError(
      statusCodes.NOT_FOUND,
      message,
      errorName.UNAUTHORIZED
    );
  }
}
