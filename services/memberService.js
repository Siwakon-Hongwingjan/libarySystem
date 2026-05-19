import { Member } from "../models/Member.js";
import { validateMemberID, validatePhone, validateEmail } from "../utils/validator.js";
import { MemberNotFoundError, ValidationError } from "../errors/LibraryErrors.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new ValidationError("Invalid member");

  const idCheck = validateMemberID(member.id);
  if (!idCheck.valid) throw new ValidationError(idCheck.message);

  const phoneCheck = validatePhone(member.phone);
  if (!phoneCheck.valid) throw new ValidationError(phoneCheck.message);

  const emailCheck = validateEmail(member.email);
  if (!emailCheck.valid) throw new ValidationError(emailCheck.message);

  if (library.members.find((m) => m.id === member.id)) throw new ValidationError("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new MemberNotFoundError(memberId);
  return member;
}

export function safeAddMember(library, member) {
  try {
    addMember(library, member);
    return { success: true, data: [...library.members], message: "Member added successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeAddMember completed");
  }
}
