import {History} from "history";
import {ChangeEvent, Component, linkEvent} from "inferno";
import {inject, observer} from "inferno-mobx";
import {action} from "mobx";
import {Model} from "../model/model";
import {Store} from "../store";

import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Row,
} from "inferno-bootstrap";

interface State {
	url: string;
}

interface Injected {
	history: History;
	model: Model;
}

/**
 * Contents of the File tab. Provides a form for fetching a CSV file from a URL
 * and displays any warnings or errors.
 */
@inject(Store.Model)
@observer
export class FileComponent extends Component<{}, State> {
	public state: State;

	get injected(): Injected {
		return this.props as Injected;
	}

	constructor() {
		super();
		this.state = {url: ""};
	}

	public render(): JSX.Element {
		const model = this.injected.model;
		const onSubmit = linkEvent(this, handleSubmit);
		const onInputUrl = linkEvent(this, handleInputUrl);

		let warnings: JSX.Element | undefined;
		if (model.warnings.length) {
			warnings = alertList("warning", model.warnings);
		}

		let errors: JSX.Element | undefined;
		if (model.errors.length) {
			errors = alertList("danger", model.errors);
		}

		return (
			<Row tag="section" className="justify-content-center">
				<Col md="9" lg="7" xl="6">
					<Card>
						<CardHeader tag="h2" className="h3 mb-0">
							CSV file
						</CardHeader>
						<CardBody>
							<Form onSubmit={onSubmit}>
								<FormGroup>
									<Label for="file-url">URL:</Label>
									<Input
										id="file-url"
										type="url"
										value={this.state.url}
										onInput={onInputUrl}
									/>
								</FormGroup>
								<Button
									color="primary"
									disabled={!this.state.url || model.loading}
								>
									Open
								</Button>
							</Form>
						</CardBody>
					</Card>
					{warnings}
					{errors}
				</Col>
			</Row>
		);
	}
}

const alertList = (color: string, messages: string[]) => (
	<Alert color={color} className="mt-3">
		<ul className="list-unstyled m-0">
			{messages.map((m) => <li>{m}</li>)}
		</ul>
	</Alert>
);

const handleSubmit = action(
	(component: FileComponent, event: Event): void => {
		event.preventDefault();

		component.injected.model
			.open(component.state.url)
			.then(() => {
				component.injected.history.push("/categories");
			})
			.catch(() => {
				// Nothing to handle.
				// Callback required to prevent console error.
			});
	},
);

function handleInputUrl(
	component: FileComponent,
	event: ChangeEvent<HTMLInputElement>,
): void {
	component.setState({url: event.target.value});
}
