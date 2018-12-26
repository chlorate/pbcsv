import {Component} from "inferno";
import {Badge} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link} from "inferno-router";
import {Run} from ".";
import {FormattedDateString} from "../date";
import {Model} from "../model";
import {Store} from "../store";
import {ValueComponent} from "../value";

interface Props {
	run: Run;
	fullCategoryName?: boolean;
	showValues: {[name: string]: boolean};
	showVersion: boolean;
	showDate: boolean;
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * A table row that displays information about a run.
 */
@inject(Store.Model)
export class RunTableRowComponent extends Component<Props, {}> {
	get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	private get valueCells(): JSX.Element[] {
		const run = this.props.run;

		const valueNames = this.injected.model.valueNames.filter(
			(name) => this.props.showValues[name],
		);

		// Link the cell that is either:
		// 1. The run's main value if it's not empty
		// 2. The first non-empty value
		let linkedName = valueNames.find(
			(name) => run.values[name] !== undefined,
		);
		if (run.main && run.values[run.main]) {
			linkedName = run.main;
		}

		return valueNames.map((name) => {
			let content = (
				<ValueComponent name={name} value={run.values[name]} />
			);
			if (run.link && name === linkedName) {
				content = (
					<a className="td-link" href={run.link} target="_blank">
						{content}
					</a>
				);
			}

			return <td className="text-right">{content}</td>;
		});
	}

	public render(): JSX.Element {
		const run = this.props.run;

		const categoryName = this.props.fullCategoryName
			? run.category.fullName
			: run.category.name;

		const cells: JSX.Element[] = [
			<td>
				<Link
					className="td-link"
					to={`/categories/${run.category.fullSlug}`}
				>
					{categoryName}
				</Link>
			</td>,
		];
		cells.push(...this.valueCells);

		if (this.props.showVersion) {
			let platform: JSX.Element | undefined;
			if (run.platform) {
				platform = (
					<span title={`Platform: ${run.platform}`}>
						{run.platform}
					</span>
				);
			}

			let version: JSX.Element | undefined;
			if (run.version) {
				version = (
					<Badge title={`Version: ${run.version}`}>
						{run.version}
					</Badge>
				);
			}

			let emulator: JSX.Element | undefined;
			if (run.emulator) {
				emulator = (
					<Badge color="warning" title={`Emulator: ${run.emulator}`}>
						{run.emulator}
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
					<FormattedDateString dateString={run.date} />
				</td>,
			);
		}

		return <tr>{cells}</tr>;
	}
}
