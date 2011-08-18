---
layout: static
title: Blog
---
<ul class="posts">
{% for post in site.posts %}
	<li>
		<a href="{{ post.url }}">{{ post.title }}</a>
		<abbr>{{ post.date | date_to_string }}</abbr>
		<div class="categories">Filed under {{ post.categories | category_links }}</div>
	</li>
{% endfor %}
</ul>