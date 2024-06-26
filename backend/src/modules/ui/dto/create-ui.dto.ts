import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class CreateUiDto {
    @ApiProperty()
    @IsArray()
    headerSearchHistoryListInfo: string[]
    @ApiProperty()
    @IsArray()
    headerSearchHistoryKeywordsListInfo : string[]
    @ApiProperty()
    @IsArray()
    bannerListInfo: string[]
}
