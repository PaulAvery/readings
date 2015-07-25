import m from 'mithril';
import {TextInput, Layout, Header, HeaderRow, Fab, Icon, Title, Spacer, Navigation, Drawer, NavLink, Content, ProgressBar} from 'mithril-mdl';

let initializedController;

function controller(View, {i}) {
	if(initializedController) return initializedController;

	this.data = {};
	this.data.categories = m.prop([]);
	this.data.importUrl = m.prop('');

	this.state = {};
	this.state.isLoading = m.prop(true);
	this.state.importOpen = m.prop(false);
	this.state.fab = {};
	this.state.fab.icon = m.prop();
	this.state.fab.method = m.prop();

	/* Methods to alter state */
	this.loading = () => {
		this.state.isLoading(true);
	};
	this.loaded = () => {
		this.state.isLoading(false);
	};

	this.hideDrawer = () => {
		document.getElementById('drawer').classList.remove('is-visible');
	};

	this.showImport = () => {
		this.state.importOpen(true);
		document.getElementById('url').focus();
	};

	this.fab = (fn) => {
		let importer = () => this.state.importOpen() ? this.import() : this.showImport();
		this.state.fab.method(fn || importer);
	};

	this.fabIcon = (icon) => {
		this.state.fab.icon(icon || 'add');
	};

	this.import = () => {
		this.state.isLoading(true);
		this.state.importOpen(false);
		i.redraw();

		i.route(`/extract/${encodeURIComponent(this.data.importUrl())}`);
	};

	/* Set up defaults and get data */
	this.fab();
	this.fabIcon();
	i.request('GET', '/api/category').end(this.data.categories);

	/* Cache the instance of our controller, otherwise we keep reloading the categories */
	if(process.browser) initializedController = this;
}

function view(View, {i}, ctrl) {
	let topLevel = ctrl.data.categories().filter(c => c.split('/').length === 1);
	let isActive = c => i.route().split('/')[2] === encodeURIComponent(c);
	let retain = (el, init, ctx) => ctx.retain = true;

	return <Layout drawer fixedHeader config={retain}>
		<Header primary scroll config={retain}>
			<HeaderRow large />
			<HeaderRow>
				<Title><span>readings</span><span class="activecategory"> / {topLevel.filter(isActive)[0]}</span></Title>
				<Spacer />
				<Fab id="add" onclick={ctrl.state.fab.method()} raised ripple accent>
					<Icon>{ctrl.state.fab.icon()}</Icon>
				</Fab>
			</HeaderRow>
			<HeaderRow large />
			<HeaderRow primaryDark id="import" class={ctrl.state.importOpen() ? '' : 'collapsed'}>
				<div class="inputwrapper">
					<TextInput id="url" label="URL..." onchange={m.withAttr('value', ctrl.data.importUrl)} value={ctrl.data.importUrl()} />
				</div>
			</HeaderRow>
			<HeaderRow large primaryDark>
				<Navigation>
					{topLevel.map(c =>
						<NavLink href={`/category/${c}`} config={m.route} active={isActive(c)}>{c}</NavLink>
					)}
				</Navigation>
			</HeaderRow>
		</Header>
		<Drawer id="drawer" config={retain}>
			<Title>readings</Title>
			<Navigation onclick={ctrl.hideDrawer}>
				{topLevel.map(c =>
					<NavLink href={`/category/${c}`} config={m.route} active={isActive(c)}>{c}</NavLink>
				)}
			</Navigation>
		</Drawer>
		<ProgressBar id="loading" class={ctrl.state.isLoading() ? '' : 'hidden'}/>
		<Content class={ctrl.state.isLoading() ? 'hidden' : ''}>
			<View i={i} layout={ctrl} />
		</Content>
	</Layout>;
}

/* Allow assigning a view into our layout */
export default function layout(View) {
	return {
		view: function() { return view.call(this, View, ...arguments); },
		controller: function() { return controller.call(this, View, ...arguments); }
	};
}
