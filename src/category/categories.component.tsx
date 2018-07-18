import {Component} from "inferno";
import {Alert} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link, withRouter} from "inferno-router";
import {CategoryListComponent} from ".";
import {Category} from "../category";
import {Model} from "../model";
import {RunComponent, RunTableComponent} from "../run";
import {Store} from "../store";

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
export class CategoriesComponent extends Component {
	private get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element {
		const model = this.injected.model;

		let category: Category | undefined;
		const fullSlug = this.injected.match.params.fullSlug;
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

		const elements: JSX.Element[] = [];
		if (category) {
			elements.push(this.breadcrumbs(category));
		}
		elements.push(
			<CategoryListComponent categories={subcategoriesWithChildren} />,
			<RunTableComponent runs={subcategoryRuns} sums={true} />,
		);
		if (category) {
			elements.push(...this.runs(category));
		}
		return <section>{elements}</section>;
	}

	private breadcrumbs(category: Category): JSX.Element {
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

		return <h2 className="mb-3">{crumbs}</h2>;
	}

	private runs(category: Category): JSX.Element[] {
		const elements: JSX.Element[] = [];

		const count = category.runs.length;
		category.runs.forEach((r, i) => {
			elements.push(<RunComponent run={r} number={count - i} />);
		});

		return elements;
	}
}
