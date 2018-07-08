import {action, observable} from "mobx";
import {Category} from "../category/category";
import {request} from "../xhr/util";
import {CsvParser} from "./csv-parser";

/**
 * Stores the state of the CSV file and its parsed content.
 */
export class Model {
	@observable public loading = false;
	@observable public loaded = false;
	@observable public warnings: string[] = [];
	@observable public errors: string[] = [];
	private _categories: Category[] = [];

	get categories(): Category[] {
		return this._categories;
	}

	/**
	 * Retrieves and parses a file from some URL. Returns a promise that is
	 * resolved if successful or rejected if there is any error.
	 */
	@action
	public open(url: string): Promise<void> {
		const parser = new CsvParser();
		this.loading = true;
		this.warnings = [];
		this.errors = [];

		return request(url)
			.then(
				(response) => parser.parse(response),
				(error) => {
					this.errors.push(`Failed to retrieve file: ${error}`);
					return Promise.reject();
				},
			)
			.then(() => {
				this.warnings.push(...parser.warnings);
				this._categories = parser.categories;
				this.loading = false;
				this.loaded = true;
			})
			.catch(() => {
				this.errors.push(...parser.errors);
				this.loading = false;
				return Promise.reject();
			});
	}

	/**
	 * Finds a category by its full slug or undefined if not found.
	 */
	public findCategory(fullSlug: string): Category | undefined {
		return this.find(fullSlug.split("/"), this.categories);
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
