import {StatelessComponent} from "inferno";
import {Badge} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {Category} from "pbcsv/category";
import {createMessages} from "pbcsv/i18n";
import {listGroupItemClassName} from "pbcsv/ui";

const messages = createMessages({
	badge: "{total, number}",
	title: "{total, plural, one {# subcategory} other {# subcategories}}",
});

interface IProps {
	category: Category;
}

/**
 * A list item in a category list. Links to the category's page and shows its
 * number of subcategories.
 */
export const CategoryListItem: StatelessComponent<IProps> = ({category}) => {
	const values = {total: category.totalDescendantsWithRuns};
	return (
		<Link
			className={listGroupItemClassName}
			to={`/categories/${category.fullSlug}`}
		>
			{category.name}
			<Badge pill title={messages.title(values)}>
				{messages.badge(values)}
			</Badge>
		</Link>
	);
};
