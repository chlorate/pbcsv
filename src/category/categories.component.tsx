import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject, observer} from "inferno-mobx";
import {withRouter} from "inferno-router";
import {Model} from "../model/model";
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

		let category;
		let subcategories = model.categories;

		const fullSlug = this.injected.match.params.fullSlug;
		if (fullSlug) {
			category = model.findCategory(fullSlug);
			if (!category) {
				return <Alert color="warning">Category not found.</Alert>;
			}
			subcategories = category.children;
		}

		if (!subcategories.length) {
			return <Alert color="primary">No categories.</Alert>;
		}

		return (
			<section>
				<SubcategoryListComponent categories={subcategories} />
				<CategoryTableComponent categories={subcategories} />
			</section>
		);
	}
}
