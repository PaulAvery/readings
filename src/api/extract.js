import isUrl from 'is-url';
import inline from 'inline-css';
import cheerio from 'cheerio';
import sanitize from 'sanitize-html';
import superagent from 'superagent';

export default function *(url) {
	if(!url || !isUrl(url)) {
		this.status = 400;
		return;
	}

	/* Get the original html */
	let html = yield new Promise((res, rej) => {
		superagent.get(url).end((e, r) => e ? rej(e) : res(r.text));
	});

	/* Clean up some things resulting in errors */
	let $raw = cheerio.load(html);
	$raw('style:empty').remove();
	let cleaned = $raw.html();

	/* Inline all css and then sanitize */
	let sanitized = sanitize(yield inline(cleaned, {
		url: url
	}));

	/**
	 * Try to extract a couple of best guesses.
	 * Algorithm taken from http://rodp.me/2015/how-to-extract-data-from-the-web.html
	 */
	let $ = cheerio.load(sanitized);
	let parents = $('body *:not(:empty), body');
	let counts = parents.map((i, e) => {
		if(e.type !== 'tag') return null;

		let tagCounts = e.children.reduce((sum, el) => {
			sum[el.tagName] = sum[el.tagName] ? sum[el.tagName] + 1 : 1;

			return sum;
		}, {});

		let count = Object.keys(tagCounts).reduce((max, key) => {
			return max > tagCounts[key] ? max : tagCounts[key];
		}, 0);

		return {
			el: e,
			count: count
		};
	}).get().sort((a, b) => {
		return b.count - a.count;
	});

	this.body = counts.slice(0, 6).map(c => $(c.el).html());
}
