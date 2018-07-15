import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {withRouter} from "inferno-router";
import {Model} from "../model";
import {RunTableComponent} from "../run";
import {Store} from "../store";

interface InjectedProps {
	match: {params: {slug: string}};
	model: Model;
}

/**
 * Displays a list of runs for the currently selected year.
 */
@inject(Store.Model)
@withRouter
export class YearComponent extends Component {
	private get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element {
		const slug = this.injected.match.params.slug;
		const year = this.injected.model.years.find((y) => y.slug === slug);
		if (!year) {
			return <Alert color="warning">Year not found.</Alert>;
		}

		return (
			<section>
				<h2 className="mb-3">{year.name}</h2>
				<RunTableComponent runs={year.runs} fullCategoryName={true} />
			</section>
		);
	}
}
