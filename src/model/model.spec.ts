import {Category} from "../category/category";
import {Model} from "./model";

describe("Model", () => {
	let model;
	let parent;
	let child;
	let grandchild;

	beforeEach(() => {
		model = new Model();

		parent = new Category("Parent", "p");
		child = new Category("Child", "c", parent);
		grandchild = new Category("Grandchild", "gc", child);
		model.categories.push(parent);
		parent.children.push(child);
		child.children.push(grandchild);
	});

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
