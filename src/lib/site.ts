/**
 * Site data — the hand-curated personal content.
 *
 * Kept as typed data rather than markdown because publications are structured
 * (authors, venue, links, images) and get rendered consistently. Edit this file
 * to update the home page.
 *
 * Migrated from the old sylqiu.github.io page (Jon Barron template, 2023) —
 * nothing was dropped in the move.
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
  bio: 'Currently, I work as a research engineer in Google AR. Previously I got my PhD from The Chinese University of Hong Kong, and worked as a research intern at Google and SenseTime Research.',
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
    blurb: 'Use a parametric head model equipped with learnable features to do photo-real free view-point rendering.',
  },
  {
    title: 'Modal Uncertainty Estimation via Discrete Latent Representation',
    href: 'https://arxiv.org/abs/2007.12858',
    authors: 'Di Qiu, Lok Ming Lui',
    venue: 'MICCAI UNSURE workshop, 2021',
    images: ['images/pub/modal_uncertainty/1.png'],
    links: [{ label: 'code', href: 'https://github.com/sylqiu/MUE' }],
    blurb: 'Learning latent mode hypothesis and their uncertainty estimation for one-to-many mappings.',
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
    title: 'Deep End-to-End Alignment and Refinement for Time-of-Flight RGB-D Modules',
    href: 'http://arxiv.org/abs/1909.07623',
    authors: 'Di Qiu, Jiahao Pang, Chengxi Yang, Wenxiu Sun',
    venue: 'ICCV, 2019',
    images: ['images/pub/tof_align_refine/1.png', 'images/pub/tof_align_refine/2.png'],
    links: [{ label: 'code & dataset', href: 'https://github.com/sylqiu/tof_rgbd_processing' }],
    blurb: 'Cross-modal flow estimation and Time-of-Flight depth refinement using deep learning.',
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
