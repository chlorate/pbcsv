import {Component} from "inferno";
import {Card, CardBody, CardHeader, Col, Row} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {ApproxDateComponent} from "../date";
import {MarkdownComponent} from "../markdown";
import {formatNumber} from "../math";
import {Model} from "../model";
import {Store} from "../store";
import {ValueComponent} from "../value";
import {Run} from "./run";

interface Props {
	number: number;
	run: Run;
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * A card that displays information about a run.
 */
@inject(Store.Model)
export class RunComponent extends Component<Props, {}> {
	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	private get header(): JSX.Element | JSX.Element[] {
		const run = this.props.run;

		// Value order is the same as the spreadsheet's header. If the run
		// specifies a main value, pull it to the front.
		const valueNames = this.injected.model.valueNames
			.filter((name) => run.values[name])
			.sort((x, y) => {
				if (x === run.main) {
					return -1;
				}
				if (y === run.main) {
					return 1;
				}
				return 0;
			});

		const header: JSX.Element[] = valueNames.map((name, i) => (
			<ValueComponent
				badge={i > 0}
				className="mr-2"
				name={name}
				value={run.values[name]}
			/>
		));
		header.push(
			<ApproxDateComponent className="float-right" date={run.date} />,
		);

		if (run.link) {
			return (
				<a
					className="panel-header-link"
					href={run.link}
					target="_blank"
				>
					{header}
				</a>
			);
		}

		return header;
	}

	private get body(): JSX.Element[] {
		const run = this.props.run;

		const body: JSX.Element[] = [
			<Row
				tag="dl"
				className="run-metadata row no-gutters float-md-right mb-0 pl-md-3 small"
			>
				{this.metadata}
			</Row>,
		];
		if (run.comment) {
			body.push(
				<hr className="d-md-none" />,
				<MarkdownComponent markdown={run.comment} />,
			);
		}
		return body;
	}

	private get metadata(): JSX.Element[] {
		const run = this.props.run;

		const metadata: JSX.Element[] = [];
		addMetadata(
			metadata,
			"Personal best:",
			`#${formatNumber(this.props.number)}`,
		);
		if (run.platform) {
			addMetadata(metadata, "Platform:", run.platform);
		}
		if (run.version) {
			addMetadata(metadata, "Version:", run.version);
		}
		if (run.emulator) {
			addMetadata(
				metadata,
				"Emulator:",
				<span class="text-warning">{run.emulator}</span>,
			);
		}
		return metadata;
	}

	public render(): JSX.Element {
		return (
			<Card className="mb-3">
				<CardHeader tag="h3" className="h4 m-0">
					{this.header}
				</CardHeader>
				<CardBody>{this.body}</CardBody>
			</Card>
		);
	}
}

function addMetadata(
	children: JSX.Element[],
	dt: string,
	dd: JSX.Element | string,
): void {
	if (children.length) {
		children.push(<div className="w-100" />);
	}

	children.push(
		<Col tag="dt" xs="auto" className="pr-1">
			{dt}
		</Col>,
		<Col tag="dd" className="mb-0 text-right">
			{dd}
		</Col>,
	);
}
