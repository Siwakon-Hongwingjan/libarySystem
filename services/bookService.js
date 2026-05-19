import { Book } from "../models/Book.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new Error("Invalid book");
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
