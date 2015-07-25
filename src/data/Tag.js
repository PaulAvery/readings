import path from 'path';
import ColorHash from 'color-hash';
let color = new ColorHash();

export default class Tag {
	constructor(src, articles) {
		this.src = src;
		this.name = path.basename(src);
		this.color = color.hex(this.name);
		this.articles = new Set(articles);
	}

	toJSON() {
		let articles = [];
		this.articles.forEach((article) => articles.push(article.src.split(path.sep).slice(1).join('/')));

		return {
			src: this.src,
			name: this.name,
			color: this.color,
			articles: articles
		};
	}
}
