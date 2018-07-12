import {NumberValue, parseValue, TimeValue, Value} from ".";

describe("parseValue", () => {
	[
		{
			name: "returns a TimeValue for times",
			in: "1:20",
			class: TimeValue,
			string: "1:20",
		},
		{
			name: "returns a NumberValue for numbers",
			in: "123",
			class: NumberValue,
			string: "123",
		},
		{
			name: "returns a Value for strings",
			in: "string",
			class: Value,
			string: "string",
		},
		{
			name: "trims whitespace",
			in: "   string   ",
			class: Value,
			string: "string",
		},
	].forEach((test) => {
		it(test.name, () => {
			const v = parseValue(test.in);
			expect(v).toBeDefined();
			if (v) {
				expect(v instanceof test.class).toBe(true);
				expect(v.string).toBe(test.string);
			}
		});
	});

	it("returns undefined for empty strings", () => {
		expect(parseValue("")).toBeUndefined();
	});
});
