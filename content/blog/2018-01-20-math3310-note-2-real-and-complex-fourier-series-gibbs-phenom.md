---
id: 2018-01-20-math3310-note-2-real-and-complex-fourier-series-gibbs-phenom
title: "MATH3310 Note 2: Real and complex Fourier series; Gibbs phenomenon"
date: 2018-01-20
tags: ["cuhk.math3310", "Fourier analysis", "teaching"]
source: https://sylqiu.blogspot.com/2018/01/math3310-note-2.html
publish: true
---
The idea of representing a general function on e.g. the interval $ {\[0,2\\pi\]}$ by an infinite sum of sines and cosines was invented by Joseph Fourier (1768-1830) in the context of solving the 1D wave equation and the 2D heat equation on the unit disk. For this matter you are recommended to have a look at Chapter 1 of *Fourier Analysis: an introduction* by Stein and Shakarchi. Our lecture also motivates the study from roughly the same perspective. Here I want to stress one more point of view from the beginning which you should remember  

>   *The Fourier series of a function is a representation of the function under a particular "basis".* 

 You have probably often heard of "spectral decomposition'' or equivalently "eigen-decomposition'' used to describe the Fourier series. These terminologies are used essentially because **constant coefficent linear differential operators are diagonalized under such a representation.** Of course, diagonalized systems are much easier to solve!  

But at this moment we won't jump ahead of ourselves in a hurry to understand what these statements mean precisely. In this post we aim to grasp some basic properties of the Fourier series.  

A technical note: the object of study here appears in basically three equivalent forms:  

-   functions on the interval $ {\[0,2\\pi\]}$ (or $ \[0,2\\pi)$, or $(0,2\\pi)$, etc)
-   functions defined on the unit circle $ {S^{1}}$;
-    $ {2\\pi}$-periodic functions

The last two categories can be easily seen to be equivalent, while for the first one, to be strictly correct, one has to require $f(0)=f(2\\pi)$. We can safely ignore this issue since the effect of a point in the integration is negligible, but at the same time it's important to remember that pointwise convergence issue will arise once we choose to adapt such an relaxation. See Section 2.  

**1\. Some basic properties**

The $ {n}$-th Fourier coefficient of a continuous function $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$ is usually defined as  

$ \\displaystyle \\hat{f}(n)=\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)e^{-inx}dx. $

and the Fourier series of $ {f}$ is defined to be  

$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}\\hat{f}(n)e^{in\\theta},\\theta\\in\[0,2\\pi\] $

> **Remark 1** *We can define the Fourier coefficient of a function $ {f(y)}$ on intervals such as $ {\[0,L\]}$ by a change of variable $ {x=\\frac{2\\pi}{L}y}$ so that $ {x\\in\[0,2\\pi\]}$, and using the above definition*  
> 
> *$ \\displaystyle \\hat{f}(n)=\\frac{1}{L}\\int\_{\[0,L\]}f(y)e^{-2\\pi iny/L}dy. $*
> 
> *If the interval where the function is defined is, for example $ {\[c,c+L\]}$, then in the definition of its Fourier coefficient one can ignore the constant multiplicative factor $ {e^{-2\\pi inc/L}}$ in $ {\\frac{e^{-2\\pi inc/L}}{L}\\int\_{\[c,c+L\]}f(y)e^{-2\\pi iny/L}dy}$ and take $\\theta \\in \[0,L\]$. In the following we will mainly focus on the functions defined on $ {\[0,2\\pi\]}$ or $ {\[-\\pi,\\pi\]}$.*

It is important to note that the limit in $ {\\sum\_{n\\in\\mathbb{Z}}\\hat{f}(n)e^{in\\theta}}$ should be understood in some appropriate sense, and for certain "bad'' functions the Fourier series of $ {f}$ does not coincide with $ {f}$. Since a rigourous study is out of the scope of this course, we will only briefly remark about this point. See Remark [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#rem1) and [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#rem2) for details.  

> **Exercise 1** *Let $ {C(\[0,2\\pi\],\\mathbb{C})}$ denote the space of continuous, complex-valued functions. It is a vector space, which can be given the following Hermite inner product*  
> 
> *$ \\displaystyle \\langle f,g\\rangle=\\int\_{\[0,2\\pi\]}f(x)\\overline{g(x)}dx,\\quad f,g\\in C(\[0,2\\pi\],\\mathbb{C}) $*
> 
> *where $ {\\overline{g(x)}}$ is the complex conjugate of $ {g(x)}$. Check that*  
> 
> *$ \\displaystyle \\hat{f}(n)=\\langle f,\\frac{1}{2\\pi}e^{inx}\\rangle, $*
> 
> *so that the Fourier series can be written as*  
> 
> *$ \\displaystyle \\sum\_{n\\in\\mathbb{Z}}\\langle f,\\frac{1}{2\\pi}e^{inx}\\rangle e^{in\\theta} $*

What we have in mind here is that we have a set of "basis vectors'' $ {\\{\\frac{1}{2\\pi}e^{inx}\\}\_{n\\in\\mathbb{Z}}}$. These "basis vectors'' are in fact orthogonal, and the $ {n}$-th Fourier coefficient is basically the coefficient corresponding to the vector $ {\\frac{1}{2\\pi}e^{inx}}$.  

> **Exercise 2** *Check that for every $ {n\\in\\mathbb{Z}}$[](https://www.blogger.com/null)*  
> 
> *$ \\displaystyle \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}e^{inx}dx=\\begin{cases} 1 & \\text{if }n=0\\\\ 0 & \\text{otherwise} \\end{cases} $*

> **Exercise 3** *Using Exercise [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exer3), and $ {e^{inx}=\\cos(nx)+i\\sin(nx)}$, show that for every pair of integers $ {n,m\\geq 1}$,*  
> 
> *$ \\displaystyle \\int\_{\[0,2\\pi\]}\\cos(nx)\\cos(mx)dx=\\begin{cases} \\pi & \\text{if }n=m\\\\ 0 & \\text{otherwise} \\end{cases} $*
> 
> *and similarly*  
> 
> *$ \\displaystyle \\int\_{\[0,2\\pi\]}\\sin(nx)\\sin(mx)dx=\\begin{cases} \\pi & \\text{if }n=m\\\\ 0 & \\text{otherwise} \\end{cases}. $*
> 
> *Finally, show that*  
> 
> *$ \\displaystyle \\int\_{\[0,2\\pi\]}\\cos(nx)\\sin(mx)dx=0\\quad\\forall n,m\\in\\mathbb{Z}. $*
> 
> *They are easy by observing $ {\\cos(nx)=\\frac{e^{inx}+e^{-inx}}{2}}$, $ {\\sin(nx)=\\frac{e^{inx}-e^{-inx}}{2i}}$.*

> **Exercise 4** *In this exercise we show how the symmetries of a function imply certain properties of its Fourier series. Let $ {f\\in C(\[-\\pi,\\pi\],\\mathbb{C})}$, and*  
> 
> *$ \\displaystyle \\hat{f}(n)=\\frac{1}{2\\pi}\\int\_{\[-\\pi,\\pi\]}f(x)e^{-inx}dx $*
> 
>   
> 
> *-   Show that the Fourier series of the function $ {f}$ can be written as
>     
>     $ \\displaystyle \\hat{f}(0)+\\sum\_{n=1}^{\\infty}\[\\hat{f}(n)+\\hat{f}(-n)\]\\cos\\theta+i\[\\hat{f}(n)-\\hat{f}(-n)\]\\sin\\theta. $
>     
> -   Show that if $ {f}$ is even, then $ {\\hat{f}(n)-\\hat{f}(-n)=0}$, so we get a cosine series (with possibly complex coefficients).
> -   Show that if $ {f}$ is odd, then $ {\\hat{f}(n)+\\hat{f}(-n)=0}$, so we get a sine series (with possibly complex coefficients).
> -   Show that $ {f:\[-\\pi,\\pi\]\\rightarrow\\mathbb{R}}$, i.e. real valued, if and only if $ {\\overline{\\hat{f}(n)}=\\hat{f}(-n)}$. So the coefficients of cosines and sines are real. Because of this property, if $ {f}$ is real-valued, sometimes we call
>     
>     $ \\displaystyle \\hat{f}(0)+\\sum\_{n=1}^{\\infty}\[\\hat{f}(n)+\\hat{f}(-n)\]\\cos\\theta+i\[\\hat{f}(n)-\\hat{f}(-n)\]\\sin\\theta $
>     
>     the real Fourier series, and
>     
>     $ \\displaystyle \\sum\_{n=-\\infty}^{\\infty}\\hat{f}(n)e^{in\\theta} $
>     
>     the complex Fourier series. They are seen to be equivalent expressions for $ {f\\in C(\[-\\pi,\\pi\],\\mathbb{R})}$.*

**2\. An example of Fourier series: $ {f(x)=x,-\\pi\\leq x\\leq\\pi}$**

This example is done in class. Let's compute its Fourier coefficients  

$ \\displaystyle \\begin{array}{rcl} \\hat{f}(n) & = & \\frac{1}{2\\pi}\\int\_{\[-\\pi,\\pi\]}xe^{-inx}dx\\\\ & = & -\\frac{1}{2\\pi}\\int\_{\[-\\pi,\\pi\]}-\\frac{1}{in}e^{-inx}dx+\[-x\\frac{1}{2\\pi in}e^{-inx}\]\_{-\\pi}^{\\pi}\\\\ & = & \\begin{cases} 0 & \\text{if }n=0\\\\ -\\frac{1}{in} & \\text{if }n\\neq0\\text{ is even}\\\\ \\frac{1}{in} & \\text{if }n\\text{ is odd} \\end{cases}. \\end{array} $

And hence its Fourier series is  

$ \\displaystyle \\frac{1}{i}\\sum\_{n\\neq0}\\frac{(-1)^{n-1}}{n}e^{in\\theta}. $

> **Exercise 5** *Show that the symmetric partial sum of the above series is equal to*  
> 
> *$ \\displaystyle \\frac{1}{i}\\sum\_{0<|n|\\leq N}\\frac{(-1)^{n-1}}{n}e^{in\\theta}=2\\sum\_{n=1}^{N}(-1)^{n-1}\\frac{\\sin(n\\theta)}{n} $*

> **Exercise 6** *Show that, for every $ {\\theta\\in(-\\pi,\\pi)}$, the symmetric partial sum of the above series converges. At $ {\\theta=\\pm\\pi}$, the limit of the series is equal to $ {0}$.*

I plotted the symmetric partial sum for $ {N=1,4,30}$ below.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbTnuahgKPgvcTu-wut3LTGkTWE6NiVvq1tWXY8xFDlEl-n2YsBXBaqzH_BfC5KlcwogLd9B5IOVtjJIXBgOO002w2CfhPItNEMs0tSZ4n6LmmCs894FY7mTib3emvo7bG2AV7WfTESw8/s320/gibbs.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbTnuahgKPgvcTu-wut3LTGkTWE6NiVvq1tWXY8xFDlEl-n2YsBXBaqzH_BfC5KlcwogLd9B5IOVtjJIXBgOO002w2CfhPItNEMs0tSZ4n6LmmCs894FY7mTib3emvo7bG2AV7WfTESw8/s1600/gibbs.jpg)

Now you might wonder why a function nice as $ {f(x)=x}$ will have its fourier series not agreeing with it at $ {x=\\pm\\pi}$. The catch is that the function $ {f(x)=x}$, although is continuous on $ {(-\\pi,\\pi)}$, is actually not a continuous function once $ {2\\pi}$-periodically extended. So from this point of view it is more similar to a "saw-tooth'' function than a nice continuous function.  

> **Remark 2** *[](https://www.blogger.com/null)Note that the symmetric parital sum near the discontinuity also overshoots the original function by roughly 18%. It turns out that this over-shoot cannot be entirely avoided by taking $ {N}$ larger. This is known as the ***Gibbs phenomenon***. In general, the pointwise convergence of Fourier series is localized and it exhibits bad pointwise convergence behavior near discontinuities. In fact, quantitative assumptions must be made since one can even construct a continuous function whose Fourier series diverges at one point. The reasons for these issues are well-understood in harmonic analysis.*

> **Remark 3** *[](https://www.blogger.com/null)What special advantage the inner product formulation of the Fourier coefficient gives us, is that we are then able to prove certain best approximation properties of the (partial) Fourier series, where orthogonality is a very handy tool. This formulation is more often called the "mean-squared'', or $ {L^{2}}$-formualtion of Fourier series. Convergene in the "mean-squared'' sense are then quite easy to establish for quite general functions, which are not necessarily continuous. For more details, you can refer to Chapter 3 of *Fourier Analysis: an introduction* by Stein and Shakarchi.*

The ringing effect (I called incorrectly it aliasing effect, which is another thing) is closely related to Gibbs phenomenon. Photo from Wikipedia  

[![](https://upload.wikimedia.org/wikipedia/commons/3/3b/Ringing_artifact_example.png)](https://upload.wikimedia.org/wikipedia/commons/3/3b/Ringing_artifact_example.png)
