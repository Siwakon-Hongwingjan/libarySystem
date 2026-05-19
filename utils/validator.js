export function validateISBN(isbn) {
  const pattern = /^978-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;
  const valid = pattern.test(isbn);
  return { valid, message: valid ? "Valid ISBN" : "ISBN must be in format: 978-x-x-x-x" };
}

export function validateMemberID(id) {
  const pattern = /^LIB-\d{4}$/;
  const valid = pattern.test(id);
  return { valid, message: valid ? "Valid member ID" : "Member ID must be in format: LIB-0000" };
}

export function validatePhone(phone) {
  const pattern = /^0[6-9]\d{8}$/;
  const valid = pattern.test(phone);
  return { valid, message: valid ? "Valid phone" : "Phone must start with 06-09 and be 10 digits" };
}

export function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = pattern.test(email);
  return { valid, message: valid ? "Valid email" : "Invalid email format" };
}

export function validateBookTitle(title) {
  const valid = typeof title === "string" && title.length >= 1 && title.length <= 100 && !/^\s/.test(title);
  return { valid, message: valid ? "Valid title" : "Title must be 1-100 characters and not start with whitespace" };
}
