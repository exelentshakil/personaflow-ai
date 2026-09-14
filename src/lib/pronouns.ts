import { CustomerProfile, PronounChoice, PronounGrammar } from "./types";

export function resolvePronounGrammar(
  choice: PronounChoice,
  custom?: { subject?: string; object?: string; possessive?: string }
): PronounGrammar {
  switch (choice) {
    case "she/her":
      return {
        subject: "she",
        subjectCap: "She",
        object: "her",
        possessive: "her",
        possessivePronoun: "hers",
        reflexive: "herself",
        verbIs: "is",
        verbHas: "has",
        verbDoes: "does",
        verbGrammarAgree: (plural, singular) => singular,
      };
    case "he/him":
      return {
        subject: "he",
        subjectCap: "He",
        object: "him",
        possessive: "his",
        possessivePronoun: "his",
        reflexive: "himself",
        verbIs: "is",
        verbHas: "has",
        verbDoes: "does",
        verbGrammarAgree: (plural, singular) => singular,
      };
    case "custom": {
      const sub = (custom?.subject || "they").toLowerCase().trim();
      const obj = (custom?.object || "them").toLowerCase().trim();
      const pos = (custom?.possessive || "their").toLowerCase().trim();
      const isPlural = sub === "they" || sub === "ze" || sub === "ey";
      return {
        subject: sub,
        subjectCap: sub.charAt(0).toUpperCase() + sub.slice(1),
        object: obj,
        possessive: pos,
        possessivePronoun: pos.endsWith("s") ? pos : `${pos}s`,
        reflexive: `${obj}self`,
        verbIs: isPlural ? "are" : "is",
        verbHas: isPlural ? "have" : "has",
        verbDoes: isPlural ? "do" : "does",
        verbGrammarAgree: (plural, singular) => (isPlural ? plural : singular),
      };
    }
    case "they/them":
    default:
      return {
        subject: "they",
        subjectCap: "They",
        object: "them",
        possessive: "their",
        possessivePronoun: "theirs",
        reflexive: "themselves",
        verbIs: "are",
        verbHas: "have",
        verbDoes: "do",
        verbGrammarAgree: (plural, singular) => plural,
      };
  }
}

export function interpolateTemplate(
  template: string,
  profile: CustomerProfile
): string {
  const grammar = resolvePronounGrammar(profile.pronouns, {
    subject: profile.customPronounSubject,
    object: profile.customPronounObject,
    possessive: profile.customPronounPossessive,
  });

  const firstName = profile.fullName.trim().split(" ")[0] || "Client";
  const goalsStr = profile.primaryGoals.length > 0 ? profile.primaryGoals.join(", ") : "Holistic growth and optimization";
  const focusAreasStr = profile.lifestyleFactors.focusAreas.length > 0 ? profile.lifestyleFactors.focusAreas.join(", ") : "Standard health & wellness";

  const replacements: Record<string, string> = {
    "{{name}}": profile.fullName,
    "{{first_name}}": firstName,
    "{{pronouns.subject}}": grammar.subject,
    "{{pronouns.Subject}}": grammar.subjectCap,
    "{{pronouns.object}}": grammar.object,
    "{{pronouns.possessive}}": grammar.possessive,
    "{{pronouns.Possessive}}": grammar.possessive.charAt(0).toUpperCase() + grammar.possessive.slice(1),
    "{{pronouns.possessive_pronoun}}": grammar.possessivePronoun,
    "{{pronouns.reflexive}}": grammar.reflexive,
    "{{pronouns.is_are}}": grammar.verbIs,
    "{{pronouns.has_have}}": grammar.verbHas,
    "{{pronouns.does_do}}": grammar.verbDoes,
    "{{category}}": profile.selectedCategory,
    "{{goals}}": goalsStr,
    "{{focus_areas}}": focusAreasStr,
    "{{commitment_hrs}}": `${profile.lifestyleFactors.weeklyCommitmentHrs} hrs/week`,
    "{{budget_tier}}": profile.lifestyleFactors.budgetTier,
    "{{experience_level}}": profile.experienceLevel,
    "{{tone}}": profile.tonePreference,
  };

  let result = template;
  for (const [key, val] of Object.entries(replacements)) {
    result = result.replaceAll(key, val);
  }

  return result;
}

export function getCategoryBadgeColor(category: string): string {
  switch (category.toLowerCase()) {
    case "wellness-longevity":
    case "wellness":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "financial-blueprint":
    case "finance":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
    case "executive-career":
    case "career":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
    case "life-strategy":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
  }
}
