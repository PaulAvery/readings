export function controller({i}) {
	i.request('GET', '/api/category').end((categories) => {
		let top = categories.filter(c => c.split('/').length === 1);
		i.route('/category/' + top[0]);
	});
}

export function view() {}
