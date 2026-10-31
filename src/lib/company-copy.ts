import type { CompanyPage } from './content-types'
export const companyCopy: Record<string, Partial<CompanyPage>> = {
  about: {
    principlesHeading: 'What guides our work',
    principles: [
      'Measure before promising.',
      'Design for real behaviour.',
      'Respect the whole system.',
      'Use technology where it helps.',
      'Learn openly.',
      'Connect segregation to recovery.',
    ].map((text) => ({ text })),
    teamHeading: 'The people behind Revalue',
    teamIntroduction:
      'Revalue brings software, hardware and environmental engineering together around a practical question: what can separated materials become?',
    people: [
      { name: 'Patience Sitati', role: 'Co-founder, software and business', initials: 'PS' },
      { name: 'Daisy Nyaburu', role: 'Hardware Lead', initials: 'DN' },
    ],
    sections: [
      {
        title: 'Our work so far',
        text: 'We have a working sorting prototype and are preparing a field pilot. Our project pages document the approach, limitations and next questions.',
      },
    ],
  },
  partners: {
    audiences: [
      'BSF farms and composters',
      'Plastic recyclers',
      'Paper buyers',
      'Scrap and metal buyers',
      'Collectors',
      'Women- and youth-led enterprises',
    ].map((text) => ({ text })),
    sections: [
      {
        title: 'Who we want to hear from',
        text: 'Separated material only has value if someone can use it.',
      },
      {
        title: 'What helps us',
        text: 'Materials you accept. Quality limits. Minimum quantities. Who handles transport. What you pay.',
      },
    ],
  },
  pricing: {
    pricingRows: [
      'Waste assessment',
      'Waste improvement work',
      'Reporting or monitoring',
      'Technology or equipment',
      'Custom work',
    ].map((offering, i) => ({
      offering,
      factors:
        i === 0
          ? 'Site size, number of waste streams, depth of assessment, travel and reporting needs.'
          : 'Tell us what you need so we can discuss scope.',
    })),
  },
  contact: {
    sections: [
      {
        title: 'A useful first message',
        text: 'Tell us about your organisation, the materials involved and what you would like to understand.',
      },
      {
        title: 'For recovery partners',
        text: 'Recovery partners can include accepted materials, quality limits, quantities and transport arrangements.',
      },
    ],
  },
}
