/**
 * An object containing values keyed by name.
 */
export interface Values {
	[name: string]: Value;
}

/**
 * Value represents some arbitrary string value associated to a run.
 */
export class Value {
	private _string: string;

	get string(): string {
		return this._string;
	}

	get number(): number | undefined {
		return undefined;
	}

	constructor(s?: string) {
		this._string = s || "";
	}
}
