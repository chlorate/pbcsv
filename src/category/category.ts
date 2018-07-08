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

	constructor(name: string, slug: string, parent?: Category) {
		this._name = name;
		this._slug = slug;
		this._parent = parent;
	}

	get name(): string {
		return this._name;
	}

	get fullName(): string {
		return (this._parent ? `${this._parent.fullName} - ` : "") + this._name;
	}

	get slug(): string {
		return this._slug;
	}

	get fullSlug(): string {
		return (this._parent ? `${this._parent.fullSlug}/` : "") + this._slug;
	}

	get parent(): Category | undefined {
		return this._parent;
	}

	get children(): Category[] {
		return this._children;
	}

	get runs(): Run[] {
		return this._runs;
	}

	get hasPlatforms(): boolean {
		return this.runs.some((r) => r.platform !== "");
	}

	get hasVersions(): boolean {
		return this.runs.some((r) => r.version !== "");
	}

	get hasEmulators(): boolean {
		return this.runs.some((r) => r.emulator !== "");
	}

	get hasDates(): boolean {
		return this.runs.some((r) => r.date !== undefined);
	}
}
