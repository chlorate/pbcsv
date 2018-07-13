import {Badge} from "inferno-bootstrap";
import {NumberValue, TimeValue, Value} from ".";

interface Props {
	badge?: boolean;
	className?: string;
	name?: string;
	value?: Value;
}

/**
 * Displays a value. Title contains extra information.
 */
export function ValueComponent(props: Props): JSX.Element | null {
	if (!props.value) {
		return null;
	}

	const lines: string[] = [];
	const formatted = props.value.formatted;
	if (props.name) {
		lines.push(props.name);
	}
	if (formatted) {
		lines.push(formatted);
	}
	const title = lines.join("\n") || undefined;

	const element = makeElement(
		props.value,
		props.badge ? props.name : undefined,
		props.badge ? undefined : `text-nowrap ${props.className || ""}`,
		props.badge ? undefined : title,
	);
	if (!props.badge) {
		return element;
	}

	return (
		<Badge className={props.className} title={title}>
			{element}
		</Badge>
	);
}

function makeElement(
	value: Value,
	name?: string,
	className?: string,
	title?: string,
): JSX.Element {
	let text = value.string;
	if (name) {
		if (/[A-Z]+(\s|$)/.test(name)) {
			// Looks like an acronym. Make it a suffix.
			text += ` ${name}`;
		} else {
			text = `${name}: ${text}`;
		}
	}

	if (value instanceof TimeValue) {
		return (
			<time
				className={className}
				title={title}
				dateTime={value.machineFormatted}
			>
				{text}
			</time>
		);
	}
	if (value instanceof NumberValue) {
		return (
			<data
				className={className}
				{...{value: value.machineFormatted}}
				title={title}
			>
				{text}
			</data>
		);
	}
	return (
		<span className={className} title={title}>
			{text}
		</span>
	);
}
