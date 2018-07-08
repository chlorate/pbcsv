/**
 * Value represents some arbitrary string value associated to a run.
 */
export class Value {
	private _name: string;
	private _string: string;

	get name(): string {
		return this._name;
	}

	get string(): string {
		return this._string;
	}

	get number(): number | undefined {
		return undefined;
	}

	constructor(name?: string, s?: string) {
		this._name = name || "";
		this._string = s || "";
	}
}
