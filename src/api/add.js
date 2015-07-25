import Python from 'python-shell';
import sanitize from 'sanitize-filename';
import {exec} from 'child_process';
import body from 'co-body';
import path from 'path';
import fs from 'fs';

export default function *() {
	let {url, author, title} = this.query;
	if(typeof url !== 'string' || typeof author !== 'string' || typeof title !== 'string') this.throw(400);

	let sanitized = '';
	let sanitizer = new Python('sanitize.py', {
		scriptPath: path.join(__dirname, '../../python')
	});
	sanitizer.on('message', m => sanitized += m);
	sanitizer.send(yield body.text(this));
	yield sanitizer.end.bind(sanitizer);

	let filename = `articles/imported/${sanitize(title)}.html`;
	yield fs.writeFile.bind(fs, filename, sanitized);

	let add = `git add "${filename.replace('"', '\\"')}"`;
	yield exec.bind(null, add);

	let commit = `git commit --author="${author}<${url}>" -m "Imported from ${url}" "${filename.replace('"', '\\"')}"`;
	yield exec.bind(null, commit);

	this.body = `imported/${encodeURIComponent(sanitize(title))}.html`;
}
