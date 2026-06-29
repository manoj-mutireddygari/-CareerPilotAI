import type { CollectedJob } from '../types';
import { saveCollectionItem } from './storage.service';

function isPostedWithinLastDay(postedAt?: string) {
  if (!postedAt) return true;
  const normalized = postedAt.toLowerCase();

  if (normalized.includes('today') || normalized.includes('just') || normalized.includes('hour') || normalized.includes('minute')) {
    return true;
  }

  const dayMatch = normalized.match(/(\d+)\s+day/);
  if (dayMatch) return Number(dayMatch[1]) <= 1;

  const weekOrMonth = normalized.includes('week') || normalized.includes('month') || normalized.includes('year');
  return !weekOrMonth;
}

export async function fetchGoogleJobs(domains: string[], locations: string[]): Promise<CollectedJob[]> {
  if (!process.env.SERPAPI_KEY) {
    return domains.flatMap((domain, index) => ({
      id: `demo-${index}`,
      company: ['Google', 'Zoho', 'Freshworks'][index % 3],
      role: domain,
      description: `Hiring ${domain} with React, Node.js, AI systems, automation, and product engineering experience.`,
      applyLink: 'https://www.google.com/search?q=jobs',
      salary: 'Competitive',
      postedDate: 'Today',
      location: locations[index % locations.length] || 'Remote'
    }));
  }

  const results: CollectedJob[] = [];
  for (const domain of domains) {
    for (const location of locations) {
      const params = new URLSearchParams({
        engine: 'google_jobs',
        q: domain,
        location,
        api_key: process.env.SERPAPI_KEY
      });
      const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`);
      const data = (await response.json()) as any;
      const jobs = (data.jobs_results || []).map((job: any, index: number) => ({
        id: `${domain}-${location}-${index}`,
        company: job.company_name,
        role: job.title,
        description: job.description,
        applyLink: job.related_links?.[0]?.link || job.share_link || '#',
        salary: job.detected_extensions?.salary,
        postedDate: job.detected_extensions?.posted_at,
        location: job.location
      })).filter((job: CollectedJob) => isPostedWithinLastDay(job.postedDate));
      results.push(...jobs);
    }
  }

  await Promise.all(results.map((job) => saveCollectionItem('jobs', { ...job })));
  return results;
}
