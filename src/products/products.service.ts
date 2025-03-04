import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { productId, name, description } = createProductDto;

    // Check if a product description already exists with the same name
    const existingName = await this.prisma.productDescription.findUnique({
      where: {
        name: name,
      },
    });

    if (existingName) {
      throw new ConflictException(
        'A product description with this name already exists.',
      );
    }

    let workingProductId: number;

    // Check if product_id is given in request
    if (productId) {
      const productExists = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!productExists) {
        throw new NotFoundException('Product ID does not exist');
      }

      workingProductId = productId;
    } else {
      // Create new product if no productId is provided
      const newProduct = await this.prisma.product.create({
        data: {},
      });
      workingProductId = newProduct.id;
    }

    // product_descriptions part
    // Check if name and description pair already exists for this product
    const existingDescription = await this.prisma.productDescription.findFirst({
      where: { productId: workingProductId, name },
    });

    if (existingDescription) {
      throw new ConflictException(
        'Product name already exists for this product',
      );
    }

    // Insert new name and description
    const newDescription = this.prisma.productDescription.create({
      data: {
        productId: workingProductId,
        name,
        description,
      }
    });

    return newDescription;
  }

  async search(name: string, limit: number = 10, offset: number = 0) {
    if (!name) {
      throw new BadRequestException('Search term is required.');
    }

    const productDescription = await this.prisma.productDescription.findUnique({
      where: {
        name: name,
      },
    });

    if (!productDescription) {
      throw new NotFoundException(
        'No product descriptions found with the given name.',
      );
    }

    const result = await this.prisma.productDescription.findMany({
      where: {
        productId: productDescription.productId,
      },
      select: {
        productId: true,
        name: true,
        description: true,
      },
      take: limit,
      skip: offset,
    });

    return result;
  }
}
