import {History} from "history";
import {ChangeEvent, Component, linkEvent} from "inferno";
import {inject, observer} from "inferno-mobx";
import {Model} from "../model";
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
	Nav,
	NavItem,
	NavLink,
	Row,
} from "inferno-bootstrap";

enum Mode {
	Url = 1,
	File,
}

interface State {
	mode: Mode;
	url: string;
}

interface InjectedProps {
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
	public fileInput: HTMLInputElement | null = null;

	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	private get nav(): JSX.Element {
		const onClickModeUrl = () => handleClickMode(this, Mode.Url);
		const onClickModeFile = () => handleClickMode(this, Mode.File);

		return (
			<Nav tabs className="card-header-tabs">
				<NavItem>
					<NavLink
						tag="button"
						className="btn-nav-link"
						active={this.state.mode === Mode.Url}
						onClick={onClickModeUrl}
					>
						Fetch URL
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						tag="button"
						className="btn-nav-link"
						active={this.state.mode === Mode.File}
						onClick={onClickModeFile}
					>
						Upload file
					</NavLink>
				</NavItem>
			</Nav>
		);
	}

	private get body(): JSX.Element[] {
		const model = this.injected.model;

		const onSubmit = linkEvent(this, handleSubmit);
		const onChangeFile = linkEvent(this, handleChangeFile);
		const onClickBrowse = () => handleClickBrowse(this);
		const onInputUrl = linkEvent(this, handleInputUrl);

		const elements: JSX.Element[] = [
			<p>Upload a CSV file, get a listing of your personal bests.</p>,
		];
		switch (this.state.mode) {
			case Mode.Url:
				elements.push(
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
					</Form>,
				);
				break;
			case Mode.File:
				elements.push(
					<input
						type="file"
						accept=".csv"
						hidden
						ref={(input) => (this.fileInput = input)}
						onChange={onChangeFile}
					/>,
					<Button
						color="primary"
						disabled={model.loading}
						onClick={onClickBrowse}
					>
						Browse
					</Button>,
				);
				break;
		}
		return elements;
	}

	constructor() {
		super();

		this.state = {
			mode: Mode.Url,
			url: "",
		};
	}

	public render(): JSX.Element {
		const model = this.injected.model;

		return (
			<Row tag="section">
				<Col xs="12" md="9" lg="7" xl="6">
					<Card className="mb-3">
						<CardHeader>{this.nav}</CardHeader>
						<CardBody>{this.body}</CardBody>
					</Card>
				</Col>
				<Col xs="12" md="9" lg="5" xl="6">
					{this.alertList("danger", model.errors)}
					{this.alertList("warning", model.warnings)}
				</Col>
			</Row>
		);
	}

	private alertList(color: string, messages: string[]): JSX.Element | null {
		if (!messages.length) {
			return null;
		}

		return (
			<Alert color={color} className="mb-3">
				<ul className="list-unstyled m-0">
					{messages.map((m) => (
						<li>{m}</li>
					))}
				</ul>
			</Alert>
		);
	}
}

function handleClickMode(component: FileComponent, mode: Mode): void {
	component.setState({mode});
}

function handleSubmit(component: FileComponent, event: Event): void {
	event.preventDefault();

	const promise = component.injected.model.parseUrl(component.state.url);
	handleParse(component, promise);
}

function handleInputUrl(
	component: FileComponent,
	event: ChangeEvent<HTMLInputElement>,
): void {
	component.setState({url: event.target.value});
}

function handleClickBrowse(component: FileComponent): void {
	if (component.fileInput) {
		component.fileInput.click();
	}
}

function handleChangeFile(component: FileComponent): void {
	const input = component.fileInput;
	if (input && input.files) {
		const promise = component.injected.model.parseFile(input.files[0]);
		handleParse(component, promise);
	}
}

function handleParse(component: FileComponent, promise: Promise<void>) {
	promise
		.then(() => {
			component.injected.history.push("/categories");
		})
		.catch(() => {
			// Nothing to handle.
			// Callback required to prevent console error.
		});
}
