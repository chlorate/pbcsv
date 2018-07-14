import {Category} from ".";
import {ApproxDate, DatePrecision} from "../date";
import {Run} from "../run";
import {Value} from "../value";

describe("Category", () => {
	const parent = new Category("Parent", "parent");
	const child = new Category("Child", "child", parent);

	const emptyRuns = new Category("", "");
	emptyRuns.runs.push(new Run(emptyRuns));

	const fullRuns = new Category("", "");
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

	it("can return if any runs have a platform", () => {
		expect(emptyRuns.hasPlatforms).toBe(false);
		expect(fullRuns.hasPlatforms).toBe(true);
	});

	it("can return if any runs have a version", () => {
		expect(emptyRuns.hasVersions).toBe(false);
		expect(fullRuns.hasVersions).toBe(true);
	});

	it("can return if any runs have an emulator", () => {
		expect(emptyRuns.hasEmulators).toBe(false);
		expect(fullRuns.hasEmulators).toBe(true);
	});

	it("can return if any runs have a date", () => {
		expect(emptyRuns.hasDates).toBe(false);
		expect(fullRuns.hasDates).toBe(true);
	});

	it("can return if any runs have a value", () => {
		expect(emptyRuns.hasValues("Value")).toBe(false);
		expect(fullRuns.hasValues("Value")).toBe(true);
		expect(fullRuns.hasValues("None")).toBe(false);
	});
});
