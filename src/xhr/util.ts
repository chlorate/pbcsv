const statusOk = 200;

/**
 * Sends a GET request and returns a promise that is resolved with the response
 * body or rejected with an error message.
 */
export function request(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.addEventListener("load", () => {
			if (xhr.status !== statusOk) {
				reject(parseError(xhr));
				return;
			}
			resolve(xhr.responseText);
		});
		xhr.addEventListener("error", () => {
			reject(parseError(xhr));
		});
		xhr.open("GET", url);
		xhr.send();
	});
}

function parseError(xhr: XMLHttpRequest): string {
	if (xhr.status) {
		return xhr.statusText || `${xhr.status} status`;
	}
	return "network error";
}
