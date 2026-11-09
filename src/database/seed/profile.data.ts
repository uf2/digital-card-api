import { LinkKind, SkillCategory } from '../../generated/prisma/enums.js';
import { OWNER_SLUG } from '../../profile/profile.constants.js';

export interface ProfileSeed {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location: string;
  links: { kind: LinkKind; label: string; url: string }[];
  skills: { name: string; category: SkillCategory }[];
  experience: {
    company: string;
    position: string;
    location: string;
    summary: string | null;
    startDate: string;
    endDate: string | null;
    achievements: string[];
  }[];
  projects: {
    name: string;
    description: string;
    url: string | null;
    repositoryUrl: string | null;
    isPrivate: boolean;
    technologies: string[];
  }[];
}

export const profileSeed: ProfileSeed = {
  slug: OWNER_SLUG,
  name: 'Vladimir Fedorovykh',
  headline:
    'Senior Backend Engineer | Node.js | TypeScript | Microservices | APIs | Payments',
  description:
    'Senior Backend Engineer with 8+ years in Node.js/TypeScript backend engineering: payments, integrations, data pipelines and production business systems. Open to remote Senior Backend roles. Uses AI coding assistants (Claude Code, Codex, OpenAI APIs) in daily development and workflow automation.',
  location: 'Buenos Aires, Argentina',
  links: [
    {
      kind: LinkKind.WEBSITE,
      label: 'Portfolio',
      url: 'https://fedorovykh.com',
    },
    {
      kind: LinkKind.GITHUB,
      label: 'GitHub',
      url: 'https://github.com/uf2',
    },
    {
      kind: LinkKind.GITLAB,
      label: 'GitLab',
      url: 'https://gitlab.com/vf2',
    },
    {
      kind: LinkKind.LINKEDIN,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/vladimir-fedorovykh',
    },
    {
      kind: LinkKind.EMAIL,
      label: 'Email',
      url: 'mailto:vladimir@fedorovykh.com',
    },
  ],
  skills: [
    { name: 'Node.js', category: SkillCategory.BACKEND },
    { name: 'TypeScript', category: SkillCategory.BACKEND },
    { name: 'JavaScript', category: SkillCategory.BACKEND },
    { name: 'NestJS', category: SkillCategory.BACKEND },
    { name: 'Express.js', category: SkillCategory.BACKEND },
    { name: 'GraphQL', category: SkillCategory.BACKEND },
    { name: 'REST APIs', category: SkillCategory.BACKEND },
    { name: 'Microservices', category: SkillCategory.BACKEND },
    { name: 'Event-Driven Systems', category: SkillCategory.BACKEND },
    { name: 'PostgreSQL', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'Prisma', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'MongoDB', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'Redis', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'BigQuery', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'RabbitMQ', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'pg-boss', category: SkillCategory.DATA_AND_MESSAGING },
    { name: 'Stripe', category: SkillCategory.PAYMENTS_AND_GROWTH },
    { name: 'PayPal', category: SkillCategory.PAYMENTS_AND_GROWTH },
    { name: 'QuickBooks Online', category: SkillCategory.PAYMENTS_AND_GROWTH },
    { name: 'GrowthBook', category: SkillCategory.PAYMENTS_AND_GROWTH },
    { name: 'GA4', category: SkillCategory.PAYMENTS_AND_GROWTH },
    { name: 'Payload CMS', category: SkillCategory.CMS_AND_WEB },
    { name: 'Strapi', category: SkillCategory.CMS_AND_WEB },
    { name: 'SvelteKit', category: SkillCategory.CMS_AND_WEB },
    { name: 'Next.js', category: SkillCategory.CMS_AND_WEB },
    { name: 'AWS', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Docker', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Git', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Jest', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Vitest', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Playwright', category: SkillCategory.CLOUD_AND_TESTING },
    { name: 'Claude Code', category: SkillCategory.AI },
    { name: 'OpenAI APIs', category: SkillCategory.AI },
    { name: 'LangChain', category: SkillCategory.AI },
    { name: 'pgvector', category: SkillCategory.AI },
    { name: 'RAG', category: SkillCategory.AI },
  ],
  experience: [
    {
      company: 'No Hesi',
      position: 'Senior Backend Engineer (Node.js, TypeScript, Payments)',
      location: 'Remote, United States',
      summary:
        'Building the subscription and pricing platform for a sim-racing multiplayer community: Node.js/TypeScript backend, Payload CMS and a SvelteKit website.',
      startDate: '2026-07-01',
      endDate: null,
      achievements: [
        'Built a pricing system run from the CMS: the business changes prices and launches price A/B tests without a developer or a deploy; the backend decides every price and checkout charges only a price the visitor was shown.',
        'Built Stripe subscriptions: Checkout, trials, gifts, upgrades and downgrades, Customer Portal and card recovery, with webhooks on pg-boss job queues.',
        'Tagged every purchase in Stripe and computed GrowthBook reports from Stripe data in BigQuery, so tests are judged on real revenue; EU and UK visitors join tests only after cookie consent.',
        'Moved the blog and marketing pages from Strapi to Payload CMS; verified purchase flows end to end with Playwright and Stripe test mode.',
      ],
    },
    {
      company: 'All Funeral Services',
      position:
        'Senior Backend Engineer / Software Developer (Node.js, Microservices)',
      location: 'Remote, United States',
      summary:
        'Node.js/TypeScript services and microservices for an operations platform of a US funeral-services business, connecting CRM, payments, orders, contractors and internal operations.',
      startDate: '2018-06-01',
      endDate: '2026-07-01',
      achievements: [
        'Developed REST APIs with Express, PostgreSQL, MongoDB, Redis, RabbitMQ and Docker; designed schemas, migrations and consistency logic for order and payment workflows.',
        'Owned payment workflows integrating Stripe, PayPal, QuickBooks Online, Kommo CRM and Elasticsearch.',
        'Built ETL and CLI tools synchronizing leads, customers, orders, invoices, payments, cemetery data and memorial pages.',
        'Introduced queue-based background processing: system performance up 35%, REST API response time down 25%.',
      ],
    },
  ],
  projects: [
    {
      name: 'Digital business card API',
      description:
        'This service: NestJS, GraphQL (Apollo), Prisma and PostgreSQL, packed in Docker, with batched loading of nested data.',
      url: null,
      repositoryUrl: 'https://github.com/uf2/digital-card-api',
      isPrivate: false,
      technologies: ['NestJS', 'GraphQL', 'Prisma', 'PostgreSQL', 'Docker'],
    },
    {
      name: 'Portfolio website',
      description:
        'Personal portfolio with experience, skills and a featured project.',
      url: 'https://fedorovykh.com',
      repositoryUrl: null,
      isPrivate: false,
      technologies: ['React', 'TanStack Start', 'TypeScript', 'Tailwind CSS'],
    },
    {
      name: 'Subscription and pricing platform (No Hesi)',
      description:
        'Private company project. CMS-driven prices, price A/B tests and Stripe subscriptions for a sim-racing community.',
      url: 'https://nohesi.gg/',
      repositoryUrl: null,
      isPrivate: true,
      technologies: [
        'Node.js',
        'TypeScript',
        'PostgreSQL',
        'pg-boss',
        'Payload CMS',
        'Stripe',
        'GrowthBook',
        'BigQuery',
      ],
    },
    {
      name: 'Operations platform (All Funeral Services)',
      description:
        'Private company project. Services connecting CRM, payments, orders and contractors for a US service business.',
      url: 'https://allfuneral.com/',
      repositoryUrl: null,
      isPrivate: true,
      technologies: [
        'Node.js',
        'TypeScript',
        'Express.js',
        'PostgreSQL',
        'MongoDB',
        'RabbitMQ',
        'Stripe',
        'QuickBooks Online',
      ],
    },
  ],
};
