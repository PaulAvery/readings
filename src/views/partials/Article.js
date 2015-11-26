import m from 'mithril';
import {Grid, Cell} from 'mithril-mdl';
import * as ArticleMd from './ArticleMd';
import * as ArticleHtml from './ArticleHtml';
import * as ArticleContent from './ArticleContent';

export function controller({i, layout}) {
	this.article = i.request('GET', `/api/article/${i.param('article')}?populate`).end();

	this.crumbs = this.article.then(article => {
		return article.src.split('/').slice(1).reduce((sum, c, index, a) => {
			let path = [''].concat(sum).map(p => p.name).join('/');
			let mod = (index === a.length - 1) ? 'article' : 'category';

			sum.push({
				url: `/${mod}${path}/${c}`,
				name: c
			});

			return sum;
		}, []);
	});

	this.crumbs.then(layout.loaded);
}

export function view(ctrl, {i}) {
	if(!ctrl.article()) i.error(404);
	let {author, tags, title, content, type} = ctrl.article();

	return <Grid class="article">
		<Cell width="2" notablet nophone />
		<Cell width="8">
			<ArticleContent crumbs={ctrl.crumbs()} author={author} tags={tags} title={title}>
				{type === 'html' ? <ArticleHtml i={i}>{content}</ArticleHtml> : <ArticleMd>{content}</ArticleMd>}
			</ArticleContent>
		</Cell>
	</Grid>;
}
