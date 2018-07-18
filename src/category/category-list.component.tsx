import {Badge, ListGroup} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {Category} from ".";
import {formatNumber} from "../math";
import {listGroupItemClassName} from "../ui";

interface Props {
	categories: Category[];
}

/**
 * A list linking to categories. Shows the number of subcategories each category
 * has.
 */
export function CategoryListComponent(props: Props): JSX.Element | null {
	const items = props.categories.map((c) => {
		const count = formatNumber(c.children.length);
		const title = `${count} subcategor${count === "1" ? "y" : "ies"}`;

		return (
			<Link
				className={listGroupItemClassName}
				to={`/categories/${c.fullSlug}`}
			>
				{c.name}
				<Badge pill title={title}>
					{count}
				</Badge>
			</Link>
		);
	});
	if (!items.length) {
		return null;
	}

	return (
		<ListGroup tag="div" className="mb-3">
			{items}
		</ListGroup>
	);
}
