import {Component} from "inferno";
import {Alert, Badge, ListGroup} from "inferno-bootstrap";
import {inject} from "inferno-mobx";
import {Link} from "inferno-router";
import {formatNumber} from "../math";
import {Model} from "../model";
import {Store} from "../store";
import {listGroupItemClassName} from "../ui";

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
			const count = formatNumber(y.runs.length);
			const title = `${count} run${count === "1" ? "" : "s"}`;

			return (
				<Link
					className={listGroupItemClassName}
					to={`/years/${y.slug}`}
				>
					{y.name}
					<Badge pill title={title}>
						{count}
					</Badge>
				</Link>
			);
		});

		return <ListGroup tag="div">{items}</ListGroup>;
	}
}
