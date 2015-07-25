import python from 'python-shell';
import isUrl from 'is-url';
import path from 'path';

export default function *(url) {
	if(!url || !isUrl(url)) {
		this.status = 400;
		return;
	}

	let extracted = (yield python.run.bind(python, 'article.py', {
		scriptPath: path.join(__dirname, '../../python'),
		args: [url],
		mode: 'json'
	}))[0];

	this.body = extracted;
}
