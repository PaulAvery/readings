import cache from '../data';

export function *get(path) {
	let cached = cache();
	let category = cached.categories[path];

	if(category) {
		let categoryObject = JSON.parse(JSON.stringify(category));

		if(this.query.hasOwnProperty('populate')) {
			categoryObject.parent = cached.categories[categoryObject.parent] || null;
			categoryObject.articles = categoryObject.articles.map(article => cached.articles[article]);
			categoryObject.categories = categoryObject.categories.map(cat => cached.categories[cat]);
		}

		this.body = categoryObject;
	}
}

export function *list() {
	let cached = cache();

	if(this.query.hasOwnProperty('populate')) {
		this.body = cached.categories;
	} else {
		this.body = Object.keys(cached.categories);
	}
}
