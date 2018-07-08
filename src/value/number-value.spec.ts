import {parseNumberValue} from "./number-value.ts";

describe("parseNumberValue", () => {
	[
		{
			name: "can parse NNN format",
			in: "1234",
			string: "1234",
			number: 1234,
		},
		{
			name: "can parse NNN.NNN format",
			in: "123.456",
			string: "123.456",
			number: 123.456,
		},
		{
			name: "can parse .NNN format",
			in: ".123",
			string: ".123",
			number: 0.123,
		},
		{
			name: "can parse -NNN format",
			in: "-1234",
			string: "-1234",
			number: -1234,
		},
		{
			name: "ignores prefixes and suffixes",
			in: "???1234???",
			string: "???1234???",
			number: 1234,
		},
		{
			name: "trims whitespace",
			in: "   1234   ",
			string: "1234",
			number: 1234,
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseNumberValue("Number", test.in);
			expect(v).not.toBeUndefined();
			if (v) {
				expect(v.name).toBe("Number");
				expect(v.string).toBe(test.string);
				expect(v.number).toBe(test.number);
			}
		});
	});

	it("returns undefined if parsing fails", () => {
		expect(parseNumberValue("Number", "???")).toBeUndefined();
	});
});
