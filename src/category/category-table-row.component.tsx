import {Badge} from "inferno-bootstrap";
import {Link} from "inferno-router";
import {ApproxDateComponent} from "../date/approx-date.component";
import {Category} from "./category";

interface Props {
	category: Category;
	showVersion: boolean;
	showDate: boolean;
}

/**
 * A table row that displays information about a category and its latest run.
 */
export function CategoryTableRowComponent(props: Props): JSX.Element {
	const category = props.category;
	const pb = category.runs[0];

	let versionCell: JSX.Element | undefined;
	if (props.showVersion) {
		let platform: JSX.Element | undefined;
		if (pb.platform) {
			platform = (
				<span title={`Platform: ${pb.platform}`}>{pb.platform}</span>
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

		versionCell = (
			<td className="text-nowrap">
				{platform} {version} {emulator}
			</td>
		);
	}

	let dateCell: JSX.Element | undefined;
	if (props.showDate) {
		dateCell = (
			<td>
				<ApproxDateComponent date={pb.date} />
			</td>
		);
	}

	return (
		<tr>
			<td>
				<Link
					className="td-link"
					to={`/categories/${category.fullSlug}`}
				>
					{category.name}
				</Link>
			</td>
			{versionCell}
			{dateCell}
		</tr>
	);
}
