import {Component} from "inferno";
import {Nav, NavItem} from "inferno-bootstrap";
import {inject, observer} from "inferno-mobx";
import {NavLink, Route, Switch, withRouter} from "inferno-router";
import {CategoriesComponent} from "../category";
import {FileComponent} from "../file";
import {HelpComponent} from "../help";
import {Model} from "../model";
import {Store} from "../store";

const links = [
	{
		path: "/",
		name: "File",
		exact: true,
	},
	{
		path: "/categories",
		name: "Categories",
		loadedOnly: true,
	},
	{
		path: "/years",
		name: "Years",
		loadedOnly: true,
	},
	{
		path: "/help",
		name: "Help",
		className: "ml-auto",
	},
];

interface Stores {
	model: Model;
}

/**
 * Renders a tabbed navigation bar and the contents of the selected tab.
 */
@inject(Store.Model)
@withRouter
@observer
export class NavComponent extends Component {
	get stores(): Stores {
		return this.props as Stores;
	}

	public render(): JSX.Element {
		const model = this.stores.model;

		const items = links
			.filter((l) => !l.loadedOnly || model.loaded)
			.map((l) => (
				<NavItem className={l.className}>
					<NavLink
						className="nav-link"
						activeClassName="active"
						exact={l.exact}
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
					<Route exact path="/" component={FileComponent} />
					<Route
						path="/categories/:fullSlug*"
						component={CategoriesComponent}
					/>
					<Route path="/years" />
					<Route path="/help" component={HelpComponent} />
				</Switch>
			</div>
		);
	}
}
