import {Component} from "inferno";
import {Badge} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link} from "inferno-router";
import {Category} from ".";
import {ApproxDateComponent} from "../date";
import {Model} from "../model";
import {Store} from "../store";
import {ValueComponent} from "../value";

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
			cells.push(
				<td className="text-right">
					<ValueComponent name={name} value={pb.values[name]} />
				</td>,
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
