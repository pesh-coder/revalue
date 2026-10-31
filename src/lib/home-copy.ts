export const defaultHomeCopy = {
  heroTitle: 'Waste has value.',
  heroText:
    'Revalue helps organisations see what they throw away, separate it better, and find out what can be recovered.',
  heroAction: 'Talk to us about your waste',
  heroSecondary: 'Read how we work',
  latestHeading: 'Latest from Revalue',
  emptyHeading: 'Explore Revalue',
  articlesLabel: 'All articles',
  focusLabel: 'Our focus',
  focusTitle: 'Keeping value in circulation.',
  focusText:
    'We focus on how waste is understood, separated and connected to recovery opportunities in Uganda.',
  focusLink: 'Explore our work',
  audienceHeading: 'Where to start',
  audiences: [
    {
      title: 'For organisations',
      description: 'Understand your waste and agree a first step.',
      href: '/solutions',
    },
    {
      title: 'For recovery partners',
      description: 'Tell us what you can accept, and on what terms.',
      href: '/partners',
    },
    {
      title: 'For funders and researchers',
      description: 'See our methods and progress.',
      href: '/projects',
    },
  ],
  howHeading: 'How we work',
  steps: [
    { text: 'Look at what happens today.' },
    { text: 'Measure before promising.' },
    { text: 'Connect separated material to a real next step.' },
  ],
  contactHeading: 'Have a waste problem you want to understand?',
  contactLabel: 'Talk to us',
  projectLabel: 'Featured project',
  projectLink: 'Read the project',
  projectStage: 'The prototype is being tested as we prepare for a field pilot.',
}
export type HomeCopy = typeof defaultHomeCopy
