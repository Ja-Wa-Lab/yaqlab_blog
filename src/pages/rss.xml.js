import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter((post) => post.data.status === 'ready')
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'YAQ Lab Notes',
    description: 'Przemyślenia o AI, infrastrukturze, bezpieczeństwie i procesach.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/posts/${post.slug}/`
    }))
  });
}
