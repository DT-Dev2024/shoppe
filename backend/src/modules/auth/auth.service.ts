import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(phone: string) {
    const user = await this.prismaService.users.findUnique({
      where: { phone: phone },
      include: { address: true, orders: true },
    });

    console.log(user);

    if (!user) {
      return null;
    }

    const payload = { username: user.phone, sub: user.id };
    delete user.password;
    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(phone: string) {
    const user = await this.prismaService.users.create({
      data: { phone: phone, roles: 'USER', name: 'user', password: '123456' },
    });
    const payload = { username: user.phone, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
