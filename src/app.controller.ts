import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import { Rental } from './books/entities/rental.entity';
import { faker } from '@faker-js/faker';
import { Book } from './books/entities/book.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Post('seed')
  async seed() {
    const rentalRepo = this.dataSource.getRepository(Rental);
    const bookRepo = this.dataSource.getRepository(Book);
    for(let i = 0; i < 15; i++) {
      const rental = new Rental();
      rental.start_date = faker.date.recent(30);
      rental.end_date = faker.date.soon(30);
      rental.book = await bookRepo.findOneBy({ id: i+1 });
      rentalRepo.save(rental);
    }
  }
}
