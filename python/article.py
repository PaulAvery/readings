import sys
import json

from requests import get
from collections import Counter
from lxml import html
from lxml.html import make_links_absolute
from lxml.html.clean import clean_html

def sanitize(html, url):
	html.make_links_absolute(url)
	return clean_html(html)

url = sys.argv[1]
request = get(url)

parsed_doc = html.fromstring(request.content)
parent_elements = parsed_doc.xpath('//body//*/..')
parents_with_children_counts = []

for parent in parent_elements:
	children_counts = Counter([child.tag for child in parent.iterchildren()])
	parents_with_children_counts.append((parent, children_counts))

parents_with_children_counts.sort(key=lambda x: x[1].most_common(1)[0][1], reverse=True)
best_guesses = map(lambda x: html.tostring(sanitize(x[0], url)).decode(), parents_with_children_counts[:6])

print(json.dumps(list(best_guesses)));
