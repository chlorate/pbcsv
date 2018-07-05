import {Badge, ListGroup} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {Category} from "./category";

interface Props {
	categories: Category[];
}

/**
 * A list linking to categories that have subcategories.
 */
export const SubcategoryListComponent = (props: Props) => {
	const items: JSX.Element[] = [];
	props.categories.forEach((c) => {
		if (c.children.length) {
			items.push(
				<Link
					className="
						list-group-item
						list-group-item-card-padding
						list-group-item-action
						d-flex
						justify-content-between
						align-items-center
					"
					to={`/categories/${c.fullSlug}`}
				>
					{c.name}
					<Badge pill>{c.children.length}</Badge>
				</Link>,
			);
		}
	});
	if (!items.length) {
		return null;
	}

	return (
		<ListGroup tag="div" className="mb-3">
			{items}
		</ListGroup>
	);
};
