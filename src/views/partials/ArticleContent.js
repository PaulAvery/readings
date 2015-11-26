import m from 'mithril';

export function view(ctrl, {crumbs, title, author, tags}, ...children) {
	let classes = arguments[1].class || '';
	let authorLink = author.mail ? `mailto:${author.mail}` : author.url;

	return <div class={`${classes} article-content mdl-shadow--4dp mdl-color--white mdl-color-text--grey-800`}>
		<div class="crumbs">
			{crumbs.map(c => <a href={c.url} class="crumb mdl-color-text--grey-500" config={m.route}>{c.name}</a>)}
		</div>
		<h3>{title}</h3>
		<a class="author mdl-color-text--grey-500" href={authorLink} config={m.route}>{`${author.name} <${author.mail || author.url}>`}</a>
		<div class="article-body">
			{children}
		</div>
		<div class="tags">
			{tags.map(t => <a class="tag mdl-color-text--white mdl-shadow--2dp" href={`/tag/${t.name}`} style={{backgroundColor: t.color}}>#{t.name}</a>)}
		</div>
	</div>;
}
