export class Member {
  constructor({ id, name, phone, email }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.borrowedBooks = [];
  }
}
