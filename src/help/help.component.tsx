import {version, versionDate} from "../version";

/**
 * Contents of the Help tab.
 */
export const HelpComponent = () => (
	<section className="row justify-content-center">
		<div className="col-md-9 col-lg-7 col-xl-6">
			<div className="card">
				<h2 className="card-header h3 mb-0">pbcsv</h2>
				<div className="card-body">
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
				</div>
			</div>
		</div>
	</section>
);
