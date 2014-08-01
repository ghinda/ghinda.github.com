---
layout: default
title: Home
---

<article>
  <ul class="posts no-bullet">

  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <time itemprop="dateCreated" datetime="{{ post.date }}">
        {{ post.date | date_to_string }}
      </time>
    </li>
  {% endfor %}

  </ul>
</article>
