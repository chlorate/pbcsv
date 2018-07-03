import {Badge} from "inferno-bootstrap";
import {Category} from "./category";

interface Props {
	category: Category;
	showVersion: boolean;
}

/**
 * A table row that displays information about a category and its latest run.
 */
export const CategoryTableRowComponent = (props: Props) => {
	const pb = props.category.runs[0];

	let versionCell;
	if (props.showVersion) {
		let platform;
		if (pb.platform) {
			platform = (
				<span title={`Platform: ${pb.platform}`}>{pb.platform}</span>
			);
		}

		let version;
		if (pb.version) {
			version = (
				<Badge title={`Version: ${pb.version}`}>{pb.version}</Badge>
			);
		}

		let emulator;
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

	return (
		<tr>
			<td>{props.category.name}</td>
			{versionCell}
		</tr>
	);
};
