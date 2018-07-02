import {CsvParser} from "./csv-parser";

describe("CsvParser", () => {
	let parser;

	beforeEach(() => {
		parser = new CsvParser();
	});

	describe("parse", () => {
		it("should create categories from single column", (done) => {
			const csv = `Category,Value
A1,0
B1 / B2,0
C1 / C2 / C3,0
C1 / C2 / C4,0`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				expect(c.length).toBe(3);
				checkCategory(c[0], "A1", undefined, 0);
				checkCategory(c[1], "B1", undefined, 1);
				checkCategory(c[1].children[0], "B2", c[1], 0);
				checkCategory(c[2], "C1", undefined, 1);
				const c20 = c[2].children[0];
				checkCategory(c20, "C2", c[2], 2);
				checkCategory(c20.children[0], "C3", c20, 0);
				checkCategory(c20.children[1], "C4", c20, 0);

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
				expect(c.length).toBe(2);
				checkCategory(c[0], "G1", undefined, 1);
				checkCategory(c[0].children[0], "C1", c[0], 0);
				checkCategory(c[1], "G2", undefined, 1);
				const c10 = c[1].children[0];
				checkCategory(c10, "G3", c[1], 1);
				const c100 = c10.children[0];
				checkCategory(c100, "C2", c10, 1);
				checkCategory(c100.children[0], "C3", c100, 0);

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
				expect(c.length).toBe(4);
				checkCategory(c[0], "C1", undefined, 0);
				checkCategory(c[1], "G1", undefined, 0);
				checkCategory(c[2], "G3", undefined, 1);
				checkCategory(c[2].children[0], "G4", c[2], 0);
				checkCategory(c[3], "G5", undefined, 1);
				checkCategory(c[3].children[0], "G6", c[3], 0);

				done();
			}, done.fail);
		});

		it("should trim whitespace", (done) => {
			const csv = `Category,Value
 C1  /  C2 , 0 `;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);

				const c = parser.categories;
				expect(c.length).toBe(1);
				checkCategory(c[0], "C1", undefined, 1);
				checkCategory(c[0].children[0], "C2", c[0], 0);

				done();
			});
		});

		function checkCategory(category, name, parent, numChildren) {
			expect(category.name).toBe(name);
			expect(category.parent).toBe(parent);
			expect(category.children.length).toBe(numChildren);
		}

		it("should ignore rows with blank category", (done) => {
			const csv = `Category,Value

,0
`;

			parser.parse(csv).then(() => {
				expect(parser.warnings.length).toBe(0);
				expect(parser.errors.length).toBe(0);
				expect(parser.categories.length).toBe(0);
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
