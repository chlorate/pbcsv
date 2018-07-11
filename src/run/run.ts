import {Category} from "../category/category";
import {ApproxDate} from "../date/approx-date";
import {Values} from "../value/value";

/**
 * A run describes a current or former personal best playthrough of some
 * category.
 */
export class Run {
	private _category: Category;
	private _values: Values = {};
	private _platform: string;
	private _version: string;
	private _emulator: string;
	private _date?: ApproxDate;
	private _comment: string;

	constructor(
		c: Category,
		platform: string,
		version: string,
		emulator: string,
		d: ApproxDate | undefined,
		comment: string,
	) {
		this._category = c;
		this._platform = platform;
		this._version = version;
		this._emulator = emulator;
		this._date = d;
		this._comment = comment;
	}

	get category(): Category {
		return this._category;
	}

	get values(): Values {
		return this._values;
	}

	get platform(): string {
		return this._platform;
	}

	get version(): string {
		return this._version;
	}

	get emulator(): string {
		return this._emulator;
	}

	get date(): ApproxDate | undefined {
		return this._date;
	}

	get comment(): string {
		return this._comment;
	}
}
