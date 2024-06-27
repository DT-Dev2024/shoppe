import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { UiService } from './ui.service';
import { CreateUiDto } from './dto/create-ui.dto';
import { UpdateUiDto } from './dto/update-ui.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/providers/api-response/api-response.service';
import { UpdateKeywordDto } from './dto/update-keyword.dto';

@Controller('ui')
@ApiTags('ui')
export class UiController {
  constructor(
    private readonly uiService: UiService,
    private readonly response: ApiResponseService,
  ) {}

  @Post()
  @ApiBearerAuth('token')
  create(@Body() createUiDto: CreateUiDto) {
    return this.uiService.create(createUiDto);
  }

  @Get()
  @ApiBearerAuth('token')
  findAll() {
    return this.uiService.findAll();
  }

  @Patch()
  @ApiBearerAuth('token')
  update(@Body() updateUiDto: UpdateUiDto) {
    return this.uiService.update(updateUiDto);
  }

  @Patch('add-key')
  @ApiBearerAuth('token')
  async addKey(@Body() updateUiDto: UpdateKeywordDto) {
    return this.uiService.addKey(updateUiDto);
  }
}
