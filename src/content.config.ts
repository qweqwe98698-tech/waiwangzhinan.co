import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['start', 'airport', 'clients', 'use', 'fix', 'choose']),
    level: z.string().optional(),
    quickAnswer: z.string(),
    order: z.number().default(99),
    pubDate: z.string().or(z.date()),
    updatedDate: z.string().or(z.date()).optional(),
    author: z.string().default('外网指南编辑部'),
    tags: z.array(z.string()).default([]),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).optional(),
    nextSteps: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        description: z.string().optional(),
      })
    ).optional(),
    completedConcept: z.string().optional(),
  }),
});

const providers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/providers' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    officialUrl: z.string(),
    affiliateUrl: z.string().optional(),
    summary: z.string(),
    tagline: z.string(),
    pricing: z.object({
      startingPrice: z.number().or(z.string()),
      billingCycle: z.string(),
      monthlyPrice: z.number().or(z.string()).optional(),
      traffic: z.string().optional(),
      currency: z.string().default('CNY'),
    }),
    devices: z.array(z.string()),
    protocols: z.array(z.string()),
    features: z.array(z.string()),
    aiSupport: z.string(),
    streaming: z.string(),
    speedtestImage: z.string().optional(),
    speedtestTestedAt: z.string().optional(),
    speedtestTool: z.string().optional(),
    promoCode: z.string().optional(),
    discount: z.string().optional(),
    estYear: z.number().optional(),
    paymentMethods: z.array(z.string()).optional(),
    verificationStatus: z.string(),
    lastVerified: z.string(),
    notes: z.string(),
    recommendFor: z.array(z.string()),
  }),
});

export const collections = {
  guides,
  providers,
};
