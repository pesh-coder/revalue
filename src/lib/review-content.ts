import { paragraphs, type Catalog } from './content-types'

// Explicit local review data. No operational claims or extra article titles are fabricated.
export const reviewCatalog: Catalog = {
  articles: [
    {
      slug: 'what-is-a-waste-audit',
      title: 'What is a waste audit?',
      excerpt: 'A waste audit is a planned look at what a site throws away.',
      topic: 'Waste audits',
      topicSlug: 'waste-audits',
      author: 'Patience Sitati',
      publishedAt: '2026-10-30',
      image: '/images/stock-bins-three.jpg',
      imageAlt: 'Waste bins arranged for separating materials.',
      imageCaption:
        'Illustrative photograph. This review image will be replaced with approved field photography.',
      format: 'Blog',
      body: paragraphs([
        'A waste audit is a planned look at what a site throws away. You weigh or estimate each type of waste, note how much is mixed, and follow where it goes after collection.',
        'It starts with a simple question: what happens to your waste from the moment it is created until it leaves the site? Then you agree the boundaries, choose the dates, and brief the people who handle waste every day. They usually know where the process breaks down.',
        'A useful audit gives you a baseline: what you generate, what it costs, and which materials might have somewhere better to go. It does not tell you that every material has a buyer. That needs checking separately.',
        'Do not handle clinical or hazardous waste without the right controls.',
      ]),
    },
  ],
  projects: [
    {
      slug: 'smart-segregation-prototype',
      title: 'Smart segregation prototype',
      excerpt:
        'A prototype bin that uses a camera and sensors to sort waste into separate compartments.',
      status: 'Testing',
      image: '/images/prototype-bin.jpg',
      sections: [
        {
          title: 'Project overview',
          text: 'A prototype bin that uses a camera and sensors to sort waste into separate compartments.',
        },
        {
          title: 'The problem',
          text: 'Mixed waste loses value. We wanted to test whether sorting at the bin could keep materials separate with less effort.',
        },
        {
          title: 'Our approach',
          text: 'A camera and classifier on a Raspberry Pi work with an Arduino, which reads the sensors and turns a sorting disc.',
        },
        {
          title: 'Work completed',
          text: 'Built a working prototype. It sorts into three compartments: metal, organic and plastic. Software logs each sorting event to a small dashboard.',
        },
        {
          title: 'Evidence and results',
          text: 'Testing is under way. Performance figures will be published once the team has confirmed the test method and results.',
        },
        {
          title: 'What we learned',
          text: 'Sorting alone does not change why materials get mixed. The next questions are about people, collection and buyers, not just the machine.',
        },
        {
          title: 'Next steps',
          text: 'No field pilot yet. No paper compartment yet. No load cell to weigh materials yet.',
        },
      ],
    },
  ],
  solutions: [
    {
      slug: 'waste-discovery-review',
      title: 'Waste Discovery Review',
      excerpt:
        'A bounded visit to map your waste, see how it is separated, and give you a short action plan.',
      availability: 'In development',
      audience:
        'Hotels, schools, offices and other sites in Greater Kampala that want a clear picture of their waste.',
      sections: [
        {
          title: 'What we would do',
          text: 'Walk the process with your team. Identify the main waste streams. Observe separation and contamination. Record collection arrangements and costs where available. Give you a short action plan.',
        },
        {
          title: 'What we will not do',
          text: 'We will not guarantee savings or recovery before we have measured anything. If a recovery partner is not confirmed, we will say so.',
        },
        {
          title: 'What affects the cost',
          text: 'Site size, number of waste streams, depth of assessment, travel and reporting needs.',
        },
      ],
    },
    {
      slug: 'segregation-systems',
      title: 'Segregation systems',
      excerpt: 'Practical ways to keep materials separate where waste is created.',
      availability: 'In development',
      audience: 'Organisations working to separate materials where waste is created.',
      sections: [
        {
          title: 'Our focus',
          text: 'Practical ways to keep materials separate where waste is created.',
        },
        {
          title: 'Developed around your site',
          text: 'Tell us how materials are handled today so we can explore an appropriate first step together.',
        },
      ],
    },
    {
      slug: 'technology-and-monitoring',
      title: 'Technology and monitoring',
      excerpt: 'A smart bin prototype and reporting tools, tested before they are offered.',
      availability: 'In development',
      audience: 'Organisations interested in testing how technology can support waste separation.',
      sections: [
        {
          title: 'Current work',
          text: 'A smart bin prototype and reporting tools, tested before they are offered.',
        },
        {
          title: 'Explore the prototype',
          text: 'The prototype is being tested as we prepare for a field pilot.',
        },
      ],
    },
    {
      slug: 'resource-recovery',
      title: 'Resource recovery',
      excerpt: 'Finding credible next steps for separated materials.',
      availability: 'Exploring',
      audience:
        'Organisations and recovery businesses exploring what separated materials could become.',
      sections: [
        { title: 'Our focus', text: 'Finding credible next steps for separated materials.' },
        {
          title: 'What we need to learn',
          text: 'Materials you accept. Quality limits. Minimum quantities. Who handles transport. What you pay.',
        },
      ],
    },
    {
      slug: 'institutional-waste-management',
      title: 'Institutional waste management',
      excerpt: 'Support for sites that need a working routine, not just new bins.',
      availability: 'Exploring',
      audience: 'Hotels, schools, offices and other sites in Greater Kampala.',
      sections: [
        {
          title: 'Our focus',
          text: 'Support for sites that need a working routine, not just new bins.',
        },
        {
          title: 'Start a conversation',
          text: 'Tell us what is happening with your waste, or what you can do with separated material.',
        },
      ],
    },
  ],
  topics: [
    {
      slug: 'waste-audits',
      title: 'Waste audits and data',
      introduction: 'How to measure what you throw away, and what to do with the result.',
    },
  ],
  tools: [
    {
      slug: 'waste-audit-toolkit',
      title: 'Waste audit toolkit',
      excerpt:
        'A spreadsheet and field guide for recording what a site generates, how it is handled and what it costs.',
      audience: 'Site and facility teams',
      format: 'Excel workbook',
      approved: false,
      instructions: [
        'Agree which site, waste streams and dates the audit will cover.',
        'Brief the people who handle waste and follow the site safety rules.',
        'Record materials, quantities, handling arrangements and costs consistently.',
        'Review the findings with the team before choosing next steps.',
      ],
    },
  ],
  pages: [
    {
      slug: 'about',
      title: 'Why Revalue exists',
      introduction:
        'Most waste is mixed long before anyone asks what it could become. We want to make the next useful step clearer, without promising value that has not been shown.',
    },
    {
      slug: 'partners',
      title: 'Work with us',
      introduction:
        'Separated material only has value if someone can use it. We want to learn what you need.',
    },
    {
      slug: 'pricing',
      title: 'How pricing works',
      introduction:
        'We do not publish fixed prices yet, because we are still testing what each service involves.',
    },
    {
      slug: 'contact',
      title: 'Talk to us',
      introduction:
        'Tell us what is happening with your waste, or what you can do with separated material. We read every message.',
    },
    {
      slug: 'terms',
      title: 'Terms',
      introduction: '',
      body: paragraphs([
        'This website is operated by Simuverse Limited, Kampala, Uganda. Content is for general information and is not professional, legal or safety advice. Status labels show our position on the date shown and may change. Tools are provided as they are, so check they suit your site before relying on them. Articles remain our work unless stated otherwise. These terms are governed by the laws of Uganda.',
      ]),
    },
    {
      slug: 'privacy',
      title: 'Privacy',
      introduction: '',
      body: paragraphs([
        'What we collect: your name, organisation, email, phone number if you give it, the subject you choose and your message.',
        'Why: to reply to you. Where: in our website system and our team email when enquiry delivery is enabled. How long: proposed retention is 24 months, subject to policy review.',
        'Who sees it: the Revalue team and the service providers that run the website and email. We do not sell it.',
        'Your rights: ask us to see, correct or delete your data. Questions or complaints: contact us, or the Personal Data Protection Office of Uganda.',
        'This local review uses sample content. Analytics and live enquiry delivery are not enabled. The final privacy policy will reflect the actual providers and data-handling configuration before public release.',
      ]),
    },
  ],
}
