import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "./order-detail.dto";

export class UpdateStatusOrderDto {
    @IsString()
    @IsNotEmpty()
    id: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}