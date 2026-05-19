import { Book } from "./models/Book.js";
import { addBook, removeBook, searchBook, listAllBooks } from "./services/bookService.js";

const library = { books: [] };

const js = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const py = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
const cc = new Book({ id: "B003", title: "Clean Code", author: "Robert Martin", isbn: "978-616-05-0003-5", category: "Technology" });

addBook(library, js);
addBook(library, py);
addBook(library, cc);

console.log("=== All Books ===");
listAllBooks(library).forEach((b) => console.log(`${b.id}: ${b.title} by ${b.author}`));

console.log("\n=== Search 'python' ===");
searchBook(library, "python").forEach((b) => console.log(`Found: ${b.title}`));

removeBook(library, "B003");
console.log(`\n=== After removing B003: ${listAllBooks(library).length} books ===`);
