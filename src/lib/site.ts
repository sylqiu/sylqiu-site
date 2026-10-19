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

/** One employer, with any number of roles held there. */
export interface CvOrg {
  org: string;
  place: string;
  roles: { title: string; dates: string; note?: string }[];
}

/** Structured Curriculum Vitae content, from CV.pdf. */
export const cv = {
  experience: [
    {
      org: 'Google XR',
      place: '',
      roles: [
        {
          title: 'Software Developer (Canada)',
          dates: 'Apr 2022 - present',
        },
        {
          title: 'Research Intern → Student Researcher (remote)',
          dates: 'Sep 2020 - Sep 2021',
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
        },
      ],
    },
  ] as CvOrg[],
};

/**
 * Writing-page categories. A post is filed under the first category whose tag
 * list intersects its own tags; unmatched posts fall into "Other".
 */
export const blogCategories: { name: string; tags: string[] }[] = [
  { name: 'Vision & Graphics', tags: ['computer vision', 'computer graphics', 'imaging', 'machine learning'] },
  { name: 'Numerical Methods & Optimization', tags: ['cuhk.math3310', 'teaching', 'numerical methods', 'optimization'] },
  { name: 'Analysis & PDE', tags: ['real analysis', 'measure theory', 'functional analysis', 'harmonic analysis', 'Fourier analysis', 'PDE', 'elliptic theory'] },
  { name: 'Geometry & Topology', tags: ['differential geometry', 'discrete conformal geometry', 'algebraic topology', 'complex analysis'] },
  { name: 'Algebra', tags: ['algebra', 'linear algebra'] },
  { name: 'Probability', tags: ['probability theory', 'stochastic differential equation', 'statistical physics'] },
];

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
    href: 'https://crv.pubpub.org/pub/dl70yq4c',
    authors:
      'Di Qiu, Yinda Zhang, Thabo Beeler, Vladimir Tankovich, Christian Häne, Sean Fanello, Christoph Rhemann, Sergio Orts Escolano',
    venue: 'CRV, 2025 · Best Paper',
    images: [],
    links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2404.02225' }],
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

/**
 * Interactive illustrations. One entry = one page at `#/illustrations/<id>`,
 * plus a row on the index page. `scene` names a factory in
 * `src/lib/registry.ts`; `blurb` is the one-line pitch. Syl names each
 * illustration he wants — never add a placeholder entry.
 */
export interface Illustration {
  id: string;
  title: string;
  blurb: string;
  scene: string;
}

export const illustrations: Illustration[] = [
  {
    id: 'flash-attention',
    title: 'FlashAttention: From Attention to Kernels',
    blurb:
      'Attention by definition, the GPU and TPU memory hierarchies, tiling and online softmax with a focus on data movement, the variant landscape, and kernel code for PyTorch, CUDA, Triton, and TPU/Pallas.',
    scene: 'flash-attention',
  },
  {
    id: 'kv-cache',
    title: 'How KV cache works in an autoregressive LLM',
    blurb:
      'From one transformer layer to prefill and decode: what a position computes for itself, the step where it reads its past, and how serving systems store, share, and schedule that past — paged blocks, copy-on-write, RadixAttention, disaggregated prefill/decode, and pseudocode linked to vLLM, SGLang, and TensorRT-LLM.',
    scene: 'kv-cache',
  },
];

