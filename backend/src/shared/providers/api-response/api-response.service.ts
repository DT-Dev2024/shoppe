import { Injectable } from '@nestjs/common';
import { ITransformer } from 'src/shared/interfaces';
import { Pagination } from 'src/shared/pagination';
import { ObjectStringKey } from 'src/shared/types';


type OptionResponse<T> = { transformer?: ITransformer<T>; meta?: ObjectStringKey };

@Injectable()
export class ApiResponseService {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} Object
   * @param {*} Transformer
   *
   * @return Object
   */
  item<T>(item: T, option: OptionResponse<T> = {}) {
    const { transformer, meta } = option;
    return {
      data: transformer ? transformer.transform(item) : item,
      meta,
    };
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return Object
   */
  collection<T>(collection: T[], option: OptionResponse<T> = {}) {
    const { transformer, meta } = option;
    return {
      data: transformer ? collection.map((i) => transformer.transform(i)) : collection,
      meta,
    };
  }

  status(status: boolean): { status: boolean } {
    return { status };
  }

  /**
   * Bind a paginator to a transformer and start building a response
   *
   * @param {*} LengthAwarePaginator
   * @param {*} Transformer
   *
   * @return Object
   */
  paginate<T>(items: T[], pagination: Pagination, option: OptionResponse<T> = {}) {
    const { transformer, meta } = option;
    meta;
    return {
      data: transformer ? items.map((i) => transformer.transform(i)) : items,
      meta: {
        pagination,
        ...meta,
      },
    };
  }
}
