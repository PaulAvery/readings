import m from 'mithril';

export function view(ctrl, Body) {
	return <html>
		<head>
			<title>readings</title>
			<meta charset="utf-8" />
			<meta name="description" content="A platform to present written information about specific topics" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons" />
			<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700" />
			<link rel="stylesheet" href="/assets/readings.css" />
		</head>
		<body class="mdl-base mdl-color--grey-100 mdl-color-text--grey-700">
			<Body />
		</body>
		<script src="/assets/material.js" />
		<script src="/assets/readings.js" />
	</html>;
}
