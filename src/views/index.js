import layout from './layout';
import * as Root from './Root';
import * as Extract from './partials/Extract';
import * as Article from './partials/Article';
import * as Category from './partials/Category';

export default {
	'/': Root,
	'/extract': Root,
	'/extract/:url...': layout(Extract),
	'/article': Root,
	'/article/:article...': layout(Article),
	'/category': Root,
	'/category/:category...': layout(Category)
};
