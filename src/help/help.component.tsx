import {Card, CardBody, CardHeader, Col, Row} from "inferno-bootstrap";
import {version, versionDate} from "../version";

/**
 * Contents of the Help tab.
 */
export const HelpComponent = () => (
	<Row tag="section" className="justify-content-end">
		<Col md="9" lg="7" xl="6">
			<Card>
				<CardHeader tag="h2" className="h3 mb-0">
					pbcsv
				</CardHeader>
				<CardBody>
					<p className="lead text-muted">
						v{version} ({versionDate})
					</p>
					<ul className="list-unstyled m-0">
						<li>
							<a href="https://github.com/chlorate/pbcsv">
								GitHub
							</a>
						</li>
					</ul>
				</CardBody>
			</Card>
		</Col>
	</Row>
);
