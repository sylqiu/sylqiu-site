---
id: 2018-01-27-math3310-note-3-best-approximation-property-of-fourier-serie
title: "MATH3310 Note 3: Best approximation property of Fourier series; \"good\" and \"bad\" approximation to the Dirac delta"
date: 2018-01-27
tags: ["cuhk.math3310", "Fourier analysis", "teaching"]
source: https://sylqiu.blogspot.com/2018/01/math3310-note-3.html
publish: true
---
**1\. Best approximation property of Fourier series**

Last time we considered the vector space $ {C(\[0,2\\pi\],\\mathbb{C})}$ (with coefficient in $ {\\mathbb{C}}$, of course) and equipped it with the Hermite inner product  

$ \\displaystyle \\langle f,g\\rangle=\\int\_{\[0,2\\pi\]}f(x)\\overline{g(x)}dx. $

The inner product induces a norm $ {\\|f\\|=\\left(\\langle f,f\\rangle\\right)^{1/2}}$. The distance between two functions $ {f,g}$ is then $ {\\|f-g\\|}$.  

Recall that the $ {n}$-th Fourier coefficient is obtained by  

$ \\displaystyle \\hat{f}(n)=\\frac{1}{2\\pi}\\langle f,e^{inx}\\rangle, $

and we showed that the family $ {\\{e^{inx}\\}\_{n\\in\\mathbb{Z}}}$ is orthogonal, meaning that  

$ \\displaystyle \\langle e^{inx},e^{imx}\\rangle=\\begin{cases} 2\\pi & \\text{if }n=m\\\\ 0 & \\text{otherwise} \\end{cases}. $

In other words, $ {{\\displaystyle \\langle f,\\frac{e^{inx}}{\\|e^{inx}\\|}\\rangle\\frac{e^{inx}}{\\|e^{inx}\\|}=\\hat{f}(n)e^{inx}}}$ is obtained by projecting $ {f}$ onto the 1-dimensional linear subspace spanned by $ {e^{inx}}$. And the Fourier series of $ {f}$ the summation of all these orthogonal pieces together  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}\\hat{f}(n)e^{inx}. $

With this geometric picture in mind we can now prove quite easily that, e.g. the projected function $ {\\hat{f}(n)e^{inx}}$ minimizes the distance  

$ \\displaystyle \\|f-g\\|,\\quad g=ce^{inx},c\\in\\mathbb{C}. $

This will follow from Pythagoras theorem for inner product spaces.  

> **Theorem 1** *(Pythagoras) Let $ {(V,\\langle\\cdot,\\cdot\\rangle)}$ be an inner product space. If $ {X,Y\\in V}$ and $ {\\langle X,Y\\rangle=0}$, then*  
> 
> *$ \\displaystyle \\|X+Y\\|^{2}=\\|X\\|^{2}+\\|Y\\|^{2}. $*

*Proof:* Expanding the squre $ {\\|X+Y\\|^{2}}$ and using the bilinearity and symmetric property of the inner prodcut we find that  

$ \\displaystyle \\begin{array}{rcl} \\|X+Y\\|^{2} & = & \\langle X+Y,X+Y\\rangle\\\\ & = & \\langle X,X+Y\\rangle+\\langle Y,X+Y\\rangle\\\\ & = & \\langle X,X\\rangle+\\langle X,Y\\rangle+\\langle Y,X\\rangle+\\langle Y,Y\\rangle\\\\ & = & \\|X\\|^{2}+\\|Y\\|^{2}. \\end{array} $

$ \\Box$  

 Now to show the minimization property, we consider for arbitrary $ {c\\in\\mathbb{C}}$,  

$ \\displaystyle \\|f-ce^{inx}\\|^{2}=\\|f-\\hat{f}(n)e^{inx}+(\\hat{f}(n)-c)e^{inx}\\|. $

Note that  

$ \\displaystyle \\langle f-\\hat{f}(n)e^{inx},e^{inx}\\rangle=\\langle f,e^{inx}\\rangle-2\\pi\\hat{f}(n)=0, $

so that $ {f-\\hat{f}(n)e^{inx}}$ is orthogonal to $ {(\\hat{f}(n)-c)e^{inx}}$. Then we have by the Pythagoras theorem,  

$ \\displaystyle \\|f-ce^{inx}\\|^{2}=\\|f-\\hat{f}(n)e^{inx}\\|^{2}+\\|(\\hat{f}(n)-c)e^{inx}\\|^{2}. $

Since $ {\\|(\\hat{f}(n)-c)e^{inx}\\|^{2}\\geq0}$ for any $ {c}$, this implies  

$ \\displaystyle \\|f-\\hat{f}(n)e^{inx}\\|^{2}\\leq\\|f-ce^{inx}\\|^{2},\\quad\\forall c\\in\\mathbb{C}. $

> **Exercise 1** Generalise the above argument to any finite sum of the terms in the Fourier series with $ {\\text{span}\\{e^{inx}\\}}$ replaced the corresponding subspace. We thus see that the finite Fourier sum are the best approximation of the given function $ {f}$ using complex exponentials (i.e. trignometric polynomials), using the norm $ {\\|\\cdot\\|}$ we defined before as the "error metric''.

> **Remark 1** *The space $ {C(\[0,2\\pi\],\\mathbb{C})}$ is particular nice since we can always make sense of the integrals such as $ {\\int\_{\[0,2\\pi\]}f(x)e^{-inx}dx}$ whenever $ {f\\in C(\[0,2\\pi\],\\mathbb{C})}$ as a Riemann integral. The above argument will also work for the more general space of Riemann square-integrable functions and Lebesgue square-integrable functions.*

We have one more remarkable property of Fourier coefficients, namely  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}|\\hat{f}(n)|^{2}=\\int\_{\[0,2\\pi\]}|f(x)|^{2}dx,\\quad f\\in C(\[0,2\\pi\],\\mathbb{C}) $

We call this the isometry property of Fourier coefficient, and the equality is often called the *Parseval's identity*. This follows from the best approximation property and the Weierstrass approximation theorem, which states that continuous functions can be approximated to arbitrary accuracy by trignometric polynomials. We won't get into the details here. After we introduce the discrete Fourier transform, you will definitely recognize the similarity. Spoiler: discrete Fourier transform is a unitary linear transform of finite dimensional vector space (or unitary up to a constant, depending on the definition convention).  

**2\. Dirichlet kernel; Poisson kernel**

The Dirichlet kernel arises from the symmetric partial sum formula  

$ \\displaystyle \\begin{array}{rcl} \\sum\_{|n|\\leq N}\\hat{f}(n)e^{in\\theta} & = & \\sum\_{|n|\\leq N}\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)e^{-inx}e^{in\\theta}dx\\\\ & = & \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)\\sum\_{|n|\\leq N}e^{i(\\theta-x)n}dx\\\\ & = & f\*D\_{N}(\\theta) \\end{array} $

where $ {\*}$ stands for convolution, and $ {D\_{N}(x)=\\frac{1}{2\\pi}\\sum\_{|n|\\leq N}e^{ixn}}$ is called the *$ {n}$-th Dirichlet kernel*.  

> **Exercise 2** Show that for each $ {N\\in\\mathbb{N}}$,  
> $$ \\displaystyle \\int\_{\[0,2\\pi\]}\\frac{1}{2\\pi}\\sum\_{|n|\\leq N}e^{inx}dx=1. $$

We showed in class that  

$ \\displaystyle \\sum\_{|n|\\leq N}e^{ixn}=\\frac{\\sin(N+\\frac{1}{2})x}{\\sin\\frac{1}{2}x} $

and below I plotted the graph for this kernel when $ {N=1,4,10}$ respectively.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiX2p8f_TQzHfqj99dQo65x6nlynRU-loc9_sX27_AFe4wtOGjoK5AcNc_EnCYsE1PAuzrArXNu6s8kLI_6Tc0XsLid-4jm59HEkxjBo1nRiIkg5eXmiqailuruL56VwnG0-bY-udvMPN4/s320/dirichlet_kernel.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiX2p8f_TQzHfqj99dQo65x6nlynRU-loc9_sX27_AFe4wtOGjoK5AcNc_EnCYsE1PAuzrArXNu6s8kLI_6Tc0XsLid-4jm59HEkxjBo1nRiIkg5eXmiqailuruL56VwnG0-bY-udvMPN4/s1600/dirichlet_kernel.jpg)

 You can see that the kernel fluctuate more and more when $ {N}$ gets larger, peaking at origin. Notice also that the it takes both positive and negative values. This type of fluctuatation should be considered as very large. In fact, one can show  

$ \\displaystyle \\int\_{\[0,2\\pi\]}|D\_{N}(x)|dx\\geq C\\log N $

for some constant $ {C>0}$. This implies that the absolute integral of the Dirichlet kernels cannot be uniformly bounded. It is this fact that leads to the Gibbs phenomenon we mentioned in the last tutorial. Nevertheless, it is possible to make sense of the convergence in appropriate sense  

$ \\displaystyle D\_{N}(x)\\rightarrow\\delta\_{0}(x) $

where $ {\\delta\_{0}(x)}$ is the "Dirac delta function'' at the origin. For example, the pointwise convergence of the symmetric partial sum holds for smooth functions; also, the convergence  

$ \\displaystyle \\sum\_{|n|\\leq N}\\hat{f}(n)e^{inx}\\rightarrow f(x)\\text{ in the norm }\\|\\cdot\\|, $

can be seen as  

$ \\displaystyle f\*D\_{N}\\rightarrow f\*\\delta\_{0}=f\\text{ in the norm }\\|\\cdot\\|. $

We only need to know the qualitative behavior here. In any case, the Dirichlet kernel can be thought of a "bad'' approximation of the "Dirac delta function''.  

Now we turn to the Poisson kernel. It is closely related to the following boundary value problem[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{cases} \\Delta u=0 & \\text{in }B(0,1)\\subset\\mathbb{R}^{2}\\\\ u=u\_{0} & \\text{on }\\partial B(0,1) \\end{cases}. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)In class we made the ansatz that the solution is of the form  

$ \\displaystyle u(r,\\theta)=a\_{0}+\\sum\_{k=1}^{\\infty}(a\_{k}\\cos k\\theta+b\_{k}\\sin k\\theta)r^{k} $

where $ {(r,\\theta)}$ is the polar coordinate in $ {\\mathbb{R}^{2}}$. Using Exercise 4 of Tutorial note 2, we can recognize it as the so-called *Abel summation* of the Fourier series of a real valued function  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}r^{|n|}\\hat{g}(n)e^{in\\theta}. $

Note that when $ {0<r<1}$, this expression is absolutely summable if e.g. $ {\\hat{g}(n)}$ are uniformly bounded!  
What is the function $ {g}$ here? Suppose $ {g}$, defined on the unit circle $ {\\partial B(0,1)}$, is nice and smooth. Letting $ {r\\rightarrow1}$, we should have  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}\\hat{g}(n)e^{in\\theta}=g(\\theta)=u\_{0}(\\theta). $

In other words,  

$ \\displaystyle \\hat{g}(n)=\\widehat{u\_{0}}(n). $

Hence  

$ \\displaystyle \\begin{array}{rcl} u(r,\\theta) & = & \\sum\_{n\\in\\mathbb{Z}}r^{|n|}\\widehat{u\_{0}}(n)e^{in\\theta}\\\\ & = & \\sum\_{n\\in\\mathbb{Z}}r^{|n|}\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}u\_{0}(x)e^{-inx}dx\\\\ & = & \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}u\_{0}(x)\\sum\_{n\\in\\mathbb{Z}}r^{|n|}e^{in(\\theta-x)}dx \\end{array} $

which again we recognize as a convolution  

$ \\displaystyle u(r,\\theta)=u\_{0}\*P\_{r}(\\theta) $

where  

$ \\displaystyle \\begin{array}{rcl} P\_{r}(\\theta) & = & \\frac{1}{2\\pi}\\sum\_{n\\in\\mathbb{Z}}r^{|n|}e^{in\\theta}\\\\ & = & \\frac{1}{2\\pi}(\\frac{re^{-i\\theta}}{1-re^{-i\\theta}}+1+\\frac{re^{i\\theta}}{1-re^{i\\theta}})\\\\ & = &\\frac{1}{2\\pi} \\frac{1-r^{2}}{1+r^{2}-2r\\cos\\theta} \\end{array} $

is the *Poisson kernel* with parameter $ {r}$. We can check that the solution to the boundary value problem ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is given by convolution of the boundary value with the Poisson kernel.  

> **Exercise 3** Show that for all $ {0<r<1}$,  
> $$ \\displaystyle \\int\_{\[0,2\\pi\]}|P\_{r}(\\theta)|d\\theta=1. $$  
> Note that $ {P\_{r}(\\theta)>0}$ for all $ {0<r<1}$ and $ {\\theta\\in\[0,2\\pi\]}$.

 Now you should think of $ {u(r,\\theta)}$ as an approximation of $ {u\_{0}}$ here, where you have a parameter $ {r}$ to adjust how closely you want it to approximate $ {u\_{0}}$ (by making $ {r}$ close to $ {1}$) or how smooth you want $ {u(r,\\theta)}$ (by making $ {r}$ closer to zero). You can compare $ {r}$ with the $ {N}$ in Dirichlet kernel. I plotted the kernel for $ {r=0.3,0.5,0.8}$ below.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiGGMhyphenhyphenmIqxCHmR5txIUmz6lk-UnsypfaAF-vlsX7u3GTkwTwtC_v6LF0xphLJCL8ZuPolPW8DKnc8sgtpyFshOoYreZd35mQ51E2KgROImKbjZm9QiQYmWXNMvUolJGNSqjvMsQt8Yxc/s320/poisson_kernel.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiGGMhyphenhyphenmIqxCHmR5txIUmz6lk-UnsypfaAF-vlsX7u3GTkwTwtC_v6LF0xphLJCL8ZuPolPW8DKnc8sgtpyFshOoYreZd35mQ51E2KgROImKbjZm9QiQYmWXNMvUolJGNSqjvMsQt8Yxc/s1600/poisson_kernel.jpg)

Notice that the kernel is always positive and its absolute integral is uniformly bounded. This stands in strong contrast to the Dirichlet kernel. And we say that the Poisson kernal is a "good'' approximation of the "Dirac delta function".  

There is also a physical interpretation for the Poisson kernel. Imaging putting a ideal charge on the boundary of the disk, say at $(1,0)$. Then the Poisson kernel describes the (negative) electrical potential inside the unit disk. I plotted the figure below.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEioe3C9XivyP9DV4lYN3WyxKxuvtIcBp3zjFKj__QQK0JdJkY4nQ0AssnXJ8A8dYrWHCyzItmQfDeFyrMqr04tAkX4vSielpZYQJX7WebYNNaOkMS0-_ciqLgALNf_8TfafnX6Xi3u63HU/s320/dirac_charge.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEioe3C9XivyP9DV4lYN3WyxKxuvtIcBp3zjFKj__QQK0JdJkY4nQ0AssnXJ8A8dYrWHCyzItmQfDeFyrMqr04tAkX4vSielpZYQJX7WebYNNaOkMS0-_ciqLgALNf_8TfafnX6Xi3u63HU/s1600/dirac_charge.jpg)
