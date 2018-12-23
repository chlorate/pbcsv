import {Run} from "pbcsv/run";

interface IProps {
	name?: string;
	slug?: string;
	parent?: Category;
	children?: Category[];
	runs?: Run[];
}

/**
 * A category contains subcategories and runs.
 */
export class Category {
	public name: string;
	public slug: string;
	public parent?: Category;
	public children: Category[];
	public runs: Run[];

	constructor({
		name = "",
		slug = "",
		parent,
		children = [],
		runs = [],
	}: IProps = {}) {
		this.name = name;
		this.slug = slug;
		this.parent = parent;
		this.children = children;
		this.runs = runs;
	}

	get fullName(): string {
		return (this.parent ? `${this.parent.fullName} - ` : "") + this.name;
	}

	get fullSlug(): string {
		return (this.parent ? `${this.parent.fullSlug}/` : "") + this.slug;
	}

	get totalDescendantsWithRuns(): number {
		return this.children.reduce(
			(total, category) =>
				total +
				category.totalDescendantsWithRuns +
				(category.runs.length ? 1 : 0),
			0,
		);
	}
}
