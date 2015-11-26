import m from 'mithril';

export function view(ctrl, args, child) {
	return <div class="article-md markdown-body">{m.trust(child)}</div>;
}
