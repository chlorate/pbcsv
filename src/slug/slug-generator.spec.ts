import {SlugGenerator} from "./slug-generator";

describe("SlugGenerator", () => {
	let generator;

	beforeEach(() => {
		generator = new SlugGenerator();
	});

	describe("slugify", () => {
		it("lowercases and hyphenates names", () => {
			expect(generator.slugify("Some Name 1.2")).toBe("some-name-1-2");
		});

		it("collapses multiple hyphens", () => {
			expect(generator.slugify("a!!!b!!!c")).toBe("a-b-c");
		});

		it("trims hyphens", () => {
			expect(generator.slugify("   name   ")).toBe("name");
			expect(generator.slugify("!!!name2!!!")).toBe("name2");
		});

		it("returns 'unnamed' if trimmed slug is empty", () => {
			expect(generator.slugify("---")).toBe("unnamed");
		});

		it("strips apostrophes", () => {
			expect(generator.slugify("it's it's")).toBe("its-its");
		});

		it("strips diacritics", () => {
			expect(generator.slugify("Pokémon")).toBe("pokemon");
		});

		it("returns unique slugs for duplicate names", () => {
			expect(generator.slugify("name")).toBe("name");
			expect(generator.slugify("name")).toBe("name.2");
			expect(generator.slugify("name")).toBe("name.3");
			expect(generator.slugify("---")).toBe("unnamed");
			expect(generator.slugify("-----")).toBe("unnamed.2");
		});
	});
});
