import {Model} from ".";
import {Category} from "../category";

describe("Model", () => {
	const model = new Model();

	const parent = new Category({
		name: "Parent",
		slug: "p",
	});
	model.categories.push(parent);

	const child = new Category({
		name: "Child",
		slug: "c",
		parent,
	});
	parent.children.push(child);

	const grandchild = new Category({
		name: "Grandchild",
		slug: "gc",
		parent: child,
	});
	child.children.push(grandchild);

	describe("findCategory", () => {
		it("should return category if found", () => {
			expect(model.findCategory("p")).toBe(parent);
			expect(model.findCategory("p/c")).toBe(child);
			expect(model.findCategory("p/c/gc")).toBe(grandchild);
		});

		it("should return undefined if not found", () => {
			expect(model.findCategory("")).toBeUndefined();
			expect(model.findCategory("bad")).toBeUndefined();
			expect(model.findCategory("bad/bad")).toBeUndefined();
			expect(model.findCategory("p/c/bad")).toBeUndefined();
		});
	});
});
