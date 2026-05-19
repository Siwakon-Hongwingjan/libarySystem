import { Book } from "../models/Book.js";
import { validateISBN, validateBookTitle } from "../utils/validator.js";
import { BookNotFoundError, ValidationError } from "../errors/LibraryErrors.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new ValidationError("Invalid book");

  const isbnCheck = validateISBN(book.isbn);
  if (!isbnCheck.valid) throw new ValidationError(isbnCheck.message);

  const titleCheck = validateBookTitle(book.title);
  if (!titleCheck.valid) throw new ValidationError(titleCheck.message);

  if (library.books.find((b) => b.id === book.id)) throw new ValidationError("Book already exists");
  library.books.push(book);
}

export function removeBook(library, bookId) {
  const index = library.books.findIndex((b) => b.id === bookId);
  if (index === -1) throw new BookNotFoundError(bookId);
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

export function safeAddBook(library, book) {
  try {
    addBook(library, book);
    return { success: true, data: [...library.books], message: "Book added successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeAddBook completed");
  }
}

export function safeRemoveBook(library, bookId) {
  try {
    removeBook(library, bookId);
    return { success: true, data: [...library.books], message: "Book removed successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeRemoveBook completed");
  }
}
