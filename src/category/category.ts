import {Run} from "../run/run";

/**
 * A category contains subcategories and runs.
 */
export class Category {
	private _name: string;
	private _slug: string;
	private _parent?: Category;
	private _children: Category[] = [];
	private _runs: Run[] = [];

	constructor(name, slug, parent?) {
		this._name = name;
		this._slug = slug;
		this._parent = parent;
	}

	get name() {
		return this._name;
	}

	get slug() {
		return this._slug;
	}

	get fullSlug() {
		return (this._parent ? `${this._parent.fullSlug}/` : "") + this._slug;
	}

	get parent() {
		return this._parent;
	}

	get children() {
		return this._children;
	}

	get runs() {
		return this._runs;
	}
}
