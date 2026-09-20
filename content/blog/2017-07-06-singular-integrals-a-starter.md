---
id: 2017-07-06-singular-integrals-a-starter
title: "Singular integrals: a starter"
date: 2017-07-06
tags: ["Fourier analysis", "harmonic analysis"]
source: https://sylqiu.blogspot.com/2017/07/singular-integrals-starter.html
publish: true
---
We begin with the simpliest subject of our current theme of study, namely the *Hilbert transform*. It often appears in two forms. One is as a Fourier multiplier operator: in the case the underlying space is $ {\\mathbb{R}}$,  

$ \\displaystyle H(f)(x)=\\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)\\frac{\\text{sign}(\\xi)}{i}e^{2\\pi ix\\xi}\\thinspace d\\xi $

for $ {f\\in L^{2}(\\mathbb{R})}$, where  

$ \\displaystyle \\text{sign}(\\xi)=\\begin{cases} 1 & \\xi>0\\\\ 0 & \\xi=0\\\\ -1 & \\xi<0 \\end{cases};\\ f^{\\wedge}(\\xi):=\\int\_{\\mathbb{R}}f(x)e^{-2\\pi i\\xi x}\\,dx $

or in the case the underlying space is a circle $ {\\mathbb{T}}$,  

$ \\displaystyle H(f)(\\theta)=\\sum\_{n\\in\\mathbb{Z}}f^{\\wedge}(n)\\frac{\\text{sign}(n)}{i}e^{in\\theta} $

where $ {f\\in L^{2}(\[0,2\\pi\])}$, and  

$ \\displaystyle \\text{sign}(n)=\\begin{cases} 1 & n>0\\\\ 0 & n=0\\\\ -1 & n<0 \\end{cases};\\ f^{\\wedge}(n):=\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)e^{-inx}\\,dx. $

(Note that the sign function vanishes on a measure zero set on $ {\\mathbb{R}}$, but on a measure 1 set on $ {\\mathbb{Z}}$. This ultimately causes the constant mode of the periodic function jumping out in various identities, compared to their analogs for functions on $ {\\mathbb{R}}$. This is however not essential.) The other formulation is as a "singular integral operator'', as will be ellaborated below. It is in the 19th and earlier 20th centuries that the properties of this operator came into interest, for its fundamental connection with the following two questions that arised in Analysis.  

The first one is that of convergence, in some appropriate sense, of the *symmetric partial sum* of the Fourier series of an integrable function $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$  

$ \\displaystyle S\_{N}(f)(\\theta):=\\sum\_{|n|\\leq N}f^{\\wedge}(n)e^{in\\theta}\\rightarrow f(\\theta)\\ ? $

At that time Lebesgue's integration theory had not been developed. However, that under the condition of $ {C^{1}}$ regularity of the function, the pointwise convergence was already clear to Dirichlet, in 1829, who told in private that he would soon resolve the case when $ {f}$ is continuous. This was disproved in 1873, by du Bois Reymond. Then after the work of Lebesgue, under the condition of square integrability of $ {f}$, the $ {L^{2}}$ convergence can be established using elemental Hilbert space technique, invented during the end of the 19th century. Later, achieved by Marcel Riesz in 1923, the $ {L^{p}}$ convergence was shown to be true for all $ {1<p<\\infty}$. Nevertheless, the "local'' convergence behavior turns out much more intricate, and the a.e. convergence for $ {L^{2}}$ functions was eventually resolved by Carleson, in 1966.  

The Hilbert transform enters the above question as follows. The symmetric partial sum can be regarded as the convolution with the *Dirichlet kernel* (this is no incidence: a bounded multiplier must correspond to a distributional kernel that commutes with translations)  

$ \\displaystyle S\_{N}(f)(\\theta)=f\*D\_{N}\\thinspace(\\theta), $

where  

$ \\displaystyle D\_{N}(x)=\\sum\_{|n|\\leq N}e^{inx}. $

The integral operator so defined is actually the orthogonal projection $ {P\_{|n|\\leq N}}$ to the space spanned by $ {\\{e^{inx}\\}\_{|n|\\leq N}}$, which is associated with the following multiplier on the intergers  

$ \\displaystyle m\_{S\_{N}}(n)=\\chi\_{|n|\\leq N}=\\begin{cases} 1 & |n|\\leq N\\\\ 0 & \\text{otherwise} \\end{cases}. $

Denote the multiplier of the Hilber transform on the circle by $ {m\_{H}(n):=\\frac{1}{i}\\text{sign}(n)}$. And notice that  

$ \\displaystyle m\_{S\_{N}}(n)=\\frac{i}{2}\\left(m\_{H}(n+N)-m\_{H}(n-N)\\right)+\\frac{1}{2}\\chi\_{\\{\\pm N\\}}. $

Then, in terms of operator,  

$ \\displaystyle S\_{N}(f)(\\theta)=\\frac{ie^{-iN\\theta}H(e^{iN\\theta}f)-ie^{iN\\theta}H(e^{-iN\\theta}f)}{2}+\\frac{P\_{\\pm N}}{2}. $

Hence the study of the boundedness properties of the family of operators $ {S\_{N}}$ reduces to the boundedness property of operators $ {H}$ and $ {P\_{\\pm N}}$.  

The second question is concerned with a different summation method of Fourier series, and its connection to complex analysis. Here for each $ {\\theta\\in\[0,2\\pi\]}$, the Fourier series is called *Abel summable* to $ {f(\\theta)}$ if  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}f^{\\wedge}(n)r^{|n|}e^{in\\theta}\\rightarrow f(\\theta) $

as $ {r\\rightarrow1}$. Similar to the symmetric partial sum, Abel summation can also be written as a convolution of $ {f}$ with a kernel. This time it is the *Poisson kernel for the unit disk*  

$ \\displaystyle f\*\\mathcal{P}\_{r}\\thinspace(\\theta), $

where  

$ \\displaystyle \\mathcal{P}\_{r}(\\theta)=\\sum\_{n\\in\\mathbb{Z}}r^{|n|}e^{in\\theta}=\\frac{1-r^{2}}{1-2r\\cos\\theta+r^{2}}. $

We remark that if for a.e. $ {\\theta\\in\[0,2\\pi\]}$, a Fourier series is Abel summable and moreover, $ {f^{\\wedge}(n)=0}$ for all $ {n<0}$, then $ {f}$ , originally defined on the unit circle, can be extended to a holomorphic function inside the unit disk, by  

$ \\displaystyle F(z)=\\sum\_{n\\in\\mathbb{Z}}f^{\\wedge}(n)z^{n}. $

It is of interest that when the a.e. convergence holds. In sharp contrast to the symmetric partial sum method, it turns out that the result holds even for integrable functions. This is to be explained by the fact that the family of Poisson kernels, indexed in $ {r}$, forms an *approximations to the identity*, while it is not the case for the Dirichlet kernels.  

Now we ask the converse, that is, given a holomorphic function $ {F}$ in the unit disk, then under what conditions $ {F}$ will have radial limit on the circle, i.e.  

$ \\displaystyle \\lim\_{r\\rightarrow1^{-}}F(re^{i\\theta})\\ \\text{ exists for a.e. $\\theta\\in \[0,2\\pi\]$?} $

Suppose $ {F}$ has the power series expansion $ {\\sum\_{n=0}^{\\infty}a\_{n}z^{n}}$. Now by Parseval's identity  

$ \\displaystyle \\sum\_{n=0}^{\\infty}|a\_{n}|^{2}r^{2n}=\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}|F(re^{i\\theta})|^{2}d\\theta,\\ 0\\leq r<1. $

Thus, assume that[](https://www.blogger.com/null)  

[$ \\displaystyle \\sup\_{0\\leq r<1}\\int\_{\[0,2\\pi\]}|F(re^{i\\theta})|^{2}d\\theta<\\infty, \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)so that the series $ {\\sum\_{n=0}^{\\infty}|a\_{n}|^{2}}$ converges to the above quantity, and thus has a corresponding $ {L^{2}}$ function $ {F\_{0}(e^{i\\theta}).}$ Since $ {L^{2}(\[0,2\\pi\])\\subset L^{1}(\[0,2\\pi\])}$, by the above paragraph we have the limit $ {\\lim\_{r\\rightarrow1^{-}}F(re^{i\\theta})}$ exists for a.e. $ {\\theta}$. This result was obtained by Fatou.  

The space of holomorphic functions on the unit disk satisfying the bound ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is called the *Hardy space $ {H^2(\\mathbb{D})}$*, with norm $ {\\|F\\|\_{H^{2}(\\mathbb{D})}}$ defined to be the quantity on the LHS of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)). It can be identified with the closed subspace $ {\\ell^{2}(\\mathbb{Z}\_{+})}$ of the Hilbert space $ {\\ell^{2}(\\mathbb{Z})}$, or equivalently the space $ {\\mathcal{S}}$ of square integrable functions on the cirlce whose Fourier coefficients vanish for $ {n<0}$. In view of this, define the orthogonal projection from $ {L^{2}(\[0,2\\pi\])}$ to $ {\\mathcal{S}}$, and write in the corresponding element in $ {H^{2}(\\mathbb{D})}$  

$ \\displaystyle \\begin{array}{rcl} P(f)(z): & = & \\sum\_{n=0}^{\\infty}a\_{n}z^{n}.\\\\ & = & \\sum\_{n=0}^{\\infty}\\left(\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(e^{i\\theta})e^{-in\\theta}\\thinspace d\\theta\\right)z^{n}\\\\ & = & \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(e^{i\\theta})\\sum\_{n=0}^{\\infty}\\left(e^{-i\\theta}z\\right)^{n}\\thinspace d\\theta\\\\ & = & \\frac{1}{2\\pi i}\\int\_{S^{1}}\\frac{f(\\zeta)}{\\zeta-z}\\thinspace d\\zeta, \\end{array} $

which turns out to be the *Cauchy integral* on the circle. On the other hand, notice that[](https://www.blogger.com/null)  

[$ \\displaystyle P(f)(e^{i\\theta})=\\frac{f(e^{i\\theta})+iH(f)(e^{i\\theta})}{2}. \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)For this reason, $ {H(f)}$ is often called *conjugate* to $ {f}$, and hence can be also identified the imaginary part of the *Cauchy kernel* of the unit circle  

$ \\displaystyle \\frac{1}{i(\\zeta-z)}d\\zeta=\\frac{ie^{i\\psi}d\\psi}{i(e^{i\\psi}-re^{i\\theta})}=\\mathcal{P}\_{r}(\\theta-\\psi)d\\psi+\\frac{d\\psi}{2}+i\\mathcal{Q}\_{r}(\\theta-\\psi)d\\psi. $

Here $ {Q\_{r}(\\theta)}$ is known as the *conjugate Poisson kernel*. In explicit form,  

$ \\displaystyle \\mathcal{Q}\_{r}(\\theta-\\psi)=\\frac{r\\sin(\\theta-\\psi)}{1-2r\\cos\\theta+r^{2}}\\rightarrow\\frac{1}{2}\\cot(\\frac{\\theta-\\psi}{2}) $

as $ {r\\rightarrow1^{-}}$. Unlike Poisson's kernel, it is not absolutely integrable, thus called "singular'', near the diagonal $ {\\theta=\\psi}$, but note that $ {\\cot(x)}$ is an odd function on $ {\[-\\pi,\\pi\]}$, which is one manifestation of the {cancellation property} for such singular integral operators.  

Now we turn to the analogous results of the above for functions on the real line, where the unit disk is replaced by the upper half space $ {\\mathbb{R}\_{+}^{2}:=\\{(x,y)\\in\\mathbb{R}^{2}:y>0\\}}$. Starting with a function $ {F\_{0}^{\\wedge}\\in L^{2}(0,\\infty)}$, define its *Laplace transform* to be[](https://www.blogger.com/null)  

[$ \\displaystyle F(x+iy)=\\int\_{\[0,\\infty)}F\_{0}^{\\wedge}(\\xi)e^{2\\pi i\\xi z}\\thinspace d\\xi, \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)which can be viewed as an "integral version'' of Abel summation of the Fourier series $ {\\sum\_{n\\geq0}f^{\\wedge}(n)}$. (The analogue for $ {\\sum\_{n\\in\\mathbb{Z}}f^{\\wedge}(n)}$ will be given by $ {\\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)e^{-2\\pi|\\xi|y}e^{2\\pi ix\\xi}\\thinspace d\\xi}$.) Since for any $ {\\delta>0}$, if $ {y\\geq\\delta}$, the integral has the uniform bound  

$ \\displaystyle \\int\_{\[0,\\infty)}|F\_{0}^{\\wedge}(\\xi)e^{2\\pi i\\xi z}|\\thinspace d\\xi\\leq\\left(\\int\_{\[0,\\infty)}|F\_{0}^{\\wedge}(\\xi)|^{2}\\thinspace d\\xi\\right)^{1/2}\\left(\\int\_{\[0,\\infty)}e^{-4\\pi\\xi\\delta}\\thinspace d\\xi\\right)^{1/2}, $

so $ {F}$ is in fact holomorphic in $ {\\mathbb{R}\_{+}^{2}}$. Plancherel's identity implies that  

$ \\displaystyle \\int\_{\\mathbb{R}}|F(x+iy)|^{2}\\thinspace dx=\\int\_{\[0,\\infty)}|F\_{0}^{\\wedge}(\\xi)|^{2}e^{-4\\pi\\xi y}\\thinspace d\\xi\\leq\\|F\_{0}^{\\wedge}\\|\_{L^{2}(0,\\infty)}^{2} $

and by the monotone convergence theorem  

$ \\displaystyle \\sup\_{y>0}\\int\_{\\mathbb{R}}|F(x+iy)|^{2}\\thinspace dx=\\|F\_{0}^{\\wedge}\\|\_{L^{2}(0,\\infty)}^{2}. $

As before, the *Hardy space* $ {H^{2}(\\mathbb{R}\_{+}^{2})}$ is defined to be the space of holomorphic functions on $ {\\mathbb{R}\_{+}^{2}}$ satisfying the condition  

$ \\displaystyle \\sup\_{y>0}\\int\_{\\mathbb{R}}|F(x+iy)|^{2}\\thinspace dx<\\infty, $

and equipped with the norm $ {\\|F\\|\_{H^{2}(\\mathbb{R}\_{+}^{2})}}$ to be the above quantity.  

Given such a function $ {F}$ with suitable decaying property, via a contour integration argument, its *inverse Laplace transform* satisfies, for any $ {y\_{1},y\_{2}>0}$.  

$ \\displaystyle \\int\_{\\mathbb{R}}F(x+iy\_{1})e^{-2\\pi i\\xi(x+iy\_{1})}\\thinspace dx=\\int\_{\\mathbb{R}}F(x+iy\_{2})e^{-2\\pi i\\xi(x+iy\_{2})}\\thinspace dx. $

In other words, there is a *deck transformation rule*  

$ \\displaystyle F\_{y\_{1}}^{\\wedge}(\\xi)e^{2\\pi y\_{1}\\xi}=F\_{y\_{2}}^{\\wedge}(\\xi)e^{2\\pi y\_{2}\\xi}. $

A limiting argument shows this it is true for all $ {F\\in H^{2}(\\mathbb{R}\_{+}^{2})}$. Hence the function $ {F\_{0}^{\\wedge}(\\xi):=F\_{y}^{\\wedge}(\\xi)e^{2\\pi y\\xi}}$ is well defined, and by Plancherel's identity  

$ \\displaystyle \\int\_{\\mathbb{R}}|F(x+iy)|^{2}\\thinspace dx=\\int\_{\\mathbb{R}}|F\_{0}^{\\wedge}(\\xi)|^{2}e^{-4\\pi y\\xi}\\thinspace dx. $

Thus,  

$ \\displaystyle \\|F\\|\_{H^{2}(\\mathbb{R}\_{+}^{2})}=\\int\_{\\mathbb{R}}|F\_{0}^{\\wedge}(\\xi)|^{2}\\thinspace dx $

and $ {H^{2}(\\mathbb{R}\_{+}^{2})}$ can be identified with the Hilbert space $ {L^{2}(0,\\infty)}$ via ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)).  

It then follows that $ {F}$ has boundary values $ {F\_{0}}$, the inverse Fourier transform of $ {F\_{0}^{\\wedge}}$, in the $ {L^{2}}$ sense. It also holds a.e., once we have the *Poisson integral representation*  

$ \\displaystyle F(x+iy)=\\int\_{\[0,\\infty)}F\_{0}^{\\wedge}(\\xi)e^{2\\pi i\\xi z}\\thinspace d\\xi=\\int\_{\\mathbb{R}}F\_{0}(x-t)\\mathcal{P}\_{y}(t)\\thinspace dt $

or more generally,  

$ \\displaystyle \\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)e^{-2\\pi|\\xi|y}e^{2\\pi ix\\xi}\\thinspace d\\xi=\\int\_{\\mathbb{R}}f(x-t)\\mathcal{P}\_{y}(t)\\thinspace dt $

where $ {\\mathcal{P}\_{y}(x)=\\frac{1}{\\pi}\\frac{y}{x^{2}+y^{2}}}$ is the *Poisson kernel for the upper half space*. To see this, define the *Cauchy kernel* for $ {y>0}$  

$ \\displaystyle C(x+iy)=\\int\_{\\mathbb{R}}e^{2\\pi i|\\xi|z}\\thinspace d\\xi=\\int\_{\\mathbb{R}}2\\chi\_{\[0,\\infty)}e^{2\\pi i\\xi z}\\thinspace d\\xi=\\frac{i}{\\pi z}. $

Then  

$ \\displaystyle \\begin{array}{rcl} \\mathcal{P}\_{y}(x) & = & \\int\_{\\mathbb{R}}e^{-2\\pi|\\xi|y}e^{2\\pi ix\\xi}\\thinspace d\\xi\\\\ & = & \\int\_{\[0,\\infty)}e^{-2\\pi\\xi y}e^{2\\pi ix\\xi}\\thinspace d\\xi+\\int\_{\[0,\\infty)}e^{-2\\pi\\xi y}e^{-2\\pi ix\\xi}\\thinspace d\\xi\\\\ & = & \\frac{1}{2}(C(x+iy)+C(-x+iy))\\\\ & = & \\frac{1}{\\pi}\\frac{y}{x^{2}+y^{2}}. \\end{array} $

Notice that for $ {y>0}$  

$ \\displaystyle \\frac{i}{\\pi z}=\\mathcal{P}\_{y}(x)+i\\mathcal{Q}\_{y}(x) $

where $ {\\mathcal{Q}\_{y}(x)=\\frac{1}{\\pi}\\frac{x}{x^{2}+y^{2}}}$ is the *conjugate Poisson kernel*. We would like to know what happens when $ {y\\rightarrow0}$. This is the clearest in terms of multipliers. We have, corresponding to the above,  

$ \\displaystyle 2\\chi\_{\[0,\\infty)}e^{-2\\pi\\xi y}=e^{-2\\pi|\\xi|y}+\\frac{1}{i}\\text{sign}(\\xi)e^{-2\\pi|\\xi|y} $

and as $ {y\\rightarrow0}$,  

$ \\displaystyle 2\\chi\_{\[0,\\infty)}(\\xi)=1+\\text{sign}(\\xi)=1+im\_{H}(\\xi), $

where $ {m\_{H}(\\xi)=\\frac{1}{i}\\text{sign}(\\xi)}$ is the Fourier multiplier of the Hilbert transform on the real line. One thus has  

$ \\displaystyle H(f)(x)=\\lim\_{y\\rightarrow0}\\int\_{\\mathbb{R}}f(x-t)\\mathcal{Q}\_{y}(t)\\thinspace dt $

in $ {L^{2}}$. We shall now focus on distributional property of $ {\\mathcal{Q}\_{y}(t)}$ as $ {y\\rightarrow0}$. Assume $ {\\varphi}$ is a test function. For any $ {\\epsilon>0}$,  

$ \\displaystyle \\begin{array}{rcl} & & \\int\_{\\mathbb{R}}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt\\\\ & = & \\int\_{|t|<\\epsilon}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt+\\int\_{|t|\\geq\\epsilon}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt\\\\ & = & \\int\_{|t|<\\epsilon}(\\varphi(t)-\\varphi(0))\\mathcal{Q}\_{y}(t)\\thinspace dt+\\int\_{|t|\\geq\\epsilon}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt\\\\ & =: & A+B \\end{array} $

Here the {cancellation property} of $ {\\mathcal{Q}\_{y}(x)}$ plays a role. It is clear that $ {A=O(\\epsilon)}$, and so  

$ \\displaystyle \\int\_{\\mathbb{R}}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt=\\lim\_{\\epsilon\\rightarrow0}\\int\_{|t|\\geq\\epsilon}\\varphi(t)\\mathcal{Q}\_{y}(t)\\thinspace dt. $

We now wish to take $ {y\\rightarrow0}$. When $ {|t|\\geq\\epsilon}$ it is clear that $ {\\mathcal{Q}\_{y}(t)\\rightarrow\\frac{1}{\\pi t}}$ as $ {y\\rightarrow0}$. This amounts to estimate  

$ \\displaystyle \\frac{1}{\\pi}\\int\_{|t|\\geq\\epsilon}\\varphi(t)\\thinspace\\frac{dt}{t}-\\int\_{\\mathbb{R}}\\varphi(t)\\mathcal{Q}\_{\\epsilon}(t)\\thinspace dt=\\int\_{\\mathbb{R}}\\varphi(t)\\Delta\_{\\epsilon}(t)\\thinspace dt, $

where  

$ \\displaystyle \\Delta\_{\\epsilon}(t)=\\begin{cases} -\\mathcal{Q}\_{\\epsilon}(t) & \\text{if }|t|<\\epsilon\\\\ \\frac{1}{t}-\\mathcal{Q}\_{\\epsilon}(t) & \\text{if }|t|\\geq\\epsilon \\end{cases}, $

which again satisfies a cancellation property. It's then not hard to see that  

$ \\displaystyle \\begin{array}{rcl} & & \\left|\\int\_{\\mathbb{R}}\\varphi(t)\\Delta\_{\\epsilon}(t)\\thinspace dt\\right|\\\\ & = & \\left|\\int\_{|t|<\\epsilon}(\\varphi(t)-\\varphi(0))\\Delta\_{\\epsilon}(t)\\thinspace dt\\right|+\\left|\\int\_{\\epsilon\\leq|t|<1}(\\varphi(t)-\\varphi(0))\\Delta\_{\\epsilon}(t)\\thinspace dt\\right|+\\left|\\int\_{|t|\\geq1}\\varphi(t)\\Delta\_{\\epsilon}(t)\\thinspace dt\\right|\\\\ & = & O(\\epsilon+\\epsilon\\log\\epsilon+\\epsilon). \\end{array} $

We conclude that $ {\\mathcal{Q}\_{y}(x)\\rightarrow\\frac{1}{\\pi}\\text{p.v.}(\\frac{1}{x})}$ in distribution as $ {y\\rightarrow0}$, and the Hilbert transform ca be written as a singular integral operator  

$ \\displaystyle H(f)=\\frac{1}{\\pi}\\text{p.v.}(\\frac{1}{x})\*f. $

Moreover, since $ {\\mathcal{P}\_{y}(x)\\rightarrow\\frac{1}{\\pi}\\delta\_{0}}$ in distributon as $ {y\\rightarrow0}$, denoting the distributional limit of $ {\\frac{1}{z}}$ to be $ {\\frac{1}{x+i0}}$ as $ {y\\rightarrow0}$, we have the following distributional identity for kernels  

$ \\displaystyle \\frac{1}{x+i0}=\\text{p.v.}(\\frac{1}{x})-i\\pi\\delta $

corresponding to identity for multipliers above.  
Again, one can define the orthogonal projection $ {P}$ from $ {L^{2}(\\mathbb{R})}$ to the closed subspace that contains functions whose Fourier transforms are supported on $ {\[0,\\infty)}$. It is realized by the *Cauchy integral*  

$ \\displaystyle F(z)=\\int\_{\\mathbb{R}}\\frac{f(t)}{t-z}\\thinspace dt=\\int\_{\[0,\\infty)}f^{\\wedge}(\\xi)e^{2\\pi i\\xi z}\\thinspace d\\xi,\\ z\\in\\mathbb{R}\_{+}^{2} $

which maps $ {L^{2}(\\mathbb{R})}$ onto $ {H^{2}(\\mathbb{R}\_{+}^{2})}$.
