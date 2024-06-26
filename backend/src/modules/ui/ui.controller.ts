import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UiService } from './ui.service';
import { CreateUiDto } from './dto/create-ui.dto';
import { UpdateUiDto } from './dto/update-ui.dto';
import { ApiTags } from '@nestjs/swagger';
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
  create(@Body() createUiDto: CreateUiDto) {
    return this.uiService.create(createUiDto);
  }

  @Get()
  findAll() {
    return this.uiService.findAll();
  }

  @Patch()
  update(@Body() updateUiDto: UpdateUiDto) {
    return this.uiService.update(updateUiDto);
  }

  @Patch('add-key')
  async addKey(@Body() updateUiDto: UpdateKeywordDto) {
    return this.uiService.addKey(updateUiDto);
  }
}
