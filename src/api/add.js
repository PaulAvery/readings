import sanitizeName from 'sanitize-filename';
import sanitize from 'sanitize-html';
import {exec} from 'child_process';
import body from 'co-body';
import fs from 'fs';

export default function *() {
	let {url, author, title} = this.query;
	if(typeof url !== 'string' || typeof author !== 'string' || typeof title !== 'string') this.throw(400);

	/* Sanitize HTML */
	let sanitized = sanitize(yield body.text(this));

	let filename = `articles/imported/${sanitizeName(title)}.html`;
	yield fs.writeFile.bind(fs, filename, sanitized);

	let add = `git add "${filename.replace('"', '\\"')}"`;
	yield exec.bind(null, add);

	let commit = `git commit --author="${author}<${url}>" -m "Imported from ${url}" "${filename.replace('"', '\\"')}"`;
	yield exec.bind(null, commit);

	this.body = `imported/${encodeURIComponent(sanitizeName(title))}.html`;
}
