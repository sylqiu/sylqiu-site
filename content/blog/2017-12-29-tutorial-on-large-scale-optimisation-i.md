---
id: 2017-12-29-tutorial-on-large-scale-optimisation-i
title: "Tutorial on large scale optimisation:I"
date: 2017-12-29
tags: ["numerical methods", "optimization", "teaching"]
source: https://sylqiu.blogspot.com/2017/12/tutorial-on-large-scale-optimisationi.html
publish: true
---
In this post we study some fundamental mathematical notions and algorithms for optimisation. As is typical today, the problems in application often involve $\\sim 10^6$ number of variables or even larger. However these problems often have special structures to exploit.  

 Before we arrive at one of the most famous algorithms, i.e. *alternating direction method of multipliers (ADMM)*, we shall prepare ourselves to grasp enough mathematical background to make sense of the algorithm and its performance. The two corner stones are  

-   Proximal mappings and proximal point methods;
-   Lagrange duality.

These two topics are covered in the first two sections of the post. We will also cover some preliminary convergence analysis for simple algorithms such as gradient descent and a simple instance of proximal point methods. After we shall give an introduction to the family of methods called *operator splitting*, to which ADMM belongs.  

 The main reference of this post is Prof.Vandenberghe and Prof. Boyd lecture notes, and I organise the materials according to my own style. I also plan to talk about the operator splitting in the framework of monotone operators, and acceleration techniques in a subsequent post.  

 For the interested readers outside of mathematics, I would say the pre-requisite for this post includes basic linear algebra with knowledge about inner product spaces and normed vector spaces, and some vector calculus. There aren't many fancy maths but it requires instead some comfort to stay with the various new concepts that come up. In particular, readers will be strongly suggested to try all the exercises. I will be very happy to hear your suggestions & report typos.  

Some notation conventions: we shall usually denote the Euclidean inner product as $ {\\langle \\cdot,\\cdot\\rangle}$, the $ {\\ell^2}$-norm as $ {\\|\\cdot\\|}$, while other inner products and norms are specified via subscripts.  

**1\. Fundamental first order methods** 

An implementable algorithm used to solve an optimisation problem, e.g.  

$ \\displaystyle \\min\_{x\\in\\mathbb{R}^d}f(x). $

is called a first order method if it involves only the computation of the gradient, or *subgradient* of the objective function $ {f}$. Of course, the performance of a particular algorithm should depend on the properties of $ {f}$, which are typically about the smoothness, convexity, and "steepness" of the objective function.  

**1.1. Basic explicit gradient/subgradient methods**

To motivate, consider a differentiable function $ {f:\\mathbb{R}^d\\rightarrow\\mathbb{R}}$, and let $ {x^0\\in \\mathbb{R}}$. It is natural to ask the question: What is the direction of  "steepest descent"? First of all we have to make sense of at what level "descent" means. But since $ {f}$ is differentiable, we may well consider this at the tangent space level. More precisely, define  

$ \\displaystyle \\varphi(t) = f(x^0 + tv),\\quad v\\in S^{d-1}, $

Differentiating $ {\\varphi}$ at $ {t=0}$ gives  

$ \\displaystyle \\varphi'(0) = \\langle \\nabla f(x^0), v\\rangle = \\|\\nabla f(x^0)\\|\\cos(\\theta), $

where $ {\\theta}$ is the angle between $ {v}$ and $ {\\nabla f(x^0)}$ under the Euclidean inner product. Then $ {\\varphi'(0)}$ is minimised if and only if $ {v}$ is in the opposite direction of the gradient. One also can view this from another aspect of regularisation of the linear approximation of $ {f}$ at $ {x}$.  

> **Exercise 1** *[](https://www.blogger.com/null)Show that, for any $ {x\\in \\mathbb{R}^d}$,*  
> 
> *$ \\displaystyle -\\nabla f(x) = \\arg\\min\_{v\\in \\mathbb{R}^d} f(x) + \\langle \\nabla f(x), v\\rangle + \\frac{1}{2}\\|v\\|^2. $*
> 
> *And more generally,*  
> 
> *$ \\displaystyle -\\tau \\nabla f(x) = \\arg\\min\_{v\\in \\mathbb{R}^d} f(x) + \\langle \\nabla f(x), v\\rangle + \\frac{1}{2\\tau}\\|v\\|^2. $*

These observations suggest that discretisation of the gradient flow  

$ \\displaystyle \\frac{dx(t)}{dt} = -\\nabla f(x(t)) $

may be a candidate for solving the optimisation problem. The simplest example is Algorithm [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#algogd1).  

> **Algorithm 1 (Gradient descent/forward Euler scheme)** *[](https://www.blogger.com/null)Given objective $ {f}$, initialisation $ {x^0}$ and step sizes choices $ {\\tau\_k}$, for $ {k\\geq 0}$, do*  
> 
> *$ \\displaystyle x^{k+1} = x^k - \\tau\_k \\nabla f(x^k). $*

A first question to ask is under what condition of $ {f}$ is the algorithm actually a *descent algorithm*? Because of discretisation, it is expected that certain smoothness of $ {f}$ is necessary.  

> **Exercise 2 (Descent lemma)** *If $ {f}$ has $ {L}$-Lipschitz gradient, then[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle f(y) \\leq f(x) + \\langle \\nabla f(x), y-x\\rangle + \\frac{L}{2}\\|x-y\\|^2. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)This implies that the function $ {\\frac{L}{2} \\langle x,x\\rangle - f(x)}$ is convex. (Hint: use the fundamental theorem of calculus.)*

Putting $ {y=x^{k+1}}$ into [(1)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemdescent), we see that[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} f(x^{k+1}) &\\leq f(x^k) + \\langle \\nabla f(x^k), -\\tau \\nabla f(x^k)\\rangle + \\frac{L}{2}\\|x^k-x^{k+1}\\|^2 \\\\ &= f(x^k) - \\tau(1-\\frac{\\tau L}{2})\\| \\nabla f(x^k)\\|^2. \\end{aligned} \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Thus the sequence is decreasing as soon as $ {0<\\tau<\\frac{2}{L}}$. The optimal time step size is $ {\\tau=\\frac{1}{L}}$ so that the descent bound is optimised.  
Various extra conditions on $ {f}$ can ensure the *convergence* of the sequence $ {\\{x^k\\}}$ to a critical point. Here are several of them.  

> **Theorem 2** *If $ {f}$ is continuously differentiable function bounded from below and has bounded level sets $ {\\{x: f(x)\\leq f(x^0)\\}}$, then the sequence $ {\\{x^k\\}}$ has a subsequence converging to a critical point of $ {f}$.*

> **Theorem 3** *[](https://www.blogger.com/null)If $ {f}$ is convex with $ {L}$-Lipschitz gradient, bounded from below, then with $ {0<\\tau \\leq \\frac{1}{L}}$, the sequence $ {\\{x^k\\}}$ converge to a minimiser $ {x^\*}$ of $ {f}$ with estimate*  
> 
> *$ \\displaystyle f(x^k) - f(x^\*) \\leq \\frac{1}{2\\tau k}\\|x^0 - x^\*\\|^2, $*
> 
> *hence it has convergence rate of $ {O(1/k)}$.*

Linear convergence can be shown when $ {f}$ has extra steepness.  

> **Theorem 4** *[](https://www.blogger.com/null)If $ {f}$ has $ {L}$-Lipschitz gradient, and additionally is strongly convex, i.e. there exists $ {\\mu}$ such that*  
> 
> *$ \\displaystyle f-\\frac{\\mu}{2}\\|x\\|^2 \\text{ is convex,} $*
> 
> *then one has linear convergence rate estimate*  
> 
> *$ \\displaystyle f(x^k) - f(x^\*) + \\frac{1}{2\\tau}\\|x^k -x^\*\\|^2 \\leq \\frac{(1-\\tau\\mu)^k}{2\\tau}\\|x^0 - x^\*\\|^2. $*

> **Theorem 5** *If $ {f}$ has $ {L}$-Lipschitz gradient, and satisfies the Polyak-Łojasiewicz inequality: there exists some $ {\\mu>0}$ such that*  
> 
> *$ \\displaystyle \\frac{1}{2}\\|\\nabla f(x)\\|^2 \\geq \\mu(f(x)-f(x^\*)) $*
> 
> *where $ {f(x^\*)}$ is the optimal value, then with $ {0<\\tau \\leq \\frac{1}{L}}$, the sequence $ {\\{x^k\\}}$ converge to a minimiser $ {x^\*}$ of $ {f}$ with linear convergence rate estimate*  
> 
> *$ \\displaystyle f(x^k) - f(x^\*) \\leq (1-\\mu(2\\tau-\\tau^2L))^k \\left(f(x^0) - f(x^\*)\\right). $*

Here we prove Theorem [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmgd1). Beginning with the bound [(2)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eqgd%20bound), and assuming that $ {0<\\tau \\leq \\frac{1}{L}}$, so that $ {\\tau (1-\\frac{\\tau L}{2}) \\leq \\frac{\\tau}{2}}$, we get  

$ \\displaystyle \\begin{aligned} f(x^{k+1}) &\\leq f(x) - \\frac{\\tau}{2}\\|\\nabla f(x^k)\\|^2 \\\\ & \\leq f(x^\*) - \\langle \\nabla f(x^k), x^\* - x^k\\rangle - \\frac{\\tau}{2}\\|\\nabla f(x^k)\\|^2 \\\\ & = f(x^\*) + \\frac{1}{2\\tau}(\\|x^k - x^\*\\|^2 - \\|x^{k+1} - x^\*\\|^2). \\end{aligned} $

where the second inequality follows from convexity. Summing the above inequality in $ {k}$ we obtain the estimate in Theorem [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmgd1).  
The differentiability condition could be relaxed *sub-differentiability*, with gradient replaced by subgradient. For our purpose we only consider sub-gradient for convex functions.  

> **Definition 6** *[](https://www.blogger.com/null)A vector $ {v\\in\\mathbb{R}^d}$ is said to be a subgradient of $ {f}$ at $ {x}$ if*  
> 
> *$ \\displaystyle f(y)\\geq f(x)+\\langle v, y-x\\rangle, \\quad \\forall y\\in\\mathbb{R}^d. $*
> 
> *The set of all subgradients of $ {f}$ at $ {x}$ is called the subdifferential of $ {f}$ at $ {x}$, denoted by $ {\\partial f(x)}$.*

Observe that $ {\\partial f(x)}$ is a nonempty, closed, bounded and convex set. If $ {f}$ at $ {x}$ is differentiable, then $ {\\partial f(x) = \\{\\nabla f(x)\\}}$. At an optimal point $ {x^\*}$ one has generalisation of the Fermat's rule $ {0\\in \\partial f(x^\*)}$.  

> **Exercise 3 (Monotonicity of sub-gradients of a convex function)** *Let $ {u\\in\\partial f(x), v\\in \\partial f(y)}$. Show that*  
> 
> *$ \\displaystyle \\langle u-v, x-y\\rangle \\geq 0. $*
> 
> *If we view $ {\\partial f: x\\mapsto \\partial f(x)}$ as a set-valued operator, the above shows that subdifferential $ {\\partial f}$ of a convex function is a *monotone operator*.*

Analogously one has the explicit subgradient scheme  

$ \\displaystyle x^{k+1} = x^k - \\tau\_k g^k, \\quad g^k\\in \\partial f(x^k). $

Unlike gradient descent, negative of subgradient is not always a descent direction. And it turns out that any choice of constant step size will be sub-optimal. The analysis begins with the following estimate.  
Let $ {x^\*}$ be an optimal point, then  

> **Exercise 4***[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\|x^{k+1} - x^\*\\| \\leq \\|x^k-x^\*\\|^2 - 2\\tau\_k (f(x^k)-f(x^\*)) + \\tau\_k^2\\|g^k\\|^2. \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)(Hint: use the convexity of $ {f}$.)*

Summing [(3)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2) in $ {k}$, we find that  

$ \\displaystyle 2\\sum\_{k=0}^{N-1}\\tau\_k (f(x^k) - f(x^\*)) \\leq \\|x^0-x^\*\\|^2 - \\|x^N - x^\*\\|^2 + \\sum\_{k=0}^{N-1}\\tau\_k^2\\|g^k\\|^2. $

Let $ {f^{\*k} = min\_{0\\leq i \\leq k} f(x^i)}$. Then the above implies  

$ \\displaystyle 2\\sum\_{k=0}^{N-1}\\tau\_k (f^{\*(N-1)} - f(x^\*)) \\leq \\|x^0-x^\*\\|^2 + \\sum\_{k=0}^{N-1}\\tau\_k^2\\|g^k\\|^2. $

So if we take constant step size $ {\\tau\_k =\\tau}$, and assume that and for every subgradient $ {g}$ one has a uniform bound $ {\\|g\\|\\leq G}$, then[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} f^{\*(N-1)} - f(x^\*) &\\leq \\frac{\\|x^0-x^\*\\|^2}{2\\sum\_{k=0}^{N-1}\\tau\_k } + \\frac{\\sum\_{k=0}^{N-1}\\tau\_k^2\\|g^k\\|^2}{2\\sum\_{k=0}^{N-1}\\tau\_k } \\\\ &\\leq \\frac{\\|x^0-x^\*\\|^2}{2N\\tau} + \\frac{G^2\\tau^2}{2} \\end{aligned} \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)which does not guarantee convergence of $ {f^{\*(N-1)}}$ when $ {N}$ is large. To ensure convergence one has to take diminishing step sizes. In this case having $ {\\tau\_k \\rightarrow 0, \\sum\_{k=1}^\\infty \\tau\_k = \\infty}$ will be sufficient.  
It is worthwhile to compare the convergence rate of the explicit subgradient method with that of the gradient descent. Although it seems not fair since they are for different functions, in the following subsection we shall see a boost in convergence even when functions are not necessarily differentiable, but instead *proximable*, so to see the incompetent nature of explicit subgradient methods.  

Convergence rate is a measure of closeness to the optimal value per number of steps. Fixing the number of steps to be $ {N}$, we ask how close our last iterate value is to the optimal. If we choose constant step size $ {\\tau\_k = \\frac{C}{\\sqrt{N}}}$, putting this into [(4)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3), we see that  

$ \\displaystyle f^{\*(N-1)} - f(x^\*)\\leq \\frac{\\|x^0-x^\*\\|^2}{2\\sqrt{N}C} + \\frac{G^2C^2}{2N} = O(1/\\sqrt{N}). $

In other words, to achieve accuracy of $ {\\epsilon}$ it requires number of iterations of order $ {1/\\epsilon^2}$, which is much slower than the ordinary gradient descent. In fact this rate cannot be improved for this kind of methods.  

**1.2. Basic proximal point method**

Proximal methods are implicit methods, which, compared to the explicit gradient/subgradient method, would read  

$ \\displaystyle x^{k+1} = x^k - \\tau\_k \\nabla f(x^{k+1}). $

This should be understood in terms of sub-differentials  

$ \\displaystyle \\frac{x^{k+1} - x^k}{\\tau\_k} \\in -\\partial f(x^{k+1}) \\iff 0 \\in \\partial f(x^{k+1}) + \\frac{x^{k+1} - x^k}{\\tau\_k}, $

meaning that $ {x^{k+1}}$ is a critical point of the function  

$ \\displaystyle x \\mapsto f(x) + \\frac{\\|x - x^k\\|^2}{2\\tau\_k}. $

The function  

$ \\displaystyle f\_\\tau(\\bar{x}) = \\min\_{x} f(x) + \\frac{\\|x - \\bar{x}\\|^2}{2\\tau}, $

is known as the *Moreau-Yosida regularisation* of $ {f}$ with parameter $ {\\tau}$. Notice that if $ {f}$ is convex, then $ {f\_\\tau}$ is $ {\\tau}$-strongly convex. Compare this with Exercise [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#ex1).  

> **Definition 7** *The proximal mapping associated to a closed, convex function $ {f}$ at $ {\\bar{x}}$ is defined to be*  
> 
> *$ \\displaystyle \\text{prox}\_f(\\bar{x}) = f\_1(\\bar{x}) = \\arg\\min\_{x} f(x) + \\frac{\\|x - \\bar{x}\\|^2}{2}. $*

Observe that $ { \\text{prox}\_{\\tau f}(\\bar{x}) = \\arg\\min\_{x} f(x) + \\frac{\\|x - \\bar{x}\\|^2}{2\\tau}}$. We may now define the implicit "descent" as in Algorithm [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#algopgd1).  

> **Algorithm 2 (Proximal minimisation/backward Euler scheme)** *[](https://www.blogger.com/null)Given objective $ {f}$, initialisation $ {x^0}$ and step sizes choices $ {\\tau\_k}$, for $ {k\\geq 0}$, do*  
> 
> *$ \\displaystyle x^{k+1} = \\text{prox}\_{\\tau\_k f}(x^k).$*

The first apparent benefit is that the definition does not require any smoothness of the objective function. The trade-off is that proximal mapping has to be computed by hand or other algorithms. Those functions having easy-to-compute proximal mappings are called *proximable*. Some famous examples are included in later sections.  

We ask again if the algorithm is a descent method. To begin with the analysis of Algorithm [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#algopgd1), let's write the iteration in the same form with the gradient descent  

$ \\displaystyle x^{k+1} = x^k - \\tau\_k G\_k(x^k), $

where $ {G\_k = \\frac{1}{\\tau\_k}(x^k - \\text{prox}\_{\\tau\_k f}(x^k)) \\in \\partial f(x^{k+1})}$.  

> **Exercise 5** *(Subgradient characterisation of the proximal mapping) Let $ {f}$ be closed and convex, $ {x\\in\\mathbb{R}^d}$ and $ {u = \\text{prox}\_{\\tau f}(x)}$. Show that for all $ {z\\in \\mathbb{R}^d}$*  
> 
> *$ \\displaystyle f(z) \\geq f(u) + \\frac{1}{\\tau}\\langle x-u, z- u \\rangle. $*
> 
> *(Hint: apply Definition [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#defsubdiff) to $ {\\frac{u - x}{\\tau} \\in -\\partial f(u)}$.)*

Taking $ {z = x^{k}, x = x^k}$ in the above, we see that  

$ \\displaystyle f(x^{k+1}) - f(x^k) \\leq -\\frac{1}{\\tau\_k}\\langle x^k- x^{k+1}, x^k- x^{k+1} \\rangle = -\\frac{1}{\\tau\_k} \\|x^k-x^{k+1}\\|^2. $

so that in each iteration there is improvement.  
Now taking $ {z = x^{\*}, x = x^k}$, we see that[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{array}{rcl} f(x^{k+1}) - f(x^\*) &\\leq& -\\frac{1}{\\tau\_k}\\langle x^k- x^{k+1}, x^\*- x^{k+1} \\rangle \\\\ &=& -\\frac{1}{\\tau\_k}\\langle x^k- x^{k+1}+x^\*-x^\*, x^\*- x^{k+1} \\rangle \\\\ &\\leq & \\frac{1}{2\\tau\_k}( \\|x^\*- x^{k}\\|^2 - \\|x^\*- x^{k+1} \\|^2), \\end{array} $](https://www.blogger.com/null)

[](https://www.blogger.com/null)where the last row follows by ${\\langle x^\*- x^{k}, x^\*-x^{k+1}\\rangle \\leq \\frac{1}{2}(\\|x^\*- x^{k}\\|^2 + \\|x^\*-x^{k+1}\\|^2)}$. Assuming constant step size $ {\\tau}$, and summing the above inequality [(4)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4) in $ {k}$, and using the fact that $ {f(x^k)}$ is decreasing, we have the convergence rate estimate  

$ \\displaystyle f(x^N) - f(x^\*) \\leq \\frac{1}{N}\\sum\_{i=0}^{N-1}(f(x^i)-f(x^\*))\\leq \\frac{1}{N\\tau}\\|x^\* - x^0\\|^2. $

Notice that the step size in principle can be taken as large as wish.  

> **Exercise 6** *Show that the proximal minimisation algorithm above with constant step size $ {\\tau>0}$ is the same with the gradient descent with the same step size applied to the Moreau-Yosida regularisation $ {f\_\\tau}$.*

Thus there is actually no surprise about additional convergence results of proximal minimisation given the results developed for gradient descent.  

**2\. Optimisation with constraints; dualities**

The power of modern optimisation lies in the fact that various constraints, either arise naturally from the problems themselves (e.g. physics), or from some clever reformulations, can be effectively taken care of. The idea is that they can be treated as unconstrained problems with extra penalty terms, or unconstrained *dual problems* with the help of *Lagrange multipliers*. It is one of the major settings that the general technique of "splitting" plays a major role in effective computation and parallelisation, the discussion about which shall be taken up in a later section. Here we wish to talk about several basic elements in constrained optimisation.  

Given a general proper function $ {f(x)}$ (away from $ {\\pm \\infty}$ is sufficient to be proper) on a set $ {C}$, what is the "best" minorising hyperplane for a given slope $ {s}$? (We don't consider "vertical" hyperplanes here.) The hyperplane can be identified with an affine mapping $ {x \\mapsto \\langle s, x\\rangle - \\alpha }$. By the minorisation  

$ \\displaystyle f(x) \\geq \\langle s, x\\rangle - \\alpha \\iff \\alpha \\geq \\langle s, x\\rangle - f(x) $

we have the "best" $ {\\alpha}$ given by  

$ \\displaystyle f^\*(s) := \\sup\_{x\\in C} \\langle s, x\\rangle - f(x), $

and the function $ {f^\*}$ is known as the *conjugate*, or the *Legendre-Fenchel transform* of $ {f}$. It is an extended real-valued function. We give some preliminary properties.  

> **Exercise 7 (Fenchel-Young inequality)** *show that*  
> 
> *$ \\displaystyle f(x) + f^\*(s) \\geq \\langle s,x\\rangle .$*

> **Exercise 8** *Show that $ {f^\*}$ is closed (i.e. f has closed epigraph) and convex regardless of $ {f}$. (Hint: intersection of closed half spaces is closed; pointwise supremum over affine functions is convex.)*

> **Exercise 9** *[](https://www.blogger.com/null)Show that the biconjugate $ {f^{\*\*} : = (f^\*)^\*}$ of a function $ {f}$ satisfies*  
> 
> *$ \\displaystyle f^{\*\*}(x) \\leq f(x). $*
> 
> *In fact, show that the epigraph of $ {f^{\*\*}}$ is the closed convex hull of the epigraph of $ {f}$. In particular, conclude that $ {f^{\*\*} = f}$ if and only if $ {f}$ is closed and convex.*

**2.1. Lagrange duality**

For our purpose suppose we are interested in the following class of optimisation problem with possibly nonlinear, but convex inequality constraints and linear equality constraint[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} & \\underset{x\\in C}{\\text{min}} & & f(x) \\\\ & \\text{subject to} & & g\_i(x) \\leq 0, \\; i = 1, \\ldots, m.\\\\ & & & Ax-b = 0. \\end{aligned} \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Here $ {C}$ is a convex set in $ {\\mathbb{R}^d}$, $ {f(x), g(x) = (g\_1(x),\\dots,g\_m(x))}$ are convex functions, $ {A\\in\\mathbb{R}^{r \\times d}}$ and $ {b\\in \\mathbb{R}^r}$. The *Lagragian* corresponding to [(5)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob1) is defined as  

$ \\displaystyle L(x,\\mu, \\lambda) = f(x) + \\langle \\mu, g(x)\\rangle + \\langle \\lambda, Ax-b\\rangle. $

The Lagrangian can arise as follows. Consider the following perturbation of [(5)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob1)  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\underset{x\\in C}{\\text{min}} & & f(x) \\\\ & \\text{subject to} & & g\_i(x) + y\_{1i} \\leq 0, \\; i = 1, \\ldots, m.\\\\ & & & Ax-b +y\_2 = 0. \\end{aligned} \\end{array} $

and define the perturbation function  

$ \\displaystyle \\begin{array}{rcl} \\phi(x,y\_1,y\_2) &=& f(x) + I\_{\\mathbb{R}^d\_+}(y\_1 - g(x)) + I\_{\\{0\\}}(Ax-b-y\_2) \\\\ &=& \\begin{cases} f(x) &\\text{ if } g(x)+y\_1\\leq 0 \\text{ and } Ax-b+y\_2=0 \\\\ \\infty &\\text{ otherwise} \\end{cases} \\end{array} $

where  

$ \\displaystyle I\_{C}(x) = \\begin{cases} 0 \\text{ if } x\\in C \\\\ \\infty \\text{ otherwise} \\end{cases} $

is the indicator function for the set $ {C}$. The original problem is thus equivalent to  

$ \\displaystyle \\inf\_{x\\in C} \\phi(x,0,0). $

In general we can also define the *value function*  

$ \\displaystyle v(y\_1,y\_2)=\\inf\_{x\\in C} \\phi(x,y\_1,y\_2). $

The *dual function* is defined to be  

$ \\displaystyle -\\phi ^\*(0,\\mu,\\lambda) = -\\sup\_{\\substack{x\\in C \\\\g\_i(x) + y\_{1i} \\leq 0, \\\\ Ax-b +y\_2 = 0 }} \\langle 0,x\\rangle + \\langle \\mu, y\_1 \\rangle + \\langle \\lambda, y\_2 \\rangle - f(x). $

Let us clean up the expression a bit. Notice that the problem is equivalent to  

$ \\displaystyle -\\sup\_{p \\geq 0}\\; \\langle \\mu, -g(x)-p \\rangle + \\langle \\lambda, -Ax+b \\rangle - f(x) $

since $ {y\_1 \\leq -g(x) \\iff y\_1 = -g(x) - p}$ for some $ { p \\geq 0}$. Noting that $ {-\\langle \\mu, p \\rangle}$ has a bounded contribution to the supremum only when $ {\\mu\\geq 0 }$, the dual function is then equivalent to  

$ \\displaystyle q(\\mu,\\lambda) = \\begin{cases} \\inf\_{x\\in C} f(x) + \\langle \\mu, g(x) \\rangle + \\langle \\lambda, Ax-b \\rangle &\\text{ if } \\mu \\geq 0\\\\ -\\infty &\\text{ otherwise} \\end{cases} \\ \\ \\ \\ \\ (6)$

The term inside the above infimum is our familiar Lagrangian. Note how multiple Lagrangians can arise from different formulations of the same problem.  

> **Exercise 10** *Show that the dual function $ {q(\\mu,\\lambda)}$ is concave.*

The *dual problem* is now defined as[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} & \\underset{\\mu,\\lambda}{\\text{max}} & & q(\\mu,\\lambda) \\\\ & \\text{subject to} & & \\mu \\geq 0,\\lambda \\in \\mathbb{R}^r. \\end{aligned} \\ \\ \\ \\ \\ (7)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)In light of above, Problem [(5)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob1) will be referred to as the *primal problem*.  
Why it is called *dual*?  

> **Exercise 11** *(Primal-dual gap, weak duality) Show that for any feasible $ {x}$ (satisfying all the constraints) and $ {\\mu,\\lambda}$ in primal, dual problems resp.,*  
> 
> *$ \\displaystyle q(\\mu,\\lambda) \\leq f(x). $*
> 
> *In particular, $ {d^\*:=\\max q \\leq \\min f =: p^\*}$, which is referred to as the *weak duality*. The equality is referred to as the *strong duality*.*

When does the strong duality holds? Note that  

$ \\displaystyle \\begin{array}{rcl} q(\\mu,\\lambda) &=& - \\phi^\*(0,\\mu,\\lambda) \\\\ & =& -\\sup\_{\\substack{x\\in C, \\\\g\_i(x) + y\_{1i} \\leq 0, \\\\ Ax-b +y\_2 = 0 }}\\; \\langle 0,x\\rangle + \\langle \\mu, y\_1 \\rangle + \\langle \\lambda, y\_2 \\rangle - \\phi(x,y\_1,y\_2) \\\\ &=& -\\sup\_{\\substack{x\\in C, \\\\g\_i(x) + y\_{1i} \\leq 0, \\\\ Ax-b +y\_2 = 0 }}\\; \\langle \\mu, y\_1 \\rangle + \\langle \\lambda, y\_2 \\rangle - \\inf\_{\\substack{x\\in C}}\\phi(x,y\_1,y\_2)\\\\ &=& -v^\*(\\mu,\\lambda). \\end{array} $

Hence weak duality can be directly obtained from the fact that  

$ \\displaystyle \\begin{array}{rcl} d^\*=\\max\_{\\mu,\\lambda} q(\\mu,\\lambda) &=& v^{\*\*}(0,0) \\\\ &\\leq& v(0,0) = p^\* \\end{array} $

and the equality holds when, for example, $ {v}$ is proper, closed and convex, or various other conditions, called *constraint qualification*. We include an important one here.  

> **Theorem 9 (Slater's constraint qualification)** *Strong duality holds for a convex problem [(5)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob1) if the constraints are strictly feasible, i.e. there exists $ {x\\in C}$ such that $ {g(x)< 0}$ and $ {Ax = b}$.*

For a more detailed discussion on this condition, you can refer to [this blog post](https://q2liu.wordpress.com/2015/01/27/strong-duality-and-slaters-theorem/) by Liu.  

Now we want to relate the weak/strong duality to the Lagrangian. Observe that  

$ \\displaystyle \\begin{array}{rcl} \\sup\_{\\mu\\geq 0,\\lambda} L(x,\\mu,\\lambda) = \\begin{cases} f(x) &\\text{ if constraints satisfied} \\\\ \\infty &\\text{ otherwise} \\end{cases} \\end{array} $

so that the primal problem is equivalent to  

$ \\displaystyle \\inf\_x \\sup\_{\\mu,\\lambda} L(x,\\mu,\\lambda), $

which is of course not greater than $ {\\sup\_{\\mu,\\lambda} \\inf\_x L(x,\\mu,\\lambda)}$. But in case of strong duality, we have the primal-dual solution pair $ {(x^\*,\\mu^\*,\\lambda^\*)}$ as the *saddle point* of the Lagrangian  

$ \\displaystyle \\inf\_x \\sup\_{\\mu,\\lambda} L(x,\\mu,\\lambda) = \\sup\_{\\mu,\\lambda} \\inf\_x L(x,\\mu,\\lambda), $

where we have  

$ \\displaystyle L(x,\\mu^\*,\\lambda^\*) \\geq L(x^\*,\\mu^\*,\\lambda^\*) \\geq L(x^\*,\\mu,\\lambda). $

The saddle point formulation, together with Karush-Kuhn-Tucker (KKT) conditions, immediately yield the optimality condition for the constrained optimisation problem.  

> **Theorem 10 (Primal-dual optimality condition)** *[](https://www.blogger.com/null)Suppose strong duality holds for Problem [(5)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob1). Then $ {(x^\*,\\mu^\*,\\lambda^\*)}$ is primal-dual optimal if and only if*  
> 
> *-   Primal feasibility: $ {x^\*}$ satisfies the constraints;
> -   Dual feasibility: $ {\\mu^\* \\geq 0}$;
> -   Complementary slackness: $ {\\langle \\mu^\*, g(x^\*)\\rangle = 0}$, $ {\\langle \\lambda^\*, Ax^\*-b \\rangle = 0}$;
> -   $ {0 \\in \\partial L(x^\*,\\mu^\*,\\lambda^\*)}$.*

**2.2. Primal decomposition; dual decomposition**  
As an appetiser to *operator splitting*, we shall have a look at the problems in the form that can already be "splited" into smaller subproblems. The simplest case is the following type of *separable problem*  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\text{min} & & f\_1(x\_1)+f\_2(x\_2) \\\\ & \\text{subject to} & & x\_1\\in C\_1,\\quad x\_2\\in C\_2 \\end{aligned} \\end{array} $

Then the problem trivially decomposes into two smaller subproblems of optimising in $ {x\_1}$ and $ {x\_2}$ separately. What if there is a *complicating variable*? For example  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\min\_{x\_1,x\_2,y} & & f\_1(x\_1,y)+f\_2(x\_2,y). \\end{aligned} \\end{array} $

In general there are two ways to solve the problem. The first one, known as the *primal decomposition*, is to consider the subproblems for fixed $ {y}$,  

$ \\displaystyle \\phi\_1(y)=\\min\_{x\_1}f\_1(x\_1,y) \\quad \\phi\_2(y)=\\min\_{x\_2}f\_1(x\_2,y). $

Then one proceeds to  

$ \\displaystyle \\min\_y \\phi\_1(y)+\\phi\_2(y). $

The exact optimisation method depends on the problem, e.g. analytical solutions, gradient/subgradient methods, etc.  
The second one, known as the *dual decomposition*, is to introduce a consistency constraint to the following problem  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\min\_{x\_1,x\_2,y\_1,y\_2} & & f\_1(x\_1,y\_1)+f\_2(x\_2,y\_2) \\\\ & \\text{subject to} & & y\_1 = y\_2 \\end{aligned} \\end{array} $

Then formulate the dual problem. More precisely, the Lagrangian of this problem is  

$ \\displaystyle L(x\_1,y\_1,x\_2,y\_2,\\lambda) = f\_1(x\_1,y\_1) + f\_2(x\_2,y\_2) +\\langle \\lambda, y\_1 - y\_2\\rangle. $

Note that the Lagrangian is separable. The dual function is  

$ \\displaystyle q(\\lambda) = q\_1(\\lambda) + q\_2(\\lambda), $

where  

$ \\displaystyle q\_1(\\lambda) = \\min\_{x\_1,y\_1} f\_1(x\_1,y\_1) + \\langle \\lambda, y\_1 \\rangle = -f\_1^\*(0,-\\lambda), $

$ \\displaystyle q\_1(\\lambda) = \\min\_{x\_2,y\_2} f\_2(x\_2,y\_2) + \\langle \\lambda, -y\_2 \\rangle = -f\_2^\*(0,\\lambda). $

Hence the dual problem is  

$ \\displaystyle \\max\_{\\lambda} q\_1(\\lambda) + q\_2(\\lambda). $

There are several reasons why dual formulation may be preferred. For example, when it is  

-   unconstrained or has simple constraints;
-   dual objective is differentiable or has simple non-differentiable terms;
-   has separable structures.

In fact, the *alternating direction method of multipliers (ADMM)* can be considered as an instance of operator splitting method applied to the dual decomposition. We will not pursue further on more general primal and dual decomposition methods here. One can refer to the notes by Boyd et al.  

**How to find a subgradient of the conjugate function?** This is an interesting question arising from solving the above dual problem using e.g. explicit gradient/subgradient methods. The results are of course useful in many situations.  

> **Theorem 11** *[](https://www.blogger.com/null)For a general function $ {f}$ (i.e. not necessarily convex), then $ {s \\in \\partial f(x)}$ implies that $ {x \\in \\partial f^\*(s)}$.*

First we need a result regarding characterisation of $ {s \\in \\partial f(x)}$.  

> **Lemma 12** *We have $ {s \\in \\partial f(x)}$ if and only if $ {f(x)+f^\*(s) = \\langle s,x\\rangle}$.*

From subgradient's definition $ {f(y) \\geq f(x) + \\langle s, y-x \\rangle}$ for all $ {y}$. Hence  

$ \\displaystyle \\langle s, x \\rangle - f(x) \\geq \\langle s, y \\rangle -f(y) \\quad \\forall y. $

This is equivalent to  

$ \\displaystyle f^\*(s) + f(x) \\leq \\langle s, x \\rangle. $

But then by Fenchel-Young inequality, we have in fact the equality holds.  
Now to prove the theorem, from $ {f \\geq f^{\*\*}}$ and the lemma, we get  

$ \\displaystyle 0 = f^\*(s) + f(x) - \\langle s, x \\rangle \\geq f^{\*}(s) + f^{\*\*}(x) - \\langle s, x \\rangle. $

But by Fenchel-Young inequality again, we have the equality holds. Applying the lemma once again we have $ {x \\in \\partial f^\*(s)}$.  
The following is an easy consequence of Exercise [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exbiconj)  

> **Corollary 13** *For a closed convex function $ {f}$, $ {s \\in \\partial f(x)}$ if and only if $ {x \\in \\partial f^\*(s)}$.*

**2.3. Method of multipliers**

Let's consider the convex problem[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} & \\underset{x \\in \\mathbb{R}^d}{\\text{min}} & & f(x) \\\\ & \\text{subject to} & & Ax = b \\end{aligned} \\ \\ \\ \\ \\ (8)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)The associated Lagrangian function is  

$ \\displaystyle L(x,\\lambda) = f(x) + \\langle \\lambda, Ax-b\\rangle. $

Then the dual function is computed to be  

$ \\displaystyle \\inf\_x L(x,\\lambda) = -f^\*(-A^T\\lambda) - \\langle b,\\lambda \\rangle $

We can reparametrise $ {\\lambda \\leftarrow -\\lambda}$, and the dual problem becomes  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\underset{\\lambda \\in \\mathbb{R}^r}{\\text{min}} & & h(\\lambda) = f^\*(A^T\\lambda) - \\langle b,\\lambda \\rangle \\\\ \\end{aligned} \\end{array} $

which is an unconstrained problem. What is the proximal mapping of the function $ {\\tau h}$? That is, given $ {s \\in \\mathbb{R}^d}$,  

$ \\displaystyle \\text{prox}\_{\\tau h}(s) = \\arg\\min\_{\\lambda\\in\\mathbb{R}^d} \\; h(\\lambda) + \\frac{1}{2\\tau}\\| \\lambda - s\\|^2 = ? $

> **Exercise 12** *Show that, if $ {\\lambda^\* = \\text{prox}\_{\\tau h}(s)}$, then*  
> 
> *$ \\displaystyle 0\\in A\\partial f^\* (A^T \\lambda^\* ) - b + \\frac{\\lambda^\*-s}{\\tau}, $*
> 
> *where $ {f^\*}$ is the conjugate of $ {f}$.*

We claim that the above relation is the same with the optimal condition of the following problem  

$ \\displaystyle \\begin{array}{rcl} \\begin{aligned} & \\underset{x,z}{\\text{min}} & & f(x)+\\frac{1}{2\\tau}\\|z\\|^2 \\\\ & \\text{subject to} & & Ax - b - s\\tau = z \\end{aligned} \\end{array} $

where after substituting $ {z = Ax - b - s\\tau}$ in the objective function, we see that the optimal $ {x^\*}$ minimises the *augmented Lagrangian* of Problem [8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob3).  

$ \\displaystyle x^\* = \\arg\\min\_{x} f(x) - \\langle s, Ax-b\\rangle + \\frac{1}{2\\tau}\\|Ax- b\\|^2 =:\\arg\\min\_{x} \\mathcal{L}\_{\\tau}(x,s) $

To see this, note that the Lagrangian of the above problem is  

$ \\displaystyle L\_{s}(x,z,\\lambda) = f(x)+\\frac{1}{2\\tau}\\|z\\|^2 - \\langle \\lambda, Ax - b - s\\tau - z \\rangle $

Thus invoking Theorem [10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmkkt), the optimal conditions for each variable are  

$ \\displaystyle \\nabla\_z L\_{s}(x^\*,z^\*,\\lambda^\*) = 0 \\implies \\frac{z^\*}{\\tau} + \\lambda^\* = 0, $

$ \\displaystyle \\partial L\_{s}(x^\*,z^\*,\\lambda^\*) \\ni 0 \\implies A^T\\lambda^\* \\in \\partial f(x^\*), $

$ \\displaystyle \\nabla\_\\lambda L\_{s}(x^\*,z^\*,\\lambda^\*) = 0 \\implies Ax^\* - b - s\\tau = z^\*. $

Combining the above three relations, together with Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmconj_subdiff) yields the claim.  
Therefore, we see that the proximal mapping is given by  

$ \\displaystyle \\lambda^\* = \\text{prox}\_{\\tau h}(s) = s - \\frac{Ax^\* - b}{\\tau}, $

where $ {x^\*}$ is as above. The convergence analysis in Section 1.2 thus applies.  

**3\. Introduction to Operator splitting in optimisation**

In this section, we typically consider problems of the form[](https://www.blogger.com/null)  

[$ \\displaystyle \\underset{x \\in \\mathbb{R}^d}{\\text{min}} \\; g(x) + h(x) \\ \\ \\ \\ \\ (9)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)without constraints. We shall describe more explicit conditions of the problem for each type of method as we go.  
The objective function is the sum of two (or more) functions, which can be thought of being used to handle constraints. There are different ways to penalise, using different penalty functions. As a consequence the two functions can have very different properties in terms of applying optimisation techniques. For instances:  

> **Example 1 (Sparsity-promoting type penalty: lasso)***[](https://www.blogger.com/null)*  
> 
> *$ \\displaystyle \\underset{x \\in \\mathbb{R}^d}{\\text{min}} \\; \\frac{\\mu}{2}\\|Ax-b\\|^2 + \\|x\\|\_1 $*
> 
> *where $ {A\\in \\mathbb{R}^{m\\times d}}$, $ {b\\in \\mathbb{R}^m}$ are given and $ {\\mu>0}$ is a parameter. This model is useful for *sparse signal recovery*, that is recovering a clean signal from the noisy observed signal $ {b}$ as a sparse linear combination of atoms from the dictionary $ {A}$.*

> **Example 2 (Rudin-Osher-Fatemi model for image denoising (ROF))** *[](https://www.blogger.com/null)Let $ {u^{\\diamond}\\in \\mathbb{R}^{m\\times n}}$ be the observed corrupted image. The (discrete) ROF model is defined to be*  
> 
> *$ \\displaystyle \\underset{u \\in \\mathbb{R}^{m\\times n}}{\\text{min}} \\; \\mu\\|Du\\|\_{p,1} + \\frac{1}{2}\\|u-u^{\\diamond}\\|^2 $*
> 
> *where $ {D:\\mathbb{R}^{m\\times n} \\rightarrow \\mathbb{R}^{m\\times n\\times 2} }$ is the total variation operator, defined as*  
> 
> *$ \\displaystyle (Du)\_{i,j,1} = \\begin{cases} u\_{i+1,j} - u\_{i,j} \\text{ if } 1\\leq i<m \\\\ 0 \\text{ otherwise.} \\end{cases} \\; (Du)\_{i,j,2} = \\begin{cases} u\_{i,j+1} - u\_{i,j} \\text{ if } 1\\leq j<n \\\\ 0 \\text{ otherwise.} \\end{cases} $*
> 
> *and $ {\\|Du\\|\_{p,1} = \\sum\_{i,j} \\left((Du)\_{i,j,1}^p + (Du)\_{i,j,2}^p\\right)^{1/p}}$. Typically $ {p=1,2}$. The $ {L^2}$ data fitting term is specialised for additive Gaussian noise with zero mean, as the optimisation problem can be regarded an instance of finding *maximum a posteriori (MAP)* estimator in Bayesian models.*

> **Example 3 (TV-$ {\\ell^1}$ model for image denoising)**  
> 
> *$ \\displaystyle \\underset{u \\in \\mathbb{R}^{m\\times n}}{\\text{min}} \\; \\mu\\|Du\\|\_{p,1} + \\frac{1}{2}\\|u-u^{\\diamond}\\|\_1 $*
> 
> *as a modified version of the ROF model that is more suitable for salt-and-pepper noise.*

> **Example 4 (TV image deblurring)** *Assume the blur kernel is $ {a}$.*  
> 
> *$ \\displaystyle \\underset{u \\in \\mathbb{R}^{m\\times n}}{\\text{min}} \\; \\mu\\|Du\\|\_{p,1} + \\frac{1}{2}\\|a\*u-u^{\\diamond}\\|^2 $*
> 
> *and also its $ {\\ell^1}$ version*  
> 
> *$ \\displaystyle \\underset{u \\in \\mathbb{R}^{m\\times n}}{\\text{min}} \\; \\mu\\|Du\\|\_{p,1} + \\frac{1}{2}\\|a\*u-u^{\\diamond}\\|\_1. $*

> **Example 5 (Robust principal component analysis (RPCA))** *[](https://www.blogger.com/null)Given $ {M\\in\\mathbb{R}^{m\\times n}}$,*  
> 
> *$ \\displaystyle \\begin{aligned} &\\underset{L,S \\in \\mathbb{R}^{m\\times n}}{\\text{min}} \\; & &\\|L\\|\_{\*} + \\rho \\|S\\|\_1 \\\\ & \\text{subject to} & & L+S=M \\end{aligned} $*
> 
> *where $ {\\|L\\|\_\*}$ denotes the nuclear norm of the matrix $ {L}$.*

Notice that many of the above problems involve non-smooth terms, which makes the problems hard to solve effectively by gradient/subgradient descent.  

In general one can view, for example in the unconstrained version of Problem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob4) as solving  

$ \\displaystyle 0 \\in T(x) = \\partial g(x) + \\partial h(x). $

The operator splitting techniques aim to break the above problem into subproblems involving one of the subgradients only. The subdifferentials here can be generalised to *maximal monotone operators*, which we will talk about shortly.  

**3.1. Forward-backward splitting**

There is a simple and natural idea of solving the unconstrained Problem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob4) when $ {g}$ is convex and differentiable with $ {L}$-Lipschitz gradient (so that gradient descent applies), and $ {h}$ is convex, not necessarily differentiable but has inexpensive proximal mapping (i.e. proximable).  

> **Algorithm 3 (Forward-backward/Proximal gradient/semi-implicit Euler)** *Given objectives $ {g,h}$, initialisation $ {x^0}$ and step sizes $ {\\tau\_k}$. For $ {k\\geq 0}$, do*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1/2} &= x^k - \\tau\_k \\nabla g(x^k); \\\\ x^{k+1} &= \\text{prox}\_{\\tau\_k h}(x^{k+1/2}). \\end{aligned} $*

**Computing proximal mappings.** Before we come to the analysis, we mention several of its special cases. The following exercises include many useful results for computing common proximal mappings, which are used in the *actual implementation* of various algorithms all the time.  

> **Example 6 (Projected gradient descent)** *Apply the forward-backward splitting to the problem*  
> 
> *$ \\displaystyle \\underset{x \\in \\mathbb{R}^d}{\\text{min}} \\; g(x) + I\_C(x) $*
> 
> *where $ {I\_C}$ is the indicator function for the convex set $ {C}$.*

> **Exercise 13** *Show that the proximal mapping of $ {I\_C}$ is the Euclidean projection onto the convex set $ {C}$.*

> **Example 7 (Iterative soft-thresholding)** *Apply the forward-backward splitting to the Lasso problem (Example [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#problasso)).*

> **Exercise 14** *[](https://www.blogger.com/null)Show that the proximal mapping of the $ {\\ell^1}$-norm $ {\\|x\\|\_1}$ is the *soft-thresholding operator**  
> 
> *$ \\displaystyle (\\text{prox}\_{\\tau \\|\\cdot\\|\_1}(x))\_i = \\max \\{0, |x\_i|-\\tau\\}= \\begin{cases} x\_i - \\tau \\text{ if } x\_i \\geq \\tau \\\\ 0 \\text{ if } |x\_i| \\leq \\tau \\\\ x\_i + \\tau \\text{ if } x\_i \\leq -\\tau \\\\ \\end{cases} $*
> 
> *where $ {(\\text{prox}\_{\\|\\cdot\\|\_1}(x))\_i}$ is the $ {i}$-th coordinate of $ {\\text{prox}\_{\\|\\cdot\\|\_1}(x)}$.*

> **Exercise 15 (Moreau decomposition)** *For closed and convex function $ {f:\\mathbb{R}^d \\rightarrow \\mathbb R}$, show that for every $ {x}$,*  
> 
> *$ \\displaystyle x = \\text{prox}\_{f}(x) + \\text{prox}\_{f^\*}(x). $*
> 
> *(Hint: use Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmconj_subdiff).)*

> **Exercise 16** *Let $ {f}$ be a norm on $ {\\mathbb{R}^d}$. Show that the conjugate of the norm $ {f^\*}$ is the indicator function of the unit ball of the *dual norm*, where the dual norm of $ {z\\in (\\mathbb{R}^d)'\\simeq \\mathbb{R}^d}$ is defined to be the quantity*  
> 
> *$ \\displaystyle \\sup\\{\\langle z, x\\rangle: f(x) \\leq 1\\}. $*

> **Exercise 17** *Show that on $ {\\mathbb{R}^d}$, the dual norm of $ {\\ell^p}$-norm is $ {\\ell^q}$-norm, whenever $ {1\\leq p \\leq \\infty}$ and $ {1/p+ 1/q =1}$.*

Observe that Exercise [14](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exst) follows as a special case.  

> **Exercise 18** *Show that the dual norm of $ {\\|\\cdot\\|\_{p,1}}$ defined in the ROF model (Example [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#egrof)) is $ {\\|\\cdot\\|\_{q,\\infty}}$, whenever $ {1\\leq p \\leq \\infty}$ and $ {1/p+ 1/q =1}$.*

> **Exercise 19** *Show that the dual norm of the nuclear norm defined in the RPCA model (Example [5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#egrpca)), under Frobenius inner product for matrices, is the matrix spectral norm. The corresponding proximal mapping is known as *singular value thresholding*.*

Now let's look into the forward-backward splitting. First we check the optimality condition is respected by the algorithm.  

Write the iteration in the following form  

$ \\displaystyle x^{k+1} = x^{k} - \\tau\_k G(x^k), $

where  

$ \\displaystyle \\begin{aligned} G(x^k) &= \\frac{1}{\\tau\_k}(x^k - \\text{prox}\_{\\tau\_k h}(x^k - \\tau\_k \\nabla g(x^k))) \\\\ &= \\nabla g(x^k) + \\frac{1}{\\tau\_k}(x^k - \\tau\_k \\nabla g(x^k)- \\text{prox}\_{\\tau\_k h}(x^k - \\tau\_k \\nabla g(x^k)))\\\\ &\\in \\nabla g(x^k) + \\partial h (x^{k+1}). \\end{aligned} $

It follows that when $ {G(x^\*) = 0}$, we have  

$ \\displaystyle 0 \\in \\nabla g(x^\*) + \\partial h (x^\*), $

that is, $ {x^\*}$ is an optimal point.  
The analysis then is a combination that of the gradient/proximal descent we have done before. Here we give a variant of this argument that can be found in the notes of Chambolle and Pock.  

> **Exercise 20** *Show that, for all $ {z}$*  
> 
> *$ \\displaystyle \\begin{aligned} &g(z) + h(z) + \\frac{1}{2\\tau}\\|z - x^k\\|^2 \\\\ \\geq& \\; g(x^k) + \\langle \\nabla g(x^k), z-x^k\\rangle + \\frac{1}{2\\tau}\\|z - x^k\\|^2 + h(z) \\\\ \\geq& \\; g(x^k) + \\langle \\nabla g(x^k), x^{k+1}-x^k\\rangle + \\frac{1}{2\\tau}\\|x^{k+1} - x^k\\|^2 + h(x^{k+1}) + \\frac{1}{2\\tau}\\|z - x^{k+1}\\|^2 \\end{aligned} \\ \\ \\ \\ \\ (10)$*
> 
> *(Hint: for the second inequality, observe that $ {x^{k+1}}$ is the minimiser of the function $ {h(z) + g(x^k) + \\langle \\nabla g(x^k), z - x^k\\rangle + \\frac{1}{2\\tau}\\|z - x^k\\|^2 }$.)*

Now since $ {g}$ has $ {L}$-Lipschitz gradient, it follows from the descent lemma, together with $ {\\tau \\leq 1/L}$ that[](https://www.blogger.com/null)  

[$ \\displaystyle g(x^{k+1}) + h(x^{k+1}) + \\frac{1}{2\\tau}\\|z - x^{k+1}\\|^2 \\leq g(z) + h(z) + \\frac{1}{2\\tau}\\|z - x^{k}\\|^2 . \\ \\ \\ \\ \\ (11)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Taking $ {z = x^k}$ we see that the algorithm is a descent method. Taking $ {z = x^\*}$ and summing in $ {k}$ with constant step sizes we obtain the $ {O(1/N)}$ rate of convergence.  

**3.2. Douglas-Rachford splitting; ADMM**

The idea of this splitting method can be traced back to the work of Douglas and Rachford in 1956, when they proposed a finite difference scheme of solving two dimensional heat equation. Later it was discovered by Lions and Mercier in 1979 that their method can be applied to the more general setting of monotone operators. Here let's focus on solving the unconstrained Problem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob4).  

Assume that both $ {g,h}$ are closed and convex, the Douglas-Rachford splitting method reads  

> **Algorithm 4 (Douglas-Rachford)** *[](https://www.blogger.com/null)Given objectives $ {g,h}$, initialisation $ {y^0}$ and step sizes $ {\\tau\_k}$. For $ {k\\geq 0}$, do*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1} &= \\text{prox}\_{\\tau\_k g}(y^{k}); \\\\ y^{k+1} &= y^k -x^{k+1} + \\text{prox}\_{\\tau\_k h}(2x^{k+1} - y^k). \\end{aligned} $*
> 
> *Here $ {x^k}$ is the main variable and $ {y^k}$ is the auxiliary variable. We could also initialise both $ {x^0}$ and $ {y^0}$. Introducing another auxiliary variable $ {u^{k}}$, and letting $ {w^k = x^k - y^k}$, the iteration becomes*  
> 
> *$ \\displaystyle \\begin{aligned} u^{k+1} &= \\text{prox}\_{\\tau\_k h}(x^{k} + w^k);\\\\ x^{k+1} &= \\text{prox}\_{\\tau\_k g}(u^{k+1}- w^{k}); \\\\ w^{k+1} &= w^k -x^{k+1} - u^{k+1}.\\\\ \\end{aligned} $*

As before we can check the optimality condition is respected. We note that the fixed point of the iteration, i.e. $ {y^\*}$ such that  

$ \\displaystyle y^{\*} = y^\* -\\text{prox}\_{\\tau\_k g}(y^\*) + \\text{prox}\_{\\tau\_k h}(2x^\* - y^\*) $

implies  

$ \\displaystyle x^\* = \\text{prox}\_{\\tau\_k g}(y^\*) = \\text{prox}\_{\\tau\_k h}(2\\text{prox}\_{\\tau\_k g}(y^\*) - y^\*). $

From subgradient characterisation, we see  

$ \\displaystyle \\frac{x^\* - y^\*}{\\tau\_k} \\in \\partial g(x^\*),\\; \\frac{y^\* - x^\*}{\\tau\_k} \\in \\partial h(x^\*). $

Summing the above two relations, we arrive at the optimality condition  

$ \\displaystyle 0 \\in \\partial g(x^\*) + \\partial h(x^\*). $

The analysis of this algorithm shall be taken up later in the framework of monotone operators. Here we want to relate it to ADMM.  
Consider the constrained optimisation problem[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} &\\min\_{\\substack{x\\in \\mathbb{R}^{d\_1}, y\\in \\mathbb{R}^{d\_2}}} \\; & & f\_1(x) + f\_2(y)\\\\ & \\text{subject to} & & Ax + By = b \\end{aligned} \\ \\ \\ \\ \\ (12)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {A\\in\\mathbb{R}^{m \\times d\_1},B\\in\\mathbb{R}^{m \\times d\_2}, b\\in \\mathbb{R}^m}$. The dual problem is unconstrained  

$ \\displaystyle \\min\_{s\\in \\mathbb{R}^m} \\; \\langle s, b\\rangle + f^\*\_1(-A^Ts) + f^\*\_2(-B^Ts), $

note that we always denote by $ {s}$ the dual variable, that is the Lagrange multiplier. If we set $ {h(s) = \\langle s, b\\rangle + f^\*\_1(-A^Ts)}$, $ {g(s) = f^\*\_2(-B^Ts)}$, we are now in the setting of Problem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prob4).  
What is the corresponding Douglas-Rachford splitting? Using computations from Section 2.3 on method of multipliers we have the following.  

> **Exercise 21** *Corresponding to the second formulation of Algorithm [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#algodg-split), given $ {s^k,w^k}$, show that*  
> 
> *-   $ { u^{k+1} = \\text{prox}\_{\\tau h}(s^k + w^k) = s^k + w^k - \\frac{A\\hat{x}\_1 - b}{\\tau}}$, where
>     
>     $ \\displaystyle \\hat{x}\_1 = \\arg\\min\_{x\_1} f\_1(x\_1) + \\langle s^k + w^k, Ax\_1-b\\rangle + \\frac{1}{2\\tau}\\| Ax\_1 - b\\|^2. $
>     
> -   $ {s^{k+1}=\\text{prox}\_{\\tau g}(u^{k+1}- w^{k}) = u^{k+1}- w^{k} -\\frac{B\\hat{x}\_2}{\\tau}}$, where
>     
>     $ \\displaystyle \\hat{x}\_2 = \\arg\\min\_{x\_2} f\_2(x\_2) + \\langle u^{k+1}- w^{k}, Bx\_2\\rangle + \\frac{1}{2\\tau}\\| Bx\_2 \\|^2. $
>     
> -   $ {w^{k+1} = w^k -s^{k+1} - u^{k+1} = \\frac{B\\hat{x}\_2}{\\tau}}$.*

Now we can simplify the above iteration. Put $ {\\hat{x}\_1,\\hat{x}\_2}$ in the $ {k+1}$-th iteration as $ {x^k,y^k}$ respectively. And note that  

$ \\displaystyle \\begin{aligned} x^{k+1} &= \\arg\\min\_{x\_1} f\_1(x\_1) + \\langle s^k + w^k, Ax\_1-b\\rangle + \\frac{1}{2\\tau}\\| Ax\_1 - b\\|^2 \\\\ & = \\arg\\min\_{x} f\_1(x) + \\langle s^k + \\frac{By^k}{\\tau}, Ax-b\\rangle + \\frac{1}{2\\tau}\\| Ax - b\\|^2 \\\\ & = \\arg\\min\_{x} f\_1(x) + \\langle s^k, Ax\\rangle + \\frac{1}{2\\tau}\\| Ax + By^k - b\\|^2 \\\\ & = \\arg\\min\_{x} \\mathcal{L}(x,y^k,s), \\end{aligned} $

And similarly for $ {y^{k+1}}$. The above iteration then amounts to  

> **Algorithm 4 (ADMM)** *Given objectives $ {f\_1,f\_2}$ for the Problem [12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#probadmm), step size $ {\\tau}$, and initialisation $ {s^0, y^0}$, do*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1} & = \\arg\\min\_{x} f\_1(x) + \\langle s^k, Ax\\rangle + \\frac{1}{2\\tau}\\| Ax + By^k - b\\|^2; \\\\ y^{k+1} &= \\arg\\min\_{y} f\_2(y) + \\langle s^k, By\\rangle + \\frac{1}{2\\tau}\\| Ax^{k+1} + By - b\\|^2; \\\\ s^{k+1} &= s^k + \\frac{Ax^{k+1} + By^{k+1} - b}{\\tau}. \\end{aligned} $*

This algorithm is similar to that of method of multipliers, in that the augmented Lagrangian is involved. However notice that the $ {x}$- and $ {y}$-subproblems are splited, in constrast to the method of multipliers, which would require a joint minimisation.
