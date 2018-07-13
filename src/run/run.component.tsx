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

	public render(): JSX.Element {
		const run = this.props.run;

		const header: JSX.Element[] = [];
		this.injected.model.valueNames.forEach((name, i) => {
			const v = run.values[name];
			if (v) {
				header.push(
					<ValueComponent
						badge={i > 0}
						className="mr-2"
						name={name}
						value={v}
					/>,
				);
			}
		});
		header.push(
			<ApproxDateComponent className="float-right" date={run.date} />,
		);

		const fields: JSX.Element[] = [];
		addField(
			fields,
			"Personal best:",
			`#${formatNumber(this.props.number)}`,
		);
		if (run.platform) {
			addField(fields, "Platform:", run.platform);
		}
		if (run.version) {
			addField(fields, "Version:", run.version);
		}
		if (run.emulator) {
			addField(
				fields,
				"Emulator:",
				<span class="text-warning">{run.emulator}</span>,
			);
		}

		const body: JSX.Element[] = [
			<Row
				tag="dl"
				className="run-fields row no-gutters float-md-right mb-0 pl-md-3 small"
			>
				{fields}
			</Row>,
		];
		if (run.comment) {
			body.push(
				<hr className="d-md-none" />,
				<MarkdownComponent markdown={run.comment} />,
			);
		}

		return (
			<Card className="mb-3">
				<CardHeader tag="h3" className="h4 m-0">
					{header}
				</CardHeader>
				<CardBody>{body}</CardBody>
			</Card>
		);
	}
}

function addField(
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
