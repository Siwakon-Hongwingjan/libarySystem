export class Book {
  constructor({ id, title, author, isbn, category, isAvailable = true }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.isAvailable = isAvailable;
  }

  checkout() {
    this.isAvailable = false;
  }

  checkin() {
    this.isAvailable = true;
  }
}
