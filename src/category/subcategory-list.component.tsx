import {Badge, ListGroup, ListGroupItem} from "inferno-bootstrap";
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
				<ListGroupItem
					tag="a"
					className="d-flex justify-content-between align-items-center"
					href="#"
				>
					{c.name}
					<Badge pill>{c.children.length}</Badge>
				</ListGroupItem>,
			);
		}
	});
	if (!items.length) {
		return null;
	}

	return <ListGroup className="mb-3">{items}</ListGroup>;
};
