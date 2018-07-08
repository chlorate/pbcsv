import marked from "marked";
import sanitizeHtml from "sanitize-html";

const markedOptions = {
	headerIds: false,
	smartypants: true,
};

const sanitizeOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat([
		"del",
		"h1",
		"h2",
		"img",
	]),
	allowedAttributes: Object.assign(
		{
			ol: ["start"],
			td: ["align"],
		},
		sanitizeHtml.defaults.allowedAttributes,
	),
};

interface Props {
	markdown: string;
}

/**
 * Renders a Markdown string.
 */
export function MarkdownComponent(props: Props): JSX.Element {
	let html = marked(props.markdown, markedOptions);
	html = sanitizeHtml(html, sanitizeOptions);

	return <div class="markdown" dangerouslySetInnerHTML={{__html: html}} />;
}
