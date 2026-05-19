import { Member } from "../models/Member.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new Error("Invalid member");
  if (library.members.find((m) => m.id === member.id)) throw new Error("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");
  return member;
}
