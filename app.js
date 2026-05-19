import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { addBook, listAllBooks } from "./services/bookService.js";
import { addMember } from "./services/memberService.js";
import { borrowBook, returnBook } from "./services/borrowService.js";
import { formatDate, isOverdue } from "./utils/dateUtils.js";

const library = { books: [], members: [], records: [] };

const js = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const py = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
addBook(library, js);
addBook(library, py);

const alice = new Member({ id: "LIB-0001", name: "Alice Smith", phone: "0812345678", email: "alice@example.com" });
addMember(library, alice);

const record = borrowBook(library, "LIB-0001", "B001");
console.log(`Borrowed: ${record.book.title}`);
console.log(`Due date: ${formatDate(record.dueDate)}`);
console.log(`Overdue? ${isOverdue(record.dueDate)}`);

returnBook(library, record.recordId);
console.log(`Returned: ${record.book.title} on ${formatDate(record.returnDate)}`);
console.log(`B001 available again? ${library.books[0].isAvailable}`);
