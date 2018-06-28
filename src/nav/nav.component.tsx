import {NavLink, Route, Switch} from "inferno-router";
import {HelpComponent} from "../help/help.component";

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
 * Renders a tabbed navigation bar and the contents of the selected tab.
 */
export const NavComponent = () => {
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

	return (
		<div>
			<ul className="nav nav-tabs mb-3">{items}</ul>
			<Switch>
				<Route exact path="/" />
				<Route path="/categories" />
				<Route path="/years" />
				<Route path="/help" component={HelpComponent} />
			</Switch>
		</div>
	);
};
