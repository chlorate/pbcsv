import {Component, InfernoNode} from "inferno";
import {DatePrecision, DateString} from "pbcsv/date";
import {formatNumber} from "pbcsv/math";

const veryRecentThreshold = 30;
const recentThreshold = 90;

interface Props {
	className?: string;
	dateString: DateString;
}

/**
 * Displays a date string. Colour indicates how recent it is. Title contains
 * extra information.
 */
export class FormattedDateString extends Component<Props> {
	public render(): InfernoNode {
		const {dateString} = this.props;
		if (!dateString.string) {
			return null;
		}

		const classNames = ["text-nowrap", this.colorClassName];
		if (this.props.className) {
			classNames.push(this.props.className);
		}

		return (
			<time
				className={classNames.join(" ")}
				title={this.title}
				dateTime={dateString.iso8601}
			>
				{dateString.string}
			</time>
		);
	}

	private get colorClassName(): string {
		const {dateString} = this.props;

		const ago = dateString.daysAgo;
		if (ago !== undefined) {
			if (ago <= veryRecentThreshold) {
				return "text-success";
			} else if (ago <= recentThreshold) {
				return "text-info";
			}
		}

		const date = dateString.date;
		if (date && date.getFullYear() >= new Date().getFullYear()) {
			return "text-body";
		}

		return "text-muted";
	}

	private get title(): string | undefined {
		const {dateString} = this.props;
		const lines: string[] = [];

		const long = dateString.longString;
		if (long) {
			lines.push(long);
		}

		const ago = dateString.daysAgo;
		if (ago) {
			const approximate = dateString.precision !== DatePrecision.Day;

			let line = formatNumber(ago);
			if (approximate) {
				line += "+";
			}
			line += ` day${ago !== 1 || approximate ? "s" : ""} ago`;

			lines.push(line);
		}

		return lines.join("\n");
	}
}
