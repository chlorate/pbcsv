import {Component} from "inferno";
import {Card} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Run, RunTableRowComponent} from ".";
import {Model} from "../model";
import {Store} from "../store";

interface Props {
	runs: Run[];
	fullCategoryName?: boolean;
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * A table that displays information about runs.
 */
@inject(Store.Model)
export class RunTableComponent extends Component<Props, {}> {
	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element | null {
		const runs = this.props.runs;
		if (!runs.length) {
			return null;
		}

		const header: JSX.Element[] = [<th className="w-100">Category</th>];

		// Value columns: only show if not empty.
		const showValues: {[name: string]: boolean} = {};
		this.injected.model.valueNames
			.filter((name) => runs.some((r) => r.values[name] !== undefined))
			.forEach((name) => {
				header.push(<th className="text-nowrap text-right">{name}</th>);
				showValues[name] = true;
			});

		// Version column: only show if not empty.
		let showVersion = false;
		const hasPlatforms = runs.some((r) => r.platform !== "");
		const hasVersions = runs.some((r) => r.version !== "");
		const hasEmulators = runs.some((r) => r.emulator !== "");
		if (hasPlatforms || hasVersions || hasEmulators) {
			// These fields are combined into a single column to keep it
			// compact. A full header is too long and abbreviating is ugly, so
			// just pick the most fitting term and show everything as a tooltip.
			let text = "Emulator";
			if (hasPlatforms) {
				text = "Platform";
			}
			if (hasVersions) {
				text = "Version";
			}

			const titleParts: string[] = [];
			if (hasPlatforms) {
				titleParts.push("Platform");
			}
			if (hasVersions) {
				titleParts.push("Version");
			}
			if (hasEmulators) {
				titleParts.push("Emulator");
			}

			let title: string | undefined;
			if (titleParts.length > 1) {
				title = titleParts.join("/");
			}

			header.push(<th title={title}>{text}</th>);
			showVersion = true;
		}

		// Date column: only show if not empty.
		let showDate = false;
		if (runs.some((r) => r.date !== undefined)) {
			header.push(<th>Date</th>);
			showDate = true;
		}

		const rows = runs.map((r) => (
			<RunTableRowComponent
				run={r}
				fullCategoryName={this.props.fullCategoryName}
				showValues={showValues}
				showVersion={showVersion}
				showDate={showDate}
			/>
		));

		return (
			<Card>
				<table class="table table-bordered table-hover table-responsive card-table">
					<thead>
						<tr>{header}</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</Card>
		);
	}
}
