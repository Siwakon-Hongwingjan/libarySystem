export class LibraryError extends Error {
  constructor(message) {
    super(message);
    this.name = "LibraryError";
  }
}

export class BookNotFoundError extends LibraryError {
  constructor(bookId) {
    super(`Book not found: ${bookId}`);
    this.name = "BookNotFoundError";
  }
}

export class MemberNotFoundError extends LibraryError {
  constructor(memberId) {
    super(`Member not found: ${memberId}`);
    this.name = "MemberNotFoundError";
  }
}

export class BookNotAvailableError extends LibraryError {
  constructor(bookId) {
    super(`Book not available: ${bookId}`);
    this.name = "BookNotAvailableError";
  }
}

export class ValidationError extends LibraryError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class OverdueError extends LibraryError {
  constructor(recordId, days) {
    super(`Book overdue by ${days} day(s): record ${recordId}`);
    this.name = "OverdueError";
    this.days = days;
  }
}
