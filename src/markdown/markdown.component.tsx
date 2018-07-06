import marked from "marked";
import sanitizeHtml from "sanitize-html";

interface Props {
	markdown: string;
}

/**
 * Renders a Markdown string.
 */
export const MarkdownComponent = (props: Props) => {
	let html = marked(props.markdown, {
		headerIds: false,
		smartypants: true,
	});
	html = sanitizeHtml(html, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			"h1",
			"h2",
			"img",
			"del",
		]),
		allowedAttributes: Object.assign(
			{
				ol: ["start"],
				td: ["align"],
			},
			sanitizeHtml.defaults.allowedAttributes,
		),
	});

	return <div class="markdown" dangerouslySetInnerHTML={{__html: html}} />;
};
