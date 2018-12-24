import {InfernoNode} from "inferno";
import {Link} from "inferno-router";
import {Category} from "pbcsv/category";

interface IProps {
	category?: Category;
}

/**
 * Breadcrumbs linking to the parent categories of some category.
 */
export const CategoryBreadcrumbs = ({category}: IProps) => {
	if (!category) {
		return null;
	}

	const crumbs: InfernoNode[] = [category.name];
	let parent = category.parent;
	while (parent) {
		crumbs.push(
			" - ",
			<Link to={`/categories/${parent.fullSlug}`}>{parent.name}</Link>,
		);
		parent = parent.parent;
	}
	crumbs.reverse();

	return <h2 className="mb-3">{crumbs}</h2>;
};
