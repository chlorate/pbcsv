import {Component, InfernoNode} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {withRouter} from "inferno-router";
import {Category, CategoryBreadcrumbs, CategoryList} from "pbcsv/category";
import {createMessages} from "pbcsv/i18n";
import {Model} from "pbcsv/model";
import {RunComponent, RunTableComponent} from "pbcsv/run";
import {Store} from "pbcsv/store";

const messages = createMessages({
	empty: "No categories or runs found.",
	notFound: "Category not found.",
});

interface InjectedProps {
	match: {params: {fullSlug: string}};
	model: Model;
}

/**
 * Contents of the Categories tab. Displays the following depending on the
 * currently selected category:
 *
 * - List of subcategories that have their own subcategories.
 * - Table of subcategories and their latest runs.
 * - List of runs for the currently selected category.
 */
@inject(Store.Model)
@withRouter
export class CategoriesTab extends Component {
	private get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): InfernoNode {
		const {match, model} = this.injected;
		const {fullSlug} = match.params;

		let category: Category | undefined;
		if (fullSlug) {
			category = model.findCategory(fullSlug);
			if (!category) {
				return <Alert color="warning">{messages.notFound()}</Alert>;
			}
		}

		let subcategories = model.categories;
		if (category) {
			subcategories = category.children;
		}
		if (!subcategories.length && (!category || !category.runs.length)) {
			return <Alert color="primary">{messages.empty()}</Alert>;
		}

		const subcategoriesWithChildren = subcategories.filter(
			(c) => c.children.length,
		);
		const subcategoryRuns = subcategories
			.filter((c) => c.runs.length)
			.map((c) => c.runs[0]);
		return (
			<section>
				<CategoryBreadcrumbs category={category} />
				<CategoryList categories={subcategoriesWithChildren} />
				<RunTableComponent runs={subcategoryRuns} sums />
				{this.runs(category)}
			</section>
		);
	}

	private runs(category?: Category): InfernoNode[] {
		if (!category) {
			return [];
		}

		const count = category.runs.length;
		return category.runs.map((run, i) => (
			<RunComponent run={run} number={count - i} />
		));
	}
}
