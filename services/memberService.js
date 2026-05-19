import { Member } from "../models/Member.js";
import { validateMemberID, validatePhone, validateEmail } from "../utils/validator.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new Error("Invalid member");

  const idCheck = validateMemberID(member.id);
  if (!idCheck.valid) throw new Error(idCheck.message);

  const phoneCheck = validatePhone(member.phone);
  if (!phoneCheck.valid) throw new Error(phoneCheck.message);

  const emailCheck = validateEmail(member.email);
  if (!emailCheck.valid) throw new Error(emailCheck.message);

  if (library.members.find((m) => m.id === member.id)) throw new Error("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");
  return member;
}
