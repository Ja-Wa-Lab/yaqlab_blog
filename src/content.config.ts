import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(8),
    slug: z.string().min(3),
    date: z.coerce.date(),
    status: z.enum(['draft', 'ready']),
    lang: z.enum(['pl', 'en']),
    tags: z.array(z.string()).min(1),
    excerpt: z.string().min(40),
    hero_image: z.string(),
    hero_alt: z.string().min(10),
    hero_h1: z.string().min(3),
    seo_title: z.string().min(10),
    seo_description: z.string().min(50),
    source_type: z.literal('voice_chat'),
    source_ref: z.string().min(3)
  })
});

export const collections = { posts };
