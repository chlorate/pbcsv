import {pad} from "./util";

describe("pad", () => {
	it("should pad if number length is less than pad length", () => {
		expect(pad(123, 6)).toBe("000123");
	});

	it("should return as-is if number and pad length are equal", () => {
		expect(pad(123, 3)).toBe("123");
	});

	it("should return as-is if number length exceeds pad length", () => {
		expect(pad(123, 2)).toBe("123");
	});
});
