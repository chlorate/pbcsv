import {Component} from "inferno";
import {Badge} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link} from "inferno-router";
import {ApproxDateComponent} from "../date/approx-date.component";
import {Model} from "../model/model";
import {Store} from "../store";
import {Category} from "./category";

interface Props {
	category: Category;
	showVersion: boolean;
	showDate: boolean;
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * A table row that displays information about a category and its latest run.
 */
@inject(Store.Model)
export class CategoryTableRowComponent extends Component<Props, {}> {
	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element {
		const category = this.props.category;
		const pb = category.runs[0];

		const cells: JSX.Element[] = [
			<td>
				<Link
					className="td-link"
					to={`/categories/${category.fullSlug}`}
				>
					{category.name}
				</Link>
			</td>,
		];

		this.injected.model.valueNames.forEach((name) => {
			const v = pb.values[name];
			cells.push(
				<td className="text-nowrap text-right">{v ? v.string : ""}</td>,
			);
		});

		if (this.props.showVersion) {
			let platform: JSX.Element | undefined;
			if (pb.platform) {
				platform = (
					<span title={`Platform: ${pb.platform}`}>
						{pb.platform}
					</span>
				);
			}

			let version: JSX.Element | undefined;
			if (pb.version) {
				version = (
					<Badge title={`Version: ${pb.version}`}>{pb.version}</Badge>
				);
			}

			let emulator: JSX.Element | undefined;
			if (pb.emulator) {
				emulator = (
					<Badge color="warning" title={`Emulator: ${pb.emulator}`}>
						{pb.emulator}
					</Badge>
				);
			}

			cells.push(
				<td className="text-nowrap">
					{platform} {version} {emulator}
				</td>,
			);
		}

		if (this.props.showDate) {
			cells.push(
				<td>
					<ApproxDateComponent date={pb.date} />
				</td>,
			);
		}

		return <tr>{cells}</tr>;
	}
}
