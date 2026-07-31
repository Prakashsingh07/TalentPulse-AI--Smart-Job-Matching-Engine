import { Job, MatchDiagnostic } from '../types';

const COMMON_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where', 'who',
  'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'can', 'should', 'now', 'work', 'working', 'experience',
  'developer', 'engineer', 'role', 'team', 'company', 'position', 'looking', 'skills'
]);

const SKILL_DICTIONARY = [
  'react', 'react.js', 'typescript', 'javascript', 'html', 'css', 'asp.net', '.net core',
  'c#', 'sql', 'sql server', 'postgresql', 'mongodb', 'node.js', 'express', 'python',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'rest api', 'graphql', 'git',
  'ci/cd', 'microservices', 'unit testing', 'entity framework', 'tailwind', 'redux',
  'nlp', 'machine learning', 'artificial intelligence', 'data science', 'agile', 'scrum'
];

/**
 * Normalizes text into clean lowercase words without punctuation
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !COMMON_STOP_WORDS.has(word));
}

/**
 * Extracts recognized technical skills from free-form text
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const cleanText = text.toLowerCase();
  const foundSkills = new Set<string>();

  SKILL_DICTIONARY.forEach(skill => {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\b|\\s)${escaped}(?:$|\\b|\\s)`, 'i');
    if (regex.test(cleanText)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills);
}

/**
 * Computes Cosine Similarity between TF-IDF term frequency vectors
 */
export function calculateCosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenizeText(text1);
  const tokens2 = tokenizeText(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};

  tokens1.forEach(t => (freq1[t] = (freq1[t] || 0) + 1));
  tokens2.forEach(t => (freq2[t] = (freq2[t] || 0) + 1));

  const allWords = Array.from(new Set([...Object.keys(freq1), ...Object.keys(freq2)]));

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  allWords.forEach(word => {
    const val1 = freq1[word] || 0;
    const val2 = freq2[word] || 0;

    dotProduct += val1 * val2;
    norm1 += val1 * val1;
    norm2 += val2 * val2;
  });

  if (norm1 === 0 || norm2 === 0) return 0;

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * High-Precision AI Natural Language Processing Diagnostic Engine
 */
export function calculateMatchDiagnostic(
  resumeText: string,
  userSkills: string[],
  job: Job
): MatchDiagnostic {
  const requiredJobSkills = job.skillsRequired || [];

  // Guard: If resume is empty or invalid
  if (!resumeText || resumeText.trim().length < 15) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: requiredJobSkills.map(capitalize),
      experienceMatch: false,
      domainScore: 0,
      summary: 'No valid resume content found for candidate analysis.',
      recommendation: 'Upload or paste your resume text to compute your precision AI fit score.'
    };
  }

  // Extract skills from resume text + combined user skills
  const extractedSkills = extractSkillsFromText(resumeText);
  const combinedUserSkills = Array.from(
    new Set([
      ...userSkills.map(s => s.toLowerCase().trim()),
      ...extractedSkills
    ])
  );

  // Match skills against job requirements
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredJobSkills.forEach(req => {
    const reqLower = req.toLowerCase().trim();
    const isMatched = combinedUserSkills.some(userSkill => 
      userSkill === reqLower || 
      userSkill.includes(reqLower) || 
      reqLower.includes(userSkill)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  // Calculate Precision Skill Ratio Score (Weight: 60%)
  const skillRatio = requiredJobSkills.length > 0 
    ? matchedSkills.length / requiredJobSkills.length 
    : 1.0;
  const skillScore = skillRatio * 60;

  // Calculate Precision Cosine Text Similarity Score (Weight: 40%)
  const fullJobText = `${job.title} ${job.description} ${(job.requirements || []).join(' ')}`;
  const cosineSim = calculateCosineSimilarity(resumeText, fullJobText);
  const textScore = Math.min(cosineSim * 1.8, 1.0) * 40; // Normalized scale

  // Compute final precision fit score
  const finalScore = Math.min(100, Math.max(0, Math.round(skillScore + textScore)));

  // Generate dynamic recommendation insights based on real score
  let summary = '';
  let recommendation = '';

  if (finalScore >= 75) {
    summary = `High Match (${finalScore}%)! Your resume contains ${matchedSkills.length} out of ${requiredJobSkills.length} core required skills.`;
    recommendation = `Excellent candidate alignment for ${job.title}. Highlight your work in ${matchedSkills.slice(0, 3).join(', ')}.`;
  } else if (finalScore >= 45) {
    summary = `Moderate Match (${finalScore}%). You match ${matchedSkills.length} required skills, but have ${missingSkills.length} skill gaps.`;
    recommendation = `Reinforce your experience in ${missingSkills.slice(0, 2).join(' & ')} to improve interview callbacks.`;
  } else {
    summary = `Low Alignment (${finalScore}%). Essential skills required by JD are missing from your uploaded resume.`;
    recommendation = `Consider developing expertise in ${missingSkills.slice(0, 3).join(', ')} before applying.`;
  }

  return {
    score: finalScore,
    matchedSkills: matchedSkills.map(capitalize),
    missingSkills: missingSkills.map(capitalize),
    experienceMatch: finalScore >= 50,
    domainScore: Math.round(textScore),
    summary,
    recommendation
  };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
