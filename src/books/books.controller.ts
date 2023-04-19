import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Rental } from './entities/rental.entity';
import { DataSource, LessThan, MoreThan } from 'typeorm';
import { Book } from './entities/book.entity';

@Controller('api/books')
export class BooksController {
  constructor(private readonly booksService: BooksService, private dataSource: DataSource) {}
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Post(':id/rent')
  async rent(@Param('id') id: number) {
    const rentalRepo = this.dataSource.getRepository(Rental);
    const bookRepo = this.dataSource.getRepository(Book);
    const rental = new Rental();
    rental.start_date = new Date();
    rental.end_date = new Date();
    rental.end_date.setDate(rental.start_date.getDate() + 7);
    const book = await bookRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException();
    }
    rental.book = book;
    const letezo = await rentalRepo.findBy({
      book: book,
      start_date: LessThan(rental.end_date),
      end_date: MoreThan(rental.start_date),
    });
    if (letezo.length > 0) {
      throw new ConflictException();
    }
    return rentalRepo.save(rental);
  }
}
