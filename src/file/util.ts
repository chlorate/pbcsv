/**
 * Reads a file. Returns a promise that is resolved with the file contents or
 * rejected with an error message.
 */
export function readFile(f: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			resolve(reader.result);
		});
		reader.addEventListener("error", () => {
			if (reader.error) {
				reject(reader.error.toString());
				return;
			}
			reject("unknown file error");
		});
		reader.readAsText(f);
	});
}
