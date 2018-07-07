import {Card} from "inferno-bootstrap";
import {Category} from "./category";
import {CategoryTableRowComponent} from "./category-table-row.component";

interface Props {
	categories: Category[];
}

/**
 * A table that displays information about categories and their latest runs.
 * Categories not having any runs are not included.
 */
export const CategoryTableComponent = (props: Props) => {
	const categories = props.categories.filter((c) => c.runs.length);
	if (!categories.length) {
		return null;
	}

	const hasPlatform = categories.some((c) =>
		c.runs.some((r) => r.platform !== ""),
	);
	const hasVersion = categories.some((c) =>
		c.runs.some((r) => r.version !== ""),
	);
	const hasEmulator = categories.some((c) =>
		c.runs.some((r) => r.emulator !== ""),
	);

	let versionHeader;
	if (hasPlatform || hasVersion || hasEmulator) {
		// These fields are combined into a single column to keep it compact.
		// A full header is too long and abbreviating is ugly, so just pick the
		// most fitting term and show everything as a tooltip.
		let text = "Emulator";
		if (hasPlatform) {
			text = "Platform";
		}
		if (hasVersion) {
			text = "Version";
		}

		const titleParts: string[] = [];
		if (hasPlatform) {
			titleParts.push("Platform");
		}
		if (hasVersion) {
			titleParts.push("Version");
		}
		if (hasEmulator) {
			titleParts.push("Emulator");
		}

		let title;
		if (titleParts.length > 1) {
			title = titleParts.join("/");
		}

		versionHeader = (
			<th className="border-top-0" title={title}>
				{text}
			</th>
		);
	}

	let dateHeader: JSX.Element | undefined;
	if (categories.some((c) => c.hasDates)) {
		dateHeader = <th className="border-top-0">Date</th>;
	}

	const rows = categories.map((c) => (
		<CategoryTableRowComponent
			category={c}
			showVersion={versionHeader}
			showDate={dateHeader !== undefined}
		/>
	));

	return (
		<Card>
			<table class="table table-bordered table-hover table-responsive card-table">
				<thead>
					<tr>
						<th className="border-top-0 w-100">Category</th>
						{versionHeader}
						{dateHeader}
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		</Card>
	);
};
