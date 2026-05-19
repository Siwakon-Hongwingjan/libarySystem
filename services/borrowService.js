import { BorrowRecord } from "../models/BorrowRecord.js";
import { getMember } from "./memberService.js";
import { calculateDueDate } from "../utils/dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";
import { BookNotFoundError, BookNotAvailableError, LibraryError } from "../errors/LibraryErrors.js";

export function borrowBook(library, memberId, bookId) {
  const member = getMember(library, memberId);
  const book = library.books.find((b) => b.id === bookId);
  if (!book) throw new BookNotFoundError(bookId);
  if (!book.isAvailable) throw new BookNotAvailableError(bookId);

  const borrowDate = new Date();
  const dueDate = calculateDueDate(borrowDate, libraryConfig.borrowDays);
  const record = new BorrowRecord({ recordId: `R${Date.now()}`, book, member, borrowDate, dueDate });

  book.checkout();
  member.borrowedBooks.push(record);
  library.records.push(record);
  return record;
}

export function returnBook(library, recordId) {
  const record = library.records.find((r) => r.recordId === recordId);
  if (!record) throw new LibraryError(`Record not found: ${recordId}`);
  if (record.returnDate) throw new LibraryError("Book already returned");

  record.returnDate = new Date();
  record.book.checkin();
  return record;
}

export function safeBorrowBook(library, memberId, bookId) {
  try {
    const record = borrowBook(library, memberId, bookId);
    return { success: true, data: record, message: "Book borrowed successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeBorrowBook completed");
  }
}

export function safeReturnBook(library, recordId) {
  try {
    const record = returnBook(library, recordId);
    return { success: true, data: record, message: "Book returned successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeReturnBook completed");
  }
}
