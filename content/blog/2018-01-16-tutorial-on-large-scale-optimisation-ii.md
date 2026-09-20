---
id: 2018-01-16-tutorial-on-large-scale-optimisation-ii
title: "Tutorial on large scale optimisation: II"
date: 2018-01-16
tags: ["numerical methods", "optimization", "teaching"]
source: https://sylqiu.blogspot.com/2018/01/tutorial-on-large-scale-optimisation-ii.html
publish: true
---
In the [last post](http://sylqiu.blogspot.hk/2017/12/tutorial-on-large-scale-optimisationi.html) we have developed background and basic algorithms such as forward-backward splitting and Douglas-Rachford splitting in large scale optimisation, where ADMM is a equivalent to applying the D-R splitting to the dual decomposition. The proof of convergence of the D-R splitting was delayed until this post.

 Here we will systematically develop a general convergence analysis framework, which will include almost all the algorithms we have seen so far:

-   Gradient descent;
-   Basic proximal point method (which is equivalent to applying gradient descent to the Moreau-Yosida envelope);
-   Forward-backward splitting;
-   Douglas-Rachford splitting.

As you will see, once the machinery is developed, all the convergence proofs are really a one-line argument, and is in some sense ultimately from gradient descent! 

 A standard reference here I guess is prof. Combettes' *Solving Monotone Inclusions via Compositions of Nonexpansive averaged operator.* My notes here are again combination of various (well known) sources, but I found prof. Giselsson's graphical representations in his [lecture notes](http://www.control.lth.se/ls-convex-2015/) to be extremely helpful in succinctly express all the essential ideas. But these ideas may not be clear from a first read of my post and I only took two figures from his lectures, so interested readers please go to the original source for a more detailed exposition.

 Before we start this abstract topic, let's recall what we have last time and take a few concrete examples at the implementation level.

**1\. Examples of implementation of ADMM**

In the last post we derived the ADMM algorithm from the Douglas-Rachford splitting. Recall that the ADMM algorithm for the problem[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{aligned} &\\min\_{\\substack{x\\in \\mathbb{R}^{d\_1}, y\\in \\mathbb{R}^{d\_2}}} \\; & & f\_1(x) + f\_2(y)\\\\ & \\text{subject to} & & Ax + By = b \\end{aligned} \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)with step size $ {\\tau}$, and initialisation $ {s^0, y^0}$, is the following iteration  

$ \\displaystyle \\begin{aligned} x^{k+1} & = \\arg\\min\_{x} f\_1(x) + \\langle s^k, Ax\\rangle + \\frac{1}{2}\\| Ax + By^k - b\\|^2; \\\\ y^{k+1} &= \\arg\\min\_{y} f\_2(y) + \\langle s^k, By\\rangle + \\frac{1}{2\\tau}\\| Ax^{k+1} + By - b\\|^2; \\\\ s^{k+1} &= s^k + \\frac{Ax^{k+1} + By^{k+1} - b}{\\tau}. \\end{aligned} $

The algorithm enjoys three convergence properties when the strong duality holds:  

-   Residual convergence. The residuals $ {Ax^k+By^k-b \\rightarrow 0}$, i.e. the iterates approach feasibility;
-   Primal value convergence. $ {f\_1(x^k)+f\_2(y^k)\\rightarrow p^\*}$, where $ {p^\*}$ is the optimal value of the primal problem;
-   Dual variable convergence. The Lagrange multiplier sequence converge to the dual optimal point $ {s^k\\rightarrow s^\*}$.

The convergence properties, especially that the solution becomes feasible in the limit, together with the parallelisable iterations, makes ADMM very useful.  
Before we proceed further, it might be better to see how it is actually implemented for various optimisation problems in applications. For convenience we want to rewrite the iteration a bit, sometimes called the scaled form of ADMM. Let $ {\\rho = 1/\\tau}$, $ {u = \\tau s}$, and notice that  

$ \\displaystyle \\langle s^k, Ax+By^k-b\\rangle + \\frac{1}{2\\tau}\\| Ax + By^k - b\\|^2 = \\frac{\\rho}{2}\\|Ax+By^k-b+u\\|^2 -\\frac{\\rho}{2}\\|u\\|^2 $

and similarly for other terms. We find that the iteration is equivalent to  

$ \\displaystyle \\begin{aligned} x^{k+1} & = \\arg\\min\_{x} f\_1(x) + \\frac{\\rho}{2}\\| Ax + By^k - b + u^k\\|^2; \\\\ y^{k+1} &= \\arg\\min\_{y} f\_2(y) + \\frac{\\rho}{2}\\| Ax^{k+1} + By - b + u^k\\|^2; \\\\ u^{k+1} &= u^k + Ax^{k+1} + By^{k+1} - b. \\end{aligned} $

Note that $ {u^k}$ is basically a running sum of residuals. And in case $ {A=B=\\pm I}$, the $ {x}$- and $ {y}$- subproblems are proximal iterations.  

> **Example 1 (Basis pursuit)** *The original problem is of the form*  
> 
> *$ \\displaystyle \\begin{aligned} &\\min \\|x\\|\_1 \\\\ &\\text{subject to } Mx=c \\end{aligned} \\ \\ \\ \\ \\ (2)$*
> 
> *In order to apply ADMM, we can transform the problem into*  
> 
> *$ \\displaystyle \\begin{aligned} &\\min \\|x\\|\_1 + I\_{\\{y:My=c\\}} \\\\ &\\text{subject to } x-y=0 \\end{aligned} \\ \\ \\ \\ \\ (3)$*
> 
> *The we can write down the $ {x}$-subproblem, which is the familiar soft-thresholding*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1} & = \\arg\\min\_{x} \\|x\\|\_1 + \\frac{\\rho}{2}\\| x - y^k + u^k\\|^2 \\\\ & = \\text{soft-threshold}(1/\\rho, y^k - u^k) \\\\ & := (\\max(0,|y^k\_i - u^k\_i| - 1/\\rho))\_i \\end{aligned} $*
> 
> *and the $ {y}$-subproblem is a projection to affine set*  
> 
> *$ \\displaystyle \\begin{aligned} y^{k+1} & = \\arg\\min\_{y} I\_{\\{y:My=q\\}} + \\frac{\\rho}{2}\\| x^{k+1} - y + u^k\\|^2 \\\\ & = \\text{proj}\_{\\{y:My=q\\}}(x^{k+1} + u^k) \\\\ & = (I-M^T(MM^T)^{-1}M)(x^{k+1} + u^k) - M^T(MM^T)^{-1}c. \\end{aligned} $*

> **Example 2 (Lasso)** *The original problem is*  
> 
> *$ \\displaystyle \\min \\frac{\\mu}{2}\\|Mx-c\\|^2+\\|x\\|\_1 \\ \\ \\ \\ \\ (4)$*
> 
> *Where $ {\\mu>0}$ is a parameter. Then we do splitting by introducing a new variable $ {y}$ and reformulate the problem as*  
> 
> *$ \\displaystyle \\begin{aligned} &\\min\_{x,y} \\frac{1}{2}\\|Mx-c\\|^2+\\lambda\\|y\\|\_1 \\\\ &\\text{subject to } x-y=0 \\end{aligned} \\ \\ \\ \\ \\ (5)$*
> 
> *Where $ {\\lambda>0}$ is a parameter. Then the $ {x}$-subproblem is a *ridge regression*, or *Tikhonov regularisation* on a quadratic problem*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1} &= \\arg\\min\_x \\frac{1}{2}\\|Mx-c\\|^2 + \\frac{\\rho}{2}\\|x-y^k + u^k\\|^2 \\\\ &= (M^TM+\\rho I)^{-1}(M^Tc + \\rho (y^k-u^k)) \\end{aligned} $*
> 
> *The $ {y}$-subproblem is the familiar soft-thresholding*  
> 
> *$ \\displaystyle \\begin{aligned} y^{k+1} & = \\arg\\min\_{y} \\lambda\\|y\\|\_1 + \\frac{\\rho}{2}\\| x^{k+1} - y + u^k\\|^2 \\\\ & = \\text{soft-threshold}(\\lambda/\\rho, x^{k+1} + u^k) \\end{aligned} $*
> 
> *So ADMM can be interpreted as a method for solving the lasso problem by iteratively carrying out ridge regression.*

> **Example 3 (TV-deblurring)** *The original problem is*  
> 
> *$ \\displaystyle \\begin{aligned} \\min\_{x\\in\\mathbb{R}^{m\\times n}} \\mu \\|Dx\\|\_{2,1} + \\frac{1}{2}\\|Ax-x^{\\diamond}\\|^2 \\end{aligned} \\ \\ \\ \\ \\ (6)$*
> 
> *In order to apply ADMM, we need to introduce a splitting variable. We let $ {p=Dx}$. The problem becomes*  
> 
> *$ \\displaystyle \\begin{aligned} &\\min\_{x,p} \\mu \\|p\\|\_{2,1} + \\frac{1}{2}\\|Ax-x^{\\diamond}\\|^2\\\\ &\\text{subject to } Dx-p=0 \\end{aligned} \\ \\ \\ \\ \\ (7)$*
> 
> *Then the $ {p}$-subproblem can be computed by Moreau decomposition*  
> 
> *$ \\displaystyle \\begin{aligned} p^{k+1} &= \\arg\\min\_{p} \\mu \\|p\\|\_{2,1} + \\frac{\\rho}{2}\\| Dx^{k} - p + u^k\\|^2 = \\text{prox}\_{\\|\\cdot\\|\_{2,1}/\\rho}(Dx^{k}+u^k) \\\\ &= (I- \\frac{\\mu}{\\rho}\\text{proj}\_{\\{\\frac{\\rho}{\\mu}\\|\\cdot\\|\_{2,\\infty}=1\\}})(Dx^{k}+u^k) \\end{aligned} $*
> 
> *The $ {x}$-subproblem can be solved in closed form*  
> 
> *$ \\displaystyle \\begin{aligned} x^{k+1} &= \\arg\\min\_{x} \\frac{1}{2}\\|Ax-x^{\\diamond}\\|^2 + \\frac{\\rho}{2}\\| Dx - p^{k+1} + u^k\\|^2 \\\\ &= D(D^TD+A^TA/\\rho)^{-1}(D^T(p^{k+1}-u^k)+A^Tu^{\\diamond}/\\rho) \\end{aligned} $*
> 
> *which can be computed efficiently using FFT if periodic boundary condition is given (the above notation assumes the matrices are real-valued, otherwise one need to the use the Hermitian transpose to respect the Hermitian inner product).*

And many more to be listed here...  

**2\. Monotone inclusion problems; fixed point iterations**

We mentioned in the previous post that the optimization problem can be regarded as solving for the *inclusion relation*  

$ \\displaystyle 0\\in \\partial g(x)+\\partial h(x), $

where $ {\\partial g(x),\\partial h(x)}$ are subdifferentials of convex functions $ {f,g}$. It is a inclusion relation because subdifferential operator is in general set-valued. These operators are examples of *monotone operators*. We often abuse the notation $ {Ax}$ to mean both the set or any element in it, which meaning is used should be clear from the context.  

> **Definition 1** *A set-valued operator $ {A:\\mathbb{R}^d \\rightarrow 2^{\\mathbb{R}^n}}$ is called *monotone* if*  
> 
> *$ \\displaystyle \\langle Ax- Ay, x-y\\rangle \\geq 0, \\quad \\forall x,y $*
> 
> *Furthermore,*  
> 
> *-   $ {A}$ is called *maximal monotone* if there does not exist a pair $ {(\\tilde{x},\\tilde{u})}$ such that $ {\\tilde{u}\\notin Ax}$ but $ {\\langle \\tilde{u}- v, \\tilde{x}-y\\rangle \\geq 0}$ for all $ {y}$ and $ {v \\in Ay}$.
> -   $ {A}$ is called *$ {\\sigma}$-strongly monotone*, or *$ {\\sigma}$-coercive* if the stronger inequality holds
>     
>     $ \\displaystyle \\langle Ax- Ay, x-y\\rangle \\geq \\sigma\\|x-y\\|^2, \\quad \\forall x,y $
>     *

Subdifferentials of convex functions are maximal monotone. (Actually, subdifferential can be defined for general functions, which will be monotone but need not be maximal monotone). As a result of Minty, $ {A}$ is maximal monotone if and only if the range of $ {A+\\alpha I}$ is $ {\\mathbb{R}^d}$. The subdifferential of a $ {\\sigma}$-strongly convex function is $ {\\sigma}$-strongly monotone.  

It turned out that a quite general convergence theory can be developed in the framework of monotone operators. To motivate, let us consider the forward-backward splitting iteration  

$ \\displaystyle x^{k+1} = \\text{prox}\_{\\tau h}(x^k-\\tau \\nabla g(x^k)), $

where we assumed the convex functions $ {g}$ has $ {L}$-Lipschitz gradient and \`\`proximability" of $ {h}$. Let us write it in a more abstract form  

$ \\displaystyle x^{k+1} = J\_{\\tau\\partial h}\\circ F\_{\\tau \\partial g}(x^k), $

where $ {F\_{\\tau \\partial g} = I - \\tau\\nabla g}$, $ {J\_{\\tau\\partial h} = (I + \\tau \\partial g)^{-1}}$. We showed last time that a fixed point $ {x^\*}$ of this iteration satisfies the optimality condition  

$ \\displaystyle 0\\in \\nabla g(x^\*) + \\partial h(x^\*). $

The convergence of the algorithm thus can be modeled as the fixed point iteration of the operator $ {J\_{\\tau\\partial h}\\circ F\_{\\tau \\partial g}}$. In the following we shall present some quintessence of this theory.  

**2.1. Averaged operators; resolvents and reflected resolvents**

Averaged operators are a class of operators that is useful for proving convergence when contractive operators are not available.  

> **Definition 2** *A set valued mapping $ {G}$ is called *nonexpansive* if*  
> 
> *$ \\displaystyle \\| Gx- Gy\\|\\leq \\|x-y\\| \\quad \\forall x,y $*
> 
> *In other words, $ {G}$ is $ {1}$-Lipschitz continuous.*

> **Definition 3** *A set valued mapping $ {F}$ is called *$ {\\alpha}$-averaged*, $ {0<\\alpha<1}$, if*  
> 
> *$ \\displaystyle F = \\alpha I + (1-\\alpha) G $*
> 
> *where $ {G}$ is a nonexpansive operator. When $ {\\alpha = 1/2}$, it is often called a *firmly nonexpansive operator*.*

> **Exercise 1** *Show that the sets of fixed points of the operators $ {G}$ and $ {F =\\alpha I + (1-\\alpha) G}$ coincide.*

> **Exercise 2 (Fundamental estimate for averaged operators)** *Show that $ {F}$ is $ {\\alpha}$-averaged if and only if*  
> 
> *$ \\displaystyle \\|Fx-Fy\\|^2 \\leq \\|x-y\\|^2 - \\frac{1-\\alpha}{\\alpha}\\|(I-F)x-(I-F)y\\|^2 $*
> 
> *for all $ {x,y}$. (Hint: use the fact that $ {\\frac{\\alpha -1}{\\alpha} I - \\frac{1}{\\alpha} F}$ is nonexpansive.)*

Now let us look at the gradient step operator $ {F\_{\\tau g}}$ for a $ {L}$-Lipschitz function $ {g}$.  

> **Exercise 3** *Let $ {g}$ be a function with $ {L}$-Lipschitz gradient. Show that $ {F\_{\\tau g}}$ is $ {\\max\\{1,|1-\\tau L|\\}}$-Lipschitz. In particular, when $ {0<\\tau \\leq 2/L}$, $ {F\_{\\tau g}}$ is nonexpansive, and when $ {0<\\tau < 2/L}$, $ {F\_{\\tau g}}$ is $ {\\tau L/2}$-averaged, and when $ {\\tau = 1/L}$ it is firmly nonexpansive. Compare this result with the descent lemma. As a consequence, we have the estimate for all $ {x,y}$*  
> 
> *$ \\displaystyle \\|F\_{\\tau \\partial g}(x) - F\_{\\tau \\partial g}(y)\\|^2 \\leq \\|x -y\\|^2 - (\\frac{2}{L\\tau}-1)\\|(I-F\_{\\tau \\partial g})(x-y)\\|^2. $*
> 
> *Note that $ {(\\frac{2}{L\\tau}-1) > 0}$ if and only if $ {0<\\tau<\\frac{2}{L}}$.*

The above inequality is the crucial estimates for convergence of gradient descent in the setting of fixed point iteration. To see this, first we note that the distances $ {\\|F\_{\\tau \\partial g}(x^k) - x^\*\\|^2}$ is decreasing by our choice of $ {\\tau}$. And writing $ {\\alpha = \\tau L/2}$, with $ {x=x^k, y=x^\*}$ we get  

$ \\displaystyle \\begin{aligned} \\|x^{k+1} - x^\*\\|^2 &\\leq \\|x^k -x^\*\\|^2 - \\frac{1-\\alpha}{\\alpha}\\|(I-F\_{\\tau \\partial g})x^k\\|^2 \\\\ & = \\|x^k -x^\*\\|^2 - \\frac{1-\\alpha}{\\alpha}\\|x^{k+1} - x^k\\|^2 \\end{aligned} $

Rearranging,  

$ \\displaystyle \\begin{aligned} \\|x^{k+1} - x^k\\|^2 \\leq \\frac{\\alpha}{1-\\alpha}(\\|x^k -x^\*\\|^2 - \\|x^{k+1} - x^\*\\|^2) \\end{aligned} $

Summing this inequality in $ {k=0,\\dots,N-1}$,  

$ \\displaystyle \\begin{aligned} \\sum\_{k=0}^{N-1} \\|x^{k+1} - x^k\\|^2 &\\leq \\frac{\\alpha}{1-\\alpha}(\\|x^0 -x^\*\\|^2 - \\|x^{N} - x^\*\\|^2) \\\\ & \\leq \\frac{\\alpha}{1-\\alpha}\\|x^0 -x^\*\\|^2 \\end{aligned} $

Since the sequence is decreasing, we conclude  

$ \\displaystyle \\|x^{k+1} - x^k\\|^2 \\leq \\frac{\\alpha}{N(1-\\alpha)}\\|x^0 -x^\*\\|^2 $

This does not quite show the convergence of the sequence, though. But recall that if we write $ {F\_{\\tau g} = (1-\\alpha)I + \\alpha G}$, the fixed point of $ {F\_{\\tau g}}$ is the same with $ {G}$.  

$ \\displaystyle \\|x^{k+1} - x^k\\|^2 = \\|(1-\\alpha)x^k+ \\alpha Gx^k - x^k\\|^2 = \\alpha^2\\|Gx^k - x^k\\|^2 $

So we have  

$ \\displaystyle \\|Gx^k - x^k\\|^2 \\leq \\frac{1}{N\\alpha(1-\\alpha)}\\|x^0 -x^\*\\|^2 \\rightarrow 0 $

i.e. $ {x^k}$ converges to a fixed point of $ {G}$, with rate $ {O(1/\\sqrt{N})}$.  
This argument can well be generalised to all $ {\\alpha}$-averaged operators. We record this result  

> **Theorem 4** *Let $ {F}$ be an $ {\\alpha}$-averaged operator on $ {\\mathbb{R}^d}$ with non-empty set of fixed points. Then the iteration $ {x^{k+1} = Fx^k}$ converges to a fixed point of $ {F}$.*

It is useful to note that the compositions of averaged operators is again averaged (the iteration being sort of a special case). If $ {T\_1}$ is $ {\\alpha\_1}$-averaged and $ {T\_2}$ is $ {\\alpha\_2}$-averaged, then $ {T\_1T\_2}$ is $ {\\theta/(1+\\theta)}$-averaged with  

$ \\displaystyle \\theta = \\frac{\\alpha\_1}{1-\\alpha\_1} +\\frac{\\alpha\_2}{1-\\alpha\_2}. $  

**From function properties to operator properties.** It will be useful to translate the smoothness and convexity properties of the function to operator properties of its subdifferentials. We have already seen the correspondence for strong convexity of $ {f}$ and the strong monotonicity of $ {\\partial f}$. Here we give more characterisations of this sort.  

> **Definition 5** *An operator $ {T}$ is called *$ {\\beta}$-cocoercive* if $ {\\beta T}$ is $ {\\frac{1}{2}}$-averaged, i.e. firmly non-expansive*  
> 
> *$ \\displaystyle \\| (I-\\beta T)x - (I-\\beta T)y\\|^2+ \\|\\beta Tx - \\beta Ty\\|^2 \\leq \\|x-y\\|^2. $*

> **Exercise 4** *Show that $ {T}$ is $ {\\beta}$-cocoercive implies $ {T}$ is $ {1/\\beta}$-Lipschitz, in particular single-valued. (Hint: the above inequality is equivalent to $ {\\langle Tx - Ty, x-y\\rangle \\geq \\beta \\|Tx - Ty\\|^2}$, then use Cauchy-Schwarz inequality.)*

We first relate the cocoercivity of the gradient to the smoothness of **convex** functions.  

> **Lemma 6** *Let $ {f}$ be a convex function. $ {f}$ has $ {L}$-Lipschitz gradient if and only if its subdifferential is $ {1/L}$-cocoercive.*

*Proof:* We only need to prove one direction. Suppose $ {f}$ has $ {L}$-Lipschitz gradient. It suffices to show  

$ \\displaystyle \\langle \\nabla f(x) - \\nabla f(y), x-y\\rangle \\geq \\frac{1}{L}\\|\\nabla f(x) - \\nabla f(y)\\|^2 $

Define  

$ \\displaystyle \\phi\_x(y) = f(y) - \\langle \\nabla f(x), y\\rangle. $

Now $ {\\phi}$ also has $ {L}$-Lipschitz gradient and achieves minimum at $ {x}$. Consequently, by the descent lemma  

$ \\displaystyle \\begin{aligned} \\phi\_x(x) &\\leq \\inf\_z\\left( \\phi\_x(y) + \\langle \\nabla \\phi\_x(y), z-y\\rangle + \\frac{L}{2}\\|z-y\\|^2 \\right) \\\\ & = \\phi\_x(y) - \\frac{1}{2L}\\|\\nabla \\phi\_x(y)\\|^2 \\end{aligned} $

Hence  

$ \\displaystyle \\begin{aligned} &f(y)-f(x)-\\langle \\nabla f(x), y-x\\rangle \\\\ = & \\phi\_x(y) - \\phi\_x(x) \\\\ \\geq& \\frac{1}{2L}\\|\\nabla \\phi\_x(y)\\|^2 = \\frac{1}{2L}\\|\\nabla f(y) - \\nabla f(x)\\|^2 \\end{aligned} $

Swapping $ {x}$ and $ {y}$ and adding up the two inequalities, we obtain the result. $ \\Box$  

 The name "cocoercive" suggests its relation with "coercive" via convex duality. Indeed, we know from the last post that for a proper, closed and convex function $ {f}$ we have  

$ \\displaystyle s\\in \\partial f(x) \\iff x\\in \\partial f^\*(s) $

That is, $ {(\\partial f)^{-1} = \\partial f^\*}$. We summarise the relations below.  

> **Theorem 7** *Let $ {f}$ be proper, closed and convex. Then the following are equivalent.*  
> 
> *-   f is $ {\\sigma}$-strongly convex.
> -   $ {\\partial f}$ is $ {\\sigma}$-strongly monotone, i.e. $ {\\sigma}$-coercive.
> -   $ {\\nabla f^\*}$ is $ {\\sigma}$-cocoercive.
> -   $ {f^\*}$ has $ {\\frac{1}{\\sigma}}$-Lipschitz gradient.*

We summarise with a graphical representation:  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXu-mlN_j4VQB9CUwQIibnM011wjR4fMKeZxCfVRvR5lZOZjYcboAnvGNwbRbAfH1WgnKmBT1eecLcdjY1NgmnqABLHbh5PO9Yg0jLGYsxDxTcvt-F8d1GaR7cH7KRXk00KlomlubTTdc/s320/Opertator_prop.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXu-mlN_j4VQB9CUwQIibnM011wjR4fMKeZxCfVRvR5lZOZjYcboAnvGNwbRbAfH1WgnKmBT1eecLcdjY1NgmnqABLHbh5PO9Yg0jLGYsxDxTcvt-F8d1GaR7cH7KRXk00KlomlubTTdc/s1600/Opertator_prop.png)

Figure from Pontus Giselsson

**Resolvents of monotone operators.**  

> **Definition 8** *The resolvent of a monotone operator $ {A}$ is defined to be the operator $ {J\_A=(I+A)^{-1}}$.*

If $ {A}$ is maximal monotone, then due to Minty's theorem, the domain of $ {J\_A}$ is the whole $ {\\mathbb{R}^n}$. So we will only consider such cases, which is enough in practice.  

> **Exercise 5** *Show that if $ {A}$ is $ {\\sigma}$-strongly monotone ($ {\\sigma}$=0 means monotone), then $ {I+A}$ is $ {(1+\\sigma)}$-strongly monotone, and hence $ {(I+A)^{-1}}$ is $ {(1+\\sigma)}$-cocoercive, which is equivalent to $ {(I+A)^{-1}}$ being $ {\\frac{1}{\\sigma +1}}$-contractive. In particular, if $ {A}$ is only monotone then $ {(I+A)^{-1}}$ is firmly nonexpansive.*

Now an immediately consequence is the crucial estimate for the proximal point iteration  

$ \\displaystyle \\|J\_{\\tau \\partial g}(x^k) - x^\*\\|^2 \\leq \\|x^k -x^\*\\|^2 - \\|(I-J\_{\\tau \\partial g})(x^k)\\|^2 $

The convergence of proximal point method follows as before. The convergence of proximal gradient method comes for free!  
**Reflected resolvents (Cayley operators).**  

> **Definition 9** *The reflected resolvent of a monotone operator $ {A}$ is defined as*  
> 
> *$ \\displaystyle R\_A = 2J\_A - I $*
> 
> *where $ {J\_A}$ is the resolvent of $ {A}$.*

We will be pretty happy with the fact that $ {R\_A}$ is in general nonexpansive. The "proof" is by the following picture.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSxjYYVOelYVKkL6HF_3neGEVkn23d-E5FkxXaqtLiObczvAJ-7Mym6QjisKdUml5oz9HcUInnk51XOk6Kn7wrhjH54o_sXn1QyBWEi1zdcGGyMJ7RzvsUFLHFL3n_Q1M0ITZpAwsng3U/s320/reflected_resolvent.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSxjYYVOelYVKkL6HF_3neGEVkn23d-E5FkxXaqtLiObczvAJ-7Mym6QjisKdUml5oz9HcUInnk51XOk6Kn7wrhjH54o_sXn1QyBWEi1zdcGGyMJ7RzvsUFLHFL3n_Q1M0ITZpAwsng3U/s1600/reflected_resolvent.png)

Figure from Pontus Giselsson

OK, so why are we interested in this? The point is that the Douglas-Rachford splitting in this language is now  

$ \\displaystyle \\frac{1}{2}I + \\frac{1}{2} R\_{\\partial g} \\circ R\_{\\partial h} $

which is a firmly nonexpansive operator!
