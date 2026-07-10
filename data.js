// FramingBench headline results.
// Metric: total-variation (TV) distance between the recommendation distribution
// over an unmodified baseline document and over a technique-modified variant,
// aggregated over up to 100 seeds per cell (N=35 for the two flagship arms).
// Higher TV = more ranking disruption. NRG = normalized rank gain, top1 = share
// of cases where the target is placed at rank 1.
// Family = one of the four taxonomy categories (processing, relation, quantity,
// manner), plus `combo` (stacked techniques) and `baseline` (unmodified article).
window.FB_DATA = {
  meta: {
    nCells: 3520,
    domains: 10,
    techniques: 19,
    targets: 2,
    seedsMax: 100
  },
  // Per-model mean TV (susceptibility). N = seeds per cell.
  models: [
    { id: "claude-haiku-4.5",       label: "Claude Haiku 4.5",        provider: "Anthropic", n: 100, tv: 0.382, nrg: 0.209, top1: 0.176 },
    { id: "gpt-5.4",                label: "GPT-5.4",                 provider: "OpenAI",    n: 35,  tv: 0.366, nrg: 0.232, top1: 0.220 },
    { id: "claude-sonnet-4.5",      label: "Claude Sonnet 4.5",       provider: "Anthropic", n: 35,  tv: 0.364, nrg: 0.222, top1: 0.183 },
    { id: "qwen-2.5-7b",            label: "Qwen 2.5 7B",             provider: "Alibaba",   n: 100, tv: 0.317, nrg: 0.220, top1: 0.248 },
    { id: "llama-3.1-70b",          label: "Llama 3.1 70B",           provider: "Meta",      n: 100, tv: 0.292, nrg: 0.228, top1: 0.229 },
    { id: "gpt-5-mini",             label: "GPT-5-mini",              provider: "OpenAI",    n: 100, tv: 0.286, nrg: 0.150, top1: 0.213 },
    { id: "llama-3.1-8b",           label: "Llama 3.1 8B",            provider: "Meta",      n: 100, tv: 0.248, nrg: 0.177, top1: 0.242 }
  ],
  // Per-technique aggregates. `editorial` is reported under TV (ranking
  // instability) only: it was not authored to promote our target product, so
  // NRG / top-1 have no clean interpretation and are left null.
  techniques: [
    { id: "M1_narrative_framing",       label: "M1 Narrative framing",       family: "manner",     tv: 0.655, nrg: 0.752, top1: 0.741 },
    { id: "combo_M1_Q5",                label: "M1 + Q5 combination",         family: "combo",      tv: 0.651, nrg: 0.782, top1: 0.775 },
    { id: "editorial",                  label: "Unmodified article",          family: "baseline",   tv: 0.638, nrg: null,  top1: null  },
    { id: "P3_format",                  label: "P3 Format",                   family: "processing", tv: 0.606, nrg: -0.057,top1: 0.043 },
    { id: "combo_M3_Q5",                label: "M3 + Q5 combination",         family: "combo",      tv: 0.597, nrg: 0.697, top1: 0.670 },
    { id: "M3_criteria_reframing",      label: "M3 Criteria reframing",       family: "manner",     tv: 0.562, nrg: 0.520, top1: 0.459 },
    { id: "P1_position",                label: "P1 Position",                 family: "processing", tv: 0.334, nrg: 0.008, top1: 0.073 },
    { id: "Q1_selective_omission",      label: "Q1 Selective omission",       family: "quantity",   tv: 0.322, nrg: 0.084, top1: 0.060 },
    { id: "Q5_social_proof",            label: "Q5 Social proof",             family: "quantity",   tv: 0.305, nrg: 0.401, top1: 0.344 },
    { id: "M6_anchoring",               label: "M6 Anchoring",                family: "manner",     tv: 0.288, nrg: 0.238, top1: 0.172 },
    { id: "Q4_expert_quotation",        label: "Q4 Expert quotation",         family: "quantity",   tv: 0.252, nrg: 0.237, top1: 0.188 },
    { id: "Q3_citation_addition",       label: "Q3 Citations",                family: "quantity",   tv: 0.229, nrg: 0.189, top1: 0.163 },
    { id: "Q2_statistics_addition",     label: "Q2 Statistics",               family: "quantity",   tv: 0.225, nrg: 0.167, top1: 0.149 },
    { id: "R3_bandwagon",               label: "R3 Bandwagon",                family: "relation",   tv: 0.198, nrg: 0.122, top1: 0.116 },
    { id: "R2_inter_attribute",         label: "R2 Inter-attribute",          family: "relation",   tv: 0.194, nrg: 0.086, top1: 0.089 },
    { id: "M4_weakness_as_strength",    label: "M4 Weakness as strength",     family: "manner",     tv: 0.189, nrg: 0.057, top1: 0.088 },
    { id: "R1_irrelevance_distraction", label: "R1 Irrelevance",              family: "relation",   tv: 0.185, nrg: 0.046, top1: 0.086 },
    { id: "P2_asymmetric_depth",        label: "P2 Asymmetric depth",         family: "processing", tv: 0.183, nrg: 0.083, top1: 0.100 },
    { id: "M7_loss_framing",            label: "M7 Loss framing",             family: "manner",     tv: 0.178, nrg: -0.015,top1: 0.059 },
    { id: "M8_scarcity_urgency",        label: "M8 Scarcity",                 family: "manner",     tv: 0.167, nrg: 0.013, top1: 0.068 },
    { id: "M5_semantic_confusion",      label: "M5 Semantic confusion",       family: "manner",     tv: 0.162, nrg: 0.013, top1: 0.054 },
    { id: "M2_selective_emphasis",      label: "M2 Selective emphasis",       family: "manner",     tv: 0.131, nrg: -0.040,top1: 0.048 }
  ],
  // Per-domain mean TV.
  domains: [
    { id: "food_and_dining",        label: "Food & dining",        tv: 0.383 },
    { id: "travel_and_hospitality", label: "Travel & hospitality", tv: 0.373 },
    { id: "home_services",          label: "Home services",        tv: 0.364 },
    { id: "consumer_electronics",   label: "Consumer electronics", tv: 0.359 },
    { id: "software_and_saas",      label: "Software & SaaS",      tv: 0.324 },
    { id: "health_and_wellness",    label: "Health & wellness",    tv: 0.324 },
    { id: "automotive",             label: "Automotive",           tv: 0.308 },
    { id: "legal_services",         label: "Legal services",       tv: 0.304 },
    { id: "insurance",              label: "Insurance",            tv: 0.247 },
    { id: "personal_finance",       label: "Personal finance",     tv: 0.162 }
  ]
};
