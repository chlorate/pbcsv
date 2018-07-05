import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject, observer} from "inferno-mobx";
import {withRouter} from "inferno-router";
import {Category} from "../category/category";
import {Model} from "../model/model";
import {RunComponent} from "../run/run.component";
import {Store} from "../store";
import {CategoryTableComponent} from "./category-table.component";
import {SubcategoryListComponent} from "./subcategory-list.component";

interface Injected {
	match: {params: {fullSlug: string}};
	model: Model;
}

/**
 * Contents of the Categories tab.
 */
@inject(Store.Model)
@withRouter
@observer
export class CategoriesComponent extends Component {
	get injected() {
		return this.props as Injected;
	}

	public render() {
		const model = this.injected.model;

		let category: Category | undefined;
		let subcategories = model.categories;

		const fullSlug = this.injected.match.params.fullSlug;
		if (fullSlug) {
			category = model.findCategory(fullSlug);
			if (!category) {
				return <Alert color="warning">Category not found.</Alert>;
			}
			subcategories = category.children;
		}

		if (!subcategories.length && (!category || !category.runs.length)) {
			return <Alert color="primary">No categories or runs.</Alert>;
		}

		const children: JSX.Element[] = [];
		if (category) {
			children.push(<h2 className="mb-3">{category.fullName}</h2>);
		}
		children.push(
			<SubcategoryListComponent categories={subcategories} />,
			<CategoryTableComponent categories={subcategories} />,
		);
		if (category && category.runs.length) {
			const numRuns = category.runs.length;
			category.runs.forEach((r, i) => {
				children.push(<RunComponent run={r} number={numRuns - i} />);
			});
		}

		return <section>{children}</section>;
	}
}
