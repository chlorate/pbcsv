import {ApproxDate} from "../date/approx-date";
import {DatePrecision} from "../date/date-precision";
import {Run} from "../run/run";
import {Category} from "./category";

describe("Category", () => {
	const parent = new Category("Parent", "parent");
	const child = new Category("Child", "child", parent);

	const emptyRuns = new Category("", "");
	emptyRuns.runs.push(new Run(emptyRuns, "", "", "", undefined, ""));

	const fullRuns = new Category("", "");
	fullRuns.runs.push(
		new Run(
			fullRuns,
			"Platform",
			"Version",
			"Emulator",
			new ApproxDate("", new Date(), DatePrecision.Day),
			"Comment",
		),
	);

	it("can return full name", () => {
		expect(parent.fullName).toBe("Parent");
		expect(child.fullName).toBe("Parent - Child");
	});

	it("can return full slug", () => {
		expect(parent.fullSlug).toBe("parent");
		expect(child.fullSlug).toBe("parent/child");
	});

	it("can return if any runs have a date", () => {
		expect(emptyRuns.hasDates).toBe(false);
		expect(fullRuns.hasDates).toBe(true);
	});
});
