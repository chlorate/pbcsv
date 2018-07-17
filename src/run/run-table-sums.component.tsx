import {Component} from "inferno";
import {inject} from "inferno-mobx";
import {Run} from ".";
import {formatNumber, formatTime} from "../math";
import {Model} from "../model";
import {Store} from "../store";
import {NumberValue, TimeValue, Value, ValueComponent} from "../value";

interface Props {
	runs: Run[];
	showValues: {[name: string]: boolean};
	showVersion: boolean;
	showDate: boolean;
}

interface InjectedProps extends Props {
	model: Model;
}

/**
 * The footer of a run table that shows sums of values.
 */
@inject(Store.Model)
export class RunTableSumsComponent extends Component<Props, {}> {
	private get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	private get rows(): JSX.Element[] {
		const runs = this.props.runs;
		const valueNames = this.injected.model.valueNames.filter(
			(name) => this.props.showValues[name],
		);

		// Add up time and numeric values for each uniquely named sum amongst
		// all runs.
		const sumNames: string[] = [];
		const sums: {[sumName: string]: {[valueName: string]: number}} = {};
		runs.forEach((r) => {
			r.sums.forEach((sumName) => {
				let sum = sums[sumName];
				if (!sum) {
					sum = sums[sumName] = {};
					sumNames.push(sumName);
				}

				valueNames.forEach((valueName) => {
					const v = r.values[valueName];
					if (!v || !v.number) {
						return;
					}

					if (!sum[valueName]) {
						sum[valueName] = 0;
					}
					sum[valueName] += v.number;
				});
			});
		});
		if (!sumNames.length) {
			return [];
		}

		// Sum formatting:
		// 1. Determine which values are times to also format their sums as
		//    times.
		// 2. Get the max precision for each value, so that their sums use the
		//    same precision.
		const valueTimes: {[name: string]: boolean} = {};
		const valuePrecisions: {[name: string]: number} = {};
		valueNames.forEach((name) => {
			valueTimes[name] = runs.some(
				(r) => r.values[name] instanceof TimeValue,
			);
			valuePrecisions[name] = runs.reduce((precision, r) => {
				const v = r.values[name];
				if (v && v.precision && v.precision > precision) {
					return v.precision;
				}
				return precision;
			}, 0);
		});

		return sumNames.map((sumName) => {
			const sum = sums[sumName];

			const cells: JSX.Element[] = [
				<th className="text-right">{sumName}</th>,
			];
			valueNames.forEach((valueName) => {
				const sumOfValue = sum[valueName];
				const precision = valuePrecisions[valueName];

				let cellValue: Value | undefined;
				if (valueTimes[valueName]) {
					cellValue = new TimeValue(
						formatTime(sumOfValue, precision),
						sumOfValue,
						precision,
					);
				} else {
					cellValue = new NumberValue(
						formatNumber(sumOfValue, precision),
						sumOfValue,
						precision,
					);
				}

				cells.push(
					<td>
						<ValueComponent name={valueName} value={cellValue} />
					</td>,
				);
			});
			if (this.props.showVersion) {
				cells.push(<td />);
			}
			if (this.props.showDate) {
				cells.push(<td />);
			}

			return <tr>{cells}</tr>;
		});
	}

	public render(): JSX.Element | null {
		const rows = this.rows;
		if (!rows.length) {
			return null;
		}

		return <tfoot>{rows}</tfoot>;
	}
}
