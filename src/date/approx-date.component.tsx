import {formatNumber} from "../math/util";
import {ApproxDate} from "./approx-date";
import {DatePrecision} from "./date-precision";

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
export const ApproxDateComponent = (props: Props): JSX.Element | null => {
	const date = props.date;
	if (!date) {
		return null;
	}

	let title = date.fullString;

	let colorClass = "";
	const now = new Date();
	if (date.date.getFullYear() < now.getFullYear()) {
		colorClass = "text-muted";
	}

	const ago = date.daysAgo;
	if (ago) {
		title += "\n";
		if (date.precision !== DatePrecision.Day) {
			title += "At least ";
		}
		title += `${formatNumber(ago)} day${ago === 1 ? "" : "s"} ago.`;

		if (ago <= veryRecentThreshold) {
			colorClass = "text-success";
		} else if (ago <= recentThreshold) {
			colorClass = "text-info";
		}
	}

	return (
		<span
			className={`text-nowrap ${colorClass} ${props.className || ""}`}
			title={title}
		>
			<time dateTime={date.iso8601}>{date.string}</time>
		</span>
	);
};
