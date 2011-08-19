---
layout: static
title: Blog
---
<ul class="posts">
{% for post in site.posts %}
	<li>
		<a href="{{ post.url }}">{{ post.title }}</a>
		<abbr>{{ post.date | date_to_string }}</abbr>
		<div class="categories">Filed under 
			{% for item in post.categories %}
				{% if forloop.last %}
					and 
				{% endif %}
				
				<a href="/{{ site.category_dir }}/{{ item }}">{{ item }}</a>{% unless forloop.last or forloop.rindex == 2%},{% endunless %}
			{% endfor %}
		</div>
	</li>
{% endfor %}
</ul>