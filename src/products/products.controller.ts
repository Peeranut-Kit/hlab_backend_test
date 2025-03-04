import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('search')
  async searchProduct(
    @Query('query') name: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.productsService.search(name, limit, offset);
  }
}
