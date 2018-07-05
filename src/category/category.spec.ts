import {Category} from "./category";

describe("Category", () => {
	let parent;
	let child;

	beforeEach(() => {
		parent = new Category("Parent", "parent");
		child = new Category("Child", "child", parent);
	});

	it("can return full name", () => {
		expect(parent.fullName).toBe("Parent");
		expect(child.fullName).toBe("Parent - Child");
	});

	it("can return full slug", () => {
		expect(parent.fullSlug).toBe("parent");
		expect(child.fullSlug).toBe("parent/child");
	});
});
