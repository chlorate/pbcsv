import {Badge, ListGroup} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {formatNumber} from "../math/util";
import {Category} from "./category";

interface Props {
	categories: Category[];
}

/**
 * A list linking to categories that have subcategories.
 */
export function SubcategoryListComponent(props: Props): JSX.Element | null {
	const items = props.categories.filter((c) => c.children.length).map((c) => {
		const count = c.children.length;

		let title = "1 subcategory";
		if (count > 1) {
			title = `${formatNumber(count)} subcategories`;
		}

		const classes = [
			"list-group-item",
			"list-group-item-card-padding",
			"list-group-item-action",
			"d-flex",
			"justify-content-between",
			"align-items-center",
		];
		return (
			<Link
				className={classes.join(" ")}
				to={`/categories/${c.fullSlug}`}
			>
				{c.name}
				<Badge pill title={title}>
					{formatNumber(count)}
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
