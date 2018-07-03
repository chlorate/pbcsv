import {Category} from "../category/category";

/**
 * A run describes a current or former personal best playthrough of some
 * category.
 */
export class Run {
	private _category: Category;
	private _platform: string;
	private _version: string;
	private _emulator: string;
	private _comment: string;

	constructor(category, platform, version, emulator, comment) {
		this._category = category;
		this._platform = platform;
		this._version = version;
		this._emulator = emulator;
		this._comment = comment;
	}

	get category() {
		return this._category;
	}

	get platform() {
		return this._platform;
	}

	get version() {
		return this._version;
	}

	get emulator() {
		return this._emulator;
	}

	get comment() {
		return this._comment;
	}
}
