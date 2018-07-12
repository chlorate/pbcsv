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
	public fileInput: HTMLInputElement | null = null;

	get injected(): Injected {
		return this.props as Injected;
	}

	constructor() {
		super();
		this.state = {
			mode: Mode.Url,
			url: "",
		};
	}

	public render(): JSX.Element {
		const mode = this.state.mode;
		const model = this.injected.model;

		const onSubmit = linkEvent(this, handleSubmit);
		const onClickModeUrl = () => handleClickMode(this, Mode.Url);
		const onClickModeFile = () => handleClickMode(this, Mode.File);
		const onChangeFile = linkEvent(this, handleChangeFile);
		const onClickBrowse = () => handleClickBrowse(this);
		const onInputUrl = linkEvent(this, handleInputUrl);

		let warnings: JSX.Element | undefined;
		if (model.warnings.length) {
			warnings = alertList("warning", model.warnings);
		}

		let errors: JSX.Element | undefined;
		if (model.errors.length) {
			errors = alertList("danger", model.errors);
		}

		const nav = (
			<Nav tabs className="card-header-tabs">
				<NavItem>
					<NavLink
						tag="button"
						className="btn-nav-link"
						active={mode === Mode.Url}
						onClick={onClickModeUrl}
					>
						Fetch URL
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						tag="button"
						className="btn-nav-link"
						active={mode === Mode.File}
						onClick={onClickModeFile}
					>
						Upload file
					</NavLink>
				</NavItem>
			</Nav>
		);

		const body: JSX.Element[] = [
			<p>Upload a CSV file, get a listing of your personal bests.</p>,
		];
		switch (mode) {
			case Mode.Url:
				body.push(
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
				body.push(
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

		return (
			<Row tag="section">
				<Col xs="12" md="9" lg="7" xl="6">
					<Card className="mb-3">
						<CardHeader>{nav}</CardHeader>
						<CardBody>{body}</CardBody>
					</Card>
				</Col>
				<Col xs="12" md="9" lg="5" xl="6">
					{warnings}
					{errors}
				</Col>
			</Row>
		);
	}
}

const alertList = (color: string, messages: string[]) => (
	<Alert color={color} className="mb-3">
		<ul className="list-unstyled m-0">
			{messages.map((m) => <li>{m}</li>)}
		</ul>
	</Alert>
);

function handleClickMode(c: FileComponent, m: Mode): void {
	c.setState({mode: m});
}

function handleSubmit(c: FileComponent, e: Event): void {
	e.preventDefault();

	const promise = c.injected.model.parseUrl(c.state.url);
	handleParse(c, promise);
}

function handleInputUrl(
	c: FileComponent,
	e: ChangeEvent<HTMLInputElement>,
): void {
	c.setState({url: e.target.value});
}

function handleClickBrowse(c: FileComponent): void {
	if (c.fileInput) {
		c.fileInput.click();
	}
}

function handleChangeFile(c: FileComponent): void {
	const input = c.fileInput;
	if (!input || !input.files) {
		return;
	}

	const promise = c.injected.model.parseFile(input.files[0]);
	handleParse(c, promise);
}

function handleParse(c: FileComponent, p: Promise<void>) {
	p.then(() => {
		c.injected.history.push("/categories");
	}).catch(() => {
		// Nothing to handle.
		// Callback required to prevent console error.
	});
}
