import { Injectable } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    // to be used later. Included for reference only
    return 'This action adds a new customer';
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prismaService.customer.findMany({});
    return customers;
  }

  async findOne(id: string) {
    return this.prismaService.customer.findUnique({
      where: {
        customerId: id,
      },
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // to be used later. Included for reference only
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    // to be used later. Included for reference only
    return `This action removes a #${id} customer`;
  }
}
