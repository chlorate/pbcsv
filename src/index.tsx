import {Component, render} from "inferno";
import {Provider} from "inferno-mobx";
import {HashRouter} from "inferno-router";
import {Model} from "./model";
import {NavComponent} from "./nav";

interface State {
	model: Model;
}

/**
 * Root component that renders the entire app and holds its state.
 */
class IndexComponent extends Component {
	public state: State;

	constructor() {
		super();

		this.state = {
			model: new Model(),
		};
	}

	public render(): JSX.Element {
		return (
			<Provider model={this.state.model}>
				<HashRouter>
					<NavComponent />
				</HashRouter>
			</Provider>
		);
	}
}

const main = document.getElementsByTagName("main");
if (!main.length) {
	throw new Error("missing main element");
}

render(<IndexComponent />, main[0]);
