import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  static buildApiResponse(data: any, status: HttpStatus, message: string) {
    return {
      status,
      message,
      data,
    };
  }

  static buildCollectionApiResponse(
    data: any,
    status: HttpStatus,
    message: string,
    nameList?: string[],
  ) {
    return {
      status,
      message,
      total: data.length,
      data,
      nameList: nameList || [],
    };
  }
}
