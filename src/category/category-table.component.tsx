import {Component} from "inferno";
import {Card} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Model} from "../model/model";
import {Store} from "../store";
import {Category} from "./category";
import {CategoryTableRowComponent} from "./category-table-row.component";

interface Props {
	categories: Category[];
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * A table that displays information about categories and their latest runs.
 * Categories not having any runs are not included.
 */
@inject(Store.Model)
export class CategoryTableComponent extends Component<Props, {}> {
	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element | null {
		const categories = this.props.categories.filter((c) => c.runs.length);
		if (!categories.length) {
			return null;
		}

		const header: JSX.Element[] = [<th className="w-100">Category</th>];

		this.injected.model.valueNames.forEach((name) => {
			header.push(<th className="text-nowrap text-right">{name}</th>);
		});

		let showVersion = false;
		const hasPlatforms = categories.some((c) => c.hasPlatforms);
		const hasVersions = categories.some((c) => c.hasVersions);
		const hasEmulators = categories.some((c) => c.hasEmulators);
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

		let showDate = false;
		if (categories.some((c) => c.hasDates)) {
			header.push(<th>Date</th>);
			showDate = true;
		}

		const rows = categories.map((c) => (
			<CategoryTableRowComponent
				category={c}
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
