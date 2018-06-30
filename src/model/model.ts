import {action, observable} from "mobx";
import {request} from "../xhr/util";

/**
 * Stores the state of the CSV file and its parsed content.
 */
export class Model {
	@observable public loading = false;
	@observable public loaded = false;
	@observable public warnings: string[] = [];
	@observable public errors: string[] = [];

	@action
	public open(url: string) {
		this.loading = true;
		this.warnings = [];
		this.errors = [];

		return request(url).then(
			(response) => {
				this.loading = false;
				this.loaded = true;
			},
			(error) => {
				this.loading = false;
				this.errors.push(`Failed to retrieve file: ${error}`);
			},
		);
	}
}
