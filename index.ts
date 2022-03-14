import express  from 'express';
import {Request, Response} from "express";
import "reflect-metadata";
import { createConnection } from 'typeorm';
import { Book, Author } from './entities';



createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "AsDfGhJkL130721",
  database: "BooksAuthors",
  entities: [
    Book,
    Author
  ],
  synchronize: true,
  logging: false
}).then(connection => {
  const authorRepository = connection.getRepository(Author);
  const bookRepository = connection.getRepository(Book);

  const app = express();
  app.use(express.json());

  app.get('/book', async function (req: Request, res: Response) {
    const books = await bookRepository.find();
    res.json(books);
  });

  app.get('/book/:id', async function (req: Request, res: Response) {
    const result = await bookRepository.findOne(req.params.id);
    res.json(result);
  })

  app.post('/book', async function (req: Request, res: Response) {
    if(!req.body) return res.sendStatus(400);
    const book = await bookRepository.create(req.body);
    const result = await bookRepository.save(book);
    res.send(result);
  })

  app.put('/book/:id', async function (req: Request, res: Response) {
    if(!req.body) return res.sendStatus(400);
    const book = await bookRepository.findOne(req.params.id);
    if(book) {
      bookRepository.merge(book, req.body);
      const results = await bookRepository.save(book);
      return res.send(results);
    }
    res.status(404).json({message: "Book not found"})
  })


  app.delete(`/book/:id`, async function(req: Request, res:Response) {
    if(!req.body) return res.sendStatus(400);
    const results = await bookRepository.delete(req.params.id);
    return res.send(results);
  })


// methods for authors
  app.get('/author', async function (req: Request, res: Response) {
    const authors = await authorRepository.find();
    res.json(authors);
  });

  app.get('/author/:id', async function (req: Request, res: Response) {
    const result = await authorRepository.findOne(req.params.id);
    res.json(result);
  })

  app.get('/author/:id/book', async function (req: Request, res: Response) {
    const authorsBooks = await bookRepository.find({
      where: {author_id: req.params.id}
    })
    res.json(authorsBooks);
  })

  app.post('/author', async function (req: Request, res: Response) {
    if(!req.body) return res.sendStatus(400);
    const author = await authorRepository.create(req.body);
    const result = await authorRepository.save(author);
    res.send(result);
  })

  app.put('/author/:id', async function (req: Request, res: Response) {
    if(!req.body) return res.sendStatus(400);
    const author = await authorRepository.findOne(req.params.id);
    if(author) {
      authorRepository.merge(author, req.body);
      const results = await authorRepository.save(author);
      return res.send(results);
    }
    res.status(404).json({message: "Author not found"})
  })


  app.delete(`/author/:id`, async function(req: Request, res:Response) {
    if(!req.body) return res.sendStatus(400);
    const results = await authorRepository.delete(req.params.id);
    return res.send(results);
  })

  app.listen(3000);

}).catch(error => console.log(error));
