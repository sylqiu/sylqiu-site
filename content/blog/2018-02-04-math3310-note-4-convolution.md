---
id: 2018-02-04-math3310-note-4-convolution
title: "MATH3310 Note 4: Convolution"
date: 2018-02-04
tags: ["cuhk.math3310", "Fourier analysis", "teaching"]
source: https://sylqiu.blogspot.com/2018/02/math3310-note-4-convolution.html
publish: true
---
**1\. Convolution**

The notion of convolution is so fundamental in Fourier analysis and in applications (guess anyone hasn't heard of the *convolutional neural network*?). We have seen its appearance last time: that the symmetric partial sum of the Fourier series of a (say) continuous function $ {f:\[0,2\\pi\]\\rightarrow\\mathbb{C}}$ is obtained by convolving $ {f}$ with the Dirichlet kernel  

$ \\displaystyle \\sum\_{|n|\\leq N}\\hat{f}(n)e^{in\\theta}=f\*D\_{N}\\;(\\theta). $

And the solution to the Laplace equation on the unit disk is obtained by convolving the given boundary value $ {u\_{0}:S^{1}\\equiv\\partial B(0,1)\\rightarrow\\mathbb{C}}$ with the Poisson kernel  

$ \\displaystyle u(r,\\theta)=u\_{0}\*P\_{r}\\;(\\theta),\\quad0<r<1. $

In this post we aim to grasp some basic properties of convolution in the context of Fourier series.  
First, let us address again our objects of study. There are three basically equivalent categories  

-   Functions defined on $ {\[0,2\\pi\]}$;
-   Functions defined on the circle $ {S^{1}}$;
-   $ {2\\pi}$-periodic functions defined on $ {\\mathbb{R}}$;

For the first class of functions, we have the agreement that values of the function at the endpoints are not important for computing Fourier coefficient, and thus can be made equivalent to the following two classes by possibly altering the function's value at the endpoints (which may not be continuous anymore, but remains *integrable*). The second class of functions can easily be $ {2\\pi}$-periodically extended to the real line. **In the context of Fourier series, convolution of two functions is indispensable with the periodicity of the functions.** This is manifested in the following definition.   

> **Definition 1** (Convolution of two $ {2\\pi}$-periodic functions) For two continuous, $ {2\\pi}$-periodic functions $ {f,g:\\mathbb{R}\\rightarrow\\mathbb{C}}$, their convolution is again a $ {2\\pi}$-periodic function, defined to be  
> $$ \\displaystyle f\*g\\;(x)=\\int\_{\[0,2\\pi\]}f(y)g(x-y)\\;dy $$

> **Exercise 1** *Check that for the same $ {f,g}$ as above,*  
> 
> *$ \\displaystyle f\*g\\;(x)=\\int\_{\[0,2\\pi\]}f(x-y)g(y)\\;dy=g\*f\\;(x). $*

One can think of convolution $ {f\*g\\;(x)}$ as a $ {g}$-weighted averaged version of $ {f}$, or equivalently one can think of it as an $ {f}$-weighted averaged version of $ {g}$, which interpretation is more sensible depends on the context. The weight function is usually called a *kernel*. For example, we would say the interior of the solution $ {u(r,\\theta)}$ to the Laplace equation is obtained by averaging the boundary value $ {u\_{0}}$ with the Poisson kernel $ {P\_{r}}$.  

We gather some basic properties of convolution below.  

> **Exercise 2** *[](https://www.blogger.com/null)Suppose $ {f,g,h:\\mathbb{R}\\rightarrow\\mathbb{C}}$ are continuous and $ {2\\pi}$-periodic. Show that*  
> 
> *-   $ {f\*(g+h)=(f\*g)+(f\*h)}$.
> -   $ {(cf)\*g=c(f\*g)=f\*(cg)}$ for any $ {c\\in\\mathbb{C}}$.
> -   $ {(f\*g)\*h=f\*(g\*h)}$.*

The relation between convolution and Fourier coefficient is contained in the next proposition.  

> **Proposition 1** *[](https://www.blogger.com/null)Suppose $ {f,g:\\mathbb{R}\\rightarrow\\mathbb{C}}$ are continuous and $ {2\\pi}$-periodic. Then*  
> 
> *$ \\displaystyle \\widehat{f\*g}(n)=2\\pi\\hat{f}(n)\\hat{g}(n). $*

*Proof:* The result can be proved directly by writing out  

$ \\displaystyle \\begin{array}{rcl} \\widehat{f\*g}(n) & = & \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}\\left(\\int\_{\[0,2\\pi\]}f(x-y)g(y)dy\\right)e^{-inx}dx\\\\ & = & \\int\_{\[0,2\\pi\]}\\left(\\frac{1}{2\\pi}\\int\_{\[-y,2\\pi-y\]}f(x-y)e^{-in(x-y)}g(y)e^{-iny}d(x-y)\\right)dy\\\\ & = & \\int\_{\[0,2\\pi\]}\\hat{f}(n)g(y)e^{-iny}dy\\\\ & = & 2\\pi\\hat{f}(n)\\hat{g}(n). \\end{array} $

In the second step we have interchanged the integral and made a change of variable. Using the fact that $ {f(x)}$ and $ {e^{inx}}$ are $ {2\\pi}$-periodic, so that the integral gives $ {\\hat{f}(n)}$. $ \\Box$  

> **Exercise 3** *What are the Fourier coefficients of $ {f\*D\_{N}\\;(\\theta)}$, where $ {D\_{N}}$ is the $ {N}$-th Dirichlet kernel? What are the Fourier coefficients of $ {f\*P\_{r}\\;(\\theta)}$, where $ {P\_{r}}$ is the Poisson kernel with radius $ {r}$, $ {0<r<1}$? Plot the Fourier coefficients of $ {D\_{N}}$ and $ {P\_{r}}$, and how are they different?*

The above relation can be interpreted this way: as we have shown in Exercise [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exerconv), the mapping $ {f\\mapsto f\*g}$ is linear, and in analogy to matrices we can think of it as  

$ \\displaystyle f\\mapsto Gf $

for some matrix $ {G}$. Expressing these function under Fourier series, we find the very same mapping expressed in Fourier coefficients is  

$ \\displaystyle \\hat{f}(n)\\mapsto2\\pi\\hat{g}(n)\\hat{f}(n) $

or equivalently, in matrix form  

$ \\displaystyle \\hat{f}=\\begin{pmatrix}\\vdots\\\\ \\hat{f}(1)\\\\ \\hat{f}(2)\\\\ \\hat{f}(3)\\\\ \\vdots \\end{pmatrix}\\mapsto2\\pi\\begin{pmatrix}\\ddots\\\\ & \\hat{g}(1)\\\\ & & \\hat{g}(2)\\\\ & & & \\hat{g}(3)\\\\ & & & & \\ddots \\end{pmatrix}\\begin{pmatrix}\\vdots\\\\ \\hat{f}(1)\\\\ \\hat{f}(2)\\\\ \\hat{f}(3)\\\\ \\vdots \\end{pmatrix} $

in other words, the under the Fourier basis, the convolution is diagonalized! This will happen exactly the same for the discrete Fourier transform.  
We have seen that under the Fourier basis the differential operator is also diagonalized. For completeness we record this result.  

> **Exercise 4** *Show that if $ {f}$ is differentiable and $ {2\\pi}$-periodic, then*  
> 
> *$ \\displaystyle \\widehat{f'}(n)=in\\widehat{f}(n). $*
> 
> *In matrix form, this is*  
> 
> *$ \\displaystyle \\begin{pmatrix}\\vdots\\\\ \\hat{f'}(1)\\\\ \\hat{f'}(2)\\\\ \\hat{f'}(3)\\\\ \\vdots \\end{pmatrix} =  i\\begin{pmatrix}\\ddots\\\\ & 1\\\\ & & 2\\\\ & & & 3\\\\ & & & & \\ddots \\end{pmatrix}\\begin{pmatrix}\\vdots\\\\ \\hat{f}(1)\\\\ \\hat{f}(2)\\\\ \\hat{f}(3)\\\\ \\vdots \\end{pmatrix}. $*

> **Remark 1** *In fact, differentiation can also be represented as a convolution! (But to describe the kernel will be out of scope). In any case, the above diagonalization result can be seen as a special instance of a generalized version of Proposition [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propconv-diag).*

> **Exercise 5** *It is an instructive exercise to compute the convolution of two vectors $v,w\\in\\mathbb{C}^3$ (how to define convolution of two vectors of the same size?). Note that the matrix corresponds to the convolution operation commutes with the translation operator $\\tau\_y: f(x) \\mapsto f(x-y)$. What special properties do the matrix have? What are the eigenvectors of this convolution matrix?*

**2\. Using Fourier series to solve the heat equation on the circle**

Let us consider the following heat equation on the unit circle with initial and boundary condition  

$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0, & 0<x<2\\pi,\\,t>0\\\\ u(x,0)=\\sin2x+\\sin5x+\\sin7x, & 0<x<2\\pi\\\\ u(0,t)=u(2\\pi,t)=0, & t>0 \\end{cases}. $

Below I record the solution version from last year. Unfortunately **the argument** is wrong. You are invited to think about why the correct solution is obtained by pure luck with the method below.  

Write $ {u(x,t)=a\_0(t)+\\sum^\\infty\_{k=1}a\_k(t)\\cos kx+b\_k(t)\\sin kx}$. Using the PDE $ {0=\\frac{\\partial u}{\\partial t}-\\frac{\\partial^2u}{\\partial x^2}}$,[](https://www.blogger.com/null)  

[$ \\displaystyle 0=(a\_0)\_t+\\sum^\\infty\_{k=1}\\left((a\_k)\_t+k^2a\_k\\right)\\cos kx+\\left((b\_k)\_t+k^2b\_k\\right)\\sin kx \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Using the initial condition[](https://www.blogger.com/null)  

[$ \\displaystyle \\sin2x+\\sin5x+\\sin7x=a\_0(0)+\\sum^\\infty\_{k=1}a\_k(0)\\cos kx+b\_k(0)\\sin kx \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Comparing the coefficients of ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#5-1)),  

$ \\displaystyle \\begin{aligned} b\_k(0)&=\\begin{cases} 1,&\\text{ if } k=2,5,7\\\\ 0,&\\text{otherwise} \\end{cases}\\\\ a\_k(0)&=0\\quad\\forall k\\geq0 \\end{aligned} $

Comparing the coefficients of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#5-2)), then we have  

$ \\displaystyle \\begin{aligned} (a\_0)\_t&=0\\\\ (a\_k)\_t+k^2a\_k&=0\\\\ (b\_k)\_t+k^2b\_k&=0 \\end{aligned} $

Therefore, we have  

$ \\displaystyle \\begin{aligned} a\_k&=0,\\quad\\forall k\\geq 0\\\\ b\_k&=0,\\quad \\forall k\\geq 1\\text{ and }k\\neq 2,5,7 \\end{aligned} $

and for $ {k=2,5,7}$  

$ \\displaystyle b\_k=e^{-k^2t} $

Hence, the solution is  

$ \\displaystyle u(x,t)=e^{-4t}\\sin2x+e^{-25t}\\sin 5x+e^{-49t}\\sin 7x $

We will talk about why the above argument is NOT correct in the next note.  

> **Remark 2** *Let us suppose we have a nice $2\\pi$-periodic continuous function whose Fourier series converges to the function itself, i.e. $$ u\_{0}(\\theta) = \\sum\_{n\\in\\mathbb{Z}}\\hat{u\_{0}}(n)e^{in\\theta}, $$ and we set it to be the initial value of the heat equation. In addition if we think of this function to be defined on the circle, then there will be no boundary conditions. Then we can find that the solution to the heat equation is then $$ u(t,\\theta) = \\sum\_{n\\in\\mathbb{Z}}e^{-tn^2}\\hat{u\_{0}}(n)e^{in\\theta}. $$ Compare this expression with the solution to the Laplace equation. You can recognize it as obtained by convolution with certain function, which is known as the heat kernel. You may also want to compare the Fourier coefficients of the heat kernel with those of the Dirichlet and Poisson kernel.*

> **Problem 1** *What if the initial condition of the original problem is changed to $ u(0,x) = 20 $ for $0 < x < 2\\pi$ and the boundary condition is changed to $u(t,0)=u(t,2\\pi)=0$ for $ t>0$? What if the boundary condition is* *$u(t,0)=u(t,2\\pi)=20$ ? (Hint: you may find the answer in [this note](http://tutorial.math.lamar.edu/Classes/DE/SolvingHeatEquation.aspx).)*
