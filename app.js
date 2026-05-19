import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { safeAddBook, safeRemoveBook } from "./services/bookService.js";
import { safeAddMember } from "./services/memberService.js";
import { safeBorrowBook, safeReturnBook } from "./services/borrowService.js";
import { formatDate } from "./utils/dateUtils.js";

const library = { books: [], members: [], records: [] };

console.log("=== Week 4: Safe Wrapper Functions Demo ===\n");

// Test 1: Add first book successfully
console.log("1. Adding first book (B001):");
const js = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const result1 = safeAddBook(library, js);
console.log(`   Success: ${result1.success}`);
console.log(`   Message: ${result1.message}\n`);

// Test 2: Add second book successfully
console.log("2. Adding second book (B002):");
const py = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
const result2 = safeAddBook(library, py);
console.log(`   Success: ${result2.success}`);
console.log(`   Message: ${result2.message}\n`);

// Test 3: Try to add duplicate book (error case)
console.log("3. Adding duplicate book (B001 again):");
const jsDuplicate = new Book({ id: "B001", title: "JavaScript Advanced", author: "Carol White", isbn: "978-616-05-0003-5", category: "Technology" });
const result3 = safeAddBook(library, jsDuplicate);
console.log(`   Success: ${result3.success}`);
console.log(`   Message: ${result3.message}\n`);

// Test 4: Add member successfully
console.log("4. Adding member (LIB-0001):");
const alice = new Member({ id: "LIB-0001", name: "Alice Smith", phone: "0812345678", email: "alice@example.com" });
const result4 = safeAddMember(library, alice);
console.log(`   Success: ${result4.success}`);
console.log(`   Message: ${result4.message}\n`);

// Test 5: Borrow book successfully
console.log("5. Borrowing book (B001):");
const result5 = safeBorrowBook(library, "LIB-0001", "B001");
console.log(`   Success: ${result5.success}`);
console.log(`   Message: ${result5.message}`);
if (result5.success) {
  const record = result5.data;
  console.log(`   Book: ${record.book.title}`);
  console.log(`   Due date: ${formatDate(record.dueDate)}`);
  console.log(`   Record ID: ${record.recordId}\n`);

  // Test 6: Try to borrow same book again (error case - not available)
  console.log("6. Attempting to borrow same book (B001) again:");
  const result6 = safeBorrowBook(library, "LIB-0001", "B001");
  console.log(`   Success: ${result6.success}`);
  console.log(`   Message: ${result6.message}\n`);

  // Test 7: Return book successfully
  console.log("7. Returning book:");
  const result7 = safeReturnBook(library, record.recordId);
  console.log(`   Success: ${result7.success}`);
  console.log(`   Message: ${result7.message}`);
  if (result7.success) {
    console.log(`   Returned on: ${formatDate(result7.data.returnDate)}\n`);
  }
}

// Test 8: Try to remove non-existent book (error case)
console.log("8. Attempting to remove non-existent book (B999):");
const result8 = safeRemoveBook(library, "B999");
console.log(`   Success: ${result8.success}`);
console.log(`   Message: ${result8.message}\n`);

console.log("=== Demo Complete ===");
