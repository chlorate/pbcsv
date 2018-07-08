import parse from "csv-parse";
import {Category} from "../category/category";
import {ApproxDate, parseApproxDate} from "../date/approx-date";
import {Run} from "../run/run";
import {SlugGenerator} from "../slug/slug-generator";

const categorySeparator = " / ";

const categoryAliases = ["category", "chart", "game", "segment", "split"];
const platformAliases = ["platform", "system"];
const versionAliases = ["ver", "version"];
const emulatorAliases = ["emu", "emulator"];
const dateAliases = ["date"];
const commentAliases = ["comment", "comments", "note", "notes"];

const valueAliases = [
	"gt",
	"igt",
	"rta",
	"score",
	"score/time",
	"time",
	"time/score",
	"value",
];

/**
 * Parses a CSV file and outputs a hierarchy of categories.
 */
export class CsvParser {
	public valueNames: string[] = [];

	private _warnings: string[] = [];
	private _errors: string[] = [];

	private readHeader = false;
	private categoryIndices: number[] = [];
	private valueIndices: number[] = [];
	private platformIndex?: number;
	private versionIndex?: number;
	private emulatorIndex?: number;
	private dateIndex?: number;
	private commentIndex?: number;

	private _categories: Category[] = [];
	private categorySlugs: {[name: string]: SlugGenerator} = {};
	private categoriesByName: {[name: string]: Category} = {};

	get warnings(): string[] {
		return this._warnings;
	}

	get errors(): string[] {
		return this._errors;
	}

	get categories(): Category[] {
		return this._categories;
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
		row.forEach((v, i) => {
			const vl = v.toLowerCase();
			if (categoryAliases.indexOf(vl) >= 0) {
				this.categoryIndices.push(i);
			}
			if (valueAliases.indexOf(vl) >= 0) {
				this.valueIndices.push(i);
				this.valueNames.push(v);
			}
			if (platformAliases.indexOf(vl) >= 0) {
				this.platformIndex = i;
			}
			if (versionAliases.indexOf(vl) >= 0) {
				this.versionIndex = i;
			}
			if (emulatorAliases.indexOf(vl) >= 0) {
				this.emulatorIndex = i;
			}
			if (dateAliases.indexOf(vl) >= 0) {
				this.dateIndex = i;
			}
			if (commentAliases.indexOf(vl) >= 0) {
				this.commentIndex = i;
			}
		});

		if (!this.categoryIndices.length) {
			this.errors.push("No category columns found.");
		}
		if (!this.valueIndices.length) {
			this.errors.push("No value columns found.");
		}

		this.readHeader = true;
	}

	private parseRow(row: string[]): void {
		const nameParts = this.parseCategoryName(row);
		if (!nameParts.length) {
			return;
		}

		const category = this.ensureCategory(nameParts);
		const run = new Run(
			category,
			this.parseString(row, this.platformIndex),
			this.parseString(row, this.versionIndex),
			this.parseString(row, this.emulatorIndex),
			this.parseDate(row, this.dateIndex),
			this.parseString(row, this.commentIndex),
		);
		category.runs.push(run);
	}

	private parseCategoryName(row: string[]): string[] {
		const parts: string[] = [];
		this.categoryIndices.forEach((i) => {
			parts.push(row[i]);
		});
		return parts
			.join(categorySeparator)
			.split(categorySeparator)
			.map((p) => p.trim())
			.filter((p) => p);
	}

	private parseString(row: string[], index?: number): string {
		if (index === undefined) {
			return "";
		}
		return row[index].trim();
	}

	private parseDate(row: string[], index?: number): ApproxDate | undefined {
		if (index === undefined || !row[index]) {
			return undefined;
		}

		const date = parseApproxDate(row[index]);
		if (!date) {
			this.warnings.push(`Invalid date: ${row[index]}`);
		}
		return date;
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
}
