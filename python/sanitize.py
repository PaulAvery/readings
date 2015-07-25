import sys
from lxml import html
from lxml.html import make_links_absolute, fragment_fromstring
from lxml.html.clean import clean_html

def sanitize(html, url):
	html.make_links_absolute(url)
	return clean_html(html)

raw_html = sys.stdin.read()
parsed_html = fragment_fromstring(raw_html, create_parent='div')

print(html.tostring(parsed_html).decode())
