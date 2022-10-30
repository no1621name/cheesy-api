import { Collection, Document } from 'mongodb';

const errorsDictionary = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  429: 'Too many requests',
  500: 'Server error',
};

export default class ServerResponse {
  public statusCode: number;
  public data: { [key: string]: any, pagination?: Pagination } = {};

  constructor (statusCode: StatusCodes, info: { [key: string]: any}) {
    this.statusCode = statusCode;
    this.data = { ...this.data, ...info };
  }

  public async withPagination(coll: Collection<Document>, findParams: object, offset: number, limit: number) {
    const total = await coll.count(findParams);
    const next = offset + limit >= total ? 0 : offset + limit;
    const prev = offset - limit >= 0 ? offset - limit : 0;

    const pagination = {
      total,
      next,
      prev,
      limit,
      current: offset
    };

    this.data.pagination = pagination;
    return this;
  }

  static throwServerError(statusCode: StatusCodes = 500, message?: string) {
    throw {
      statusCode,
      statusMessage: errorsDictionary[statusCode as keyof typeof errorsDictionary],
      message: message || errorsDictionary[statusCode as keyof typeof errorsDictionary],
    };
  }
}
