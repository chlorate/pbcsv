import {Card, CardBody, CardHeader, Col, Row} from "inferno-bootstrap";
import {ApproxDateComponent} from "../date/approx-date.component";
import {MarkdownComponent} from "../markdown/markdown.component";
import {formatNumber} from "../math/util";
import {Run} from "./run";

interface Props {
	number: number;
	run: Run;
}

/**
 * A card that displays information about a run.
 */
export function RunComponent(props: Props): JSX.Element {
	const run = props.run;

	const fields: JSX.Element[] = [];
	addField(fields, "Personal best:", `#${formatNumber(props.number)}`);
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

	const body: Array<JSX.Element | string> = [
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
	} else {
		body.push(
			<span className="text-muted d-none d-md-inline">No comment.</span>,
		);
	}

	return (
		<Card className="mb-3">
			<CardHeader tag="h3" className="h4 m-0">
				{"1:23:45"}
				<ApproxDateComponent className="float-right" date={run.date} />
			</CardHeader>
			<CardBody>{body}</CardBody>
		</Card>
	);
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
