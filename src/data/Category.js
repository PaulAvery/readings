import path from 'path';

export default class Category {
	constructor(src, parent) {
		this.src = src;
		this.name = path.basename(src);
		this.parent = parent;
		this.links = new Set();
		this.articles = new Set();
		this.categories = new Set();
	}

	toJSON() {
		let articles = [];
		let categories = [];
		this.articles.forEach((article) => articles.push(article.src.split(path.sep).slice(1).join('/')));
		this.categories.forEach((category) => categories.push(category.src.split(path.sep).slice(1).join('/')));

		return {
			src: this.src,
			name: this.name,
			parent: this.parent ? this.parent.src.split(path.sep).slice(1).join('/') : null,
			articles: articles,
			categories: categories
		};
	}
}
