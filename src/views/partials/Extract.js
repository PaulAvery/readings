import m from 'mithril';
import {Fab, Grid, Cell, TextInput} from 'mithril-mdl';
import * as ArticleContent from './ArticleContent';
import * as ArticleHtml from './ArticleHtml';

export function controller({i, layout}) {
	this.url = m.prop(i.param('url'));
	this.title = m.prop('Some Title');
	this.author = m.prop('Unknown');
	this.extracts = m.prop();
	this.selected = m.prop(0);

	this.next = () => this.selected(Math.min(this.selected() + 1, this.extracts().length - 1));
	this.previous = () => this.selected(Math.max(this.selected() - 1, 0));
	this.save = () => {
		layout.loading(true);
		i.redraw();

		let html = this.extracts()[this.selected()];

		i.request('POST', '/api/article')
			.query({
				url: this.url(),
				author: this.author(),
				title: this.title()
			})
			.send(html)
			.end(url => {
				i.route(`/article/${url}`);
			});
	};

	layout.fab(this.save);
	layout.fabIcon('save');
	this.onunload = () => { layout.fab(); layout.fabIcon(); };
	i.request('GET', `/api/extract/${encodeURIComponent(i.param('url'))}`).end(this.extracts).then(layout.loaded);
}

export function view(ctrl, {i}) {
	if(!ctrl.extracts()) i.error(400);

	let crumbs = [{
		name: 'imported',
		url: '/category/imported'
	}, {
		name: ctrl.title() + '.html',
		url: `/category/imported/${ctrl.title()}.html`
	}];

	return <div>
		<Grid class="extract-input">
			<Cell width="2" notablet nophone />
			<Cell width="4">
				<TextInput id="title" label="Title..."
					oninput={m.withAttr('value', ctrl.title)}
					value={ctrl.title()} />
			</Cell>
			<Cell width="4">
				<TextInput id="author" label="Author..."
					oninput={m.withAttr('value', ctrl.author)}
					value={ctrl.author()} />
			</Cell>
		</Grid>
		<Grid class="article extract-article">
			<Cell width="2" notablet nophone />
			<Cell width="8">
				<ArticleContent crumbs={crumbs} author={{url: ctrl.url(), name: ctrl.author()}} tags={[]} title={ctrl.title()}>
					<Fab class="previous-preview mdl-color--grey-300" onclick={ctrl.previous} disabled={ctrl.selected() <= 0} ripple>
						&lt;
					</Fab>
					<Fab class="next-preview mdl-color--grey-300" onclick={ctrl.next} disabled={ctrl.selected() + 1 >= ctrl.extracts().length} ripple>
						&gt;
					</Fab>
					<ArticleHtml i={i}>{ctrl.extracts()[ctrl.selected()]}</ArticleHtml>
				</ArticleContent>
			</Cell>
		</Grid>
	</div>;
}
