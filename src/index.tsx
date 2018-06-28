import {Component, render} from "inferno";
import {HashRouter} from "inferno-router";
import {NavComponent} from "./nav/nav.component";

/**
 * Root component that renders the entire app and holds its state.
 */
class IndexComponent extends Component {
	public render() {
		return (
			<HashRouter>
				<NavComponent />
			</HashRouter>
		);
	}
}

const main = document.getElementsByTagName("main");
if (!main.length) {
	throw new Error("missing main element");
}

render(<IndexComponent />, main[0]);
