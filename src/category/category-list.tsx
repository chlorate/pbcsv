import {Badge, ListGroup} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {Category} from "pbcsv/category";
import {formatNumber} from "pbcsv/math";
import {listGroupItemClassName} from "pbcsv/ui";

interface IProps {
	categories: Category[];
}

/**
 * A list linking to categories. Shows the number of subcategories each category
 * has.
 */
export const CategoryList = ({categories}: IProps) => {
	const items = categories.map((category) => {
		const total = formatNumber(category.totalDescendantsWithRuns);
		const title = `${total} subcategor${total === "1" ? "y" : "ies"}`;
		return (
			<Link
				className={listGroupItemClassName}
				to={`/categories/${category.fullSlug}`}
			>
				{category.name}
				<Badge pill title={title}>
					{total}
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
};
