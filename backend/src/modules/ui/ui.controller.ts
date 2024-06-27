import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { UiService } from './ui.service';
import { CreateUiDto } from './dto/create-ui.dto';
import { UpdateUiDto } from './dto/update-ui.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/providers/api-response/api-response.service';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';

@Controller('ui')
@ApiTags('ui')
export class UiController {
  constructor(
    private readonly uiService: UiService,
    private readonly response: ApiResponseService,
  ) {}

  @Post()
  @ApiBearerAuth('token')
  async create(@Body() createUiDto: CreateUiDto) {
    const ui = await this.uiService.create(createUiDto);
    if (ui) {
      return ApiResponse.buildApiResponse(
        ui,
        200,
        'Ui Infor created successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 400, 'Ui not created');
    }
  }

  @Get()
  @ApiBearerAuth('token')
  async findAll() {
    const ui = await this.uiService.findAll();
    if (ui) {
      return ApiResponse.buildCollectionApiResponse(
        ui,
        200,
        'Ui Infor retrieved successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
  }

  @Patch()
  @ApiBearerAuth('token')
  async update(@Body() updateUiDto: UpdateUiDto) {
    const update = await this.uiService.update(updateUiDto);
    if (update) {
      return ApiResponse.buildApiResponse(
        update,
        200,
        'Ui updated successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 400, 'Ui not updated');
    }
  }

  @Patch('add-key')
  @ApiBearerAuth('token')
  async addKey(@Body() updateUiDto: UpdateKeywordDto) {
    const update = await this.uiService.addKey(updateUiDto);
    if (update) {
      return ApiResponse.buildApiResponse(
        update,
        200,
        'Ui updated successfully',
      );
    } else {
      return ApiResponse.buildApiResponse(null, 400, 'Ui not updated');
    }
  }
}
