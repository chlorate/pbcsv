import {Component} from "inferno";
import {Alert, Badge, ListGroup} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link} from "inferno-router";
import {formatNumber} from "../math";
import {Model} from "../model";
import {Store} from "../store";

const itemClassName = [
	"list-group-item",
	"list-group-item-card-padding",
	"list-group-item-action",
	"d-flex",
	"justify-content-between",
	"align-items-center",
].join(" ");

interface InjectedProps {
	model: Model;
}

/**
 * Contents of the Years tab. Displays a list of years having runs.
 */
@inject(Store.Model)
export class YearsComponent extends Component {
	private get injected(): InjectedProps {
		return this.props as InjectedProps;
	}

	public render(): JSX.Element {
		const years = this.injected.model.years;
		if (!years.length) {
			return <Alert color="primary">No runs.</Alert>;
		}

		const items: JSX.Element[] = years.map((y) => {
			const count = y.runs.length;
			const title = `${formatNumber(count)} run${count === 1 ? "" : "s"}`;

			return (
				<Link className={itemClassName} to={`/years/${y.slug}`}>
					{y.name}
					<Badge pill title={title}>
						{formatNumber(count)}
					</Badge>
				</Link>
			);
		});

		return <ListGroup tag="div">{items}</ListGroup>;
	}
}
