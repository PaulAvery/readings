import compose from 'koa-compose';

/* Set up sanitizer */
import sanitize from 'sanitize-html';
sanitize.defaults.allowedTags.push('img', 'style', 'body', 'h1', 'h2', 'span');
sanitize.defaults.allowedAttributes['*'] = ['style'];

/* Set up API */
import add from './add';
import extract from './extract';
import * as tag from './tag';
import * as article from './article';
import * as category from './category';

export default function api(router) {
	return compose([
		router.get('/tag', tag.list),
		router.get('/tag/:name', tag.get),
		router.get('/article', article.list),
		router.get('/article/:path+', article.get),
		router.get('/category', category.list),
		router.get('/category/:path+', category.get),
		router.get('/extract/:url+', extract),
		router.post('/article', add)
	]);
}
