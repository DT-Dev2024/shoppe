import { ApiProperty } from '@nestjs/swagger';
export class Product {
    // @ApiProperty()
    id?: string
    @ApiProperty()
    image: string
    @ApiProperty()
    name: string
    @ApiProperty()
    price: number
}
