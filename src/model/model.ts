import {action, observable} from "mobx";
import {CsvParser} from ".";
import {Category} from "../category";
import {readFile} from "../file";
import {request} from "../xhr";

/**
 * Stores the state of the CSV file and its parsed content.
 */
export class Model {
	@observable public loading = false;
	@observable public loaded = false;
	@observable public warnings: string[] = [];
	@observable public errors: string[] = [];
	private _valueNames: string[] = [];
	private _categories: Category[] = [];
	private _years: Category[] = [];

	get valueNames(): string[] {
		return this._valueNames;
	}

	get categories(): Category[] {
		return this._categories;
	}

	get years(): Category[] {
		return this._years;
	}

	/**
	 * Fetches a CSV file from a URL and parses its contents. Returns a promise
	 * that is resolved if successful or rejected if there is any error.
	 */
	public parseUrl(url: string): Promise<void> {
		return this.parse(request(url));
	}

	/**
	 * Reads a CSV file and parses its contents. Returns a promise that is
	 * resolved if successful or rejected if there is any error.
	 */
	public parseFile(f: File): Promise<void> {
		return this.parse(readFile(f));
	}

	/**
	 * Finds a category by its full slug or undefined if not found.
	 */
	public findCategory(fullSlug: string): Category | undefined {
		return this.find(fullSlug.split("/"), this.categories);
	}

	@action
	private parse(p: Promise<string>): Promise<void> {
		const parser = new CsvParser();
		this.loading = true;
		this.warnings = [];
		this.errors = [];

		return p
			.then(
				(contents) => parser.parse(contents),
				(error) => {
					this.errors.push(`Failed to read file: ${error}`);
					return Promise.reject();
				},
			)
			.then(() => {
				this.warnings.push(...parser.warnings);
				this._valueNames = parser.valueNames;
				this._categories = parser.categories;
				this._years = parser.years;
				this.loading = false;
				this.loaded = true;
			})
			.catch(() => {
				this.errors.push(...parser.errors);
				this.loading = false;
				return Promise.reject();
			});
	}

	private find(
		slugs: string[],
		categories: Category[],
	): Category | undefined {
		const slug = slugs.shift();
		const category = categories.find((c) => c.slug === slug);
		if (!category) {
			return;
		}
		if (slugs.length) {
			return this.find(slugs, category.children);
		}
		return category;
	}
}
