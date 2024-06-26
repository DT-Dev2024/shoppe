import { Injectable } from '@nestjs/common';
import { CreateUiDto } from './dto/create-ui.dto';
import { UpdateUiDto } from './dto/update-ui.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { UpdateUi } from './types/update-ui.type';

@Injectable()
export class UiService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUiDto: CreateUiDto) {
    return await this.prisma.ui_home_data_source.create({ data: createUiDto });
  }

  async findAll() {
    const ui = await this.prisma.ui_home_data_source.findMany({});

    ui.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return ui[0];
  }

  async update(updateUiDto: UpdateUiDto) {
    return await this.prisma.ui_home_data_source.update({
      where: { id: updateUiDto.id },
      data: {
        bannerListInfo: {
          push: updateUiDto.bannerListInfo,
        },
        headerSearchHistoryListInfo: {
          push: updateUiDto.headerSearchHistoryListInfo,
        },
        headerSearchHistoryKeywordsListInfo: {
          push: updateUiDto.headerSearchHistoryKeywordsListInfo,
        },
      },
    });
  }

  async addKey(updateUiDto: UpdateKeywordDto) {
    const updateData: any = {};

    if (
      updateUiDto.condition === UpdateUi.headerSearchHistoryKeywordsListInfo
    ) {
      updateData.headerSearchHistoryKeywordsListInfo = {
        push: updateUiDto.value,
      };
    }

    if (updateUiDto.condition === UpdateUi.headerSearchHistoryListInfo) {
      updateData.headerSearchHistoryListInfo = {
        push: updateUiDto.value,
      };
    }

    return await this.prisma.ui_home_data_source.update({
      where: { id: updateUiDto.id },
      data: updateData,
    });
  }
}
