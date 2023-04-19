import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DataSource } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
constructor(private dataSource: DataSource) {}

  create(createBookDto: CreateBookDto) {
    const book = Object.assign(new Book(), createBookDto);
    return this.dataSource.getRepository(Book).save(book);
  }

  findAll() {
    return this.dataSource.getRepository(Book).find();
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
