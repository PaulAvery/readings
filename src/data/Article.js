import fs from 'fs';
import path from 'path';
import marky from 'marky-markdown';
import {execSync as exec} from 'child_process';

/* Yes, shelling out is kind of a hack, but it works decently, so who cares? */
let gitAuthor = 'git log --diff-filter=A --follow --find-renames=40% --pretty=\'format:{"name": "%aN", "mail": "%aE"}\' ';

export default class Article {
	constructor(src, category) {
		this.src = src;
		this.tags = new Set();
		this.type = path.extname(src) === '.md' ? 'markdown' : 'html';
		this.title = path.basename(src, path.extname(src));
		this.author = JSON.parse(exec(gitAuthor + `"${src.replace('"', '\\"')}"`, {encoding: 'utf8'}));
		this.category = category;
		if(this.author.mail.substr(0, 4) === 'http') {
			this.author.url = this.author.mail;
			delete this.author.mail;
		}

		let content = fs.readFileSync(src, 'utf8');
		this.content = this.type === 'markdown' ? marky(content).html() : content;
	}

	toJSON() {
		let tags = [];
		this.tags.forEach((tag) => tags.push(tag.name));

		return {
			src: this.src,
			tags: tags,
			type: this.type,
			author: this.author,
			title: this.title,
			content: this.content,
			category: this.category ? this.category.src.split(path.sep).slice(1).join('/') : null
		};
	}
}
