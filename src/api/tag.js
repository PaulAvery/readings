import cache from '../data';

export function *get(name) {
	let cached = cache();
	let tag = cached.tags[name];

	if(tag) {
		let tagObject = JSON.parse(JSON.stringify(tag));

		if(this.query.hasOwnProperty('populate')) {
			tagObject.articles = tagObject.articles.map(article => cached.articles[article]);
		}

		this.body = tagObject;
	}
}

export function *list() {
	let cached = cache();

	if(this.query.hasOwnProperty('populate')) {
		this.body = cached.tags;
	} else {
		this.body = Object.keys(cached.tags);
	}
}
