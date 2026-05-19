import { Member } from "../models/Member.js";
import { addMember, getMember } from "../services/memberService.js";

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
