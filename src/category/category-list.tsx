import {StatelessComponent} from "inferno";
import {ListGroup} from "inferno-bootstrap";
import {Category, CategoryListItem} from "pbcsv/category";

interface IProps {
	categories: Category[];
}

/**
 * A list of categories. Each category links to its page and shows its number of
 * subcategories.
 */
export const CategoryList: StatelessComponent<IProps> = ({categories}) => {
	const items = categories.map((category) => (
		<CategoryListItem key={category.fullSlug} category={category} />
	));
	if (!items.length) {
		return null;
	}

	return (
		<ListGroup tag="div" className="mb-3">
			{items}
		</ListGroup>
	);
};
