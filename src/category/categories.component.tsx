import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject, observer} from "inferno-mobx";
import {Model} from "../model/model";
import {Store} from "../store";
import {SubcategoryListComponent} from "./subcategory-list.component";

interface Stores {
	model: Model;
}

/**
 * Contents of the Categories tab.
 */
@inject(Store.Model)
@observer
export class CategoriesComponent extends Component {
	get stores() {
		return this.props as Stores;
	}

	public render() {
		const categories = this.stores.model.categories;
		if (!categories.length) {
			return <Alert color="primary">No categories.</Alert>;
		}

		return (
			<section>
				<SubcategoryListComponent categories={categories} />
			</section>
		);
	}
}
