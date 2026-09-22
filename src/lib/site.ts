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
