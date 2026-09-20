---
id: 2018-02-14-math3310-note-6-the-fourier-transform-on
title: "MATH3310 Note 6: The Fourier transform on $\\mathbb{R}$"
date: 2018-02-14
tags: ["cuhk.math3310", "Fourier analysis", "teaching"]
source: https://sylqiu.blogspot.com/2018/02/math3310-note-6-fourier-transform-on.html
publish: true
---
In many ways the Fourier transform on $ {\\mathbb{R}}$  

$ \\displaystyle f(x)\\mapsto\\hat{f}(\\omega):=\\int\_{\\mathbb{R}}f(x)e^{-i\\omega x}dx,\\quad x,\\omega\\in\\mathbb{R} $

is similar to the transformation that gets us the Fourier coefficient of a function on $ {\[0,2\\pi\]}$  

$ \\displaystyle f(x)\\mapsto\\hat{f}(n)=\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)e^{-inx}dx,\\quad x\\in\[0,2\\pi\],n\\in\\mathbb{Z}. $

We shall see these similarities and comparisons later on. But first of all, just like the study of Fourier series, we need to make clear what is the object of study in the context of Fourier transfrom on $ {\\mathbb{R}}$:  

-   Functions on $ {\\mathbb{R}}$ with \`\`reasonable'' decay near the infinity $ {\\pm\\infty.}$ For the sake of simplicity, we can just pretend that these functions are continuous with compact supports, i.e. the closure of the set

    $ \\displaystyle \\{x\\in\\mathbb{R}:f(x)\\neq0\\} $

    is compact in $ {\\mathbb{R}}$, with the usual topology.

With the above agreement, then defining the integral $ {\\hat{f}(\\omega)}$ for each $ {\\omega}$ will not be an issue. The function $ {\\hat{f}(\\omega)}$ is called the Fourier transform of $ {f}$, and $ {\\omega}$ is often called the *frequency variable*.  
The Fourier transform is easily seen to be a linear transform. Let us see three examples.  

> **Example 1** *$ {\\:}$*  
> 
> *-   The Fourier transform of the \`\`Dirac delta function'' at the origin $ {\\delta\_{0}(x)}$ is
>     
>     $ \\displaystyle \\int\_{\\mathbb{R}}\\delta\_{0}(x)e^{-i\\omega x}dx=e^{0}=1. $
>     
> -   The Fourier transform of the function
>     
>     $ \\displaystyle f(x)=\\begin{cases} e^{-ax} & \\text{if }x\\geq0\\\\ e^{ax} & \\text{if }x<0 \\end{cases} $
>     
>     where $ {a>0}$, is
>     
>     $ \\displaystyle \\begin{array}{rcl} \\hat{f}(x) & = & \\int\_{-\\infty}^{0}e^{ax}e^{-i\\omega x}dx+\\int\_{0}^{\\infty}e^{-ax}e^{-i\\omega x}dx\\\\ & = & \\frac{1}{a-i\\omega}+\\frac{1}{a+i\\omega}\\\\ & = & \\frac{2a}{a^{2}+\\omega^{2}}. \\end{array} $
>     
> -   The Fourier transform of the Gaussian function
>     
>     $ \\displaystyle f(x)=\\frac{1}{\\sqrt{\\pi}}e^{-x^{2}} $
>     
>     is still a Gaussian
>     
>     $ \\displaystyle \\hat{f}(x)=2\\sqrt{\\pi}e^{-x^{2}}. $
>     *

> **Remark 1** *In fact, the function*  
> 
> *$ \\displaystyle P\_{a}(x)=\\frac{1}{\\pi}\\frac{a}{a^{2}+x^{2}} $*
> 
> *is called the Poisson kernel on the real line $ {\\mathbb{R}}$. Try to connect what you know about approximation of the delta function with the above Example.*

In general, it is good to think of the function $ {\\hat{f}(\\omega)}$ as a measure of how smooth the function $ {f}$ is:  

-   If $ {\\hat{f}(\\omega)}$ is \`\`large'' beyond certain threshold $ {|\\omega|>C}$, then the function is considered as rough, and oscillatory. An extreme example is the \`\`Dirac delta function'', whose frequency spreads out equally on the real line.
-   If instead $ {\\hat{f}(\\omega)}$ is \`\`small'' when $ {|\\omega|>C}$, then the function is considered as smooth. An good example is the Gaussian function.

To understand this better we make an analogy with the Fourier series. To do this, let us first come to the inversion map that recovers the function from its Fourier transform.  

  **The inverse Fourier transform.** We have, for nice functions $ {f:\\mathbb{R}\\rightarrow\\mathbb{C}}$  

$ \\displaystyle f(x)=\\frac{1}{2\\pi}\\int\\hat{f}(\\omega)e^{ix\\omega}d\\omega. $

Now you can compare this with the Fourier series $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$  

$ \\displaystyle f(x)=\\sum\_{n\\in\\mathbb{Z}}\\hat{f}(n)e^{inx}. $

We can still think of the function as a superposition of different freqeuncies, $ {e^{ix\\omega}}$, each with coefficient $ {\\hat{f}(\\omega)}$, only that the sum is replaced by an integral. Of course, $ {e^{ix\\omega}}$, with variable in $ {x}$, oscillate very much when $ {\\omega}$ is large, and is smooth when $ {\\omega}$ is small. And the Fourier transform evaluated at $ {\\omega}$ just shows how much this frequency is present in the function.  
Many intuitions about Fourier coefficient thus still hold about the Fourier transform.  

> **Exercise 1** *Show that*  
> 
> 1.  For a function $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$, its zero-th Fourier coefficient $ {\\hat{f}(0)}$ is the average of the function $ {f}$ up to dividing by $ {2\\pi}$ 
>     
>     $ \\displaystyle \\hat{f}(0)=\\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)dx. $
>     
> 2.  For a function $ {f:\\mathbb{R}\\rightarrow\\mathbb{C}}$, its Fourier transform evaluated at $ {0}$ is the average of the function 
>     
>     $ \\displaystyle \\hat{f}(0)=\\int\_{\\mathbb{R}}f(x)dx. $ 
>     

**Interaction with convolution.** We can define convolution of two functions on $ {\\mathbb{R}}$,  

$ \\displaystyle f\*g(x)=\\int\_{\\mathbb{R}}f(y)g(x-y)dy $

whenever the right hand side makes sense (convergent). With straightforward computations we can show  

> **Exercise 2**    *[](https://www.blogger.com/null)$ {\\hat{f}(\\omega)\\hat{g}(\\omega)=\\widehat{f\*g}(\\omega).}$*

Of course this is in spirit the same with the result about the Fourier coefficients. Here we have essentially the same interpretation: the Fourier transform on $ {\\mathbb{R}}$ diagonalizes convolution on $ {\\mathbb{R}}$.  

**The "unitarity" of the Fourier transform.** Just as in the case of Fourier series, where we have, for a function $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$,  

$ \\displaystyle \\int\_{\[0,2\\pi\]}|f(x)|^{2}dx=2\\pi\\sum\_{n\\in\\mathbb{Z}}|\\hat{f}(n)|^{2}. $

in the situation of the Fourier transform, we have  

> **Exercise 3**    *$ {2\\pi\\int\_{\\mathbb{R}}|f(x)|^{2}dx=\\int\_{\\mathbb{R}}|\\hat{f}(\\omega)|^{2}d\\omega}$. (Hint: use Exercise [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exer4).)*

The right way to see this is to interprete the mapping  

$ \\displaystyle f\\mapsto\\frac{1}{\\sqrt{2\\pi}}\\hat{f} $

as a unitary mapping, where the mapping is unitary means it preserves the Hermite inner product. Just like the case of matrices, the inverse of a unitary mapping is just its Hermittian adjoint.

**Solving differential equations using Fourier transform.** Because the in the Fourier transform, one must use the whole real line the compute the integral  

$ \\displaystyle \\hat{f}(\\omega)=\\int\_{\\mathbb{R}}f(x)e^{-i\\omega x}dx, $

the differential equation that can be solved is always on $ {\\mathbb{R}}$, that means there is no boundary term. Because of our object of study is function with \`\`reasonable'' decay near the inifinity, the data term and the solution must also be of such kind.  

> **Exercise 4** *Solve the following heat equation on the real line by taking the Fourier transform in the spatial variable $ {x}$*  
> 
> *$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0 & (t,x)\\in(0,\\infty)\\times\\mathbb{R}\\\\ u(0,x)=u\_{0}(x) & x\\in\\mathbb{R} \\end{cases}. $*

**The sampling theorem.** A function $ {f:\\mathbb{R}\\rightarrow\\mathbb{C}}$ is called $ {(-\\pi,\\pi)}$-*band-limited* if its Fourier transform $ {\\hat{f}:\\mathbb{R}\\rightarrow\\mathbb{C}}$ is supported inside the open interval $ {(-\\pi,\\pi)}$, that is

$ \\displaystyle \\{\\omega:\\hat{f}(\\omega)\\neq0\\}\\subset(-\\pi,\\pi). $

Intuitively, we know that this function $ {f}$ cannot oscillate too fast. What is amazing is the fact that the function $ {f}$ is entirely determined by its value at a discrete set of points in $ {\\mathbb{R}}$. In the following exercise we will derive such a reconstruction formula.  

> **Exercise 5**  
> 
> *-   Assume the inverse Fourier transform is valid for the function $ {f}$. Show that *$ \\displaystyle f(x)=\\frac{1}{2\\pi}\\int\_{\[-\\pi,\\pi\]}\\hat{f}(\\omega)e^{ix\\omega}d\\omega. $**  2.  Now that $ {\\hat{f}}$ can be thought of as a function defined on the interval $ {\[-\\pi,\\pi\]}$, which vanishes on the two end points, we can express $ {\\hat{f}}$ in terms of its Fourier series. What are the Fourier coefficients $ {\\{a\_{n}\\}\_{n\\in\\mathbb{Z}}}$ of $ {\\hat{f}}$?
> 3.  By substituting the Fourier series expression of $ {\\hat{f}}$ inside the Fourier inversion, i.e.*$ \\displaystyle f(x)=\\frac{1}{2\\pi}\\int\_{\[-\\pi,\\pi\]}\\left(\\sum\_{n\\in\\mathbb{Z}}a\_{n}e^{in\\omega}\\right)e^{ix\\omega}d\\omega, $*
> 4.  show that *$ \\displaystyle f(x)=\\sum\_{n\\in\\mathbb{Z}}f(n)\\frac{\\sin\\pi(x-n)}{\\pi(x-n)}. $*

The above is often called the *Shannon-Nyquist sampling theorem*. We can think of $ {f(n)}$ as sampled from the original function $ {f}$. The sampling point are at the integers, where two neighboring sampling points are of distance $ {1=\\frac{1}{2}\\cdot\\frac{\\text{length}(\[-\\pi,\\pi\])}{\\pi}}$, which is often called the *Nyquist rate* of sampling. In real life signals may come with very high frequency, to the extent that the equipment at hand cannot capture at this reconstruction rate. This will make some different frequency appears identical to the equipment, producing the *aliasing effect*. But nevertheless, it is possible to sample certain special signals below this criticial Nyquist rate, a subject now known as *compressed sensing*.
