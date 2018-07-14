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
	showValues: {[name: string]: boolean};
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

	private get valueCells(): JSX.Element[] {
		const pb = this.props.category.runs[0];

		const valueNames = this.injected.model.valueNames.filter(
			(name) => this.props.showValues[name],
		);

		const linkedName = valueNames.find(
			(name) => pb.values[name] !== undefined,
		);

		return valueNames.map((name) => {
			let content = (
				<ValueComponent name={name} value={pb.values[name]} />
			);
			if (pb.link && linkedName === name) {
				content = (
					<a className="td-link" href={pb.link} target="_blank">
						{content}
					</a>
				);
			}

			return <td className="text-right">{content}</td>;
		});
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
		cells.push(...this.valueCells);

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
