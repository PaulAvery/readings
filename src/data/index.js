import fs from 'fs';
import path from 'path';

import Tag from './Tag';
import Article from './Article';
import Category from './Category';

let time = 0;
let tags = {};
let articles = {};
let categories = {};

let tagDir = 'tags';
let articleDir = 'articles';

function loadCategory(dir, parent) {
	fs.readdirSync(dir).forEach((f) => {
		let file = path.join(dir, f);
		let stat = fs.lstatSync(file);

		if(stat.isDirectory()) {
			let category = new Category(file, parent);
			categories[path.relative(articleDir, file)] = category;

			if(parent) parent.categories.add(category);
			loadCategory(file, category);
		} else if (stat.isFile() && ['.md', '.html'].indexOf(path.extname(file)) !== -1) {
			let article = new Article(file, parent);
			articles[path.relative(articleDir, file)] = article;

			if(parent) parent.articles.add(article);
		}
	});
}

function loadTags() {
	tags = fs.readdirSync(tagDir).reduce((sum, f) => {
		let file = path.join(tagDir, f);

		/* Fetch all articles with given tag */
		let children = fs.readdirSync(file).filter((a) => {
			let aFile = path.join(file, a);
			return fs.lstatSync(aFile).isSymbolicLink();
		}).map((a) => {
			let aFile = path.join(file, a);
			let target = fs.readlinkSync(aFile);

			return articles[path.relative(articleDir, path.join(path.dirname(aFile), target))];
		});

		/* Create tag */
		let tag = new Tag(file, children);
		sum[path.relative(tagDir, file)] = tag;

		/* Add tag to all children */
		children.forEach((article) => {
			article.tags.add(tag);
		});

		return sum;
	}, {});
}

function reloadCache() {
	tags = {};
	articles = {};
	categories = {};

	/* Create folders if they do not exist */
	try {
		fs.mkdirSync('tags');
		fs.mkdirSync('articles');
		fs.mkdirSync('articles/imported');
	} catch(e) {
		if(e.code !== 'EEXIST') throw e;
	}

	/* Load tags last, so articles are already available */
	loadCategory(articleDir);
	loadTags();
}

export default function cache() {
	let ntime = fs.lstatSync('.git/objects').mtime.getTime();

	/* Invlidate cache if needed */
	if(ntime !== time) {
		time = ntime;
		reloadCache();
	}

	return {
		tags,
		articles,
		categories
	};
}
