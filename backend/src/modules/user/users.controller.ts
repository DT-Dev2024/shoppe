import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/shared/providers/api-response/api-response';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    const users = this.usersService.findAll();
    return ApiResponse.buildCollectionApiResponse(
      users,
      200,
      'Users retrieved successfully',
    );
  }

  @Get(':id')
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
  update(@Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(updateUserDto);
    if (!user) {
      return ApiResponse.buildApiResponse(null, 500, 'Internal server error');
    }
    return ApiResponse.buildApiResponse(user, 200, 'User updated successfully');
  }

  @Delete(':id')
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
}
