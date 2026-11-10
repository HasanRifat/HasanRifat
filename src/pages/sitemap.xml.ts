import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sheets } from '../data/sheets';
import { experiments } from '../data/experiments';
import { href } from '../lib/url';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getCollection('projects');
  const notes = await getCollection('notes', (n) => !n.data.draft);
  const paths = [
    ...sheets.map((s) => s.path),
    ...projects.map((p) => `/work/${p.id}/`),
    ...experiments.map((x) => `/lab/${x.slug}/`),
    ...notes.map((n) => `/notes/${n.id}/`),
  ];
  const urls = paths.map((p) => `<url><loc>${new URL(href(p), site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
