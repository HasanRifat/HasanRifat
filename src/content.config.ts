import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Files whose names start with "_" are templates and are never published.
const projects = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    arabic: z.string().optional(),
    order: z.number(),
    kind: z.string(),
    status: z.string(),
    period: z.string().optional(),
    role: z.string(),
    stack: z.array(z.string()).default([]),
    summary: z.string(),
    figure: z.enum(['shop', 'dashboard', 'shelf', 'roots', 'flow', 'bot']),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

export const categories = ['Technology', 'Design', 'Learning', 'Building', 'Personal development'] as const;

const notes = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(categories),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };
