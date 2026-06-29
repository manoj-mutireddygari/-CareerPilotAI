import type { CollectedJob, MatchResult, ResumeProfile } from '../types';

const defaultProfile: ResumeProfile = {
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning'],
  projects: ['AI resume analyzer', 'Automation dashboard'],
  experience: ['Built full stack applications and AI workflow prototypes'],
  education: ['Computer Science Engineering'],
  technologies: ['Firebase', 'Express', 'Tailwind CSS', 'GSAP'],
  preferredRoles: ['AI Engineer', 'Full Stack Developer', 'Backend Developer']
};

interface OpenAiJsonResponse {
  output_text?: string;
  output?: Array<{ content?: Array<{ text?: string }> }>;
}

async function callLanguageModel(prompt: string): Promise<OpenAiJsonResponse | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1',
      input: prompt,
      text: { format: { type: 'json_object' } }
    })
  });

  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  return response.json() as Promise<OpenAiJsonResponse>;
}

function extractModelText(response: OpenAiJsonResponse | null) {
  return response?.output_text || response?.output?.flatMap((item) => item.content || []).map((content) => content.text).find(Boolean);
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
}

function uniqueTerms(values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => normalizeText(value).split(/[\s,/|]+/))
        .map((value) => value.trim())
        .filter((value) => value.length > 1)
    )
  );
}

function phraseHits(phrases: string[], haystack: string) {
  return phrases.filter((phrase) => {
    const normalized = normalizeText(phrase).trim();
    return normalized.length > 1 && haystack.includes(normalized);
  });
}

function calculateDeterministicMatch(profile: ResumeProfile, job: CollectedJob): MatchResult {
  const jobText = normalizeText(`${job.role} ${job.description}`);
  const roleText = normalizeText(job.role);
  const profileText = normalizeText(
    [...profile.skills, ...profile.technologies, ...profile.projects, ...profile.experience, ...profile.preferredRoles].join(' ')
  );

  const skills = [...profile.skills, ...profile.technologies];
  const matchedSkills = phraseHits(skills, jobText);
  const skillScore = skills.length ? (matchedSkills.length / Math.max(skills.length, 1)) * 42 : 0;

  const preferredRoleHits = phraseHits(profile.preferredRoles, roleText);
  const roleWords = uniqueTerms(profile.preferredRoles);
  const roleOverlap = roleWords.filter((term) => roleText.includes(term)).length;
  const roleScore = Math.min(22, preferredRoleHits.length * 18 + roleOverlap * 3);

  const projectTerms = uniqueTerms([...profile.projects, ...profile.experience]).filter((term) => term.length > 3);
  const projectOverlap = projectTerms.filter((term) => jobText.includes(term)).length;
  const projectScore = Math.min(16, projectOverlap * 2);

  const importantJobTerms = uniqueTerms([job.description]).filter((term) =>
    /ai|ml|python|react|node|api|cloud|aws|azure|gcp|llm|data|model|system|security|docker|kubernetes|tensorflow|pytorch|sql|typescript|java|backend|frontend|fullstack|automation|microservices|devops|testing|analytics/i.test(
      term
    )
  );
  const matchedImportantTerms = importantJobTerms.filter((term) => profileText.includes(term));
  const keywordScore = importantJobTerms.length ? (matchedImportantTerms.length / importantJobTerms.length) * 20 : 8;

  const seniorityPenalty = /principal|staff|architect|lead|manager|12|15|17|10\+/.test(jobText) && !/lead|senior|architect|manager|principal/.test(profileText) ? 10 : 0;
  const rawScore = 28 + skillScore + roleScore + projectScore + keywordScore - seniorityPenalty;
  const matchScore = Math.max(45, Math.min(96, Math.round(rawScore)));
  const missingSkills = importantJobTerms.filter((term) => !profileText.includes(term)).slice(0, 8);

  return {
    jobId: job.id,
    matchScore,
    whyItMatches: matchedSkills.length
      ? `Matched skills: ${matchedSkills.slice(0, 8).join(', ')}. Role similarity and project keywords were also considered.`
      : 'Limited direct skill overlap found; score is based on role similarity, project terms, and transferable keywords.',
    missingSkills: missingSkills.length ? missingSkills : ['No major ATS keyword gap detected'],
    recommendation:
      matchScore >= 85
        ? 'Strong match. Apply with role-specific keywords and project impact.'
        : matchScore >= 75
          ? 'Good match. Add missing keywords only where truthful before applying.'
          : 'Moderate match. Improve missing skills before prioritizing this role.'
  };
}

export async function analyzeResumeWithAi(resumeText: string): Promise<ResumeProfile> {
  const prompt = `Analyze this resume and return JSON with skills, projects, experience, education, technologies, preferredRoles. Resume: ${resumeText}`;
  try {
    const response = await callLanguageModel(prompt);
    const output = extractModelText(response);
    if (!output) return defaultProfile;
    return JSON.parse(output) as ResumeProfile;
  } catch (error) {
    console.warn('Resume AI analysis failed, using extracted fallback profile:', error instanceof Error ? error.message : error);
    return {
      ...defaultProfile,
      projects: resumeText.match(/project[s]?:?([\s\S]{0,500})/i)?.[1]?.split('\n').filter(Boolean).slice(0, 4) || defaultProfile.projects
    };
  }
}

export async function matchJobWithAi(profile: ResumeProfile, job: CollectedJob): Promise<MatchResult> {
  const prompt = `Compare candidate profile with job description. Return JSON: matchScore, whyItMatches, missingSkills, recommendation. Profile: ${JSON.stringify(profile)} Job: ${JSON.stringify(job)}`;
  try {
    const response = await callLanguageModel(prompt);
    const output = extractModelText(response);
    if (output) {
      const parsed = JSON.parse(output) as Omit<MatchResult, 'jobId'>;
      return { ...parsed, jobId: job.id };
    }
  } catch (error) {
    console.warn('Job AI matching failed, using deterministic fallback:', error instanceof Error ? error.message : error);
  }

  return calculateDeterministicMatch(profile, job);
}

function keywordFallback(profile: ResumeProfile, job: CollectedJob) {
  const descriptionWords = job.description
    .replace(/[^a-zA-Z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const importantTerms = Array.from(
    new Set(
      descriptionWords.filter((word) =>
        /ai|ml|python|react|node|api|cloud|aws|azure|gcp|llm|data|model|system|security|docker|kubernetes|tensorflow|pytorch|sql|typescript|java|backend|frontend|fullstack|automation/i.test(
          word
        )
      )
    )
  ).slice(0, 22);
  const currentSkills = new Set(profile.skills.map((skill) => skill.toLowerCase()));
  const missingKeywords = importantTerms.filter((term) => !currentSkills.has(term.toLowerCase())).slice(0, 12);

  return `ATS KEYWORD GUIDANCE

Role: ${job.role}
Company: ${job.company}

Keywords to add where truthful:
${importantTerms.map((term) => `- ${term}`).join('\n') || '- Review the job description and mirror exact technical terms you have used.'}

Missing or weak keywords:
${missingKeywords.map((term) => `- ${term}`).join('\n') || '- No major keyword gaps detected from the extracted profile.'}

Suggested resume bullet improvements:
- Add measurable impact to relevant projects, for example: "Built ${job.role.toLowerCase()}-aligned automation using ${profile.technologies.slice(0, 3).join(', ')}."
- Mirror role terminology from the job description only when it matches real experience.
- Place strongest matching skills in the top skills section and project bullets.
- Add deployment, API, data, testing, or cloud keywords only if you can explain them in interview.

Do not add:
- Tools you have never used.
- Fake experience, fake internships, fake production claims, or inflated years of experience.
- Keywords that you cannot support with a project, coursework, or work example.

Existing candidate signals:
Skills: ${profile.skills.join(', ')}
Technologies: ${profile.technologies.join(', ')}
Projects: ${profile.projects.slice(0, 4).join('; ')}`;
}

export async function generateAtsResume(profile: ResumeProfile, job: CollectedJob) {
  const prompt = `Create an ATS keyword guidance document, not a resume. Return plain text content with these sections: Keywords to add where truthful, Missing or weak keywords, Suggested resume bullet improvements, Do not add, Existing candidate signals. Never invent experience. Profile: ${JSON.stringify(profile)} Job: ${JSON.stringify(job)}`;
  try {
    const response = await callLanguageModel(prompt);
    return extractModelText(response) || keywordFallback(profile, job);
  } catch (error) {
    console.warn('ATS keyword guidance failed, using fallback guidance:', error instanceof Error ? error.message : error);
    return keywordFallback(profile, job);
  }
}

export async function generateEmail(matches: Array<{ job: CollectedJob; match: MatchResult }>) {
  const body = matches
    .map(({ job, match }) => `${job.company} - ${job.role}\nMatch: ${match.matchScore}%\n${match.whyItMatches}\nApply: ${job.applyLink}`)
    .join('\n\n');

  return {
    subject: "Today's AI Career Matches",
    body
  };
}
