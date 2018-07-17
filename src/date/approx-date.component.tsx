import {Component} from "inferno";
import {ApproxDate, DatePrecision} from ".";
import {formatNumber} from "../math";

const veryRecentThreshold = 30;
const recentThreshold = 90;

interface Props {
	className?: string;
	date?: ApproxDate;
}

/**
 * Displays a date. Colour indicates how recent it is. Title contains extra
 * information.
 */
export class ApproxDateComponent extends Component<Props, {}> {
	private get colorClass(): string | undefined {
		const date = this.props.date;
		if (!date) {
			return undefined;
		}

		const ago = date.daysAgo;
		if (ago !== undefined) {
			if (ago <= veryRecentThreshold) {
				return "text-success";
			} else if (ago <= recentThreshold) {
				return "text-info";
			}
		}

		if (date.date && date.date.getFullYear() >= new Date().getFullYear()) {
			return "text-body";
		}

		return "text-muted";
	}

	private get title(): string | undefined {
		const date = this.props.date;
		if (!date) {
			return undefined;
		}

		const lines: string[] = [];

		const full = date.fullString;
		if (full) {
			lines.push(full);
		}

		const ago = date.daysAgo;
		if (ago) {
			const approx = date.precision !== DatePrecision.Day;
			lines.push(
				formatNumber(ago) +
					(approx ? "+" : "") +
					` day${ago !== 1 || approx ? "s" : ""} ago`,
			);
		}

		return lines.join("\n");
	}

	public render(): JSX.Element | null {
		const date = this.props.date;
		if (!date) {
			return null;
		}

		const classNames = ["text-nowrap", this.colorClass];
		if (this.props.className) {
			classNames.push(this.props.className);
		}

		return (
			<time
				className={classNames.join(" ")}
				title={this.title}
				dateTime={date.iso8601}
			>
				{date.string}
			</time>
		);
	}
}
