import m from 'mithril';

export function controller({i}) {
	let self = this;

	this.iframe = m.prop();

	this.saveIFrame = function() {
		self.iframe(this);
	};

	this.timeout = 0;
	this.resizeIFrame = () => {
		clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			if(this.iframe()) {
				this.iframe().height = 0;
				this.iframe().height = this.iframe().contentWindow.document.body.scrollHeight + 'px';
			}
		}, 0);
	};

	if(i.browser) window.onresize = this.resizeIFrame;
}

export function view(ctrl, args, child) {
	ctrl.resizeIFrame();

	return <iframe class="article-html" scrolling="no" src={'data:text/html;charset=utf-8,' + encodeURIComponent(child)} onload={ctrl.saveIFrame}></iframe>;
}
