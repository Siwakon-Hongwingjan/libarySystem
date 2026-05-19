import { Book } from "../models/Book.js";
import { validateISBN, validateBookTitle } from "../utils/validator.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new Error("Invalid book");

  const isbnCheck = validateISBN(book.isbn);
  if (!isbnCheck.valid) throw new Error(isbnCheck.message);

  const titleCheck = validateBookTitle(book.title);
  if (!titleCheck.valid) throw new Error(titleCheck.message);

  if (library.books.find((b) => b.id === book.id)) throw new Error("Book already exists");
  library.books.push(book);
}

export function removeBook(library, bookId) {
  const index = library.books.findIndex((b) => b.id === bookId);
  if (index === -1) throw new Error("Book not found");
  library.books.splice(index, 1);
}

export function searchBook(library, query) {
  const q = query.toLowerCase();
  return library.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
  );
}

export function listAllBooks(library) {
  return [...library.books];
}
