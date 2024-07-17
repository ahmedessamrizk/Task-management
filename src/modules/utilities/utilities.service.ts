import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  paginate(page: number, size: number): any {
    if (!page || page <= 0) {
      page = 1;
    }

    const skip = (page - 1) * size;
    return { limit: size, skip };
  }
}
