using System.Text.Json;
using System.Text.RegularExpressions;
using JobPortal.API.Models;

namespace JobPortal.API.Services
{
    public class MatchDiagnosticResult
    {
        public int MatchScore { get; set; }
        public List<string> MatchedSkills { get; set; } = new();
        public List<string> MissingSkills { get; set; } = new();
        public string Summary { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
    }

    // Open/Closed Principle Strategy Interfaces
    public interface ISkillExtractor
    {
        List<string> ExtractSkills(string text);
    }

    public interface ITextSimilarityCalculator
    {
        double CalculateSimilarity(string text1, string text2);
    }

    public interface INlpMatchingEngine
    {
        MatchDiagnosticResult ComputeMatch(string resumeText, List<string> seekerSkills, Job job);
    }

    public class RecognizedTaxonomySkillExtractor : ISkillExtractor
    {
        private static readonly List<string> RecognizedSkills = new()
        {
            "react", "typescript", "javascript", "html", "css", "asp.net", ".net core",
            "c#", "sql", "sql server", "postgresql", "mongodb", "node.js", "python",
            "docker", "kubernetes", "aws", "azure", "rest api", "graphql", "git", "nlp"
        };

        public List<string> ExtractSkills(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return new List<string>();
            var textLower = text.ToLowerInvariant();
            return RecognizedSkills.Where(skill => textLower.Contains(skill)).ToList();
        }
    }

    public class TfIdfCosineSimilarityCalculator : ITextSimilarityCalculator
    {
        private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
            "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will",
            "with", "this", "but", "they", "have", "had", "what", "when", "where", "who"
        };

        public double CalculateSimilarity(string text1, string text2)
        {
            var tokens1 = Tokenize(text1);
            var tokens2 = Tokenize(text2);

            if (tokens1.Count == 0 || tokens2.Count == 0) return 0.0;

            var freq1 = tokens1.GroupBy(t => t).ToDictionary(g => g.Key, g => g.Count());
            var freq2 = tokens2.GroupBy(t => t).ToDictionary(g => g.Key, g => g.Count());

            var allWords = freq1.Keys.Union(freq2.Keys).ToList();

            double dotProduct = 0;
            double norm1 = 0;
            double norm2 = 0;

            foreach (var word in allWords)
            {
                freq1.TryGetValue(word, out int count1);
                freq2.TryGetValue(word, out int count2);

                dotProduct += count1 * count2;
                norm1 += count1 * count1;
                norm2 += count2 * count2;
            }

            if (norm1 == 0 || norm2 == 0) return 0.0;

            return dotProduct / (Math.Sqrt(norm1) * Math.Sqrt(norm2));
        }

        private List<string> Tokenize(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return new List<string>();
            var clean = Regex.Replace(text.ToLowerInvariant(), @"[^a-z0-9\s]", " ");
            return clean.Split(new[] { ' ', '\t', '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                        .Where(w => w.Length > 1 && !StopWords.Contains(w))
                        .ToList();
        }
    }

    public class NlpMatchingEngine : INlpMatchingEngine
    {
        private readonly ISkillExtractor _skillExtractor;
        private readonly ITextSimilarityCalculator _similarityCalculator;

        public NlpMatchingEngine(ISkillExtractor skillExtractor, ITextSimilarityCalculator similarityCalculator)
        {
            _skillExtractor = skillExtractor;
            _similarityCalculator = similarityCalculator;
        }

        public MatchDiagnosticResult ComputeMatch(string resumeText, List<string> seekerSkills, Job job)
        {
            var extractedSkills = _skillExtractor.ExtractSkills(resumeText);
            var combinedUserSkills = seekerSkills
                .Select(s => s.ToLowerInvariant().Trim())
                .Union(extractedSkills)
                .ToHashSet();

            List<string> requiredSkills = new();
            if (!string.IsNullOrEmpty(job.SkillsRequiredJson))
            {
                try
                {
                    requiredSkills = JsonSerializer.Deserialize<List<string>>(job.SkillsRequiredJson) ?? new();
                }
                catch { }
            }

            var matchedSkills = new List<string>();
            var missingSkills = new List<string>();

            foreach (var req in requiredSkills)
            {
                var reqLower = req.ToLowerInvariant().Trim();
                if (combinedUserSkills.Any(u => u.Contains(reqLower) || reqLower.Contains(u)))
                {
                    matchedSkills.Add(req);
                }
                else
                {
                    missingSkills.Add(req);
                }
            }

            double skillRatio = requiredSkills.Count > 0 ? (double)matchedSkills.Count / requiredSkills.Count : 1.0;
            double skillScore = skillRatio * 60.0;

            string fullJobText = $"{job.Title} {job.Description} {job.RequirementsJson}";
            double cosineSimilarity = _similarityCalculator.CalculateSimilarity(resumeText, fullJobText);
            double textScore = Math.Min(cosineSimilarity * 1.5, 1.0) * 40.0;

            int finalScore = Math.Min(100, Math.Max(15, (int)Math.Round(skillScore + textScore)));

            string summary = finalScore >= 75
                ? $"Exceptional match ({finalScore}%)! Candidate exhibits strong alignment with required stack."
                : $"Moderate fit ({finalScore}%). Identified {missingSkills.Count} missing target skills.";

            string recommendation = matchedSkills.Count > 0
                ? $"Recommend interview focused on {string.Join(", ", matchedSkills.Take(3))}."
                : "Consider technical screening to evaluate core competency.";

            return new MatchDiagnosticResult
            {
                MatchScore = finalScore,
                MatchedSkills = matchedSkills,
                MissingSkills = missingSkills,
                Summary = summary,
                Recommendation = recommendation
            };
        }
    }
}
