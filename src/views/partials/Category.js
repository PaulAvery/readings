import m from 'mithril';
import {Grid, Cell} from 'mithril-mdl';

export function controller({i, layout}) {
	this.category = m.prop();
	this.articles = m.prop();
	this.categories = m.prop();

	i.request('GET', `/api/category/${i.param('category')}`).end(category => {
		this.category(category);

		this.categories(category.categories.map(c => {
			return {
				url: `/category/${c}`,
				name: c.split('/').pop()
			};
		}));

		this.articles(category.articles.map(a => {
			return {
				url: `/article/${a}`,
				name: a.split('/').pop()
			};
		}));
	}).then(layout.loaded);
}

export function view(ctrl, {i}) {
	if(!ctrl.category()) i.error(404);

	return <Grid class="category">
		<Cell width="2" notablet nophone />
		<Cell width="4">
			<h4>Categories:</h4>
			<ul class="mdl-shadow--4dp mdl-color--white mdl-color-text--grey-800">
				{ctrl.categories().map(c => <li><a href={c.url} config={m.route}>{c.name}</a></li>)}
				<span class="empty-placeholder  mdl-color-text--grey-400">Nothing here</span>
			</ul>
		</Cell>
		<Cell width="4">
			<h4>Articles:</h4>
			<ul class="category-column mdl-shadow--4dp mdl-color--white mdl-color-text--grey-800">
				{ctrl.articles().map(a => <li><a href={a.url} config={m.route}>{a.name}</a></li>)}
				<span class="empty-placeholder mdl-color-text--grey-400">Nothing here</span>
			</ul>
		</Cell>
	</Grid>;
}
