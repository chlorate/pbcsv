import {Nav, NavItem} from "inferno-bootstrap";
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
		className: "ml-auto",
	},
];

/**
 * Renders a tabbed navigation bar and the contents of the selected tab.
 */
export const NavComponent = () => {
	const items = links.map((l) => (
		<NavItem className={l.className}>
			<NavLink
				className="nav-link"
				activeClassName="active"
				exact
				to={l.path}
			>
				{l.name}
			</NavLink>
		</NavItem>
	));

	return (
		<div>
			<Nav tabs className="mb-3">
				{items}
			</Nav>
			<Switch>
				<Route exact path="/" />
				<Route path="/categories" />
				<Route path="/years" />
				<Route path="/help" component={HelpComponent} />
			</Switch>
		</div>
	);
};
