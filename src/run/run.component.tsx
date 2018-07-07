import {Card, CardBody, CardHeader, Col, Row} from "inferno-bootstrap";
import {MarkdownComponent} from "../markdown/markdown.component";
import {Run} from "./run";

interface Props {
	number: number;
	run: Run;
}

/**
 * A card that displays information about a run.
 */
export const RunComponent = (props: Props) => {
	const run = props.run;

	let date: JSX.Element | undefined;
	if (run.date) {
		date = (
			<span className="float-right text-muted text-nowrap">
				{run.date.string}
			</span>
		);
	}

	const fields: JSX.Element[] = [];
	addField(fields, "Personal best:", `#${props.number}`);
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
			<hr className="d-block d-md-none" />,
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
				<span>{"1:23:45"}</span>
				{date}
			</CardHeader>
			<CardBody>{body}</CardBody>
		</Card>
	);
};

function addField(
	children: JSX.Element[],
	dt: string,
	dd: JSX.Element | string,
) {
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
