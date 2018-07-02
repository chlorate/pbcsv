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

	get categories() {
		return this._categories;
	}

	/**
	 * Retrieves and parses a file from some URL. Returns a promise that is
	 * resolved if successful or rejected if there is any error.
	 */
	@action
	public open(url: string) {
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
				this.warnings.concat(parser.warnings);
				this._categories = parser.categories;
				this.loading = false;
				this.loaded = true;
			})
			.catch(() => {
				this.errors.concat(parser.errors);
				this.loading = false;
				return Promise.reject();
			});
	}
}
