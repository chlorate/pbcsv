import {NumberValue} from "../value/number-value";
import {TimeValue} from "../value/time-value";
import {Value} from "../value/value";
import {CsvParser} from "./csv-parser";

describe("CsvParser", () => {
	let parser;

	beforeEach(() => {
		parser = new CsvParser();
	});

	describe("parse", () => {
		it("should create categories from a single column", (done) => {
			const csv = `Category,Value
A1,0
B1 / B2,0
C1 / C2 / C3,0
C1 / C2 / C4,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 3, done.fail);
				requireLength(c[0].children, 0, done.fail);
				requireLength(c[1].children, 1, done.fail);
				requireLength(c[2].children, 1, done.fail);
				requireLength(c[2].children[0].children, 2, done.fail);

				let ch = c[0];
				expect(ch.name).toBe("A1");
				expect(ch.parent).toBeUndefined();

				ch = c[1];
				expect(ch.name).toBe("B1");
				expect(ch.parent).toBeUndefined();

				ch = c[1].children[0];
				expect(ch.name).toBe("B2");
				expect(ch.parent).toBe(c[1]);

				ch = c[2];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBeUndefined();

				ch = c[2].children[0];
				expect(ch.name).toBe("C2");
				expect(ch.parent).toBe(c[2]);

				ch = c[2].children[0].children[0];
				expect(ch.name).toBe("C3");
				expect(ch.parent).toBe(c[2].children[0]);

				ch = c[2].children[0].children[1];
				expect(ch.name).toBe("C4");
				expect(ch.parent).toBe(c[2].children[0]);

				done();
			}, done.fail);
		});

		it("should create categories from multiple columns", (done) => {
			const csv = `Game,Value,Category
G1,0,C1
G2 / G3,0,C2 / C3`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].children, 1, done.fail);
				requireLength(c[1].children, 1, done.fail);
				requireLength(c[1].children[0].children, 1, done.fail);
				requireLength(
					c[1].children[0].children[0].children,
					1,
					done.fail,
				);

				let ch = c[0];
				expect(ch.name).toBe("G1");
				expect(ch.parent).toBeUndefined();

				ch = c[0].children[0];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBe(c[0]);

				ch = c[1];
				expect(ch.name).toBe("G2");
				expect(ch.parent).toBeUndefined();

				ch = c[1].children[0];
				expect(ch.name).toBe("G3");
				expect(ch.parent).toBe(c[1]);

				ch = c[1].children[0].children[0];
				expect(ch.name).toBe("C2");
				expect(ch.parent).toBe(c[1].children[0]);

				ch = c[1].children[0].children[0].children[0];
				expect(ch.name).toBe("C3");
				expect(ch.parent).toBe(c[1].children[0].children[0]);

				done();
			}, done.fail);
		});

		it("should strip categories with blank name", (done) => {
			const csv = `Game,Value,Category
,0,C1
G1,0,
G3 /  / G4,0,
G5 /  /        / G6,0,`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 4, done.fail);
				requireLength(c[2].children, 1, done.fail);
				requireLength(c[3].children, 1, done.fail);

				let ch = c[0];
				expect(ch.name).toBe("C1");
				expect(ch.parent).toBeUndefined();

				ch = c[1];
				expect(ch.name).toBe("G1");
				expect(ch.parent).toBeUndefined();

				ch = c[2];
				expect(ch.name).toBe("G3");
				expect(ch.parent).toBeUndefined();

				ch = c[2].children[0];
				expect(ch.name).toBe("G4");
				expect(ch.parent).toBe(c[2]);

				ch = c[3];
				expect(ch.name).toBe("G5");
				expect(ch.parent).toBeUndefined();

				ch = c[3].children[0];
				expect(ch.name).toBe("G6");
				expect(ch.parent).toBe(c[3]);

				done();
			}, done.fail);
		});

		it("should assign unambiguous slugs", (done) => {
			const csv = `Category,Value
C1 / C1,0
C1? / C1,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].children, 1, done.fail);
				requireLength(c[1].children, 1, done.fail);

				expect(c[0].fullSlug).toBe("c1");
				expect(c[0].children[0].fullSlug).toBe("c1/c1");

				expect(c[1].fullSlug).toBe("c1.2");
				expect(c[1].children[0].fullSlug).toBe("c1.2/c1");

				done();
			}, done.fail);
		});

		it("should add runs to categories", (done) => {
			const csv = `Category,Value,Platform,Version,Emulator,Date,Comment
Empty,0,,,,,
Category,0,NES,1.1,FCEU,1987-12-17,Run 1...
Category,1:00,NES,1.0,FCEU,2010-03-01,Run 2...`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 2, done.fail);
				requireLength(c[0].runs, 1, done.fail);
				requireLength(c[1].runs, 2, done.fail);

				let r = c[0].runs[0];
				expect(r.category).toBe(c[0]);
				expect(r.platform).toBe("");
				expect(r.version).toBe("");
				expect(r.emulator).toBe("");
				expect(r.date).toBeUndefined();
				expect(r.comment).toBe("");

				r = c[1].runs[0];
				expect(r.category).toBe(c[1]);
				expect(r.platform).toBe("NES");
				expect(r.version).toBe("1.1");
				expect(r.emulator).toBe("FCEU");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("1987-12-17");
				expect(r.comment).toBe("Run 1...");

				r = c[1].runs[1];
				expect(r.category).toBe(c[1]);
				expect(r.platform).toBe("NES");
				expect(r.version).toBe("1.0");
				expect(r.emulator).toBe("FCEU");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("2010-03-01");
				expect(r.comment).toBe("Run 2...");

				done();
			}, done.fail);
		});

		it("should add values to runs", (done) => {
			const csv = `Category,Score,Time,Value
C1,1234,,
C1,,1:23:45,
C1,,,String
C1,1,2,3`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].runs, 4, done.fail);

				expect(Object.keys(c[0].runs[0].values).length).toBe(1);
				expect(Object.keys(c[0].runs[1].values).length).toBe(1);
				expect(Object.keys(c[0].runs[2].values).length).toBe(1);
				expect(Object.keys(c[0].runs[3].values).length).toBe(3);

				let v = c[0].runs[0].values.Score;
				requireDefined(v, done.fail);
				expect(v instanceof NumberValue).toBe(true);
				expect(v.string).toBe("1234");

				v = c[0].runs[1].values.Time;
				requireDefined(v, done.fail);
				expect(v instanceof TimeValue).toBe(true);
				expect(v.string).toBe("1:23:45");

				v = c[0].runs[2].values.Value;
				requireDefined(v, done.fail);
				expect(v instanceof Value).toBe(true);
				expect(v.string).toBe("String");

				v = c[0].runs[3].values.Score;
				requireDefined(v, done.fail);
				expect(v instanceof NumberValue).toBe(true);
				expect(v.string).toBe("1");

				v = c[0].runs[3].values.Time;
				requireDefined(v, done.fail);
				expect(v instanceof NumberValue).toBe(true);
				expect(v.string).toBe("2");

				v = c[0].runs[3].values.Value;
				requireDefined(v, done.fail);
				expect(v instanceof NumberValue).toBe(true);
				expect(v.string).toBe("3");

				done();
			}, done.fail);
		});

		it("should warn if any date is ambiguous", (done) => {
			const csv = `Category,Value,Date
Category,0,1/2/2003`;

			parser.parse(csv).then(() => {
				expect(parser.errors.length).toBe(0);
				expect(parser.warnings).toEqual([
					"Ambiguous date found: assuming format is MM/DD/YYYY, not DD/MM/YYYY.",
				]);
				expect(parser.categories.length).toBe(1);
				done();
			}, done.fail);
		});

		it("should trim whitespace", (done) => {
			const csv = `Category,Value,Platform,Version,Emulator,Date,Comment
 C1  /  C2 , V , P , V , E , 1987-11-17 , C `;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				requireLength(c, 1, done.fail);
				requireLength(c[0].children, 1, done.fail);

				expect(c[0].name).toBe("C1");
				expect(c[0].children[0].name).toBe("C2");

				const r = c[0].children[0].runs[0];
				expect(r.values.Value.string).toBe("V");
				expect(r.platform).toBe("P");
				expect(r.version).toBe("V");
				expect(r.emulator).toBe("E");
				requireDefined(r.date, done.fail);
				expect(r.date.string).toBe("1987-11-17");
				expect(r.comment).toBe("C");

				done();
			}, done.fail);
		});

		it("should ignore empty/unrecognized rows before header", (done) => {
			const csv = `,

Not a header,
,

Category,Value
Category,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(1);
				done();
			}, done.fail);
		});

		it("should ignore rows with blank category", (done) => {
			const csv = `Category,Value
,

,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(0);
				done();
			}, done.fail);
		});

		it("should ignore rows with no values", (done) => {
			const csv = `Category,Value 1,Value 2
,,

Category,,`;

			parser.parse(csv).then(() => {
				const c = parser.categories;
				requireLength(c, 0, done.fail);
				done();
			}, done.fail);
		});

		it("should reject promise on any CSV parsing error", (done) => {
			const csv = `Category,Value
bad`;

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual([
					"Error: Number of columns is inconsistent on line 2",
				]);
				done();
			});
		});

		it("should reject promise if there are no category columns", (done) => {
			const csv = `Value`;

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual(["No category columns found."]);
				done();
			});
		});

		it("should reject promise if there are no value columns", (done) => {
			const csv = "Category";

			parser.parse(csv).then(done.fail, () => {
				expect(parser.errors).toEqual(["No value columns found."]);
				done();
			});
		});
	});
});

function requireLength(
	array: any[],
	length: number,
	fail: (message: string) => void,
) {
	expect(array.length).toBe(length);
	if (array.length < length) {
		fail(`Expected array to have length ${length}: ${array}`);
	}
}

function requireDefined(value: any, fail: (message: string) => void) {
	expect(value).toBeDefined();
	if (value === undefined) {
		fail("Expected value to be defined");
	}
}
