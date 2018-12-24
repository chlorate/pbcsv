import {computed, observable} from "mobx";
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
	@observable public name: string;
	@observable public slug: string;
	@observable public parent?: Category;
	@observable public children: Category[];
	@observable public runs: Run[];

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

	@computed get fullName(): string {
		return (this.parent ? `${this.parent.fullName} - ` : "") + this.name;
	}

	@computed get fullSlug(): string {
		return (this.parent ? `${this.parent.fullSlug}/` : "") + this.slug;
	}

	@computed get totalDescendantsWithRuns(): number {
		return this.children.reduce(
			(total, category) =>
				total +
				category.totalDescendantsWithRuns +
				(category.runs.length ? 1 : 0),
			0,
		);
	}
}
