export class NlpService {
  static computeNlpMatch(resumeText, seekerSkills, job) {
    const recognizedSkills = [
      'react', 'typescript', 'javascript', 'html', 'css', 'asp.net', '.net core',
      'c#', 'sql', 'sql server', 'postgresql', 'mongodb', 'node.js', 'python',
      'docker', 'kubernetes', 'aws', 'azure', 'rest api', 'graphql', 'git', 'nlp'
    ];
    
    const textLower = (resumeText || '').toLowerCase();
    const extracted = recognizedSkills.filter(s => textLower.includes(s));
    const combined = Array.from(new Set([...(seekerSkills || []).map(s => s.toLowerCase()), ...extracted]));

    const reqSkills = job.skillsRequired || [];
    const matched = [];
    const missing = [];

    reqSkills.forEach(req => {
      const rLower = req.toLowerCase();
      if (combined.some(u => u === rLower || u.includes(rLower) || rLower.includes(u))) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const skillRatio = reqSkills.length > 0 ? matched.length / reqSkills.length : 1;
    const score = Math.min(100, Math.max(20, Math.round(skillRatio * 100)));

    return {
      matchScore: score,
      matchedSkills: matched,
      missingSkills: missing,
      aiAnalysis: `Calculated ${score}% match fit. Matched ${matched.length} out of ${reqSkills.length} required skills.`
    };
  }
}
