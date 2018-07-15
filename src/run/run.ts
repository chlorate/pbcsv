import {Category} from "../category";
import {ApproxDate} from "../date";
import {Values} from "../value";

/**
 * A run describes a current or former personal best playthrough of some
 * category.
 */
export class Run {
	private _category: Category;
	private _values: Values = {};
	private _main: string;
	private _sums: string[] = [];
	private _platform: string;
	private _version: string;
	private _emulator: string;
	private _date?: ApproxDate;
	private _comment: string;
	private _link: string;

	constructor(
		category: Category,
		main?: string,
		platform?: string,
		version?: string,
		emulator?: string,
		date?: ApproxDate,
		comment?: string,
		link?: string,
	) {
		this._category = category;
		this._main = main || "";
		this._platform = platform || "";
		this._version = version || "";
		this._emulator = emulator || "";
		this._date = date;
		this._comment = comment || "";
		this._link = link || "";
	}

	get category(): Category {
		return this._category;
	}

	get values(): Values {
		return this._values;
	}

	get main(): string {
		return this._main;
	}

	get sums(): string[] {
		return this._sums;
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

	get link(): string {
		return this._link;
	}
}
