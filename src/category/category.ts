/**
 * A category contains subcategories and runs.
 */
export class Category {
	private _name: string;
	private _parent?: Category;
	private _children: Category[] = [];

	constructor(name, parent) {
		this._name = name;
		this._parent = parent;
	}

	get name() {
		return this._name;
	}

	get parent() {
		return this._parent;
	}

	get children() {
		return this._children;
	}
}
