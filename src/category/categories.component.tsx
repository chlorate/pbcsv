import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject, observer} from "inferno-mobx";
import {Link, withRouter} from "inferno-router";
import {CategoryTableComponent, SubcategoryListComponent} from ".";
import {Category} from "../category";
import {Model} from "../model";
import {RunComponent} from "../run";
import {Store} from "../store";

interface Injected {
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
@observer
export class CategoriesComponent extends Component {
	get injected(): Injected {
		return this.props as Injected;
	}

	public render(): JSX.Element {
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
			const crumbs: Array<JSX.Element | string> = [category.name];

			let parent = category.parent;
			while (parent) {
				crumbs.push(
					" - ",
					<Link to={`/categories/${parent.fullSlug}`}>
						{parent.name}
					</Link>,
				);
				parent = parent.parent;
			}
			crumbs.reverse();

			children.push(<h2 className="mb-3">{crumbs}</h2>);
		}
		children.push(
			<SubcategoryListComponent categories={subcategories} />,
			<CategoryTableComponent categories={subcategories} />,
		);
		if (category) {
			const runCount = category.runs.length;
			category.runs.forEach((r, i) => {
				children.push(<RunComponent run={r} number={runCount - i} />);
			});
		}

		return <section>{children}</section>;
	}
}
