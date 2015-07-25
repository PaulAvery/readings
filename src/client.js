/* eslint-env browser */
import Isomorphic from 'isomorphic-mithril';
import views from './views';
import m from 'mithril';

let app = new Isomorphic();
app.mount(document.body, '/', views);

app.listen(m);
