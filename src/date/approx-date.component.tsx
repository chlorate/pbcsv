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
export function ApproxDateComponent(props: Props): JSX.Element | null {
	const date = props.date;
	if (!date) {
		return null;
	}

	let title = date.fullString;

	let colorClass = "text-muted";
	if (date.date && date.date.getFullYear() >= new Date().getFullYear()) {
		colorClass = "text-body";
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
		<time
			className={`text-nowrap ${colorClass} ${props.className || ""}`}
			title={title}
			dateTime={date.iso8601}
		>
			{date.string}
		</time>
	);
}
