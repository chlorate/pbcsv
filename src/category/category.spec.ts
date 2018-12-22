import {Category} from "pbcsv/category";
import {DatePrecision, DateString} from "pbcsv/date";
import {Run} from "pbcsv/run";
import {Value} from "pbcsv/value";

describe("Category", () => {
	const parent = new Category("Parent", "parent");
	const child = new Category("Child", "child", parent);

	const emptyRuns = new Category();
	emptyRuns.runs.push(new Run(emptyRuns));

	const fullRuns = new Category();
	fullRuns.runs.push(
		new Run(
			fullRuns,
			"Primary",
			"Platform",
			"Version",
			"Emulator",
			new DateString("", new Date(), DatePrecision.Day),
			"Comment",
		),
	);
	fullRuns.runs[0].values.Value = new Value("value");

	it("can return full name", () => {
		expect(parent.fullName).toBe("Parent");
		expect(child.fullName).toBe("Parent - Child");
	});

	it("can return full slug", () => {
		expect(parent.fullSlug).toBe("parent");
		expect(child.fullSlug).toBe("parent/child");
	});
});
