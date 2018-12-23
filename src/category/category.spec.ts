import {Category} from "pbcsv/category";
import {DatePrecision, DateString} from "pbcsv/date";
import {Run} from "pbcsv/run";
import {Value} from "pbcsv/value";

describe("Category", () => {
	const parent = new Category("Parent", "parent");
	const child = new Category("Child", "child", parent);

	it("can return full name", () => {
		expect(parent.fullName).toBe("Parent");
		expect(child.fullName).toBe("Parent - Child");
	});

	it("can return full slug", () => {
		expect(parent.fullSlug).toBe("parent");
		expect(child.fullSlug).toBe("parent/child");
	});

	it("can return total descendants having runs", () => {
		const categoryWithRuns = new Category();
		categoryWithRuns.runs.push(new Run(categoryWithRuns));

		const category = new Category();
		category.children.push(new Category(), new Category());
		category.children[0].children.push(categoryWithRuns);

		expect(category.totalDescendantsWithRuns).toBe(1);
		expect(category.children[0].totalDescendantsWithRuns).toBe(1);
		expect(categoryWithRuns.totalDescendantsWithRuns).toBe(0);
	});
});
