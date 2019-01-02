import {Component, InfernoNode} from "inferno";
import {DatePrecision, DateString} from "pbcsv/date";
import {createMessages} from "pbcsv/i18n";

const veryRecentThreshold = 30;
const recentThreshold = 90;

const messages = createMessages({
	dateDay: "{date, date, long}",
	dateMonth: "{date, date, month}",
	dateYear: "{date, date, year}",
	daysAgoApproximate: "{daysAgo, number}+ days ago",
	daysAgoExact: "{daysAgo, plural, one {# day} other {# days}} ago",
});

const precisionToMessage = {
	[DatePrecision.Year]: messages.dateYear,
	[DatePrecision.Month]: messages.dateMonth,
	[DatePrecision.Day]: messages.dateDay,
};

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
		const {date, precision, approximate, daysAgo} = this.props.dateString;
		const lines: string[] = [];

		let message;
		if (precision) {
			message = precisionToMessage[precision];
		}
		if (message) {
			lines.push(message({date}));
		}

		if (daysAgo) {
			message = approximate
				? messages.daysAgoApproximate
				: messages.daysAgoExact;
			lines.push(message({daysAgo}));
		}

		return lines.join("\n");
	}
}
