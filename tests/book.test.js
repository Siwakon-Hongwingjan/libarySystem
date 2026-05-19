import { Book } from "../models/Book.js";
import { addBook, removeBook, searchBook, listAllBooks, safeAddBook, safeRemoveBook } from "../services/bookService.js";

describe("addBook", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("adds a valid Book to library", () => {
    const book = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    addBook(library, book);
    expect(library.books).toHaveLength(1);
    expect(library.books[0].id).toBe("B001");
  });

  test("throws when argument is not a Book instance", () => {
    expect(() => addBook(library, { id: "B001" })).toThrow("Invalid book");
  });

  test("throws when book id already exists", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    addBook(library, book);
    expect(() => addBook(library, book)).toThrow("Book already exists");
  });
});

describe("removeBook", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
  });

  test("removes an existing book", () => {
    removeBook(library, "B001");
    expect(library.books).toHaveLength(0);
  });

  test("throws when book not found", () => {
    expect(() => removeBook(library, "B999")).toThrow("Book not found");
  });
});

describe("searchBook", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" }));
    addBook(library, new Book({ id: "B002", title: "Python Guide", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" }));
  });

  test("finds books by title (case-insensitive)", () => {
    expect(searchBook(library, "javascript")).toHaveLength(1);
  });

  test("finds books by author", () => {
    expect(searchBook(library, "jones")).toHaveLength(1);
  });

  test("returns empty array when not found", () => {
    expect(searchBook(library, "notexist")).toHaveLength(0);
  });
});

describe("listAllBooks", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("returns all books", () => {
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addBook(library, new Book({ id: "B002", title: "Python", author: "Bob", isbn: "978-616-05-0002-8", category: "Technology" }));
    expect(listAllBooks(library)).toHaveLength(2);
  });

  test("returns empty array when no books", () => {
    expect(listAllBooks(library)).toHaveLength(0);
  });
});

describe("addBook — validation (week3)", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("throws when ISBN format is invalid", () => {
    const book = new Book({ id: "B001", title: "Valid Title", author: "Alice", isbn: "INVALID-ISBN", category: "Technology" });
    expect(() => addBook(library, book)).toThrow("ISBN must be in format");
  });

  test("throws when title starts with whitespace", () => {
    const book = new Book({ id: "B001", title: " Bad Title", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    expect(() => addBook(library, book)).toThrow("Title must be");
  });
});

describe("safeAddBook (week4)", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("returns success:true when book is valid", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    const result = safeAddBook(library, book);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Book added successfully");
  });

  test("returns success:false on invalid book instance", () => {
    const result = safeAddBook(library, { id: "B001" });
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
  });

  test("returns success:false on duplicate id", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    safeAddBook(library, book);
    expect(safeAddBook(library, book).success).toBe(false);
  });
});

describe("safeRemoveBook (week4)", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
  });

  test("returns success:true when book exists", () => {
    expect(safeRemoveBook(library, "B001").success).toBe(true);
  });

  test("returns success:false when book not found", () => {
    expect(safeRemoveBook(library, "BNONE").success).toBe(false);
  });
});
