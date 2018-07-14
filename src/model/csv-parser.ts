import parse from "csv-parse";
import {Category} from "../category";
import {ApproxDate, parseApproxDate} from "../date";
import {Run} from "../run";
import {SlugGenerator} from "../slug";
import {parseValue, Values} from "../value";

const categorySeparator = " / ";

const categoryRegExp = /^(cat|seg)\.?$|^(category|chart|game|segment|split)$/i;
const valueRegExp = /points|score|time|value|^(gt|igt|jrta|pb|rt|rta|ta)$/i;
const platformRegExp = /^(con|plat|sys)\.?$|^(console|platform|system)$/i;
const versionRegExp = /^(reg|ver)\.?$|^(region|version)$/i;
const emulatorRegExp = /^(emu)\.?$|^(emulator)$/i;
const dateRegExp = /date/i;
const commentRegExp = /^(detail|comment|note)s?$/i;
const linkRegExp = /^(img|vid)\.?$|^(image|link|proof|url|video|vod)$/i;

const urlRegExp = /^https?:\/\/.+/;

/**
 * Parses a CSV file and outputs a hierarchy of categories.
 */
export class CsvParser {
	private _warnings: string[] = [];
	private _errors: string[] = [];

	private rowNumber: number = 0;
	private hasAmbiguousDates: boolean = false;

	private readHeader = false;
	private categoryIndices: number[] = [];
	private valueIndices: number[] = [];
	private _valueNames: string[] = [];
	private platformIndex?: number;
	private versionIndex?: number;
	private emulatorIndex?: number;
	private dateIndex?: number;
	private commentIndex?: number;
	private linkIndex?: number;

	private _categories: Category[] = [];
	private categorySlugs: {[name: string]: SlugGenerator} = {};
	private categoriesByName: {[name: string]: Category} = {};
	private lastCategories: string[] = [];

	get warnings(): string[] {
		return this._warnings;
	}

	get errors(): string[] {
		return this._errors;
	}

	get categories(): Category[] {
		return this._categories;
	}

	get valueNames(): string[] {
		return this._valueNames;
	}

	/**
	 * Parses the contents of a CSV file. Returns a promise that is resolved if
	 * successful and rejected if there are any errors.
	 */
	public parse(text: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const parser = parse();
			parser.on("readable", () => {
				for (let row = parser.read(); row; row = parser.read()) {
					this.rowNumber++;

					if (!this.readHeader) {
						this.parseHeader(row);
						continue;
					}

					this.parseRow(row);
				}
			});
			parser.on("finish", () => {
				if (this.errors.length) {
					reject();
					return;
				}
				resolve();
			});
			parser.on("error", (error) => {
				this.errors.push(error.toString());
				reject();
			});
			parser.write(text);
			parser.end();
		});
	}

	private parseHeader(row: string[]): void {
		let isHeader = false;
		row.forEach((v, i) => {
			switch (true) {
				case categoryRegExp.test(v):
					this.categoryIndices.push(i);
					break;
				case valueRegExp.test(v):
					this.valueIndices.push(i);
					this._valueNames.push(v);
					break;
				case platformRegExp.test(v) && this.platformIndex === undefined:
					this.platformIndex = i;
					break;
				case versionRegExp.test(v) && this.versionIndex === undefined:
					this.versionIndex = i;
					break;
				case emulatorRegExp.test(v) && this.emulatorIndex === undefined:
					this.emulatorIndex = i;
					break;
				case dateRegExp.test(v) && this.dateIndex === undefined:
					this.dateIndex = i;
					break;
				case commentRegExp.test(v) && this.commentIndex === undefined:
					this.commentIndex = i;
					break;
				case linkRegExp.test(v) && this.linkIndex === undefined:
					this.linkIndex = i;
					break;
				default:
					return; // Unrecognized column name.
			}

			isHeader = true;
		});
		if (!isHeader) {
			return; // Skip rows that contain no recognized header columns.
		}

		if (!this.categoryIndices.length) {
			this.errors.push("No category columns found.");
		}
		if (!this.valueIndices.length) {
			this.errors.push("No value columns found.");
		}

		this.readHeader = true;
	}

	private parseRow(row: string[]): void {
		if (this.isHeaderRow(row)) {
			return; // Skip rows that look like duplicate headers.
		}

		const values = this.parseValues(row);
		if (!Object.keys(values).length) {
			// Skip row with no values. Also clear category cascade.
			this.lastCategories = [];
			return;
		}

		const nameParts = this.parseCategoryName(row);
		if (!nameParts.length) {
			return; // Skip row with no categories.
		}

		const category = this.ensureCategory(nameParts);
		const run = new Run(
			category,
			undefined,
			this.parseString(row, this.platformIndex),
			this.parseString(row, this.versionIndex),
			this.parseString(row, this.emulatorIndex),
			this.parseDate(row),
			this.parseString(row, this.commentIndex),
			this.parseLink(row),
		);
		Object.assign(run.values, values);
		category.runs.push(run);
	}

	private isHeaderRow(row: string[]): boolean {
		return (
			this.categoryIndices.every((i) => categoryRegExp.test(row[i])) &&
			this.valueIndices.every((i) => valueRegExp.test(row[i])) &&
			(this.platformIndex === undefined ||
				platformRegExp.test(row[this.platformIndex])) &&
			(this.versionIndex === undefined ||
				versionRegExp.test(row[this.versionIndex])) &&
			(this.emulatorIndex === undefined ||
				emulatorRegExp.test(row[this.emulatorIndex])) &&
			(this.dateIndex === undefined ||
				dateRegExp.test(row[this.dateIndex])) &&
			(this.commentIndex === undefined ||
				commentRegExp.test(row[this.commentIndex])) &&
			(this.linkIndex === undefined ||
				linkRegExp.test(row[this.linkIndex]))
		);
	}

	private parseCategoryName(row: string[]): string[] {
		const parts: string[] = [];
		this.categoryIndices.forEach((i) => {
			parts.push(row[i]);
		});

		// Cascade previous parent categories: copy previous categories up until
		// the first non-empty category in this row.
		for (let i = 0; i < this.lastCategories.length && !parts[i]; i++) {
			parts[i] = this.lastCategories[i];
		}
		this.lastCategories = parts;

		return parts
			.join(categorySeparator)
			.split(categorySeparator)
			.map((p) => p.trim())
			.filter((p) => p);
	}

	private parseValues(row: string[]): Values {
		const values: Values = {};
		this.valueIndices.forEach((col, i) => {
			if (col >= row.length) {
				return;
			}

			const v = parseValue(row[col]);
			if (v) {
				values[this.valueNames[i]] = v;
			}
		});
		return values;
	}

	private parseString(row: string[], index?: number): string {
		if (index === undefined) {
			return "";
		}
		return row[index].trim();
	}

	private parseDate(row: string[]): ApproxDate | undefined {
		if (this.dateIndex === undefined) {
			return undefined;
		}

		const s = row[this.dateIndex];
		const date = parseApproxDate(s);
		if (date) {
			if (!date.date) {
				this.warn(`Unrecognized date: ${s}`);
			}
			if (date.ambiguous && !this.hasAmbiguousDates) {
				this.warn(
					"Assuming date format is MM/DD/YYYY, not DD/MM/YYYY.",
				);
				this.hasAmbiguousDates = true;
			}
		}
		return date;
	}

	private parseLink(row: string[]): string {
		if (this.linkIndex === undefined) {
			return "";
		}

		const s = row[this.linkIndex].trim();
		if (s && !urlRegExp.test(s)) {
			this.warn(`Invalid link URL: ${s}`);
			return "";
		}
		return s;
	}

	private ensureCategory(nameParts: string[]): Category {
		const joinedName = nameParts.join(categorySeparator);
		let category = this.categoriesByName[joinedName];
		if (category) {
			return category;
		}

		let parent;
		let parentJoinedName = "";
		if (nameParts.length > 1) {
			const parentParts = nameParts.slice(0, nameParts.length - 1);
			parent = this.ensureCategory(parentParts);
			parentJoinedName = parentParts.join(categorySeparator);
		}

		let slugs = this.categorySlugs[parentJoinedName];
		if (!slugs) {
			slugs = new SlugGenerator();
			this.categorySlugs[parentJoinedName] = slugs;
		}

		const lastPart = nameParts[nameParts.length - 1];
		category = new Category(lastPart, slugs.slugify(lastPart), parent);
		if (!parent) {
			this.categories.push(category);
		} else {
			parent.children.push(category);
		}

		this.categoriesByName[joinedName] = category;
		return category;
	}

	private warn(message: string): void {
		this.warnings.push(`Row ${this.rowNumber}: ${message}`);
	}
}
