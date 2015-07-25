import cache from '../data';

export function *get(path) {
	let cached = cache();
	let article = cached.articles[path];

	if(article) {
		let articleObject = JSON.parse(JSON.stringify(article));

		if(this.query.hasOwnProperty('populate')) {
			articleObject.tags = articleObject.tags.map(tag => cached.tags[tag]);
			articleObject.category = cached.categories[articleObject.category];
		}

		this.body = articleObject;
	}
}

export function *list() {
	let cached = cache();

	if(this.query.hasOwnProperty('populate')) {
		this.body = cached.articles;
	} else {
		this.body = Object.keys(cached.articles);
	}
}
