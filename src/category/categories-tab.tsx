import {Component, InfernoChildren, VNode} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {withRouter} from "inferno-router";
import {Category, CategoryBreadcrumbs, CategoryList} from "pbcsv/category";
import {Model} from "pbcsv/model";
import {RunComponent, RunTableComponent} from "pbcsv/run";
import {Store} from "pbcsv/store";

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

	public render(): InfernoChildren {
		const {match, model} = this.injected;

		let category: Category | undefined;
		const fullSlug = match.params.fullSlug;
		if (fullSlug) {
			category = model.findCategory(fullSlug);
			if (!category) {
				return <Alert color="warning">Category not found.</Alert>;
			}
		}

		let subcategories = model.categories;
		if (category) {
			subcategories = category.children;
		}
		if (!subcategories.length && (!category || !category.runs.length)) {
			return <Alert color="primary">No categories or runs.</Alert>;
		}

		const subcategoriesWithChildren = subcategories.filter(
			(c) => c.children.length,
		);
		const subcategoryRuns = subcategories
			.filter((c) => c.runs.length)
			.map((c) => c.runs[0]);

		const children: InfernoChildren = [
			<CategoryBreadcrumbs category={category} />,
			<CategoryList categories={subcategoriesWithChildren} />,
			<RunTableComponent runs={subcategoryRuns} sums />,
			...this.runs(category),
		];
		return <section>{children}</section>;
	}

	private runs(category?: Category): VNode[] {
		if (!category) {
			return [];
		}

		const count = category.runs.length;
		return category.runs.map((run, i) => (
			<RunComponent run={run} number={count - i} />
		));
	}
}
