import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { BorrowRecord } from "./models/BorrowRecord.js";
import { safeAddBook, searchBook, listAllBooks } from "./services/bookService.js";
import { safeAddMember } from "./services/memberService.js";
import { safeBorrowBook, safeReturnBook } from "./services/borrowService.js";
import { formatDate, isOverdue } from "./utils/dateUtils.js";
import { calculateFine, getTotalFine } from "./utils/fineUtils.js";
import { libraryConfig } from "./config/libraryConfig.js";

const library = { books: [], members: [], records: [] };

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║      Week 5: Full Library System Integration Demo        ║");
console.log("╚══════════════════════════════════════════════════════════╝");
console.log(`Config → maxBooks: ${libraryConfig.maxBooks}, borrowDays: ${libraryConfig.borrowDays}, fineRate: ${libraryConfig.fineRatePerDay} THB/day`);
console.log();

// ─────────────────────────────────────────────
// SECTION 1: Modules + Regex Validation (add books)
// ─────────────────────────────────────────────
console.log("── Section 1: Add Books (Modules + Regex Validation) ──────");

const book1 = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const r1 = safeAddBook(library, book1);
console.log(`[1] Add "JavaScript Basics"  → success: ${r1.success} | ${r1.message}`);

const book2 = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
const r2 = safeAddBook(library, book2);
console.log(`[2] Add "Python for Beginners" → success: ${r2.success} | ${r2.message}`);

const book3 = new Book({ id: "B003", title: "Clean Code", author: "Robert Martin", isbn: "978-0-13-235088-4", category: "Technology" });
const r3 = safeAddBook(library, book3);
console.log(`[3] Add "Clean Code"         → success: ${r3.success} | ${r3.message}`);

// Validation failure: bad ISBN format (regex check)
const badIsbn = new Book({ id: "B999", title: "Bad Book", author: "No One", isbn: "INVALID-ISBN", category: "Fiction" });
const rBadIsbn = safeAddBook(library, badIsbn);
console.log(`[4] Add book with invalid ISBN → success: ${rBadIsbn.success} | ${rBadIsbn.message}`);

// Validation failure: title starts with whitespace
const badTitle = new Book({ id: "B998", title: "  Leading Space", author: "Nobody", isbn: "978-616-05-0004-2", category: "Fiction" });
const rBadTitle = safeAddBook(library, badTitle);
console.log(`[5] Add book with bad title  → success: ${rBadTitle.success} | ${rBadTitle.message}`);
console.log();

// ─────────────────────────────────────────────
// SECTION 2: Add Members (Regex Validation)
// ─────────────────────────────────────────────
console.log("── Section 2: Add Members (Regex Validation) ───────────────");

const alice = new Member({ id: "LIB-0001", name: "Alice Smith", phone: "0812345678", email: "alice@example.com" });
const mR1 = safeAddMember(library, alice);
console.log(`[6] Add member Alice (LIB-0001) → success: ${mR1.success} | ${mR1.message}`);

const bob = new Member({ id: "LIB-0002", name: "Bob Jones", phone: "0898765432", email: "bob@example.com" });
const mR2 = safeAddMember(library, bob);
console.log(`[7] Add member Bob (LIB-0002)   → success: ${mR2.success} | ${mR2.message}`);

// Validation failure: bad member ID format
const badMember = new Member({ id: "INVALID", name: "Ghost", phone: "0812345678", email: "ghost@example.com" });
const mRBad = safeAddMember(library, badMember);
console.log(`[8] Add member with bad ID      → success: ${mRBad.success} | ${mRBad.message}`);
console.log();

// ─────────────────────────────────────────────
// SECTION 3: Borrow Books (DateTime + Exception Handling)
// ─────────────────────────────────────────────
console.log("── Section 3: Borrow Books (DateTime + Exception Handling) ─");

const bR1 = safeBorrowBook(library, "LIB-0001", "B001");
console.log(`[9] Alice borrows "JavaScript Basics" → success: ${bR1.success} | ${bR1.message}`);
if (bR1.success) {
  console.log(`    Borrow date : ${formatDate(bR1.data.borrowDate)}`);
  console.log(`    Due date    : ${formatDate(bR1.data.dueDate)}`);
  console.log(`    Record ID   : ${bR1.data.recordId}`);
}

const bR2 = safeBorrowBook(library, "LIB-0002", "B002");
console.log(`[10] Bob borrows "Python for Beginners" → success: ${bR2.success} | ${bR2.message}`);
if (bR2.success) {
  console.log(`    Due date    : ${formatDate(bR2.data.dueDate)}`);
  console.log(`    Record ID   : ${bR2.data.recordId}`);
}

// Exception: try to borrow an already-checked-out book
const bRDup = safeBorrowBook(library, "LIB-0002", "B001");
console.log(`[11] Bob tries to borrow "JavaScript Basics" (already out) → success: ${bRDup.success} | ${bRDup.message}`);

// Exception: borrow a book that does not exist
const bRNone = safeBorrowBook(library, "LIB-0001", "B999");
console.log(`[12] Alice borrows non-existent book B999 → success: ${bRNone.success} | ${bRNone.message}`);
console.log();

// ─────────────────────────────────────────────
// SECTION 4: Overdue Simulation + Fine Calculation
// ─────────────────────────────────────────────
console.log("── Section 4: Overdue Simulation + Fine Calculation ────────");

const pastDue    = new Date(2026, 3,  1);  // April 1, 2026
const borrowDate = new Date(2026, 2, 18);  // March 18, 2026
const returnedLate = new Date(2026, 4,  5); // May 5, 2026 (returned late)

const overdueRecord = new BorrowRecord({
  recordId: "R-OVERDUE",
  book: book3,          // "Clean Code"
  member: alice,
  borrowDate,
  dueDate: pastDue,
});
overdueRecord.returnDate = returnedLate;
library.records.push(overdueRecord);

const overdueDays = Math.ceil((returnedLate - pastDue) / (1000 * 60 * 60 * 24));
const fine = calculateFine(pastDue, returnedLate);

console.log(`[13] Overdue record for "Clean Code" (Alice)`);
console.log(`     Borrow date : ${formatDate(borrowDate)}`);
console.log(`     Due date    : ${formatDate(pastDue)}`);
console.log(`     Return date : ${formatDate(returnedLate)}`);
console.log(`     Overdue by  : ${overdueDays} day(s)`);
console.log(`     Fine        : ${fine} THB  (${overdueDays} days × ${libraryConfig.fineRatePerDay} THB/day)`);

// Check if dueDate is overdue relative to today
const dueDateIsOverdue = isOverdue(pastDue);
console.log(`     isOverdue() : ${dueDateIsOverdue} (dueDate ${formatDate(pastDue)} is before today)`);
console.log();

// Total fine across ALL records in the library
const totalFine = getTotalFine(library.records);
console.log(`[14] Total fine across all records in library → ${totalFine} THB`);
console.log();

// ─────────────────────────────────────────────
// SECTION 5: Return Book (Exception Handling)
// ─────────────────────────────────────────────
console.log("── Section 5: Return Book (Exception Handling) ─────────────");

if (bR1.success) {
  const ret1 = safeReturnBook(library, bR1.data.recordId);
  console.log(`[15] Alice returns "JavaScript Basics" → success: ${ret1.success} | ${ret1.message}`);
  if (ret1.success) {
    console.log(`     Returned on : ${formatDate(ret1.data.returnDate)}`);
    const returnFine = calculateFine(ret1.data.dueDate, ret1.data.returnDate);
    console.log(`     Fine        : ${returnFine} THB (returned on time)`);
  }
}

// Exception: try to return an already-returned record
const retDup = safeReturnBook(library, "R-OVERDUE");
console.log(`[16] Return already-returned record R-OVERDUE → success: ${retDup.success} | ${retDup.message}`);

// Exception: return a record that doesn't exist
const retNone = safeReturnBook(library, "R-DOES-NOT-EXIST");
console.log(`[17] Return non-existent record → success: ${retNone.success} | ${retNone.message}`);
console.log();

// ─────────────────────────────────────────────
// SECTION 6: Search + List All Books
// ─────────────────────────────────────────────
console.log("── Section 6: Search + List All Books ──────────────────────");

const searchResults = searchBook(library, "python");
console.log(`[18] Search "python" → ${searchResults.length} result(s):`);
searchResults.forEach((b) => console.log(`     • [${b.id}] ${b.title} by ${b.author} | available: ${b.isAvailable}`));

const allBooks = listAllBooks(library);
console.log(`[19] All books in library (${allBooks.length} total):`);
allBooks.forEach((b) => console.log(`     • [${b.id}] ${b.title} — ${b.isAvailable ? "Available" : "Checked Out"}`));
console.log();

console.log("╔══════════════════════════════════════════════════════════╗");
console.log("║                  Demo Complete                           ║");
console.log("╚══════════════════════════════════════════════════════════╝");
