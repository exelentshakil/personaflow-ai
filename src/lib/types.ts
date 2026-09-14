export type PronounChoice = 'they/them' | 'she/her' | 'he/him' | 'custom';

export interface PronounGrammar {
  subject: string; // they / she / he
  subjectCap: string; // They / She / He
  object: string; // them / her / him
  possessive: string; // their / her / his
  possessivePronoun: string; // theirs / hers / his
  reflexive: string; // themselves / herself / himself
  verbIs: string; // are / is
  verbHas: string; // have / has
  verbDoes: string; // do / does
  verbGrammarAgree: (verbPlural: string, verbSingular: string) => string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pronouns: PronounChoice;
  customPronounSubject?: string;
  customPronounObject?: string;
  customPronounPossessive?: string;
  selectedCategory: string;
  primaryGoals: string[];
  lifestyleFactors: {
    weeklyCommitmentHrs: number;
    focusAreas: string[];
    budgetTier: 'Starter' | 'Core' | 'Executive';
    primaryMotivation: string;
  };
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  tonePreference: 'empathetic-supportive' | 'direct-analytical' | 'inspirational-visionary' | 'action-oriented';
  predefinedPromptId: string;
  endpointTarget: 'internal-orchestrator' | 'client-custom-api' | 'dual-llm-fallback';
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    newsletter: boolean;
  };
  twoFactorEnabled: boolean;
}

export interface ReportInsight {
  title: string;
  score: number;
  description: string;
  actionItem: string;
  statusBadge: 'OPTIMAL' | 'PRIORITY' | 'ATTENTION';
}

export interface RoadmapMilestone {
  phase: string;
  timeline: string;
  milestone: string;
  deliverables: string[];
}

export interface PersonalizedReport {
  id: string;
  reportCode: string;
  title: string;
  generatedAt: string;
  customerName: string;
  pronounTag: string;
  summary: string;
  coreInsights: ReportInsight[];
  personalizedRoadmap: RoadmapMilestone[];
  riskMitigation: { risk: string; mitigation: string }[];
  disclaimer: string;
  providerTelemetry: {
    provider: string;
    model: string;
    latencyMs: number;
    tokens: { input: number; output: number };
    timestamp: string;
    cached: boolean;
  };
}

export interface CmsProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  billingInterval: 'one-time' | 'monthly' | 'quarterly' | 'annual';
  status: 'active' | 'draft' | 'archived';
  description: string;
  features: string[];
  associatedPromptId: string;
  badge?: string;
}

export interface PredefinedPrompt {
  id: string;
  title: string;
  category: string;
  description: string;
  systemDirective: string;
  userTemplate: string;
  variables: string[];
  activeModel: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  validUntil: string;
  maxRedemptions: number;
  timesRedeemed: number;
  status: 'active' | 'expired';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: string;
  latencyMs?: number;
}
