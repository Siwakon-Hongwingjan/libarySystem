import { Member } from "../models/Member.js";
import { addMember, getMember, safeAddMember } from "../services/memberService.js";

describe("addMember", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("adds a valid Member to library", () => {
    const member = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    addMember(library, member);
    expect(library.members).toHaveLength(1);
  });

  test("throws when argument is not a Member instance", () => {
    expect(() => addMember(library, { id: "LIB-0001" })).toThrow("Invalid member");
  });

  test("throws when member id already exists", () => {
    const member = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    addMember(library, member);
    expect(() => addMember(library, member)).toThrow("Member already exists");
  });
});

describe("getMember", () => {
  let library;
  beforeEach(() => {
    library = { members: [] };
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
  });

  test("returns the correct member", () => {
    const m = getMember(library, "LIB-0001");
    expect(m.name).toBe("Alice");
  });

  test("throws when member not found", () => {
    expect(() => getMember(library, "LIB-9999")).toThrow("Member not found");
  });
});

describe("addMember — validation (week3)", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("throws when member ID format is invalid", () => {
    const m = new Member({ id: "INVALID", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(() => addMember(library, m)).toThrow("Member ID must be in format");
  });

  test("throws when phone format is invalid", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "12345", email: "alice@test.com" });
    expect(() => addMember(library, m)).toThrow("Phone must start with 06-09");
  });

  test("throws when email is invalid", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "notanemail" });
    expect(() => addMember(library, m)).toThrow("Invalid email format");
  });
});

describe("safeAddMember (week4)", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("returns success:true on valid member", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(safeAddMember(library, m).success).toBe(true);
  });

  test("returns success:false on invalid member ID", () => {
    const m = new Member({ id: "INVALID", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(safeAddMember(library, m).success).toBe(false);
  });
});
