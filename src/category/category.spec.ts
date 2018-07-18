import {Category} from ".";
import {ApproxDate, DatePrecision} from "../date";
import {Run} from "../run";
import {Value} from "../value";

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
			new ApproxDate("", new Date(), DatePrecision.Day),
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
