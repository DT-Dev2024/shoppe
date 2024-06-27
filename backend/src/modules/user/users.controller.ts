import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';
import { CreateAddressDto } from './dto/address.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth('token')
  findAll() {
    const users = this.usersService.findAll();
    return ApiResponse.buildCollectionApiResponse(
      users,
      200,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
  @ApiBearerAuth('token')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(
      user,
      200,
      'User retrieved successfully',
    );
  }

  @Patch()
  @ApiBearerAuth('token')
  update(@Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(updateUserDto);
    if (!user) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(user, 200, 'User updated successfully');
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  remove(@Param('id') id: string) {
    const user = this.usersService.remove(id);
    if (!user) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    } else {
      return ApiResponse.buildApiResponse(
        user,
        200,
        'User deleted successfully',
      );
    }
  }

  @Post('address')
  @ApiBearerAuth('token')
  updateAddress(@Body() address: CreateAddressDto) {
    const user = this.usersService.updateAddress(address);
    if (!user) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(
      user,
      200,
      'User updated address successfully',
    );
  }
}
