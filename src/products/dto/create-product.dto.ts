import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  readonly productId?: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
