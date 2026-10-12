/**
 * Site data — the hand-curated personal content.
 *
 * Kept as typed data rather than markdown because publications are structured
 * (authors, venue, links, images) and get rendered consistently. Edit this file
 * to update the CV.
 */

export interface Link {
  label: string;
  href: string;
}

export interface Publication {
  title: string;
  /** Canonical paper link (arXiv or DOI). */
  href?: string;
  authors: string;
  /** Rendered with the author's own name bolded automatically. */
  venue: string;
  /** Thumbnail; a second entry makes it a hover swap. */
  images: string[];
  links: Link[];
  blurb: string;
}

export const site = {
  name: 'Di Qiu',
  role: 'Research Engineer, Google AR',
  bio: 'Research engineer in Google AR, working on 3D reconstruction and generative AI for AR/VR. PhD from The Chinese University of Hong Kong; previously a research intern at Google and SenseTime Research.',
  email: 'sylvesterqiu@gmail.com',
  avatar: 'images/profile2.png',
  links: [
    { label: 'Email', href: 'mailto:sylvesterqiu@gmail.com' },
    { label: 'Google Scholar', href: 'https://scholar.google.com.hk/citations?user=ZYVfX7UAAAAJ&hl' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/syl-di-qiu-99460467/' },
    { label: 'GitHub', href: 'https://github.com/sylqiu' },
  ] as Link[],
  /** Shown on the home page and in the footer. */
  blogArchive: 'https://sylqiu.blogspot.com/',
};

/**
 * The umbrella name for the interactive courses section. Deliberately not tied
 * to one subject, so new topics can join without a rename.
 */
export const exploreFlow = {
  name: 'ExploreFlow',
  tagline: 'Interactive courses — visual, explorable, and steppable line by line.',
  blurb:
    'Each course pairs prose with live demos you can drag and step through, ' +
    'narrated beat by beat. No video: everything runs in the page.',
};

/** A dated one-liner (education, activity, teaching). */
export interface CvEntry {
  dates: string;
  what: string;
  where: string;
  note?: string;
}

/** One employer, with any number of roles held there. */
export interface CvOrg {
  org: string;
  place: string;
  roles: { title: string; dates: string; note?: string }[];
}

/** Structured Curriculum Vitae content, from CV.pdf. */
export const cv = {
  education: [
    {
      dates: '2016 - 2021',
      what: 'Doctor of Philosophy in Applied Mathematics',
      where: 'The Chinese University of Hong Kong · Sha Tin, Hong Kong',
      note: 'Computational geometry and data-driven methods in low-level vision and graphics. Advisor: Prof. Lok Ming Lui.',
    },
    {
      dates: '2012 - 2016',
      what: 'Bachelor of Science in Mathematics (First Honor)',
      where: 'The University of Hong Kong · Hong Kong',
      note: "HK Government Scholarship; HKU Foundation Scholarships for Outstanding Mainland Students; C.V. Starr Scholarship; 2013 Dean's List.",
    },
    {
      dates: 'Fall 2014',
      what: 'Exchange Student in Mathematics and Philosophy',
      where: 'University of California, Los Angeles · CA, USA',
      note: '',
    },
    {
      dates: 'Summer 2013',
      what: 'Exchange Student in Japanese Language',
      where: 'Ritsumeikan University · Kyoto, Japan',
      note: '',
    },
    {
      dates: '2009 - 2012',
      what: 'Pre-university secondary education',
      where: 'The High School Affiliated to Yunnan Normal University · Kunming, China',
      note: 'Bronze medal, national biology olympiad; first prize, provincial physics olympiad; second prize, provincial mathematics olympiad.',
    },
  ] as CvEntry[],
  experience: [
    {
      org: 'Google',
      place: 'Canada',
      roles: [
        {
          title: 'Software Developer',
          dates: 'Apr 2022 - present',
          note: 'Syntec team, working on 3D reconstruction and generative AI for AR/VR.',
        },
        { title: 'Student Researcher (remote)', dates: 'Jan 2021 - Sep 2021' },
        {
          title: 'Research Intern (remote)',
          dates: 'Sep 2020 - Dec 2020',
          note: 'Data-generation team, reporting to Dr. Sergio Orts Escolano; multi-view depth estimation for human digitization and performance capture for AR.',
        },
      ],
    },
    {
      org: 'SenseTime Research',
      place: 'Hong Kong',
      roles: [
        {
          title: 'Research Intern · Intern Star award',
          dates: 'Jul 2018 - Aug 2019',
          note: 'Computational photography division, reporting to Dr. Jiahao Pang and Dr. Wenxiu Sun. Depth refinement for Time-of-Flight sensors (ICCV 2019 paper); awarded Intern Star for the synthetic data-generation pipeline; proposed the ToF relighting project.',
        },
      ],
    },
    {
      org: 'Department of Computer Science, The University of Hong Kong',
      place: 'Hong Kong',
      roles: [
        {
          title: 'Research Assistant',
          dates: 'Jul 2015 - Sep 2015',
          note: 'With Prof. Kwok-Ping Chan: graphical models and an exemplar-based Bayesian network for facial-expression recognition from key-points; helped collect a facial-expression dataset.',
        },
      ],
    },
    {
      org: 'Department of Mathematics, The University of Hong Kong',
      place: 'Hong Kong',
      roles: [
        {
          title: 'Research Assistant',
          dates: 'Jul 2015 - Sep 2015',
          note: 'With Dr. James Fullwood: Riemannian geometry.',
        },
      ],
    },
  ] as CvOrg[],
  activities: [
    { dates: '2021', what: 'Poster — Modal uncertainty estimation for medical image based diagnosis', where: 'MICCAI UNSURE workshop · Online' },
    { dates: '2020', what: 'Poster — Towards Geometry Guided Neural Relighting with Flash Photography', where: 'International Conference on 3D Vision · Online' },
    { dates: '2019', what: 'Poster — Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules', where: 'International Conference on Computer Vision · Seoul, Korea' },
    { dates: '2019', what: 'Poster — Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules', where: 'Hong Kong Computer Vision Workshop · CUHK' },
    { dates: '2018', what: 'Talk — Parametrizing flat-foldable surfaces with incomplete data', where: 'SIAM Conference on Imaging Science · Bologna, Italy' },
    { dates: '2018', what: 'Talk — A conformal geometry approach to surface folding', where: 'Annual Meeting of Hong Kong Mathematical Society · City University of Hong Kong' },
    { dates: '2016', what: 'Participant — Berlin Mathematical School Summer School on Imaging', where: 'Berlin, Germany' },
    { dates: '2016', what: 'Participant — Grenoble Summer School on Geometric Analysis', where: 'Grenoble, France' },
  ] as CvEntry[],
  services: [
    'Social chair, SIAM student chapter of CUHK (2018): organizing weekly gatherings and seminars.',
    'Reviewer, Pattern Recognition Letters.',
    'Reviewer, MICCAI UNSURE workshop.',
  ],
  teaching: [
    { dates: 'Spring 2020', what: 'CUHK MATH 2530 — Advanced Calculus for Physics and Engineering', where: 'The Chinese University of Hong Kong' },
    { dates: 'Spring 2020', what: 'CUHK MMAT 5240 — Optimization and Modelling', where: 'The Chinese University of Hong Kong' },
    { dates: 'Spring 2018', what: 'CUHK MATH 3310 — Computational Mathematics', where: 'The Chinese University of Hong Kong' },
    { dates: 'Fall 2017', what: 'CUHK MATH 3360 — Mathematical Image Processing', where: 'The Chinese University of Hong Kong' },
    { dates: 'Spring 2017', what: 'CUHK MATH 1010 — University Mathematics', where: 'The Chinese University of Hong Kong' },
    { dates: 'Fall 2016', what: 'CUHK MATH 1510 — Mathematics for Engineers', where: 'The Chinese University of Hong Kong' },
  ] as CvEntry[],
  skills: [
    { label: 'Programming', value: 'Python (proficient); C++, JavaScript, Java (familiar).' },
    { label: 'Frameworks', value: 'Django, React, Redux.' },
    { label: 'Software', value: 'Blender, MATLAB.' },
    { label: 'Languages', value: 'Mandarin, Cantonese, English; German (intermediate), Japanese (intermediate).' },
  ],
  interests: [
    'Knowledge exposition — I keep a personal blog for intuitive write-ups of interesting algorithms and theories.',
    'Charity volunteering — Ghana (toilette hygiene promotion, Jun 2015); Nepal (earthquake relief, Jan 2016).',
  ],
};

export const publications: Publication[] = [
  {
    title: 'GNM Head: A Generative aNthropometric Model of the Human Head',
    href: 'https://arxiv.org/abs/2607.23687',
    authors:
      'Stylianos Ploumpis, Jan Bednarik, Gaspard Zoss, Ruslan Guseinov, Luca Prasso, Prashanth Chandran, Oliver Boyne, Vasileios Choutas, Timo Bolkart, Daoye Wang, Menglei Chai, Di Qiu, Sebastian Winberg, Gilles Rainer, Lewis Bridgeman, Leonhard Helminger, Edo Collins, Delio Vicini, Jérémy Riviere, Yannick Boetzel, Alexander Koumis, Stylianos Moschoglou, Jay Busch, Cynthia Herrera, Jacob Still, Scott Ysebert, Peter Lincoln, Sergio Orts Escolano, Christoph Rhemann, Erroll Wood, Thabo Beeler, Stefanos Zafeiriou',
    venue: 'arXiv preprint, 2026',
    images: [],
    links: [],
    blurb:
      'A publicly released parametric model of the human head - face, neck, eyeballs, teeth and tongue - for animation, rendering, and as conditioning for generative models.',
  },
  {
    title: 'Concurrent Image Understanding and Generation: Self-Correcting Coupled Markov Jump Processes',
    href: 'https://arxiv.org/abs/2607.13188',
    authors:
      'Minh-Quan Le, Armand Comas, Alexandros Lattas, Stylianos Moschoglou, Pedro Vélez, Amit Raj, Aaron Germuth, Thabo Beeler, Dimitris Samaras, Di Qiu',
    venue: 'arXiv preprint, 2026',
    images: [],
    links: [],
    blurb:
      "Joint multimodal sampling where each modality's transition rates follow the other's confidence, with a remasking jump that retracts cross-modal contradictions.",
  },
  {
    title: 'MagicMirror: Fast and High-Quality Avatar Generation with a Constrained Search Space',
    href: 'https://arxiv.org/abs/2404.01296',
    authors:
      'Armand Comas-Massagué, Di Qiu, Menglei Chai, Marcel Bühler, Amit Raj, Ruiqi Gao, Qiangeng Xu, Mark Matthews, Paulo Gotardo, Octavia Camps, Sergio Orts-Escolano, Thabo Beeler',
    venue: 'ECCV, 2024',
    images: [],
    links: [],
    blurb: 'Text-guided avatar generation and editing, using a parametric NeRF with a constrained search space for fast, high-quality results.',
  },
  {
    title: 'Loc3Diff: Local Diffusion for 3D Human Head Synthesis and Editing',
    href: 'https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/08166.pdf',
    authors:
      'Yushi Lan, Feitong Tan, Qiangeng Xu, Di Qiu, Kyle Genova, Zeng Huang, Sean Fanello, Rohit Pandey, Thomas Funkhouser, Chen Change Loy, Yinda Zhang',
    venue: 'ECCV, 2024',
    images: [],
    links: [],
    blurb:
      'Generates photorealistic 3D heads by diffusing UV-anchored local tri-planes, giving semantic-aligned local control for head synthesis and editing.',
  },
  {
    title: 'CHOSEN: Contrastive Hypothesis Selection for Multi-View Depth Refinement',
    href: 'https://arxiv.org/abs/2404.02225',
    authors:
      'Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano',
    venue: 'arXiv preprint, 2024',
    images: [],
    links: [],
    blurb:
      'Iteratively re-samples and selects the best depth hypotheses with contrastive learning; drops into any multi-view stereo pipeline.',
  },
  {
    title: 'MonoAvatar: Learning Personalized High Quality Volumetric Head Avatars from Monocular RGB Videos',
    href: 'https://arxiv.org/abs/2304.01436',
    authors:
      'Ziqian Bai, Feitong Tan, Zeng Huang, Kripasindhu Sarkar, Danhang Tang, Di Qiu, Abhimitra Meka, Ruofei Du, Mingsong Dou, Sergio Orts-Escolano, Rohit Pandey, Ping Tan, Thabo Beeler, Sean Fanello, Yinda Zhang',
    venue: 'CVPR, 2023',
    images: ['images/pub/mono_avatar/mono_avatar.gif'],
    links: [{ label: 'project', href: 'https://augmentedperception.github.io/monoavatar' }],
    blurb: 'Builds an animatable 3D head avatar from monocular video, using a parametric head model equipped with learnable features.',
  },
  {
    title: 'Modal Uncertainty Estimation via Discrete Latent Representation',
    href: 'https://arxiv.org/abs/2007.12858',
    authors: 'Di Qiu, Lok Ming Lui',
    venue: 'MICCAI UNSURE workshop, 2021',
    images: ['images/pub/modal_uncertainty/1.png'],
    links: [{ label: 'code', href: 'https://github.com/sylqiu/MUE' }],
    blurb: 'Estimates the modal uncertainty of one-to-many mappings with a conditional variational auto-encoding framework over discrete latent modes.',
  },
  {
    title: 'Guided Collaborative Training for Pixel-wise Semi-Supervised Learning',
    href: 'https://arxiv.org/abs/2008.05258',
    authors: 'Zhanghan Ke, Di Qiu, Kaican Li, Qiong Yan, Rynson W. H. Lau',
    venue: 'ECCV, 2020',
    images: [],
    links: [],
    blurb: 'An ensemble of networks that learn from each other through a flaw-detection module; state-of-the-art pixel-wise semi-supervised segmentation, denoising and enhancement.',
  },
  {
    title: 'Towards Geometry Guided Neural Relighting with Flash Photography',
    authors: 'Di Qiu, Jin Zeng, Zhanghan Ke, Wenxiu Sun, Chengxi Yang',
    venue: '3DV, 2020',
    images: ['images/pub/relight/1.png', 'images/pub/relight/2.png'],
    links: [],
    blurb: 'Directional relighting from a single co-located flash image and its depth map.',
  },
  {
    title: 'Inconsistent Surface Registration via Optimization of Mapping Distortions',
    href: 'https://arxiv.org/abs/1908.09098',
    authors: 'Di Qiu, Lok Ming Lui',
    venue: 'Journal of Scientific Computing, 2020',
    images: ['images/pub/incon_shape/1.png', 'images/pub/incon_shape/2.png'],
    links: [{ label: 'code', href: 'https://github.com/sylqiu/incon_reg' }],
    blurb: 'Simultaneously finding the domain of correspondence and the registration by optimizing distortions in the mapping differential.',
  },
  {
    title: 'Adapting Object Detectors with Conditional Domain Normalization',
    href: 'https://arxiv.org/abs/2003.07071',
    authors: 'Peng Su, Kun Wang, Xingyu Zeng, Shixiang Tang, Dapeng Chen, Di Qiu, Xiaogang Wang',
    venue: 'ECCV, 2020',
    images: [],
    links: [],
    blurb: 'Aligns mini-batch feature statistics across domains for domain adaptation in object detection and segmentation.',
  },
  {
    title: 'Shape Analysis via Inconsistent Surface Registration',
    href: 'https://arxiv.org/abs/2003.01357',
    authors: 'Gary P. T. Choi, Di Qiu, Lok Ming Lui',
    venue: 'Proceedings of the Royal Society A, 2020',
    images: [],
    links: [],
    blurb: 'Inconsistent surface registration applied to shape analysis in tooth morphology.',
  },
  {
    title: 'Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules',
    href: 'http://arxiv.org/abs/1909.07623',
    authors: 'Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun',
    venue: 'ICCV, 2019 · Best Poster Award, HK Computer Vision Workshop',
    images: ['images/pub/tof_align_refine/1.png', 'images/pub/tof_align_refine/2.png'],
    links: [{ label: 'code & dataset', href: 'https://github.com/sylqiu/tof_rgbd_processing' }],
    blurb: 'Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning, with a physically accurate synthetic dataset.',
  },
  {
    title: 'Computing Quasiconformal Folds',
    href: 'https://arxiv.org/abs/1804.03936',
    authors: 'Di Qiu, Ka Chun Lam, Lok Ming Lui',
    venue: 'SIAM Journal on Imaging Sciences, 2019',
    images: ['images/pub/fold_map/1.png', 'images/pub/fold_map/2.png'],
    links: [{ label: 'code', href: 'https://github.com/sylqiu/Least-square-beltrami-solver' }],
    blurb: 'Computing folding and unfolding maps via a generalized form of quasiconformal mapping and crease geometry inference.',
  },
];

/** Highlight the author's own name inside an author list. */
export function authorsHtml(authors: string): string {
  const name = site.name;
  const escaped = authors.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return escaped
    .split(', ')
    .map((a) => (a.trim() === name ? `<strong>${a.trim()}</strong>` : a.trim()))
    .join(', ');
}
