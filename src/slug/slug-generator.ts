/**
 * Generates clean, unambiguous URL slugs.
 */
export class SlugGenerator {
	private used: {[slug: string]: boolean} = {};

	/**
	 * Returns a URL slug for the given name.
	 */
	public slugify(name: string): string {
		// Diacritic removal: https://stackoverflow.com/a/37511463/6689246
		let slug = name
			.normalize("NFD")
			.toLowerCase()
			.replace(/['\u0300-\u036f]/g, "")
			.replace(/[^a-z\d]/g, "-")
			.replace(/--+/g, "-")
			.replace(/^-+|-+$/g, "");

		if (!slug) {
			slug = "unnamed";
		}

		if (this.used[slug]) {
			let count = 2;
			while (this.used[`${slug}.${count}`]) {
				count++;
			}
			slug = `${slug}.${count}`;
		}

		this.used[slug] = true;
		return slug;
	}
}
