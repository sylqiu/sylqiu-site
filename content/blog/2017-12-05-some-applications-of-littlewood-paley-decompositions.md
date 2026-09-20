---
id: 2017-12-05-some-applications-of-littlewood-paley-decompositions
title: "Some applications of Littlewood Paley decompositions"
date: 2017-12-05
tags: ["harmonic analysis"]
source: https://sylqiu.blogspot.com/2017/12/some-applications-of-littlewood-paley.html
publish: true
---
Throughout this post $ {d\\in\\mathbb{N}}$ will be a fixed dimension constant. Recall that the $ {k}$-th Littlewood-Paley "projection'' of $ {f\\in\\mathcal{S}(\\mathbb{R}^{d})}$, $ {k\\in\\mathbb{Z}}$, is defined as  

$ \\displaystyle P\_{k}f=(\\varphi\_{k}\\hat{f})^{\\vee}, $

where $ {\\varphi\_{k}(\\xi)=\\varphi\_{0}(2^{-k}\\xi)}$, $ {\\varphi\_{0}(\\xi)=\\psi(\\xi)-\\psi(2\\xi)}$ and $ {\\psi}$ s a $ {C^{\\infty}}$ bump function supported in $ {B(0,2)}$ and equals $ {1}$ in $ {B(0,1)}$ in the frequency space. These operators are *frequency localisation* operators, where each piece $ {P\_{k}f}$ of $ {f}$ is localised to frequency $ {\\sim2^{k}}$, since the Fourier support of $ {P\_{k}f}$ is precisely the annulus $ {\\text{Ann}(2^{k-1},2^{k})}$. The purpose of this post is to see some applications of frequency localisation, in particular in understanding derivatives.  

There are three basic interconnected heuristics that one should keep in mind about the frequency localisation of a function, in particular Littlewood-Paley pieces $ {\\{P\_{k}f\\}\_{k\\in\\mathbb{Z}}}$:  

-   Localisation to frequency $ {\\sim2^{k}}$ basically distroys all the spatial information under scale $ {\\sim2^{-k}}$. More precisely, $ {P\_{k}f}$ essentially ocsillates like the plaine wave $ {e^{2^{k}ix}}$, and also differentiating $ {P\_{k}f}$ in the spacial variable mainly amplifies itself by a factor of $ {2^{k}}$, c.f. Lemma [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem5).
-   Different $ {P\_{k}f}$ are "almost orthogonal'' to each other. In fact, the $ {P\_{k}f}$ and $ {P\_{l}f}$ are exactly $ {L^{2}}$-orthogonal whenever $ {|k-l|>1}$. c.f. Theorem [7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Littlewood-Paley-inequality) Littlewood Paley inequality.
-   For a frequency localised function such as $ {P\_{k}f}$, lower $ {L^{p}}$ norms control higher $ {L^{q}}$ norms. This is analogous to the case of spatial localised function (i.e. functions that has compact support), for which the control is reversed, by the merit of Hölder's inequality. c.f. Lemma [8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem\(Bernstein-inequality\)) Bernstein's inequality, or the closely related Young's convolution inequality, which will be the ultimate source of varous embedding inequalities.

**1\. Basic properties**

In which sense, and under what condition can we reconstruct the function from its Littlewood-Paley pieces? If we define an extra piece $ {Pf=(\\psi\\hat{f})^{\\vee}}$ that includes all the low frequency component, then the family $ {P\_{\\leq N}:=P+\\sum\_{1\\leq k\\leq N}P\_{k}}$, indexed in N, forms an approximation to the identity. To see this, we rewrite $ {P\_{\\leq N}}$ as a convolutional operator  

$ \\displaystyle P\_{\\leq N}f=f\*\\Psi\_{N} $

where each $ {\\Psi\_{N}(x)=2^{Nd}\\Psi(2^{N}x)\\in\\mathcal{S}(\\mathbb{R}^{d})}$ is generated form the principal function $ {\\Psi=\\psi^{\\vee}}$, and observe the following properties about $ {\\Psi\_{N}}$. For each $ {N}$  

-   $ {|\\Psi\_{N}(x)|\\lesssim2^{Nd}}$ for all $ {N}$.
-   $ {\\int\_{\\mathbb{R}^{d}}\\Psi\_{N}(x)dx=1}$, since $ {\\hat{\\Psi}\_{N}(0)=1}$.
-   $ {|\\Psi\_{N}(x)|\\lesssim2^{-N}|x|^{-d-1}}$ for all $ {N,x}$; consequently for fixed $ {\\delta>0}$, $ {1\\leq p<\\infty}$, $ {\\int\_{|x|\\geq\\delta}|\\Psi\_{N}(x)|^{p}dx\\rightarrow0}$ as $ {N\\rightarrow\\infty}$.

Note that the first and third observations implies the uniform bound$ {\\|\\Psi\_{N}\\|\_{L^{1}}\\lesssim1}$. To see this,  

$ \\displaystyle \\begin{array}{rcl} & & \\int\_{|r|\\leq2^{-N}}|\\Psi\_{N}(r)|dr+\\int\_{|r|>2^{-N}}|\\Psi\_{N}(r)|dr\\\\ & \\lesssim & 2^{-Nd}\\cdot2^{Nd}+2^{-N}\\int\_{\\mathbb{R}^{d}}|x|^{-d-1}<\\infty. \\end{array} $

These observations say that $ {P\_{\\leq N}f}$ is a smooth, averaged version of $ {f}$. With this we can prove, for example, the $ {L^{p}}$ convergence property for $ {1\\leq p<\\infty}$. First, since $ {\\int\_{\\mathbb{R}^{d}}\\Psi\_{N}(x)dx=1}$, $ {f(x)}$ can be slicked inside the convolution  

$ \\displaystyle \\int\\left|\\int\\left(f(x-r)-f(x)\\right)\\Psi\_{N}(r)dr\\right|^{p}dx, $

which, by Jensen's inequality, is bounded by  

$ \\displaystyle \\begin{array}{rcl} & & \\int\\int\\left|\\left(f(x-r)-f(x)\\right)\\right|^{p}|\\Psi\_{N}(r)|^{p}drdx\\\\ & = & \\int\\|f(\\cdot-r)-f(\\cdot)\\|\_{L^{p}}^{p}|\\Psi\_{N}(r)|^{p}dr\\\\ & \\leq & \\int\_{|r|\\leq\\delta}\\|f(\\cdot-r)-f(\\cdot)\\|\_{L^{p}}^{p}|\\Psi\_{N}(r)|^{p}dr+\\\\ & & \\quad\\int\_{|r|>\\delta}\\|f(\\cdot-r)-f(\\cdot)\\|\_{L^{p}}^{p}|\\Psi\_{N}(r)|^{p}dr \\end{array} $

where $ {\\delta}$ is chosen so small that $ {\\|f(\\cdot-r)-f(\\cdot)\\|\_{L^{p}}^{p}\\leq\\epsilon}$ by the continuity of translation in $ {L^{p}}$-topology, and the second term is of course bounded by  

$ \\displaystyle 2^{p}\\|f\\|\_{L^{p}}^{p}\\int\_{|r|>\\delta}|\\Psi\_{N}(r)|^{p}dr\\leq\\epsilon $

when $ {N=N(\\delta)}$ is large enough. We thus obtained  

> **Theorem 1** *[](https://www.blogger.com/null)Whenever $ {f\\in L^{p}}$, $ {1\\leq p<\\infty}$,*  
> 
> *$ \\displaystyle P\_{\\leq N}f\\rightarrow f\\quad\\text{in }L^{p}. $*

The third observation can be stated in a somewhat different form that the principal function $ {\\Psi}$ has an $ {L^{1}}$ radial majorant  

$ \\displaystyle \\Psi^{\*}(x)=\\sup\_{|y|\\geq|x|}|\\Psi(y)|, $

indicating that pointwise behavior of $ {P\_{\\leq N}f(x)}$ at a Lebesgue point $ {x}$ of $ {f}$ is controled by the *maximal average* of $ {f}$ at $ {x}$, given by the Hardy-Littlewood maximal function  

$ \\displaystyle Mf(x)=\\sup\_{r>0}\\frac{c}{r^{d}}\\int\_{B(x,r)}|f(y)|dy. $

And in fact, the pointwise convergence at Lebesgue points is of a local character, so the convergence can be obtained for all $ {f\\in L^{p}}$, $ {1\\leq p\\leq\\infty}$.  

> **Theorem 2** *[](https://www.blogger.com/null)Let $ {f\\in L^{p}}$, $ {1\\leq p\\leq\\infty}$, and $ {x\\in\\mathbb{R}^{d}}$ be a Lebesgue point of $ {f}$. Then*  
> 
> *$ \\displaystyle f(x)=\\lim\_{N\\rightarrow\\infty}P\_{\\leq N}f(x). $*

We first prove the assertion for continuous functions of compact support $ {g\\in C\_{c}(\\mathbb{R}^{d})}$. Write  

$ \\displaystyle \\begin{array}{rcl} g\*\\Psi\_{N}(x)-g(x) & = & \\int\\left(g(x+2^{-N}r)-g(x)\\right)\\Psi(r)dr\\\\ & = & \\int\_{|r|\\leq R}+\\int\_{|r|>R}\\left(g(x+2^{-N}r)-g(x)\\right)\\Psi(r)dr, \\end{array} $

where $ {R}$ is chosen so large that $ {\\int\_{|r|>R}|\\Psi(r)|dr<\\epsilon}$. Then because of uniform continuity of $ {g}$ the first term can be made smaller than $ {\\epsilon}$ by choosing $ {N}$ large enough, and the second term is is bounded by $ {2\\|g\\|\_{\\infty}\\epsilon}$. This special case is thus proved.  
The subsequent proof for $ {1\\leq p<\\infty}$ is a combination of density argument and weak-$ {(p,p)}$ estimate of the maximal function. Recall that weak-$ {(p,p)}$ estimate for $ {1<p<\\infty}$ is a consequence of the strong-$ {(p,p)}$ estimate, which is them obtained by interpolation. The proof that follows is just a variant of the Lebesgue differentiation theorem.  

Now recall that Lebesgue set of $ {f}$ consists of points $ {x}$ such that  

$ \\displaystyle \\lim\_{r\\rightarrow0}\\frac{1}{|B(x,r)}\\int\_{B(x,r)}|f(y)-f(x)|dy=0. $

It suffices to prove the measure of the set $ {\\{x:\\limsup\_{N\\rightarrow\\infty}|f\*\\Psi\_{N}(x)-f(x)|>\\alpha\\}}$ is arbitrarily small for all $ {\\alpha>0}$. We then observe that  

$ \\displaystyle \\begin{array}{rcl} & & |\\{x:\\limsup\_{N\\rightarrow\\infty}|f\*\\Psi\_{N}(x)-f(x)|>\\alpha\\}|\\\\ & \\leq & |\\{x:\\limsup\_{N\\rightarrow\\infty}|f\*\\Psi\_{N}(x)-g\*\\Psi\_{N}(x)|>\\alpha/3\\}|+\\\\ & & \\quad|\\{x:\\limsup\_{N\\rightarrow\\infty}|g\*\\Psi\_{N}(x)-g(x)|>\\alpha/3\\}|+\\\\ & & \\quad\\quad|\\{x:|g(x)-f(x)|>\\alpha/3\\}|\\\\ & = & |E\_{1}|+|E\_{2}|+|E\_{3}| \\end{array} $

If we choose $ {g\\in C\_{c}(\\mathbb{R}^{d})}$ then $ {|E\_{2}|=0}$, by Chebyshev's inequality  

$ \\displaystyle |E\_{3}|\\lesssim\\frac{1}{\\alpha^{p}}\\|g-f\\|\_{L^{p}}^{p}, $

and $ {|E\_{1}|\\leq|\\{x:3AM(f-g)>\\alpha\\}\\lesssim\\frac{1}{\\alpha^{p}}\\|f-g\\|\_{L^{p}}^{p}}$, where $ {A=A=\\int\_{\\mathbb{R}^{d}}\\Psi^{\*}(x)dx}$, and the first inequality follows from the following lemma, and second from the weak-$ {(p,p)}$ estimate. Now by density of $ {C\_{c}(\\mathbb{R}^{d})}$ in $ {L^{p}}$, $ {1\\leq p<\\infty}$, we may choose $ {g}$ such that $ {\\|g-f\\|\_{L^{p}}\\leq\\epsilon}$ and hence this special case is proved.  

> **Lemma 3** *[](https://www.blogger.com/null)Let $ {f\\in L^{p}}$, $ {1\\leq p\\leq\\infty}$.*  
> 
> *$ \\displaystyle \\sup\_{N\\in\\mathbb{Z}}|f\*\\Psi\_{N}|(x)\\leq\\sup\_{N\\in\\mathbb{Z}}|f|\*\\Psi\_{N}^{\*}(x)\\leq AMf(x), $*
> 
> *where $ {A=\\int\_{\\mathbb{R}^{d}}\\Psi^{\*}(x)dx}$.*

The first inequality is easy. For the second one, we note that since $ {0\\leq\\Psi^{\*}\\in L^{1}}$, and the fact that it is radial, it suffices to prove for simple functions of the form  

$ \\displaystyle \\sum\_{j=1}^{k}a\_{j}\\chi\_{B\_{j}},\\text{ where }\\sum\_{j=1}^{k}a\_{j}|\\chi\_{B\_{j}}|\\leq A. $

We then note that $ {|f|\*\\chi\_{B\_{j}}\\leq Mf(x)}$. Finally, if $ {f\\in L^{\\infty}}$, we shall prove the result for $ {x\\in B(0,R)}$, for all $ {R>0}$. We may chop $ {f=f\\chi\_{|x|\\leq2R}+f\\chi\_{|x|>2R}=f\_{1}+f\_{2}}$ and note that $ {f\\chi\_{|x|\\leq2R}\\in L^{1}}$, which is handled as before. Thus it remains to estimate for $ {x\\in B(0,R),}$  

$ \\displaystyle |f\_{2}\*\\Psi\_{N}|\\leq\\|f\\|\_{L^{\\infty}}\\int\_{|r|>R}|\\Psi\_{N}(r)|dr\\rightarrow0 $

as $ {N\\rightarrow\\infty}$. The theorem is thus completely proved.  

However, if one considers $ {\\sum\_{|k|\\leq N}P\_{k}}$ and its convergence properties, things are a little different. Obviously, the convergence $ {\\sum\_{|k|\\leq N}P\_{k}f\\rightarrow f}$ still holds in the $ {L^{2}}$ sense. However, a first hint that it behaves quite differently from $ {P\_{\\leq N}}$ is to consider $ {f\\in\\mathcal{S}(\\mathbb{R}^{d})}$, with $ {\\int\_{\\mathbb{R}^{d}}f(x)dx=1}$, so that $ {\\hat{f}\\not\\equiv0}$ in the neiborhood of $ {0}$. Then $ {\\sum\_{|k|\\leq N}\\varphi\_{k}\\hat{f}}$ does not converge to $ {\\hat{f}}$ in the Schwartz topology. And since the Fourier transform is a continuous bijection on $ {\\mathcal{S}(\\mathbb{R}^{d})}$, $ {\\sum\_{|k|\\leq N}P\_{k}f}$ does not converge in $ {\\mathcal{S}(\\mathbb{R}^{d})}$. It is a character of $ {\\sum\_{|k|\\leq N}P\_{k}}$ that it ignores the constant mode in the frequency space.  

In the scenario of $ {L^{p}}$ convergence, $ {1\\leq p<\\infty}$, by virtue of Theorem [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm1) we need analyse the error term  

$ \\displaystyle \\begin{array}{rcl} P\_{\\leq N}f-\\sum\_{|k|\\leq N}P\_{k}f & = & f\*\\Psi\_{-N}, \\end{array} $

here $ {\\Psi\_{-N}}$ spreads out more and more as $ {N}$ gets larger, while $ {\\int\\Psi\_{-N}(r)dr=1}$. We have pointwise convergence for all $ {x}$  

$ \\displaystyle f\*\\Psi\_{-N}(x)=\\int\\hat{f}(\\xi)\\psi(2^{N}\\xi)e^{2\\pi ix\\cdot\\xi}d\\xi\\rightarrow0 $

as $ {N\\rightarrow\\infty}$. From Lemma ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem3)) $ {f\*\\Psi\_{-N}(x)}$ is pointwisely majorised by $ {Mf(x)}$ that is independent of $ {N}$. If $ {Mf}$ is $ {L^{p}}$ integrable, dominated convergence then shows that $ {\\|f\*\\Psi\_{-N}\\|\_{L^{p}}\\rightarrow0}$. This happens, however, only when $ {1<p<\\infty}$, since the maximal function is strong-$ {(p,p)}$ only in that range. Indeed, in the endpoint cases the convergence breaks down, as we will show.  
As above, the $ {L^{p}}$convergence of $ {\\sum\_{|k|\\leq N}P\_{k}f}$ to $ {f}$, $ {1<p<\\infty}$, is a consequence of the dominated convergence theorem. The convergence when $ {p=1}$ fails basically is due to baiscally the same reason that maximal function is not bounded on $ {L^{1}}$. To see this, fix a large $ {N}$ such that $ {\\Psi\_{N}(x)}$ is essntially constant in $ {B(0,2R)}$. Then if we take $ {f=\\chi\_{B(0,1)}}$, for $ {x\\in B(0,R),}$  

$ \\displaystyle \\begin{array}{rcl} |f\*\\Psi\_{-N}(x)| & = & |\\int\_{B(x,1)}\\Psi(r)dr|\\\\ & \\gtrsim & |x|^{-d} \\end{array} $

and let $ {N\\rightarrow\\infty}$ we see that $ {f\*\\Psi\_{-N}}$ is not in $ {L^{1}}$. That the convergence when $ {p=\\infty}$ fails is more about the nature of $ {L^{\\infty}}$-convergence. In particular, the limit, should it exist, must be continuous. Moreover, when the function is constant, the projection to nonzero frequency is simply zero. We summarise the discussion as follows.  

> **Theorem 4** *Whenever $ {f\\in L^{p}}$, $ {1<p<\\infty}$,*  
> 
> *$ \\displaystyle \\sum\_{|k|\\leq N}P\_{k}f\\rightarrow f\\quad\\text{in }L^{p}. $*

Nevertheless by the virtue of the proof of Theorem [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm2) and the fact that $ {\\Phi\_{N}=\\left(\\sum\_{|k|\\leq N}\\varphi\_{k}\\right)^{\\vee}}$ is such that $ {\\int\\Phi\_{N}=0}$, the pointwise almost everywhere convergence result still holds.  

> **Theorem 5** *[](https://www.blogger.com/null)Let $ {f\\in L^{p}}$, $ {1\\leq p\\leq\\infty}$, and $ {x\\in\\mathbb{R}^{d}}$ be a Lebesgue point of $ {f}$. Then*  
> 
> *$ \\displaystyle f(x)=\\sum\_{k\\in\\mathbb{Z}}P\_{k}f(x). $*

Next we turn to the point of interaction between Littlewood-Paley pieces and derivatives.  

> **Lemma 6** *[](https://www.blogger.com/null)Let $ {1\\leq p\\leq\\infty}$, $ {P\_{k}f}$ be defined as above. Then we have*  
> 
> *$ \\displaystyle \\|\\partial\_{x\_{i}}(P\_{k}f)\\|\_{L^{p}}\\sim2^{k}\\|P\_{k}f\\|\_{L^{p}}. $*

This lemma will be a primary source of machinery when we talk about function space characterisations. The keypoint here is a reproducing formula. We choose a multiplier operator $ {\\tilde{P}\_{k}}$ that localises to the same band of frequency $ {\\sim2^{k}}$, such that  

$ \\displaystyle \\tilde{P}\_{k}P\_{k}f=P\_{k}f. $

Write $ {f\_{k}=P\_{k}f}$ for simplicity. We have  

$ \\displaystyle f\_{k}(x)=\\int f\_{k}(x+2^{-k}y)\\tilde{\\Phi}(y)dy. $

Differentiating in $ {x}$, we get  

$ \\displaystyle \\begin{array}{rcl} \\partial\_{x\_{i}}f\_{k} & = & \\int\\partial\_{x\_{i}}f\_{k}(x+2^{-k}y)\\tilde{\\Phi}(y)dy\\\\ & = & 2^{k}\\int\\partial\_{y\_{i}}f\_{k}(x+2^{-k}y)\\tilde{\\Phi}(y)dy\\\\ & = & -2^{k}\\int f\_{k}(x+2^{-k}y)\\partial\_{yi}\\tilde{\\Phi}(y)dy. \\end{array} $

Since $ {\\nabla\\Phi}$ is again localised at the same range, we obtain one direction of the equivalence  

$ \\displaystyle \\|\\partial\_{x\_{i}}(P\_{k}f)\\|\_{L^{p}}\\lesssim2^{k}\\|P\_{k}f\\|\_{L^{p}}. $

For the other direction we need to "invert'' $ {\\partial\_{x\_{i}}}$. This will follows from the following observation  

$ \\displaystyle P\_{k}f=-\\sum\_{i}(-\\Delta)^{-1}\\partial\_{x\_{i}}P\_{k}(\\partial\_{x\_{i}}f), $

which can be checked via multipliers. Note that $ {\\partial\_{x\_{i}}P\_{k}(\\partial\_{x\_{i}}f)}$ has Fourier support away from the origin so the whole expression is well defined. We then note that the kernel corresponding to $ {(-\\Delta)^{-1}\\partial\_{x\_{i}}}$ is that of bounded linear operator. Applying once again the reproducing formula for $ {P\_{k}(\\partial\_{x\_{i}}f)}$, and noting the extra factor $ {2^{-k}}$ when $ {(-\\Delta)^{-1}\\partial\_{x\_{i}}}$ applied to that frequency, we obtain  

$ \\displaystyle 2^{k}\\|P\_{k}f\\|\_{L^{p}}\\lesssim\\|\\partial\_{x\_{i}}(P\_{k}f)\\|\_{L^{p}}. $

Now we come to the point of  "alomost orthogonality'', which is implicit the notion of "squared functions''. Here in our treatment they take the form  

$ \\displaystyle |Sf|(x)=\\left((Pf(x))^{2}+\\sum\_{k=1}^{\\infty}\\left(P\_{k}f(x)\\right)^{2}\\right)^{1/2} $

or sometimes also  

$ \\displaystyle |Sf|(x)=\\|P\_{k}f(x)\\|\_{\\ell^{2}(\\mathbb{Z})}. $

We think of $ {Sf=(Pf,P\_{1}f,P\_{2}f,\\dots)}$ or $ {Sf=(P\_{k}f)\_{k\\in\\mathbb{Z}}}$ as sequencies. Roughly speaking, these alomost orthogonal pieces are sumed as if squared sumed. More precisely,  

> **Theorem 7** *[](https://www.blogger.com/null)(Littlewood-Paley inequality) Let $ {f\\in\\mathcal{S}(\\mathbb{R}^{d})}$ and $ {Sf}$ be defined either one of the form as above. Then for $ {1<p<\\infty}$,*  
> 
> *$ \\displaystyle \\||Sf|\\|\_{L^{p}}\\sim\\|f\\|\_{L^{p}}. $*

We first note that $ {\\|Pf\\|\_{L^{p}}\\lesssim\\|f\\|\_{L^{p}}}$ by a simple application of Young's convolution inequality. Then it suffices the prove the theorem for the definition $ {|Sf|(x)=\\|P\_{k}f(x)\\|\_{\\ell^{2}(\\mathbb{Z})}.}$ We fist prove one direction $ {\\||Sf|\\|\_{L^{p}}\\lesssim\\|f}$. The case $ {1<p\\leq2}$ is proved using vector valued singular integral. It amounts to the kernel estimate  

$ \\displaystyle \\left(\\sum\_{j\\in\\mathbb{Z}}|\\partial\_{x}\\Psi\_{j}(x)|^{2}\\right)^{1/2}\\lesssim C|x|^{-d-1} $

away from the origin. To prove the case $ {2\\leq p<\\infty}$ we proceed by duality. Here a sequence $ {(f\_{k})\_{k\\in\\mathbb{Z}}}$ in $ {L^{p}(\\mathbb{R}^{d},\\ell^{2})}$ is paired with a sequence $ {(g\_{k})\_{k\\in\\mathbb{Z}}}$ in $ {L^{p'}(\\mathbb{R}^{d},\\ell^{2})}$, $ {1<p'\\leq2}$. Now taking $ {f\_{k}=P\_{k}f}$, we can then transfer $ {P\_{k}}$ to $ {g\_{k}}$ via its adjoint:  

$ \\displaystyle \\begin{array}{rcl} \\int\\sum\_{k\\in\\mathbb{Z}}(P\_{k}f)(x)\\cdot g\_{k}(x)dx & = & \\int f(x)\\sum\_{k\\in\\mathbb{Z}}(P\_{k}g\_{k})(x). \\end{array} $

Using Hölder, it is bounded by  

$ \\displaystyle \\|f\\|\_{L^{p}}\\|\\|\\sum\_{k\\in\\mathbb{Z}}(P\_{k}g\_{k})(x)\\|\_{L^{p'}}. $

We apply the vector valued singular integral again, now to $ {(g\_{k}(x))\_{k\\in\\mathbb{Z}}\\mapsto\\|P\_{k}g\_{k}(x)\\|\_{\\ell^{2}(\\mathbb{Z})}}$, to obtain[](https://www.blogger.com/null)  

[$ \\displaystyle \\|\\sum\_{k\\in\\mathbb{Z}}(P\_{k}g\_{k})(x)\\|\_{L^{p'}}\\lesssim\\left\\Vert \\|g\_{k}(x)\\|\_{\\ell^{2}(\\mathbb{Z})}\\right\\Vert \_{L^{p'}}. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Therefore, $ {Sf}$ is a continuous linear functional on $ {L^{p'}(\\mathbb{R}^{d},\\ell^{2})}$  

$ \\displaystyle |\\langle Sf,(g\_{k})\_{k\\in\\mathbb{Z}}\\rangle|\\leq\\|f\\|\_{L^{p}}\\left\\Vert \\|g\_{k}(x)\\|\_{\\ell^{2}(\\mathbb{Z})}\\right\\Vert \_{L^{p'}}, $

so  

$ \\displaystyle \\||Sf|\\|\_{L^{p}}\\lesssim\\|f\\|\_{L^{p}},\\quad1<p<\\infty. $

The other direction can be obtained using duality again, apply ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) to a sequence $ {(f\_{k})\_{k\\in\\mathbb{Z}}}$ in $ {L^{p}(\\mathbb{R}^{d},\\ell^{2})}$, with slightly different $ {\\tilde{P}\_{k}}$  

$ \\displaystyle \\|\\sum\_{k\\in\\mathbb{Z}}(\\tilde{P}\_{k}f\_{k})(x)\\|\_{L^{p}}\\lesssim\\|\\|f\_{k}\\|\_{\\ell^{2}(\\mathbb{Z})}\\|\_{L^{p}}. $

Apply this with $ {f\_{k}=P\_{k}f}$ such that $ {\\tilde{P}\_{k}P\_{k}f=P\_{k}f}$, we get  

$ \\displaystyle \\|f\\|\_{L^{p}}\\lesssim\\|\\|P\_{k}f\\|\_{\\ell^{2}(\\mathbb{Z})}\\|\_{L^{p}}. $

Finally, we turn to the point that lower $ {L^{p}}$ norms of $ {P\_{k}f}$ control its higher $ {L^{q}}$ norms.  

> **Lemma 8** *(Bernstein inequality) [](https://www.blogger.com/null)Let $ {P\_{k}f}$ be defined as before, $ {k\\in\\mathbb{Z}}$, $ {1\\leq p\\leq q\\leq\\infty}$. Then*  
> 
> *$ \\displaystyle \\|P\_{k}f\\|\_{L^{q}}\\lesssim2^{kd(1/p-1/q)}\\|P\_{k}f\\|\_{L^{p}}. $*

By iterpolation it is enough to prove when $ {p=1,q=\\infty}$, i.e.  

$ \\displaystyle \\|P\_{k}f\\|\_{L^{\\infty}}\\lesssim2^{kd}\\|P\_{k}f\\|\_{L^{1}}. $

We use again the reproducing formula $ {\\tilde{P}\_{k}P\_{k}f=P\_{k}f}$. Write now $ {P\_{k}f=f\_{k}}$. By Young's convolution inequality  

$ \\displaystyle \\|\\tilde{P}\_{k}f\_{k}\\|\_{L^{\\infty}}\\leq\\|f\_{k}\\|\_{1}\\|\\tilde{\\Psi}\_{k}\\|\_{\\infty} $

where $ {\\tilde{\\Psi}\_{k}(x)=2^{kd}\\Psi(2^{k}x)}$.  

**2\. Applications to Hölder and Sobolev spaces**

In the following we will be frequently using the the fact the a convergent exponential sum is bounded by a constant multiple of its first term.  
**Littlewood-Paley characterisation for Hölder spaces.** The Hölder space $ {\\Lambda^{\\gamma}}$ over $ {\\mathbb{R}^{d}}$, $ {\\gamma\\in(0,1)}$, consists of continuous functions such that  

$ \\displaystyle |f|\_{\\Lambda^{\\gamma}}:=\\|f\\|\_{L^{\\infty}}+\\sup\_{\\underset{y\\neq0}{x,y\\in\\mathbb{R}^{d}}}\\frac{|f(x+y)-f(x)|}{|y|^{\\gamma}}<\\infty. $

From the definition we have  

$ \\displaystyle |f(x+y)-f(x)|\\leq C|y|^{\\gamma}. $

Recall $ {P\_{k}f=\\int f(x-y)\\Psi\_{k}(y)dy}$ where $ {\\int\\Psi\_{k}(y)dy=0}$. Then  

$ \\displaystyle P\_{k}f(x)=\\int\\left(f(x-y)-f(x)\\right)\\Psi\_{k}(y)dy $

and so[](https://www.blogger.com/null)  

[$ \\displaystyle \\|P\_{k}f\\|\_{L^{\\infty}}\\lesssim\\int|y|^{\\gamma}|\\Psi\_{k}(y)|dy\\lesssim2^{-k\\gamma}. \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)This implication can in fact be reversed. Suppose now the above holds. Then first of all  

$ \\displaystyle \\|f\\|\_{L^{\\infty}}\\leq\\|Pf\\|\_{L^{\\infty}}+\\sum\_{k\\geq1}\\|P\_{k}f\\|\_{L^{\\infty}}\\lesssim1. $

Next,  

$ \\displaystyle \\begin{array}{rcl} |f(x+y)-f(x)| & \\leq & |Pf(x+y)-Pf(x)|+\\sum\_{k\\geq1}|P\_{k}f(x+y)-P\_{k}f(x)|. \\end{array} $

Now if $ {|y|>2^{-k}}$, we compare at a rather global scale  

$ \\displaystyle |P\_{k}f(x+y)-P\_{k}f(x)|\\leq2\\|P\_{k}f\\|\_{L^{\\infty}}\\lesssim2^{-k\\gamma}, $

otherwise we can use Lemma [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem5) to get[](https://www.blogger.com/null)  

[$ \\displaystyle |P\_{k}f(x+y)-P\_{k}f(x)|\\leq|y|\\|\\nabla P\_{k}f\\|\_{L^{\\infty}}\\lesssim|y|2^{k(1-\\gamma)}. \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Consequently the above expression is summbale wherever $ {y}$ is  

$ \\displaystyle \\begin{array}{rcl} \\sum\_{k\\geq1}|P\_{k}f(x+y)-P\_{k}f(x)| & \\lesssim & \\sum\_{2^{k}\\leq|y|^{-1}}2^{k(1-\\gamma)}|y|+\\sum\_{2^{k}>|y|^{-1}}2^{-k\\gamma}\\\\ & \\lesssim & |y|^{1-\\gamma}|y|+|y|^{\\gamma}\\lesssim|y|^{\\gamma}. \\end{array} $

This characterisation ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) allows us to redefine $ {\\Lambda^{\\gamma}}$ for all $ {\\gamma>0}$!  
What happens when $ {\\gamma=1}$? It turns out that the difference quotient definition, i.e. Lipschitz continuity, is no longer equivalent to the condition ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), as one can already see from the above summation. The latter space is called the *Zygmund space* $ {\\Lambda^{1}}$.  

Nevertheless there exists a difference quotient characterisation to $ {\\Lambda^{1}}$, which involves difference of one more order, and also works for $ {\\gamma\\in(0,2)}$. It is defined by  

$ \\displaystyle \\|f\\|\_{L^{\\infty}}+\\sup\_{\\underset{y\\neq0}{x,y\\in\\mathbb{R}^{d}}}\\frac{|f(x+y)+f(x-y)-2f(x)|}{|y|^{\\gamma}}. $

The keypoint is that $ {P\_{k}}$ need to be chosen (to be an even function) such that  

$ \\displaystyle P\_{k}f(x)=\\int\\frac{f(x+y)+f(x-y)-2f(x)}{2}\\Psi\_{k}(y)dy, $

so that similar argument applies as before, for example  

$ \\displaystyle \\|P\_{k}f(x)\\|\_{L^{\\infty}}\\leq\\int|y|^{\\gamma}|\\Psi\_{k}(y)|dy\\lesssim2^{-j\\gamma}. $

For the reverse implication, instead of ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3))  

$ \\displaystyle |P\_{k}f(x+y)+P\_{k}f(x-y)-2P\_{k}f(x)|\\leq\\|\\nabla^{2}P\_{k}f\\|\_{L^{\\infty}}|y|^{2}\\lesssim|y|^{2}2^{k(2-\\gamma)} $

and the same argument applies as before.  
Now we can make use of these difference quotient definitions to recover the general case $ {\\gamma>0}$, which was defined before as in ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)). We take a nested definition approach, saying that $ {f\\in\\Lambda^{\\gamma}}$ if  

$ \\displaystyle \\|f\\|\_{L^{\\infty}}+\\sum\_{|\\beta|=m}\\|\\partial^{\\beta}f\\|\_{\\Lambda^{\\gamma-m}}<\\infty, $

where $ {m\\in\\mathbb{N}}$ is such that $ {\\gamma-m\\in(0,1\]}$. Note that it is enough to take derivatives of order $ {m}$.  
**Littlwood-Paley characterisation for Sobolev spaces.** The Sobolev space $ {W^{k,p}(\\mathbb{R}^{d})}$ over $ {\\mathbb{R}^{d}}$, $ {k\\in\\mathbb{N}}$, $ {1\\leq p\\leq\\infty}$, consists of functions such that  

$ \\displaystyle \\|f\\|\_{W^{k,p}}:=\\|f\\|\_{L^{p}}+\\sum\_{|\\beta|=k}\\|\\partial^{\\beta}f\\|\_{L^{p}}. $

The Littlewood-Paley characterisation will be based on the square function $ {|Sf|}$ defined before, and is equivalent to various singular integral characterisation for such spaces.  

> **Lemma 9** *For any $ {k\\geq1}$, $ {1<p<\\infty}$,*  
> 
> *$ \\displaystyle \\|\\partial^{\\beta}f\\|\_{L^{p}}\\sim\\|\\left(\\sum\_{l}|2^{kl}P\_{l}f|^{2}\\right)^{1/2}\\|\_{L^{p}}, $*
> 
> *where $ {|\\beta|=k}$.*

The result follows from Littlewood-Paley inequality once we observe that  

$ \\displaystyle 2^{j}P\_{k}f=\\tilde{P}\_{k}\\partial^{\\beta}f $

for some $ {\\tilde{P}\_{k}}$ similar to $ {P\_{k}}$. Then  

$ \\displaystyle \\|f\\|\_{W^{k,p}}\\sim\\|\\left(\\sum\_{l}|(1+2^{l})^{k}P\_{l}f|^{2}\\right)^{1/2}\\|\_{L^{p}}. $

Again this characterisation allows one to define Sobolev spaces with fractional derivatives, i.e. $ {k}$ not necessarily an integer, and not necessarily positive!

**Sobolev embeddings.** Now suppose $ {f\\in W^{1,p}}$, where $ {1<p<\\infty}$, with $ {\\|f\\|\_{W^{1,p}}=a>0}$. Then we have  

$ \\displaystyle \\|\\partial\_{x\_{i}}P\_{k}f\\|\_{L^{p}}\\sim2^{k}\\|P\_{k}f\\|\_{L^{p}} $

while  

$ \\displaystyle \\|\\partial\_{x\_{i}}P\_{k}f\\|\_{L^{p}}\\lesssim a,\\quad\\|P\_{k}f\\|\_{L^{p}}\\lesssim a. $

Thus  

$ \\displaystyle \\|P\_{k}f\\|\_{L^{p}}\\lesssim\\min\\{2^{-k}a,a\\}. $

Note how high frequency component can be controled by the extra factor of $ {2^{-k}}$. Now we use Bernstein's inequality, for any $ {p<q\\leq\\infty}$,  

$ \\displaystyle \\|P\_{k}f\\|\_{L^{q}}\\leq2^{(1/p-1/q)dk}\\min(1,2^{-k})a, $

and thus  

$ \\displaystyle \\|f\\|\_{L^{q}}\\lesssim\\sum\_{k}2^{(1/p-1/q)dk}\\min(1,2^{-k})a. $

Note that when $ {k\\geq0}$ the factor  

$ \\displaystyle 2^{((1/p-1/q)d-1)k} $

decays only if  

$ \\displaystyle \\begin{array}{rcl} & & (1/p-1/q)d-1<0\\\\ & \\iff & \\frac{1}{p}-\\frac{1}{q}<\\frac{1}{d}. \\end{array} $

Thus we have  

> **Theorem 10** *(Non-endpoint Sobolev inequality for one derivative) Let $ {1\\leq p<q\\leq\\infty}$ be such that*  
> 
> *$ \\displaystyle \\frac{1}{p}-\\frac{1}{q}<\\frac{1}{d}. $*
> 
> *Then*  
> 
> *$ \\displaystyle \\|f\\|\_{L^{q}}\\lesssim\\|f\\|\_{W^{1,p}} $*
> 
> *and hence $ {W^{1,p}\\hookrightarrow L^{q}}$ continuously.*

Next we deal with the endpoint case $ {\\frac{1}{p}-\\frac{1}{q}=\\frac{1}{d}}$. We will first prove weak-type estimate for all $ {1<p<q<\\infty}$, it holds for all $ {\\lambda>0}$  

$ \\displaystyle |\\{|f|>\\lambda\\}|\\lesssim\\frac{\\|\\nabla f\\|\_{L^{p}}^{q}}{\\lambda^{q}}, $

and subsequently show how to bootstrap to strong-type estimate.  
Suppose $ {f\\in W^{1,p}}$. We first treat for a single Littlewood-Paley piece where we will obtain several useful observations. By Chebyshev we have[](https://www.blogger.com/null)  

[$ \\displaystyle |\\{|P\_{k}f|>\\lambda\\}|\\lesssim\\frac{\\|P\_{k}f\\|\_{L^{p}}^{p}}{\\lambda^{p}}\\sim\\frac{(2^{-k}\\|\\nabla P\_{k}f\\|\_{L^{p}})^{p}}{\\lambda^{p}}. \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Now using Bernstein's inequality[](https://www.blogger.com/null)  

[$ \\displaystyle \\|P\_{k}f\\|\_{L^{\\infty}}\\lesssim2^{dk/p}\\|P\_{k}f\\|\_{L^{p}}\\lesssim2^{dk/p-k}\\|\\nabla P\_{k}f\\|\_{L^{p}} \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)hence $ {|\\{|P\_{k}f|>\\lambda\\}|=0}$ unless $ {\\lambda\\lesssim2^{dk/p-k}\\|\\nabla P\_{k}f\\|\_{L^{p}}}$. Putting this back to ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)), we get  

$ \\displaystyle \\begin{array}{rcl} |\\{|P\_{k}f|>\\lambda\\}| & \\lesssim & 2^{-kp}\\|\\nabla P\_{k}f\\|\_{L^{p}}^{p}\\lambda^{-q}\\left(2^{dk/p-k}\\|\\nabla P\_{k}f\\|\_{L^{p}}\\right)^{q-p}\\\\ & = & \\lambda^{-q}\\|\\nabla P\_{k}f\\|\_{L^{p}}^{q}, \\end{array} $

thus the weak type estimate for a single Littlewood-Paley piece is completed.  
How to improve to the whole function $ {f}$? First, since the quantity $ {\\{|f|>\\lambda\\}|}$ is of pointwise character, from Theorem [5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm5) it is equivalent to show  

$ \\displaystyle |\\{|\\sum\_{j\\in\\mathbb{Z}}P\_{j}f|>\\lambda\\}|\\lesssim\\frac{\\|\\nabla f\\|\_{L^{p}}^{q}}{\\lambda^{q}}. $

Now, note that in [5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5) $ {k(d/p-1)}$ is monotonly increasing in $ {k}$ as a consequence of the assumption $ {\\frac{1}{p}-\\frac{1}{q}=\\frac{1}{d}}$. So for fixed $ {\\lambda>0}$, the main conrtribution to the quantity $ {|\\{|f|>\\lambda\\}|}$ is from the tail part $ {P\_{>N}}$ for some $ {N}$. We wish to select $ {N}$ such that, say, $ {\\|P\_{\\leq N}f\\|\_{L^{\\infty}}\\leq\\sum\_{k=-\\infty}^{N}\\|P\_{k}f\\|\_{L^{\\infty}}<\\lambda/2}$ so that  

$ \\displaystyle |\\{|\\sum\_{j\\in\\mathbb{Z}}P\_{j}f|>\\lambda\\}|=|\\{|P\_{>N}f|\\geq\\lambda/2\\}|. $

To do this we choose the critical $ {k\_{\\lambda}}$,  

$ \\displaystyle \\lambda\\sim2^{dk\_{\\lambda}/p-k\_{\\lambda}}\\|\\nabla P\_{k\_{\\lambda}}f\\|\_{L^{p}}, $

so that after subtracting a large constant $ {C}$,  

$ \\displaystyle \\|P\_{\\leq k\_{\\lambda}-C}f\\|\_{L^{\\infty}}<\\lambda/2. $

Now to estimate $ {|\\{|P\_{>N}f|>\\lambda\\}|,}$ note that $ {\\|P\_{k}f\\|\_{p}\\lesssim2^{-k}\\|\\nabla P\_{k}f\\|\_{L^{p}}}$ where the RHS is decresing in $ {k}$. So by summing we obtain  

$ \\displaystyle \\|P\_{>k\_{\\lambda}-C}f\\|\_{L^{p}}\\lesssim2^{-k\_{\\lambda}}\\|\\nabla P\_{k}f\\|\_{L^{p}}, $

and thus by Chebyshev,  

$ \\displaystyle |\\{|P\_{>N}f|\\geq\\lambda/2\\}|\\lesssim2^{-k\_{\\lambda}p}\\lambda^{-p}\\|\\nabla P\_{k}f\\|\_{L^{p}}^{p}\\sim\\lambda^{-q}\\|\\nabla P\_{k}f\\|\_{L^{p}}^{q} $

Thus the weak type estimate is completely proved.  
The strong type estimate should be of the form  

$ \\displaystyle \\|f\\|\_{L^{q}}\\lesssim\\|\\nabla f\\|\_{L^{p}}, $

which, after inverting $ {\\nabla}$, is equivalent to  

$ \\displaystyle \\|\\Delta^{-1}\\nabla\\cdot g\\|\_{L^{q}}\\lesssim\\|g\\|\_{L^{p}} $

where $ {g:=\\nabla f}$. With the same method we can show, for all $ {p,q}$ satisfying the assumption, the weak type estimate in a slightly altered form  

$ \\displaystyle \\|\\Delta^{-1}\\nabla\\cdot g\\|\_{L^{q,\\infty}}\\lesssim\\|g\\|\_{L^{p}}, $

the strong type estimate thus follows by interpolation. Thus we have  

> **Theorem 11** *(Endpoint Sobolev inequality for one derivative, $ {p\\neq1,q\\neq\\infty}$) Let $ {1<p<q<\\infty}$ be such that*  
> 
> *$ \\displaystyle \\frac{1}{p}-\\frac{1}{q}=\\frac{1}{d}. $*
> 
> *Then*  
> 
> *$ \\displaystyle \\|f\\|\_{L^{q}}\\lesssim\\|\\nabla f\\|\_{L^{p}} $*
> 
> *and hence $ {W^{1,p}\\hookrightarrow L^{q}}$ continuously.*

Finally we comment on the remaining two endpoint cases. In the case $ {p=1}$, $ {q=\\frac{n}{n-1}}$, the inequality still holds, however cannot be established using singular integrals, which is due to Galiardo-Nirenberg  

$ \\displaystyle \\|f\\|\_{L^{\\frac{n}{n-1}}}\\lesssim\\|\\nabla f\\|\_{L^{1}}. $

In the case $ {p=d}$, $ {q=\\infty}$, the space $ {W^{1,\\infty}}$ instead embeds into $ {BMO}$.
