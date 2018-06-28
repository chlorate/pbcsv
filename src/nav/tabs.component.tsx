import {NavLink} from "inferno-router";

const links = [
	{
		path: "/",
		name: "File",
	},
	{
		path: "/categories",
		name: "Categories",
	},
	{
		path: "/years",
		name: "Years",
	},
	{
		path: "/help",
		name: "Help",
		classes: "ml-auto",
	},
];

/**
 * Renders a tabbed navigation bar.
 */
export const TabsComponent = () => {
	const items = links.map((l) => (
		<li className={`nav-item ${l.classes || ""}`}>
			<NavLink
				className="nav-link"
				activeClassName="active"
				exact
				to={l.path}
			>
				{l.name}
			</NavLink>
		</li>
	));

	return <ul className="nav nav-tabs">{items}</ul>;
};
