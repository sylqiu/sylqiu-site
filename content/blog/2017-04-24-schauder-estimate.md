---
id: 2017-04-24-schauder-estimate
title: "Schauder estimate"
date: 2017-04-24
tags: ["elliptic theory", "harmonic analysis", "PDE"]
source: https://sylqiu.blogspot.com/2017/04/schauder-estimate.html
publish: true
---
From known results in potential theory for the *Poisson equation*  

$ \\displaystyle \\Delta u=f, $

Schauder was able to develop a linear elliptic theory in the framework of classical solutions, which will be presented in this article. The fundamental observation is that locally, equations  

$ \\displaystyle Lu=f $

under appropriate assumptions can be regarded as perturbations of the Poisson equation. Before commencing the analysis we will first develop some intuition with Hölder spaces, as well as some general strategy in dealing with estimate with Hölder-type quantities. This will be done in Section 2. The attack on this perturbation analysis will thus need to face the following strategical questions:  

-   what are the most essential problems that one can reduce to? 
-   what kind of estimates does one need to make?\*
-   what assumptions does one need, so that the results from the potential theory (or, the constant coefficient case)  become useful?

The somewhat vague question\* shall be partially answered in Section 5, given the guidance from the Banach's two famous theorems in linear functional analysis. However, the technique will shine at its full extent only after one grasps the ideas in Section 3, where the first and the third questions are addressed. The answers to these questions, though not always explicit stated, should constitute the basic philosophy in attacking similar problems.  

In the exposition we have largely followed the book by Gilbarg and Trudinger. Materials for Hölder spaces are mainly collected from notes of Tao.  

**1\. Genesis of $ {C^{\\alpha}}$-estimates: the regularity problem of the Poisson equation**

A harmonic function $ {u}$, i.e.[](https://www.blogger.com/null)  

[$ \\displaystyle \\Delta u=0 \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)is so special in that it is "controlled by itself". This is manifested in a number of inter-connected aspects. The most special one is the *mean value property (MVP)*, which says that the value of the harmonic function at a point can be given by its integral over radially symmetric domains around that point (i.e. balls, spheres). This can be explained by the radial symmetry of the Laplacian, and the fact that it measures the second order change of the average  

$ \\displaystyle \\Delta u(x)=\\lim\_{r\\rightarrow0^{+}}C(n)\\frac{1}{r^{n+2}}\\int\_{B\_{r}(x)}\\left(u(y)-u(x)\\right)dy, $

here $ {C(n)}$ is some constant depending only on $ {n}$. Thus if $ {\\Delta u=0}$ in a domain (i.e. a connected proper open subset) $ {\\Omega\\subset\\mathbb{R}^{n}}$ , and assuming some regularity $ {u\\in C^{2}(\\Omega)}$, one recovers the MVP.  
We can easily deduce many other properties from the MVP. For instances, suppose $ {u}$ is harmonic, then  

-   via a contradiction argument, one sees that $ {u}$ on a bounded domain takes its extrema on the boundary, and otherwise constant. These are known as the *weak and strong maximum principles*.
-   given a ball $ {B\_{R}(x)\\subset\\Omega'\\subset\\subset\\Omega}$, for any $ {y\_{1},y\_{2}\\in B\_{r}(y)}$ for $ {r}$ small enough (say $ {r=R/4)}$, via a covering argument, one can control the discrepancy between the values $ {u(y\_{1})}$ and $ {u(y\_{2})}$ by using the MVP. This implies that harmonic functions satisfy a (rather crude) *Harnack-type inequality*,

    $ \\displaystyle \\sup\_{\\Omega'}u\\lesssim\_{n}\\inf\_{\\Omega'}u. $

-   since MVP is stable under convolving with an *approximate identity*, which is a mollifier, thus the MVP implies smoothness of $ {u}$.
-   by differentiation under the integral sign and divergence theorem,

    $ \\displaystyle D\_{i}u(x\_{0})=\\frac{n}{\\omega\_{n}R^{n}}\\int\_{\\partial B\_{R}(x\_{0})}u(y)\\nu\_{i}dS(y), $

    this implies a *(a priori) gradient bound*

    $ \\displaystyle |Du(x\_{0})|\\leq\\frac{n}{R}\\sup\_{B\_{R}(x\_{0})}|u| $

    and its higher order analogs[

    $ \\displaystyle |D^{\\boldsymbol{\\alpha}}u(x\_{0})|\\leq\\frac{n^{m}e^{m-1}m!}{R^{m}}\\sup\_{B\_{R}(x\_{0})}|u| \\ \\ \\ \\ \\ (2)$

    ](https://www.blogger.com/null)for any multi-index $ {\\alpha}$ with $ {|\\alpha|=m}$. From this one can show the *analyticity* of $ {u}$.

The bound ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) can be extended to an *(a priori) interior estimate* of the form[](https://www.blogger.com/null)  

[$ \\displaystyle \\sup\_{\\Omega'}|D^{\\boldsymbol{\\alpha}}u|\\lesssim\_{n,m}\\frac{1}{\\text{diam}(\\Omega')^{m}}\\sup\_{\\Omega}|u| \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {\\Omega'\\subset\\subset\\Omega}$ . These estimates are called *a priori* because the existence of $ {u}$ is part of the assumption. An immediate consequence is the *equicontinuity* of the derivatives of $ {u}$ at all orders, and via the *Arzelá-Ascoli* theorem, we can obtain the following *compactness result*, which is important in developing the existence of solutions to the Dirichlet problem:  

-   Any bounded sequence of harmonic functions on a domain $ {\\Omega\\subset\\mathbb{R}^{n}}$ contains a locally uniformly convergent subsequence.  

Next we consider the inhomogeneous counterpart to ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), the *Poisson equation*[](https://www.blogger.com/null)  

[$ \\displaystyle \\Delta u=f, \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where we call the function $ {f:\\Omega\\rightarrow\\mathbb{R}}$ the *source term* of the equation. To see the structure of the equation, we use the fundamental solution: for any function $ {u}$ in $ {C^{2}(\\overline{B}\_{R}(x))}$, we have for $ {y\\in\\Omega}$, the *Green's representation formula*  

$ \\displaystyle u(y)=\\int\_{\\partial B\_{R}}\\left(u(x)\\frac{\\partial\\Phi}{\\partial\\nu}(x-y)-\\Phi(x-y)\\frac{\\partial u}{\\partial\\nu}(x)\\right)dS(x)+\\int\_{B\_{R}}\\Phi(x-y)\\Delta u(x)dx, $

where  

$ \\displaystyle \\Phi(x-y)=\\Phi(|x-y|)=\\begin{cases} \\frac{1}{n(2-n)\\omega\_{n}}|x-y|^{2-n} & n>2\\\\ \\frac{1}{2\\pi}\\log|x-y| & n=2 \\end{cases} $

denotes the *Newton kernel*, which is the fundamental solution of the *Laplace equation*, that is,  

$ \\displaystyle \\Delta\\Phi(x-y)=\\delta(x-y)\\quad\\text{in }\\mathbb{R}^{n}. $

The representation formula decomposes a function $ {u}$ in $ {C^{2}(\\overline{\\Omega})}$ into a sum of a harmonic function  

$ \\displaystyle h(y)=\\int\_{\\partial B\_{R}}\\left(u(x)\\frac{\\partial\\Phi}{\\partial\\nu}(x-y)-\\Phi(x-y)\\frac{\\partial u}{\\partial\\nu}(x)\\right)dS(x) $

and the *Newtonian potential* of the Laplacian  

$ \\displaystyle w\_{\\Delta u}(y):=\\int\_{\\Omega}\\Phi\*\\Delta udx. $

If we can replace $ {\\Delta u}$ by $ {f}$, then the solutions to the Poisson equation is decomposed into two parts as above  

$ \\displaystyle u=h+w\_{f}. $

So we have to justify the replacement. This means we have to analyse the linear operator  

$ \\displaystyle \\Delta^{-1}:f\\mapsto w\_{f} $

where the notation $ {\\Delta^{-1}}$ is due to the fact that $ {\\Delta w\_{\\Delta u}=\\Delta u}$. If it were the case that $ {\\Delta^{-1}}$ is bounded, say, from $ {C^{0}(\\Omega)}$ to $ {C^{2}(\\Omega')}$, that is[](https://www.blogger.com/null)  

[$ \\displaystyle \\sup\_{\\Omega'}|D^{2}w\_{f}|\\lesssim\_{n,\\Omega'}\\sup\_{\\Omega}|f|, \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {D^{2}}$ means the second order derivative operator, and then coupled with the previous estimate of the harmonic functions ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)), one would have an interior a priori bound for the solutions of the Poisson equation[](https://www.blogger.com/null)  

[$ \\displaystyle \\sup\_{\\Omega'}|D^{2}u|\\lesssim\_{n,\\Omega'}\\sup\_{\\Omega}|h|+\\sup\_{\\Omega}|f|. \\ \\ \\ \\ \\ (6)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)And by a similar compactness result one would get the existence of solutions to the Dirichlet problem of Poisson equation with continuous source term.  
The bound ([6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)) as stated is, however, not the case.  

> **Example 1** *Let $ {P(x)=x\_{1}x\_{2}}$ (or any other harmonic polynomial with mixed-partials bounded away from zero will do), and let $ {\\eta\\in C\_{0}^{\\infty}(B\_{2}(0))}$ be a cutoff function such that $ {\\eta=1}$ when $ {|x|<1}$. Consider the function*  
> 
> *$ \\displaystyle v(x):=\\eta P(x). $*
> 
> *Then when $ {|x|<1}$*  
> 
> *$ \\displaystyle D\_{12}v(x)=1\\quad\\text{and}\\quad\\Delta v(x)=0 $*
> 
> *and when $ {1<|x|<2}$*  
> 
> *$ \\displaystyle \\Delta v(x)=P\\Delta\\eta(x)+2D\\eta(x)\\cdot DP(x). $*
> 
> *Rescaling $ {v\_{k}(x)=2^{-2k}v(2^{k}x)}$, we find that for each $ {x}$ near zero, there exists exactly one $ {N>0}$ with*  
> 
> *$ \\displaystyle 2^{-N}\\leq x<2^{-N+1}. $*
> 
> *Thus we have*  
> 
> *$ \\displaystyle \\Delta v\_{N}(x)=\\Delta v(2^{N}x), $*
> 
> *and for all $ {n<N}$*  
> 
> *$ \\displaystyle \\Delta v\_{n}(x)=0,\\quad D\_{12}v\_{n}(x)=1, $*
> 
> *and for all $ {n>N}$*  
> 
> *$ \\displaystyle \\Delta v\_{n}(x)=0,\\quad D\_{12}v\_{n}(x)=0. $*
> 
> *Now if we let*  
> 
> *$ \\displaystyle f(x)=\\sum\_{n=1}^{\\infty}n^{-1}2^{-2k}\\Delta v(2^{k}x), $*
> 
> *which is then continuous, but*  
> 
> *$ \\displaystyle \\sum\_{n=1}^{\\infty}n^{-1}2^{-2k}D\_{12}v(2^{k}x) $*
> 
> *blows up near zero, as $ {\\sum n^{-1}}$ is divergent. Here one utilises separately the fact that $ {D^{2}(\\eta P)\\rightarrow1}$ as $ {x\\rightarrow0}$, and the boundedness of $ {\\Delta(\\eta P)}$ in the annulus $ {1<|x|<2}$. Hence we conclude that $ {\\Delta u=f}$ does not have a solution in $ {C^{2}(B\_{2}(0))}$.*

The above result exhibits the possibility of piling up the "frequency" near the origin to get logarithmic divergence, while keeping the Laplacian bounded. It thus becomes necessary to search for spaces that are better behaved than the classical $ {C^{0}}$ space in order for $ {D^{2}\\Delta^{-1}}$ to be bounded. We shall next turn to the study of a particular convenient class of such spaces suitable in the framework of classical solutions.  

**2\. Working with Hölder spaces: intuitions**

Throughout this section $ {\\Omega}$ will be a domain in $ {\\mathbb{R}^{n}}$ subject to some boundary regularity condition to be specified. As we shall see, this will not be the concern for *interior estimates*, but *boundary estimates*.  

For the classical derivatives, it is natural to use the norm  

$ \\displaystyle \\|f\\|\_{C^{k}(\\overline{\\Omega})}:=\\sum\_{|\\boldsymbol{\\alpha}|\\leq k}\\sup\_{x\\in\\Omega}|D^{\\boldsymbol{\\alpha}}f|, $

where the bold greek $ {\\boldsymbol{\\alpha}}$ is a multi-index. We denote $ {C^{k}(\\Omega)}$ to be the space of $ {k}$-times continuously differentiable functions on $ {\\Omega}$ such that $ {\\|\\cdot\\|\_{C^{k}(\\overline{\\Omega})}}$ is finite. Then $ {C^{k}(\\Omega)}$ becomes a Banach space. We also denote $ {C\_{\\text{loc}}^{k}(\\Omega)}$ to be the space of $ {k}$-times continuously differentiable functions on $ {\\Omega}$. These are the functions such that the quantity $ {\\|\\cdot\\|\_{C^{k}(K)}}$ is finite whenever $ {K}$ is a compact subset of $ {\\Omega}$. We will also use the notation $ {C^{k}(\\mathbb{R}^{n})}$ to mean the space with finite $ {C^{k}}$-norm on $ {\\mathbb{R}^{n}}$. Its local version will be denoted by $ {C\_{\\text{loc}}^{k}(\\mathbb{R}^{n})}$.  

In any case, such a quantity only measures the "height" of the function and its derivatives up to order $ {k}$.  

> **Example 2** *It is instructive to illustrate this with the function*  
> 
> *$ \\displaystyle A\\phi(x/R)\\sin(\\xi\\cdot x), $*
> 
> *where $ {A>0}$, $ {\\phi\\in C\_{c}^{\\infty}(\\mathbb{R}^{n})}$ and $ {R>1/|\\xi|}$. Then the $ {C^{k}}$-norm of the function satisfies*  
> 
> *$ \\displaystyle \\|A\\phi(x/R)\\sin(\\xi\\cdot x)\\|\_{C^{k}(\\mathbb{R}^{n})}\\lesssim\_{n,\\phi,k}A|\\xi|^{k}. $*
> 
> *Note the assumption $ {R>1/|\\xi|}$ implies that the frequency scale is "effective", meaning that the support of the function must be large enough to capture such information. This can be thought of as an manifestation of the "uncertainty principle".*

Thus we see that the $ {C^{k}}$-norm is unable to capture the "frequency scale" information of the highest derivative of that function, which may not be differentiable in the classical sense. There are some ways to get such information near a point $ {x\_{0}\\in\\Omega}$, but an elementary one (e.g. not involving *weak derivative*) is the *$ {\\alpha}$-Hölder coefficient* at $ {x\_{0}}$:  

$ \\displaystyle \[f\]\_{\\alpha;x\_{0}}:=\\sup\_{x\\in\\Omega}\\frac{|f(x)-f(x\_{0})|}{|x-x\_{0}|^{\\alpha}} $

where $ {\\alpha\\geq0}$. And $ {f}$ is called *pointwisely $ {\\alpha}$-Hölder continuous* if $ {\[f\]\_{\\alpha;x}<+\\infty}$ for every $ {x\\in\\Omega}$. We can also define the *Hölder semi-norm*  

$ \\displaystyle \[f\]\_{\\alpha;\\Omega}=\\sup\_{\\underset{x\\neq y}{x,y\\in\\Omega}}\\frac{|f(x)-f(x\_{0})|}{|x-y|^{\\alpha}} $

and we call $ {f}$ to be *uniformly $ {\\alpha}$-Hölder continuous* if $ {\[f\]\_{\\alpha,\\Omega}<+\\infty}$, and *locally $ {\\alpha}$-Hölder continuous* if $ {\[f\]\_{\\alpha,K}<+\\infty}$ for every compact subset $ {K\\subset\\Omega}$. Clearly, if $ {f}$ is bounded, then pointwise Hölder is equivalent to locally Hölder. If $ {\\alpha=1}$, $ {\[f\]\_{\\alpha;\\Omega}}$ then coincide with the more familiar *Lipschitz semi-norm*.  
It turns out that only the cases $ {0\\leq\\alpha\\leq1}$ are interesting.  

> **Proposition 1** *Let $ {f\\in C^{0}(\\Omega)}$ and $ {x\_{0}\\in\\Omega}$.*  
> 
> 1.  If $ {\\alpha=0}$, $ {\[f\]\_{\\alpha;\\Omega}\\leq2\\sup\_{x\\in\\Omega}|f(x)|}$;
> 2.  If $ {\\alpha>1}$, and $ {\[f\]\_{\\alpha;\\Omega}<+\\infty}$, then $ {f}$ is constant. 

*Proof:* For (2), there exist $ {C>0}$ such that  

$ \\displaystyle \\frac{|f(x)-f(y)|}{|x-y|}<C|x-y|^{\\alpha-1}, $

for all $ {x,y\\in\\Omega}$. Then taking $ {|x-y|\\rightarrow0}$, we see that $ {f}$ is differentiable and $ {f'\\equiv0}$. $ \\Box$  

Hence we shall always assume $ {0\\leq\\alpha\\leq1}$. Now we define  

> **Definition 2** *(Hölder spaces) The *$ {\\alpha}$-Hölder norm* of a function $ {f}$ is defined as*  
> 
> *$ \\displaystyle \\|f\\|\_{C^{k,\\alpha}(\\Omega)}=\\|f\\|\_{C^{k}(\\Omega)}+\[f\]\_{\\alpha,\\Omega}. $*
> 
> *We denote $ {C^{k,\\alpha}(\\Omega)}$ to be the space of functions with finite $ {\\|\\cdot\\|\_{C^{k,\\alpha}(\\Omega)}}$ values. These are the functions with their $ {k}$-th order partial derivatives uniformly $ {\\alpha}$-Hölder continuous. We also denote $ {C\_{\\text{loc}}^{k,\\alpha}(\\Omega)}$ to be the space of functions that are locally $ {\\alpha}$-Hölder continuous. We will also use $ {C^{k,\\alpha}(\\mathbb{R}^{n})}$ and $ {C\_{\\text{loc }}^{k,\\alpha}(\\mathbb{R}^{n})}$ following the similar convention as before.*

Locally Hölder norm behaves well under products. Let's assume $ {\\Omega}$ is bounded, and $ {f\\in C^{\\alpha}(\\Omega)}$ and $ {g\\in C^{\\beta}(\\Omega)}$ with $ {\\alpha<\\beta}$. Observe that  

$ \\displaystyle \\frac{|f(x)g(x)-f(y)g(y)|}{|x-y|^{\\alpha}}\\leq\\frac{|g(x)(f(x)-f(y))|}{|x-y|^{\\alpha}}+\\frac{|f(y)(g(x)-g(y))|}{|x-y|^{\\alpha}}, $

and  

$ \\displaystyle \\frac{|g(x)(f(x)-f(y))|}{|x-y|^{\\alpha}}\\leq\\|g\\|\_{C^{0}(\\Omega)}\[f\]\_{\\alpha;\\Omega}, $

$ \\displaystyle \\begin{array}{rcl} \\frac{|f(y)(g(x)-g(y))|}{|x-y|^{\\alpha}} & = & |x-y|^{\\beta-\\alpha}\\frac{|f(y)(g(x)-g(y))|}{|x-y|^{\\beta}}\\\\ & \\leq & |\\text{diam}\\Omega|^{\\beta-\\alpha}\\|f\\|\_{C^{0}(\\Omega)}\[g\]\_{\\alpha;\\Omega}, \\end{array} $

we conclude that on bounded domains the product of Hölder continuous functions is still Hölder continuous, and moreover, write $ {\\gamma=\\min(\\alpha,\\beta)}$[](https://www.blogger.com/null)  

[$ \\displaystyle \\|fg\\|\_{C^{\\gamma}(\\Omega)}\\leq\\max(1,|\\text{diam}\\Omega|^{\\alpha+\\beta-2\\gamma})\\|f\\|\_{C^{\\alpha}(\\Omega)}\\|g\\|\_{C^{\\beta}(\\Omega)}. \\ \\ \\ \\ \\ (7)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)We also see that in general the product inherits the *lowest* Hölder regularity from the given functions.  

> **Example 3** *[](https://www.blogger.com/null)Here we illustrate the behaviour of the $ {C^{k,\\alpha}}$-norm on $ {\\mathbb{R}^{n}}$ using various functions, thus ignoring the boundary effects of the domain. Let $ {\\phi\\in C\_{c}^{\\infty}(\\mathbb{R}^{n})}$. First note that for $ {x\_{0}\\in\\mathbb{R}^{n}}$,*  
> 
> *$ \\displaystyle \\lim\_{x\\rightarrow x\_{0}}\\frac{|\\phi(x)-\\phi(x\_{0})|}{|x-x\_{0}|^{\\alpha}}=\\lim\_{x\\rightarrow x\_{0}}\\frac{|\\phi(x)-\\phi(x\_{0})|}{|x-x\_{0}|}|x-x\_{0}|^{1-\\alpha}=\\begin{cases} |\\phi'(x\_{0})| & \\alpha=0\\\\ 0 & \\text{otherwise} \\end{cases}. $*
> 
> *To quotient $ {\\frac{|\\phi(x)-\\phi(x\_{0})|}{|x-x\_{0}|^{\\alpha}}}$ is clearly bounded outside a neighborhood of $ {x\_{0}}$. Hence bounded differentiable functions are $ {\\alpha}$-Hölder continuous for all $ {0\\leq\\alpha\\leq1}$. Next consider the function  
> *  
> 
> *$ \\displaystyle |x|^{s}\\phi(x). $*
> 
> *If $ {s\\geq k+\\alpha}$, then clearly it lies in $ {C^{k}(\\mathbb{R}^{n})}$. Since $ {|x|^{\\beta}}$ is $ {\\alpha}$-Hölder continuous at $ {x=0}$ if $ {\\beta\\geq\\alpha}$ (and smooth at other points), one sees that $ {|x|^{s}\\phi(x)}$ lies in $ {C^{k,\\alpha}(\\mathbb{R}^{n})}$. Conversely, if $ {s<k+\\alpha}$, then $ {|x|^{s}\\phi(x)}$ does not lie in $ {C^{k,\\alpha}(\\mathbb{R}^{n})}$. Finally consider the function  
> *  
> 
> *$ \\displaystyle A\\phi(x/R)\\sin(\\xi\\cdot x), $*
> 
> *where $ {A>0}$, $ {R>1/|\\xi|}$. It has $ {C^{k,\\alpha}}$-norm of order*  
> 
> *$ \\displaystyle \\|\\phi(x)\\sin(\\xi\\cdot x)\\|\_{C^{k}(\\mathbb{R}^{n})}\\lesssim\_{n,\\phi,k}A|\\xi|^{k+\\alpha}. $*

More generally, one can see that if $ {0<\\alpha<\\beta<1}$, then on $ {\\mathbb{R}^{n}}$  

$ \\displaystyle C^{k}\\equiv C^{k,0}\\supsetneq C^{k,\\alpha}\\supsetneq C^{k,\\beta}\\supsetneq C^{k,1}\\supsetneq C^{k+1}, $

and in fact each inclusion is an continuous embedding. Thus Hölder continuity can be thought of as "fractional differentiabilty" in a sense.  
The situation for the domian $ {\\Omega}$ is more subtle, as one has to consider the behaviour of the function near the boundary $ {\\partial\\Omega}$. For example, let $ {\\Omega=\\mathbb{R}^{n}\\backslash\\{0\\}}$, $ {\\phi\\in C\_{c}^{\\infty}(\\mathbb{R}^{n})}$. Then the function  

$ \\displaystyle |x|\\phi(x) $

lies in $ {C^{1,0}(\\Omega)}$. But it does not come from a restriction of any function in $ {C^{1,0}(\\mathbb{R}^{n})}$, since $ {|x|}$ is not conitnuously differentiable at the origin. Moreover, from the experience with various Hölder quantities (when $ {\\alpha>0}$), for instances the estimate with products ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq17)), and calculations for smooth functions in Example [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exaHere-we-illustrate) above, we can see that they are in a sense "global" in character, in constrast to differentiability, which is an entirely local concept. In this respect, there is a typical example of a Liouville type result regarding the boundedness of Hölder norm for harmonic functions defined on the whole space $ {\\mathbb{R}^{n}}$.  

> **Lemma 3** *(Liouville type lemma) Let $ {0<\\alpha<1}$. If $ {u:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ is a harmonic function with finite $ {\\alpha}$-Hölder norm, i.e. there exists $ {C>0}$ such that[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle |u(x)-u(y)|\\leq C|x-y|^{\\alpha} \\ \\ \\ \\ \\ (8)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)for all $ {x,y\\in\\mathbb{R}^{n}}$. Then $ {u}$ is constant.*

*Proof:* Without loss of generality assume $ {u(0)=0}$. Taking $ {y=0}$ in ([8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7-1)) we find a growth condition for $ {u}$:  

$ \\displaystyle |u(x)|\\leq C|x|^{\\alpha}. $

Then using the gradient estimate for harmonic functions, it is easily seen that $ {u}$ must be constant. $ \\Box$  

Therefore, it is often useful to divide the analysis into "local part" and "non local" part, where in the former one can make use of the smoothness, and in later the boundedness of the function. Such a strategy can be used to prove, perhaps surprisingly, that one cannot approximate a $ {C^{\\alpha}}$ function using smooth functions in the $ {C^{\\alpha}}$-topology, but only weaker $ {C^{\\alpha'}}$-topologies where $ {\\alpha'<\\alpha}$ (see Tao).  
This "non-locality" can also cause problems since the domain can "go bad" more quickly than the function does. For example, consider  

$ \\displaystyle \\Omega=\\{(x,y)\\in\\mathbb{R}^{2}:y<|x|^{1/2},x^{2}+y^{2}<1\\} $

which has a "cusp" near the origin. And consider the function  

$ \\displaystyle u(x,y)=\\begin{cases} (\\text{sgn }x)y^{\\beta} & y>0\\\\ 0 & y\\leq0 \\end{cases} $

where $ {1<\\beta<2}$, which is in $ {C^{1,0}(\\Omega)}$. However, $ {u\\notin C^{\\alpha}(\\Omega)}$ if $ {\\beta/2<\\alpha}$, as one checks that  

$ \\displaystyle \\frac{u(x,x^{1/2})-u(-x,x^{1/2})}{|2x|^{\\alpha}}=C\\frac{x^{\\beta/2}}{x^{\\alpha}} $

blows up near the origin, and thus the inclusion fails $ {C^{1,0}(\\Omega)\\not\\subset C^{\\alpha}(\\Omega)}$. For this reason, it is necessary to assume some boundary regularity for the domain $ {\\Omega}$, and it will be convenient to separate the analysis into the *interior estimate* part and the *boundary estimate* part, which will be developed in later sections.  

Finally we make a remark on the choice of definition of the $ {C^{k}}$-norms on $ {\\mathbb{R}^{n}}$. In fact, the quantity $ {\\|f\\|\_{C^{k}(\\mathbb{R}^{n})}}$ is comparable to  

$ \\displaystyle \\|f\\|\_{\\tilde{C}^{k}(\\mathbb{R}^{n})}=\\sup\_{\\mathbb{R}^{n}}|f|+\\sup\_{\\mathbb{R}^{n}}|D^{k}f|, $

that is, it suffices to control the highest order derivatives in order to control the intermediate ones (which also somehow explains why the highest order terms in a PDE dominate). This can be easily seen from the fundamental theorem of calculus: let $ {x\\in\\mathbb{R}^{n}}$ and $ {x',x''}$ be the endpoints of the segment, containing $ {x}$, of length $ {2d}$ for some fixed $ {d>0}$, parallel to the $ {x^{i}}$-axis. Then for some $ {\\bar{x}}$ in the segment we have by the mean value theorem  

$ \\displaystyle |D\_{i}f(\\bar{x})|=\\frac{|f(x')-f(x'')|}{2d}\\leq\\frac{1}{d}\\sup\_{\\mathbb{R}^{n}}|f|. $

Using fundamental theorem of calculus, we have the desired uniform bound  

$ \\displaystyle |D\_{i}f(x)|=|D\_{i}f(\\bar{x})+\\int\_{\\bar{x}}^{x}D\_{ii}fdx\_{i}|\\leq\\frac{1}{d}\\sup\_{\\mathbb{R}^{n}}|f|+d\\sup\_{\\mathbb{R}^{n}}|D\_{ii}f|. $

This idea can be in fact amplified to a family of *interpolation inequalities* in more general cases, which will be useful in our analysis. Here, it takes the form  

$ \\displaystyle \\sup\_{\\mathbb{R}^{n}}|D^{1}f|\\leq\\epsilon\\sup\_{\\mathbb{R}^{n}}|D^{2}f|+C\_{\\epsilon}\\sup\_{\\mathbb{R}^{n}}|f|. $

for any $ {\\epsilon>0}$. For example, such an inequality is useful when we have, for example in this case, the convergence $ {f\_{n}\\rightarrow f}$ in $ {C^{2}(\\mathbb{R}^{n})}$ in $ {C^{0}}$-topology, then one can conclude that in fact $ {f\_{n}\\rightarrow f}$ in $ {C^{1}}$-topology. This is part of the more general phenomenon that sequences bounded in high regularity spaces tend to have converging subsequences in the low regularity spaces (that is of a *Rellich-Kondrachov type* compact embedding). Such kind of results are also very useful in the context of *Sobolev spaces*, but we won't touch this topic in the article. Note that if $ {\\Omega}$ is in place of $ {\\mathbb{R}^{n}}$, then $ {d}$ depends on the choice of $ {x}$, and thus making the problem more complicated. Nevertheless the interpolation inequality holds true, and this again requires a separation of analysis into interior and boundary parts. We shall mention this in later sections of the notes.  

**3\. The heart of the matter: interior a priori estimate**

This section is to devoted to the proof of the Hölder estimate for the Newtonian potential,[](https://www.blogger.com/null)  

[$ \\displaystyle \\|D^{2}w\_{f}\\|\_{C^{\\alpha}(\\Omega')}\\lesssim\_{n,\\Omega'}\\|f\\|\_{C^{\\alpha}(\\Omega)}, \\ \\ \\ \\ \\ (9)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for any $ {u\\in C^{2,\\alpha}(\\Omega)}$, $ {0<\\alpha<1}$; as well as Schauder's perturbation argument for the generalised a priori estimate[](https://www.blogger.com/null)  

[$ \\displaystyle \\|u\\|\_{C^{2,\\alpha}(\\Omega')}\\lesssim\_{n,\\Omega',L}\\|Lu\\|\_{C^{\\alpha}(\\Omega)}+\\|u\\|\_{C^{0}(\\Omega)}, \\ \\ \\ \\ \\ (10)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for a linear second order uniform elliptic operator with, i.e.  

$ \\displaystyle Lu(x)=a^{ij}(x)D\_{ij}^{2}u(x)+b^{i}(x)D\_{i}u(x)+c(x)u(x) $

with some appropriate assumptions on the coefficients. The vital ideas presented in what follows will stand as the principal part of this article.  
Note that it suffices to establish[](https://www.blogger.com/null)  

[$ \\displaystyle \\|D^{2}w\_{f}\\|\_{C^{\\alpha}(B\_{r})}\\lesssim\_{n,r}\\|f\\|\_{C^{\\alpha}(B\_{2r})}. \\ \\ \\ \\ \\ (11)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Indeed, let $ {x\_{0}\\in\\Omega'}$ $ {r=\\frac{1}{3}\\text{dist}(x\_{0},\\partial\\Omega)}$, $ {B\_{r}=B(x\_{0},r)}$, and $ {y\\in\\Omega}$. We have  

$ \\displaystyle \\begin{array}{rcl} & & |D^{2}u(x)|+\\frac{|D^{2}u(x)-D^{2}u(y)|}{|x-y|^{\\alpha}}\\\\ & \\leq & \\|D^{2}u\\|\_{C^{2}(B\_{r})}+\[D^{2}u\]\_{\\alpha;B\_{r}}+\\frac{|D^{2}u(x)|+|D^{2}u(y)|}{r^{\\alpha}}. \\end{array} $

By ([11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq8)), the above is bounded by  

$ \\displaystyle \\begin{array}{rcl} & \\lesssim\_{n,B\_{r}} & \\|\\Delta u\\|\_{C^{\\alpha}(B\_{2r})}\\leq\\|\\Delta\\tilde{u}\\|\_{C^{\\alpha}(\\tilde{\\Omega})}. \\end{array} $

Then one can apply a standard covering argument for the compact set $ {\\overline{\\Omega'}}$.  
If we rescale the function based on $ {x\_{0}}$,  

$ \\displaystyle \\tilde{u}(x)=u(x\_{0}+\\rho x) $

where $ {\\rho>0}$, the estimate ([11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq8)) turns into  

$ \\displaystyle \\|D^{2}w\_{f}\\|\_{C^{0}(B(0,r/\\rho))}+\\rho^{\\alpha}\[D^{2}w\_{f}\]\_{\\alpha;B(0,r/\\rho)}\\lesssim\_{n,r}\\|f\\|\_{C^{0}(B(0,r/\\rho))}+\\rho^{\\alpha}\[f\]\_{\\alpha;B(0,r/\\rho)}. $

Thus it is natural to introduce the non-dimensional quantities  

$ \\displaystyle |u|'\_{k,\\alpha;B\_{r}}=\\sum\_{j=0}^{k}r^{j}\\|D^{j}u\\|\_{C^{0}(B\_{r})}+r^{k+\\alpha}\[D^{k}u\]\_{\\alpha;B\_{r}} $

to absorb the effect done by scaling. Thus the estimate ([11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq8)) writes[](https://www.blogger.com/null)  

[$ \\displaystyle |D^{2}w\_{f}|'\_{0,\\alpha;B\_{r}}\\lesssim\_{n}|f|'\_{0,\\alpha;B\_{2r}}. \\ \\ \\ \\ \\ (12)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  
We first justify that $ {w\_{f}}$ is twice differentiable provided $ {f\\in C^{0,\\alpha}(B\_{2r})}$, which satisfies  

$ \\displaystyle |f(x)-f(y)|\\lesssim\[f\]\_{\\alpha;x}|x-y|^{\\alpha}. $

This will be based on an approximation argument. For this we need the following estimates on the Newton kernel  

$ \\displaystyle \\begin{array}{rcl} |D\_{i}\\Phi(x-y)| & \\lesssim & |x-y|^{1-n};\\\\ |D\_{ij}\\Phi(x-y)| & \\lesssim & |x-y|^{-n}. \\end{array} $

As results, the functions[](https://www.blogger.com/null)  

[$ \\displaystyle v\_{1}(x)=\\int\_{B\_{2r}}D\_{i}\\Phi(x-y)\\cdot f(y)dy, \\ \\ \\ \\ \\ (13)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)[](https://www.blogger.com/null)  

[$ \\displaystyle v\_{2}(x)=\\int\_{B\_{2r}}D\_{ij}\\Phi(x-y)\\cdot(f(y)-f(x))dy+f(x)\\int\_{\\partial B\_{2r}}D\_{i}\\Phi(x-y)\\cdot\\nu\_{j}dS(y). \\ \\ \\ \\ \\ (14)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)are well defined. The "bad" part of kernel and its derivatives occur when $ {x=y}$. So we multiply a cutoff function $ {\\eta\_{\\epsilon}(x-y)=\\eta(\\frac{|x-y|}{\\epsilon})}$ with  

$ \\displaystyle \\eta(t)=\\begin{cases} 1 & t\\geq2\\\\ 0 & t\\leq1\\\\ C^{\\infty} & \\text{otherwise} \\end{cases},\\quad|\\eta'|\\leq2, $

then  

$ \\displaystyle w\_{\\epsilon}:=\\int\_{B\_{2r}}\\Phi\\eta\_{\\epsilon}(x-y)\\cdot f(y)dy $

is differentiable with  

$ \\displaystyle D\_{i}w\_{\\epsilon}=\\int\_{B\_{2r}}D\_{i}\\Phi\\eta\_{\\epsilon}(x-y)\\cdot f(y)dy. $

Thus  

$ \\displaystyle \\begin{array}{rcl} |v\_{1}(x)-D\_{i}w\_{\\epsilon}(x)| & = & \\left|\\int\_{|x-y|\\leq2\\epsilon}D\_{i}(1-\\eta\_{\\epsilon})\\Phi(x-y)\\cdot f(y)dy\\right|\\\\ & \\leq & \\sup|f|\\int\_{|x-y|\\leq2\\epsilon}\\left(|D\_{i}\\Phi|+\\frac{2}{\\epsilon}|\\Phi|\\right)dy\\\\ & = & O(\\epsilon), \\end{array} $

and hence $ {D\_{i}w\_{\\epsilon}(x)}$ converges locally uniformly to $ {v\_{1}}$ and $ {D\_{i}w=v\_{1}}$. Similarly,  

$ \\displaystyle \\begin{array}{rcl} |v\_{2}(x)-D\_{ij}w\_{\\epsilon}| & = & \\left|\\int\_{|x-y|\\leq2\\epsilon}D\_{j}\\left((1-\\eta\_{\\epsilon})D\_{i}\\Phi(x-y)\\right)\\cdot\\left(f(y)-f(x)\\right)dy\\right|\\\\ & \\leq & \[f\]\_{\\alpha;x}\\int\_{|x-y|\\leq2\\epsilon}\\left(|D\_{ij}\\Phi|+\\frac{2}{\\epsilon}|D\_{i}\\Phi|\\right)|x-y|^{\\alpha}dy\\\\ & = & O(\\epsilon^{\\alpha}) \\end{array} $

and hence $ {D\_{ij}w\_{\\epsilon}(x)}$ converges locally uniformly to $ {v\_{2}}$ and $ {D\_{ij}w=v\_{2}}$.  
Now we turn to the Hölder estimate ([12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq9)). Thanks to the explicit formula ([14](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq11)), the estimates below are lengthy but straightforward. First we have a $ {C^{0}}$-bound for all $ {x\\in B\_{r}}$,  

$ \\displaystyle |D\_{ij}w(x)|\\lesssim|f(x)|+r^{\\alpha}\[f\]\_{\\alpha;x}. $

Next let $ {\\bar{x}\\in B\_{r}}$ be another point. Then  

$ \\displaystyle \\begin{array}{rcl} & & D\_{ij}w(\\bar{x})-D\_{ij}w(x)\\\\ & = & \\int\_{B\_{2r}}D\_{ij}\\Phi(\\bar{x}-y)\\cdot(f(y)-f(\\bar{x}))dy+f(\\bar{x})\\int\_{\\partial B\_{2r}}D\_{i}\\Phi(\\bar{x}-y)\\cdot\\nu\_{j}dS(y)\\\\ & & -\\int\_{B\_{2r}}D\_{ij}\\Phi(x-y)\\cdot(f(y)-f(x))dy-f(x)\\int\_{\\partial B\_{2r}}D\_{i}\\Phi(x-y)\\cdot\\nu\_{j}dS(y). \\end{array} $

By adding and subtracting various terms and rearranging, it amounts to estimate the following integrals. There are two boundary terms:  

$ \\displaystyle \\begin{array}{rcl} & & f(x)\\int\_{\\partial B\_{2r}}\\left(D\_{i}\\Phi(\\bar{x}-y)-D\_{i}\\Phi(x-y)\\right)\\cdot\\nu\_{j}dS(y)\\\\ & \\leq & \\sup\_{B\_{2r}}|f|\\cdot|x-\\bar{x}|\\int\_{\\partial B\_{2r}}\\left|DD\_{i}\\Phi(\\bar{x}-y)\\right|dS(y)\\text{ \\quad(mean value theorem)}\\\\ & \\lesssim\_{n} & r^{-\\alpha}\\sup\_{B\_{2r}}|f|\\cdot|x-\\bar{x}|^{\\alpha}\\quad\\text{(since \\ensuremath{x,\\bar{x}\\in B\_{r}})}, \\end{array} $

$ \\displaystyle \\begin{array}{rcl} & & \\left(f(x)-f(\\bar{x})\\right)\\int\_{\\partial B\_{2}}D\_{i}\\Phi(\\bar{x}-y)\\nu\_{j}dS(y)\\\\ & \\lesssim\_{n} & \[f\]\_{\\alpha;x}|x-y|^{\\alpha}, \\end{array} $

two local terms: write $ {\\delta=|x-\\bar{x}|}$ and $ {\\xi=\\frac{x+\\bar{x}}{2}}$,  

$ \\displaystyle \\begin{array}{rcl} & & \\int\_{B(\\xi,\\delta)}D\_{ij}\\Phi(x-y)(f(x)-f(y)) dy\\\\ & \\leq & \\int\_{B(\\xi,\\delta)}|D\_{ij}\\Phi(x-y)||f(x)-f(y)| dy\\\\ & \\lesssim\_{n} & \[f\]\_{\\alpha;x}|x-y|^{\\alpha}. \\end{array} $

$ \\displaystyle \\int\_{B(\\xi,\\delta)}D\_{ij}\\Phi(\\bar{x}-y)(f(y)-f(\\bar{x})) dy\\lesssim\_{n}\[f\]\_{\\alpha;x}|x-y|^{\\alpha}. $

and two non-local terms:  

$ \\displaystyle \\begin{array}{rcl} & & \\left(f(x)-f(\\bar{x})\\right)\\int\_{B\_{2r}\\backslash B(\\xi,\\delta)}D\_{ij}\\Phi(x-y){ dy}\\\\ & \\leq & \[f\]\_{\\alpha;x}|x-y|^{\\alpha}\\left(|\\int\_{\\partial B\_{2r}}D\_{i}\\Phi(x-y){ dS}|+|\\int\_{\\partial B(\\xi,\\delta)}D\_{i}\\Phi(x-y){ dS}|\\right)\\\\ & \\lesssim\_{n} & \[f\]\_{\\alpha;x}|x-y|^{\\alpha} \\end{array} $

$ \\displaystyle \\begin{array}{rcl} & & \\int\_{B\_{2r}\\backslash B(\\xi,\\delta)}\\left(D\_{i}\\Phi(\\bar{x}-y)-D\_{i}\\Phi(x-y)\\right){{\\left(f(x)-f(\\bar{x})\\right)} dy}\\\\ & \\leq & \\int\_{B\_{2r}\\backslash B(\\xi,\\delta)}|DD\_{ij}\\Phi(x-y)||f(x)-f(\\bar{x})|{ dS}\\\\ & \\lesssim\_{n} & \[f\]\_{\\alpha;\\bar{x}}|x-y|^{\\alpha}, \\end{array} $

where in the last estimate we have used  

$ \\displaystyle |DD\_{ij}\\Phi(x-y)|\\lesssim|x-y|^{-n-1}. $

Summing up together, we see that  

$ \\displaystyle D\_{ij}w(\\bar{x})-D\_{ij}w(x)\\lesssim\_{n}\\left(r^{-\\alpha}\\sup\_{B\_{2r}}|f|+\[f\]\_{\\alpha;x}+\[f\]\_{\\alpha;\\bar{x}}\\right)|x-y|^{\\alpha}. $

It then follows the desired estimate ([12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq9)).  

> **Remark 1** *More details in this remark can be found in the book by Jürgen Jost.*  
> 
> *-   The above argument can be slightly simplified by noticing that the kernel of the integral operator
>     
>     $ \\displaystyle f\\mapsto D\_{ij}w\_{f}=\\int\_{B\_{2r}}K(x-y)f(y)dy $
>     
>     has certain cancellation property.
> -   The assumption $ {0<\\alpha<1}$ is essential; there are examples where the estimate fail for $ {\\alpha=1}$.*

By making some change of variable, the estimate ([12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq9)) also extends easily to the case of second order elliptic equations  

$ \\displaystyle Lu=a\_{ij}(x\_{0})D\_{ij}u=f(x) $

with constant coefficients and no lower order term. Here we require  

$ \\displaystyle a^{ij}\\xi\_{i}\\xi\_{j}\\geq\\lambda|\\xi|^{2}\\quad\\forall x\\in\\Omega,\\xi\\in\\mathbb{R}^{n}, $

for some $ {\\lambda>0}$, i.e. $ {L}$ is *strictly elliptic*. Of course now the constant in the estimate depends on the extrema $ {\\lambda,\\Lambda}$ of the eigenvalues of $ {\[a\_{ij}\]}$,[](https://www.blogger.com/null)  

[$ \\displaystyle \\|u\\|\_{C^{2,\\alpha}(\\Omega')}\\lesssim\_{n,\\Omega',\\lambda,\\Lambda}\\|u\\|\_{C^{0}(\\Omega)}+\\|f\\|\_{C^{\\alpha}(\\Omega)}. \\ \\ \\ \\ \\ (15)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  
Now, we prove the interior Hölder estimate of the second derivative of the equation[](https://www.blogger.com/null)  

[$ \\displaystyle Lu(x)=a^{ij}(x)D\_{ij}^{2}u(x)+b\_{i}(x)D\_{i}u(x)+c(x)u(x)=f(x) \\ \\ \\ \\ \\ (16)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)And to get sharper result than ([10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq8-1)), we will make the appropriate assumption on the coefficients while doing estimate. The strategy is to "freeze" the coefficient  

$ \\displaystyle a\_{ij}(x\_{0})D\_{ij}u=(a\_{ij}(x\_{0})-a\_{ij}(x))D\_{ij}u-b^{i}(x)D\_{i}u(x)-c(x)u(x)+f(x) $

where $ {x\_{0}\\in\\Omega}$ fixed, and use the control on LHS obtained earlier to get control on the RHS. The lower order terms on the RHS will be handled through the use of some interpolation inequalities.  
It is convenient to introduce here several useful interior quantities. We will make use of  

$ \\displaystyle d\_{x}=\\text{dist}(x,\\partial\\Omega),\\quad d\_{x,y}=\\min(d\_{x},d\_{y}) $

as natural choices for "weights"; the "interior semi-norm" is then defined by  

$ \\displaystyle \[u\]\_{k;\\Omega}^{\*}:=\\sup\_{\\underset{|\\boldsymbol{\\beta}|=k}{x\\in\\Omega}}d\_{x}^{k}|D^{\\boldsymbol{\\beta}}u(x)|, $

$ \\displaystyle \[u\]\_{k,\\alpha;\\Omega}^{\*}:=\\sup\_{\\underset{|\\boldsymbol{\\beta}|=k}{x,y\\in\\Omega}}d\_{x,y}^{k+\\alpha}\\frac{|D^{\\boldsymbol{\\beta}}u(x)-D^{\\boldsymbol{\\beta}}u(y)|}{|x-y|^{\\alpha}}, $

and the "interior norms"  

$ \\displaystyle |u|\_{k;\\Omega}^{\*}:=\\sum\_{j\\leq k}\\sup\_{\\underset{|\\boldsymbol{\\beta}|=j}{x\\in\\Omega}}d\_{x}^{k}|D^{\\boldsymbol{\\beta}}u(x)|, $

$ \\displaystyle |u|\_{k,\\alpha;\\Omega}^{\*}:=|u|\_{k;\\Omega}^{\*}+\[u\]\_{k,\\alpha;\\Omega}^{\*}; $

we also use some weighted interior quantities such as  

$ \\displaystyle |f|\_{0,\\alpha;\\Omega}^{(k)}:=\\sup\_{x\\in\\Omega}d\_{x}^{k}|f(x)|+\\sup\_{x,y\\in\\Omega}d\_{x,y}^{k+\\alpha}\\frac{|f(x)-f(y)|}{|x-y|^{\\alpha}}. $

Given the above formulation, ([15](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq13)) is equivalent to[](https://www.blogger.com/null)  

[$ \\displaystyle |u|\_{k,\\alpha;\\Omega}^{\*}\\lesssim\_{n,\\lambda,\\Lambda}\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega}^{(2)}. \\ \\ \\ \\ \\ (17)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  
Now let's assume $ {\\Omega}$ is compact and $ {u}$ is a $ {C^{2,\\alpha}}$-solution of the equation ([16](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq14)). The compactness assumption will be subsequently removed. Write  

$ \\displaystyle F(x):=(a\_{ij}(x\_{0})-a\_{ij}(x))D\_{ij}u-b\_{i}(x)D\_{i}u(x)-c(x)u(x)+f(x). $

Denote $ {d=\\mu d\_{x\_{0}}}$. We shall obtain the interior estimate in the ball $ {B\_{d/2}=B(x\_{0},d/2)}$. Then by ([17](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq15)), and for any $ {y\_{0}\\in B\_{d/2}}$, we have  

$ \\displaystyle \\left(\\frac{d}{2}\\right)^{2+\\alpha}\\frac{|D^{2}u(x\_{0})-D^{2}u(y\_{0})|}{|x\_{0}-y\_{0}|^{\\alpha}}\\leq C\_{n,\\lambda,\\Lambda}\\left(\\|u\\|\_{C^{0}(B\_{d})}+|F|\_{0,\\alpha;B\_{d}}^{(2)}\\right). $

This is the local part. If $ {|x\_{0}-y\_{0}|\\geq d/2}$, then of course  

$ \\displaystyle \\left(\\frac{d}{2}\\right)^{2+\\alpha}\\frac{|D^{2}u(x\_{0})-D^{2}u(y\_{0})|}{|x\_{0}-y\_{0}|^{\\alpha}}\\leq\\frac{4}{\\mu^{\\alpha}}\[u\]\_{2;\\Omega}^{\*}. $

Combining, we see that  

$ \\displaystyle d\_{x\_{0}}^{2+\\alpha}\\frac{|D^{2}u(x\_{0})-D^{2}u(y\_{0})|}{|x\_{0}-y\_{0}|^{\\alpha}}\\leq\\frac{C\_{n,\\lambda,\\Lambda}}{\\mu^{2+\\alpha}}\\left(\\|u\\|\_{C^{0}(B\_{d})}+|F|\_{0,\\alpha;B\_{d}}^{(2)}\\right)+\\frac{4}{\\mu^{\\alpha}}\[u\]\_{2;\\Omega}^{\*}. $

We wish $ {|F|\_{0,\\alpha;B\_{d}}^{(2)}}$ and $ {\[u\]\_{2;\\Omega}^{\*}}$ to be estimated in terms of $ {\\|u\\|\_{C^{0}(\\Omega)}}$ and $ {\[u\]\_{2,\\alpha;\\Omega}^{\*}}$, where the latter should has a small coefficient so that can be absorbed by the LHS.  
At this point we put forward the interior interpolation inequalities in its general form that we shall be using. Suppose $ {u\\in C^{2,\\alpha}(\\Omega).}$ Then for any $ {\\epsilon >0}$, there is a constant $ {C\_{\\epsilon}}$ such that for any $ {\\beta+j<2 align="center" alpha="" div="" have="" we=""> [$ \\displaystyle \[u\]\_{j,\\beta;\\Omega}^{\*} \\leq \\epsilon\[u\]\_{2,\\alpha;\\Omega}^{\*}+C\_{\\epsilon}|u|\_{0;\\Omega},\\ \\ \\ \\ \\ (17) $](https://www.blogger.com/null) [](https://www.blogger.com/null)which also implies (with different constants)  

[$ \\displaystyle |u|\_{j,\\beta;\\Omega}^{\*}\\leq\\epsilon\[u\]\_{2,\\alpha;\\Omega}^{\*}+C\_{\\epsilon}|u|\_{0;\\Omega}. \\ \\ \\ \\ \\ (18)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  
We continue our estimate, and it amounts to estimate each term in $ {F}$ separately. To estimate  

$ \\displaystyle |(a\_{ij}(x\_{0})-a\_{ij}(x))D\_{ij}u|\_{0,\\alpha;B\_{d}}^{(2)} $

from the product rule ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq17)) we see that it is necessary to assume  

$ \\displaystyle |a\_{ij}|\_{0,\\alpha;\\Omega}^{(0)}\\leq A $

for some constant $ {A}$ (of course $ {A}$ is comparable to $ {\\Lambda}$); then  

$ \\displaystyle \\begin{array}{rcl} |(a\_{ij}(x\_{0})-a\_{ij}(x))D\_{ij}u|\_{0,\\alpha;B\_{d}}^{(2)} & \\leq & C\_{n,\\Lambda}\\mu^{2+\\alpha}\\left(\[u\]\_{2;\\Omega}^{\*}+\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}\\right)\\\\ & \\leq & C\_{n,\\Lambda}\\mu^{2+\\alpha}(C\_{\\mu}\\|u\\|\_{C^{0}(\\Omega)}+2\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}) \\end{array} $

where the last follows from the interpolation inequality. Similarly, for the first order term,  

$ \\displaystyle |b\_{i}(x)D\_{i}u(x)|\_{0,\\alpha;B\_{d}}^{(2)} $

it is necessary to assume  

$ \\displaystyle |b\_{i}(x)|\_{0,\\alpha;\\Omega}^{(1)}\\leq A. $

Then  

$ \\displaystyle \\begin{array}{rcl} |b^{i}(x)D\_{i}u(x)|\_{0,\\alpha;B\_{d}}^{(2)} & \\leq & C\\mu^{2}|b\_{i}|\_{0,\\alpha;\\Omega}^{(1)}|Du|\_{0,\\alpha;\\Omega}^{(1)}\\\\ & \\leq & C\_{\\Lambda}\\mu^{2}|u|\_{1,\\alpha;\\Omega}^{\*}\\\\ & \\leq & C\_{\\Lambda}\\mu^{2}(C\_{\\mu}\\|u\\|\_{C^{0}(\\Omega)}+2\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}). \\end{array} $

And for the zero order term  

$ \\displaystyle |c(x)u(x)|\_{0,\\alpha;B\_{d}}^{(2)} $

it is necessary to assume  

$ \\displaystyle |c(x)|\_{0,\\alpha;\\Omega}^{(2)}\\leq A. $

Then  

$ \\displaystyle |c(x)u(x)|\_{0,\\alpha;B\_{d}}^{(2)}\\leq C\_{\\Lambda}\\mu^{2}(C\_{\\mu}\\|u\\|\_{C^{0}(\\Omega)}+2\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}). $

Finally, assume $ {f\\in C^{\\alpha}(\\Omega)}$, then the source term satisfies  

$ \\displaystyle |f|\_{0,\\alpha;B\_{d}}^{(2)}\\leq C|f|\_{0,\\alpha;\\Omega}^{(2)}. $

Putting all these together, and by symmetry, we get  

$ \\displaystyle d\_{x\_{0},y\_{0}}^{2+\\alpha}\\frac{|D^{2}u(x\_{0})-D^{2}u(y\_{0})|}{|x\_{0}-y\_{0}|^{\\alpha}}\\leq C\_{n,\\lambda,\\Lambda}\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}+C\_{\\mu}\\left(\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega}^{(2)}\\right). $

The RHS is independent of $ {x\_{0},y\_{0}\\in\\Omega}$, we conclude that  

$ \\displaystyle \[u\]\_{2,\\alpha;\\Omega}^{\*}\\leq C\_{n,\\lambda,\\Lambda}\\mu^{\\alpha}\[u\]\_{2,\\alpha;\\Omega}^{\*}+C\_{\\mu}\\left(\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega}^{(2)}\\right). $

Now take $ {\\mu\\ll1}$ small enough so that $ {C\_{n,\\lambda,\\Lambda}\\mu^{\\alpha}<1/2}$, we obtain the desired estimate  

$ \\displaystyle \[u\]\_{2,\\alpha;\\Omega}^{\*}\\leq C\_{n,\\lambda,\\Lambda}\\left(\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega}^{(2)}\\right) $

for compact $ {\\Omega}$.  
To remove the compactness requirement, we note that $ {\\Omega\\subset\\mathbb{R}^{n}}$ is $ {\\sigma}$-compact. Accordingly the assumptions are modified to be  

$ \\displaystyle u\\in C\_{\\text{loc }}^{2,\\alpha}(\\Omega),\\quad f\\in C\_{\\text{loc}}^{\\alpha}(\\Omega). $

Due to the interior nature of the quantities $ {|\\cdot|\_{k,\\alpha;\\Omega}^{(\\sigma)}}$ the assumptions on the coefficients remain unaffected  

$ \\displaystyle |a\_{ij}|\_{0,\\alpha;\\Omega}^{(0)},|b\_{i}(x)|\_{0,\\alpha;\\Omega}^{(1)},|c(x)|\_{0,\\alpha;\\Omega}^{(2)}\\leq A. $

And of course  

$ \\displaystyle a^{ij}\\xi\_{i}\\xi\_{j}\\geq\\lambda|\\xi|^{2}\\quad\\forall x\\in\\Omega,\\xi\\in\\mathbb{R}^{n}. $

It then follows the estimate  

$ \\displaystyle \\begin{array}{rcl} \[u\]\_{2,\\alpha;K\_{i}}^{\*} & \\leq & C\_{n,\\lambda,\\Lambda}\\left(\\|u\\|\_{C^{0}(K\_{i})}+|f|\_{0,\\alpha;K\_{i}}^{(2)}\\right)\\\\ & \\leq & C\_{n,\\lambda,\\Lambda}\\left(\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega}^{(2)}\\right) \\end{array} $

for any sequence of compact sets such that $ {\\bigcup\_{i=1}^{+\\infty}K\_{i}=\\Omega}$. We thus close the argument by letting $ {i\\rightarrow+\\infty}$.  
The value of the above proof should not be confined to the statement itself, rather it is the wide applicability of the ideas presented, and in what way the constants appearing in the inequality should depend on various quantities. For instance, at this moment it ought to be *obvious* that if $ {u\\in C\_{\\text{loc}}^{2,\\alpha}(\\Omega)}$ is a solution to the equation $ {Lu=f}$ on a bounded domain $ {\\Omega}$, where the coefficients of $ {L}$ and the source term lie in $ {C^{\\alpha}(\\Omega)}$, then for any $ {\\Omega'\\subset\\subset\\Omega}$ with $ {\\text{dist}(\\Omega',\\partial\\Omega)=d>0}$, we have  

$ \\displaystyle \\begin{array}{rcl} & & d\\|Du\\|\_{C^{0}(\\Omega')}+d^{2}\\|D^{2}u\\|\_{C^{0}(\\Omega')}+d^{2+\\alpha}\[D^{2}u\]\_{\\alpha;\\Omega'}\\\\ & \\lesssim\_{n,\\lambda,\\Lambda,\\text{diam}(\\Omega)} & \\|u\\|\_{C^{0}(\\Omega)}+\\|f\\|\_{C^{\\alpha}(\\Omega)}, \\end{array} $

where the dependence on $ {\\text{diam}(\\Omega)}$ comes from the switch from quantities of the type $ {|\\cdot|\_{k,\\alpha;\\Omega}^{\*}}$ to the type $ {\\|\\cdot\\|\_{C^{k,\\alpha}(\\Omega')}}$.  

**4\. Boundary a priori estimate**

In order to obtain a global $ {C^{2,\\alpha}}$-estimate of the solution, we have seen that it is necessary to assume certain regularity of the boundary $ {\\partial\\Omega}$. In the scenario that the boundary value of the solution is known, that is, a function $ {\\varphi:\\partial\\Omega\\rightarrow\\mathbb{R}}$ (for instance prescribed by the Dirichlet problem), whether or not this function comes from some function defined on the closure $ {\\tilde{\\varphi}:\\overline{\\Omega}\\rightarrow\\mathbb{R}}$, which has at least the same regularity, is a basic question for the possibility for the solution to satisfy $ {u\\downharpoonright\_{\\partial\\Omega}=\\varphi}$ . This amounts to ask if it is possible to *continuously extend* any function $ {u\\in C^{2,\\alpha}(\\Omega)}$ to $ {C^{2,\\alpha}(\\Omega\_{1})}$, where $ {\\Omega\_{1}}$ is any open set containing $ {\\Omega}$.  

This will be the case if $ {\\partial\\Omega\\subset\\mathbb{R}^{n}}$ is a bounded *embedded $ {C^{2,\\alpha}}$-manifold*, which means that in the neighbourhood open ball $ {B\_{0}}$ of each point $ {x\_{0}\\in\\partial\\Omega}$, there exists a $ {C^{2,\\alpha}}$-diffeomorphism  

$ \\displaystyle \\Psi\_{0}:B\_{0}\\rightarrow\\mathbb{R}^{n} $

that straightens the boundary portion $ {B\_{0}\\cap\\partial\\Omega}$, for instance,  

$ \\displaystyle \\Psi(B\_{0}\\cap\\Omega)\\cong B(\\Psi(x\_{0}),r)\\cap\\{x'\_{n}\\geq0\\} $

where $ {x\_{n}'}$ is the last coordinate function in the codomain. Thus locally we can view the boundary as the graph of a $ {C^{2,\\alpha}}$ function. Of course, these diffeomorphisms should satisfy compatibility conditions, as in the usual definition of a manifold.  
Such a diffeomorphism encodes the "local distortion" when one straightens the corresponding boundary portion. More precisely, we have for some constant $ {K>0}$ that[](https://www.blogger.com/null)  

[$ \\displaystyle K^{-1}|x-y|\\leq|\\Psi\_{0}(x)-\\Psi\_{0}(y)|\\leq K|x-y| \\ \\ \\ \\ \\ (19)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for all $ {x,y\\in B\_{0}}$ , where $ {K}$ depends on $ {\\Psi\_{0}}$. In the case that $ {\\overline{\\Omega}}$ is compact (which is then called a *$ {C^{2,\\alpha}}$ domain* in the book by Gilbarg and Trudinger), then from the finite covering of the boundary we can assert that the such local distortions are uniformly bounded (i.e. a uniform $ {K}$ for each neighborhood). Otherwise in the unbounded case, this should always be part of our assumption, and therefore we can localize our analysis.  
An immediate consequence of ([19](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq20)) is that the various quantities such as $ {\\|\\cdot\\|\_{C^{2,\\alpha}(B)}}$ ,$ {|\\cdot|\_{2,\\alpha;B}^{\*}}$ etc. are $ {K}$-comparable to the corresponding quantities in the codomain $ {\\|\\cdot\\|\_{C^{k,\\alpha}(\\Psi(B))}}$ ,$ {|\\cdot|\_{k,\\alpha;(\\Psi(B))}^{(\\sigma)}}$, and of course their weaker analogues. This essentially reduces our task to dealing with the boundary portion of the type  

$ \\displaystyle B\\cap\\{x{}\_{n}\\geq0\\}, $

where the local extension is then particularly easy. The global extension then follows a routine procedure using partition of unity. Thus for us it will be immaterial to consider the boundary value of $ {u}$ in $ {C^{2,\\alpha}(\\partial\\Omega)}$ or just $ {u\\in C^{2,\\alpha}(\\Omega)}$.  
To obtain boundary estimate, let's assume for simplicity that $ {u}$ is a $ {C\_{\\text{loc}}^{2,\\alpha}(\\Omega\\cup T)}$ solution to the equation $ {Lu=f}$ satisfying  

$ \\displaystyle u=0\\quad\\text{on }T $

where $ {T}$ is some straightened local boundary portion. Introduce the weights  

$ \\displaystyle \\bar{d}\_{x}=\\text{dist}(x,\\partial\\Omega\\backslash T),\\quad\\bar{d}\_{x,y}=\\min(\\bar{d}\_{x},\\bar{d}\_{y}) $

and the corresponding quantities  

$ \\displaystyle |u|\_{k,\\alpha;\\Omega\\cup T}^{(\\sigma)} $

defined using $ {\\bar{d}\_{x}}$ and $ {\\bar{d}\_{x,y}}$ in place of $ {d\_{x}}$ and $ {d\_{x,y}}$ as before. We find that the analysis is identical to the interior estimate, where we only need modify the assumptions on the coefficients and the source term to be  

$ \\displaystyle |a\_{ij}|\_{0,\\alpha;\\Omega\\cup T}^{(0)},|b\_{i}|\_{0,\\alpha;\\Omega\\cup T}^{(1)},|c|\_{0,\\alpha;\\Omega\\cup T}^{(2)}\\leq\\Lambda, $

and  

$ \\displaystyle |f|\_{0,\\alpha;\\Omega\\cup T}^{(2)}<+\\infty; $

moreover, the interpolation inequalities replaced by the corresponding versions. In summary, we have the a priori estimate on the boundary portion[](https://www.blogger.com/null)  

[$ \\displaystyle |u|\_{2,\\alpha;\\Omega\\cup T}^{\*}\\lesssim\_{n,\\lambda,\\Lambda}\\|u\\|\_{C^{0}(\\Omega)}+|f|\_{0,\\alpha;\\Omega\\cup T}^{(2)}. \\ \\ \\ \\ \\ (20)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  
We can patch these estimates together. Now the assumptions on the coefficients and the source term are global:  

$ \\displaystyle |a\_{ij}|\_{0,\\alpha;\\Omega},|b\_{i}|\_{0,\\alpha;\\Omega},|c|\_{0,\\alpha;\\Omega}\\leq\\Lambda, $

and  

$ \\displaystyle |f|\_{0,\\alpha;\\Omega}<+\\infty. $

Again assume $ {u=0}$ on $ {\\partial\\Omega}$ for simplicity, which will be removed subsequently. We shall divide our analysis into local part and non-local part and merely sketch the main ideas. Take any point $ {x\_{0}}$ on the boundary, and a ball $ {B\_{0}}$ around $ {x\_{0}}$ small enough such that the estimate ([20](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq21)) makes sense. Take any two point in $ {\\Omega}$, then one can separate the discussion of the difference quotient  

$ \\displaystyle \\frac{|D^{2}u(x)-D^{2}u(y)|}{|x-y|^{\\alpha}} $

into the estimate in that ball, which is given by [20](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq21); the estimate in the interior, which is handled in the last section; finally the estimate in the case two points lie in different regions, but which satisfies a bound $ {|x-y|>\\delta}$. Combining these together, we get[](https://www.blogger.com/null)  

[$ \\displaystyle \\|u\\|\_{C^{2,\\alpha}(\\Omega)}\\lesssim\_{n,\\lambda,\\Lambda,\\Omega}\\|u\\|\_{C^{0}(\\Omega)}+\\|f\\|\_{C^{0,\\alpha}(\\Omega)}. \\ \\ \\ \\ \\ (21)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)In the general situation, assume the boundary value $ {\\varphi\\in C^{2,\\alpha}(\\partial\\Omega)}$. By the preceding discussion we can abuse the notation $ {\\varphi}$ to represnet any function in $ {C^{2,\\alpha}(\\Omega)}$ whose restriction gives that boudary value. Then let  

$ \\displaystyle v=u-\\varphi, $

so that $ {v=0}$ on $ {\\partial\\Omega}$, and  

$ \\displaystyle Lv=f-L\\varphi=:f'\\in C^{\\alpha}(\\Omega). $

We thus have by ([21](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq22))  

$ \\displaystyle \\|v\\|\_{C^{2,\\alpha}(\\Omega)}\\lesssim\_{n,\\lambda,\\Lambda,\\Omega}\\|v\\|\_{C^{0}(\\Omega)}+\\|f\\|\_{C^{0,\\alpha}(\\Omega)}, $

and hence  

[$ \\displaystyle \\begin{array}{rcl} \\|u\\|\_{C^{2,\\alpha}(\\Omega)} & \\leq & \\|v\\|\_{C^{2,\\alpha}(\\Omega)}+\\|\\varphi\\|\_{C^{2,\\alpha}(\\Omega)} \\\\ & \\lesssim\_{n,\\lambda,\\Lambda,\\Omega} & \\|u\\|\_{C^{0}(\\Omega)}+\\|f\\|\_{C^{0,\\alpha}(\\Omega)}+\\|\\varphi\\|\_{C^{2,\\alpha}(\\Omega)},\\ \\ \\ \\ \\ (22) \\end{array} $](https://www.blogger.com/null)

[](https://www.blogger.com/null)which is our desired global a priori estimate.  

**5\. Existence technique: the method of continuity and Perron's subsolutions**

We have assumed that the solution to the equation $ {Lu=f}$ exists in $ {C^{2,\\alpha}(\\Omega)}$ in order to derive the above estimates. So after all, why aren't those a priori bounds in some sense a waste of time?  

The answer lies in an approximation argument that is valid in general Banach spaces. The explanation will be based on the following two fundamental results in linear functional analysis.  

> **Theorem 4** *(Banach open mapping theorem) Suppose $ {X}$ and $ {Y}$ are Banach spaces. Let $ {L:X\\rightarrow Y}$ be a continuous linear operator. To know if for every $ {f\\in Y}$ there exists $ {u\\in X}$ to $ {Lu=f}$, it is *equivalent* to establish for all $ {f\\in Y}$, there exists a solution $ {u\\in X}$ to $ {Lu=f}$ such that*  
> 
> *$ \\displaystyle \\|u\\|\_{X}\\leq C\\|f\\|\_{Y}, $*
> 
> *for some constant $ {C}$ independent of $ {f}$.*

> **Theorem 5** *(Banach closed graph theorem) Suppose $ {X}$ and $ {Y}$ are Banach spaces and we have a continuous inclusion*  
> 
> *$ \\displaystyle Y\\hookrightarrow Z, $*
> 
> *where $ {Z}$ is some topological vector space. And let $ {L^{-1}}$ be a continuous linear operator ($ {L^{-1}}$ being merely a choice of notation, as is the case for $ {\\Delta^{-1}}$)*  
> 
> *$ \\displaystyle L^{-1}:X\\rightarrow Z. $*
> 
> *Here one thinks of $ {Z}$ as some lower regularity space and $ {Y}$ some higher regularity space. To know if actually $ {L^{-1}x\\in Y}$ for every $ {x\\in X}$, it is *equivalent* to establish*  
> 
> *$ \\displaystyle \\|L^{-1}x\\|\_{Y}\\leq C\\|x\\|\_{X}, $*
> 
> *for some constant $ {C}$ that is independent of $ {x}$.*

Note that in the above theorems it suffices to establish the inequalities for a dense family of $ {f\\in Y}$ and $ {x\\in X}$ respectively.  

Let us now elaborate in more details. In our case, what we would like to first establish is the existence of the local $ {C^{2,\\alpha}}$-solution given continuous boundary data, in the simple domain of a ball $ {B}$. To proceed further in the existence theory, it turns out that we need a further assumption on the coefficient of $ {L}$.  

> **Theorem 6** *(Weak Maximum Principle) Let $ {L}$ be elliptic in the bounded domain $ {\\Omega}$, and that $ {Lu\\geq0}$ in $ {\\Omega}$, with $ {u\\in C^{0}(\\Omega)}$. If $ {c\\leq0}$, then*  
> 
> *$ \\displaystyle \\sup\_{\\Omega}u\\leq\\sup\_{\\partial\\Omega}u^{+}, $*
> 
> *where $ {u^{+}(x):=\\max(0,u(x))}$. If furthermore $ {Lu=0}$, then*  
> 
> *$ \\displaystyle \\sup\_{\\Omega}|u|=\\sup\_{\\partial\\Omega}|u|. $*

Let us suppose also that the existence has been established for smooth class of boundary data, which is presumably easy. Then if we take an approximating sequence $ {\\varphi\_{k}}$ in that smooth class to our given continuous boundary data $ {\\varphi}$ in the $ {C^{0}}$ topology, i.e.  

$ \\displaystyle \\lim\_{k\\rightarrow+\\infty}\\|\\varphi\_{k}-\\varphi\\|\_{C^{0}(B)}=0, $

(where $ {\\varphi\_{k}}$,$ {\\varphi}$ have been continuously extended to a slightly larger open set) and denote the solutions corresponding to $ {\\varphi\_{k}}$ to be $ {u\_{k}}$, we see that  

$ \\displaystyle L(u\_{k}-u\_{l})=0. $

Then from the weak maximal principle above, the difference is controlled by the boundary value, and hence we have  

$ \\displaystyle \\lim\_{k,l\\rightarrow+\\infty}\\|u\_{k}-u\_{l}\\|\_{C^{0}(B)}=0. $

This shows that $ {\\{u\_{k}\\}}$ is a Cauchy sequence in $ {C^{0}(B)}$ and thus converges to some continuous limit $ {u\\in C^{0}(B)}$. However, from the interior a priori estimate, the second order derivatives of the family $ {\\{u\_{k}\\}}$ are equicontinuous on compact subsets of $ {B}$. And thus by Arzelá-Ascoli theorem the limit of $ {u\_{k}}$ is a solution to $ {Lu=f}$ that lies in $ {C^{0}(B)}$, and in fact satisfy such an $ {C^{2,\\alpha}}$ estimate in the interior. Of course, if $ {\\varphi}$ is $ {C^{2,\\alpha}}$ in some portion of the boundary $ {T}$, then by taking the approximation sequence to satisfy also  

$ \\displaystyle |\\varphi\_{k}|\_{2,\\alpha;G}\\leq C|\\varphi|\_{2.\\alpha;G} $

for open balls $ {G}$ contained the local extension domains near the boundary, and making use of the a priori boundary estimate in the last section, we see that a similar boundary estimate also holds in the limit.  
In the above argument the Banach open mapping theorem and the Banach closed graph theorem are not directly utilised. Instead, the role they played is *metamathematical*, in the sense that the a priori method is at least as powerful as any other method in proving solvability or regularity result of the types stated in the open mapping and closed graph theorems.  

It now remains the easy task of establishing the existence result with smooth boundary data. This will be done through *the method of continuity*. The idea is to consider a homotopy, that is a family of linear operators  

$ \\displaystyle L\_{t}u=tLu+(1-t)\\Delta u $

parametrised by $ {t\\in\[0,1\]}$. Each $ {L\_{t}}$ then satisfy uniformly elliptic condition with  

$ \\displaystyle \\lambda\_{t}=\\min(1,\\lambda),\\quad\\Lambda\_{t}=\\max(1,\\Lambda). $

We wish the solvability of the Dirichlet problem in balls with smooth boundary data for the Poisson equation $ {\\Delta u=f}$ , which we assume, will lead to the solvability in the corresponding problem for $ {Lu=f}$. This will be the case if the family of the solutions $ {\\{u\_{t}\\}\_{t\\in\[0,1\]}}$ are *uniformly continuous* with respect to perturbation of the source term and the boundary data. This means a uniform bound  

$ \\displaystyle |u\_{t}|\_{2,\\alpha,\\Omega}\\lesssim\_{\\lambda,\\Lambda,\\Omega}\\|f\\|\_{C^{\\alpha}(\\Omega)}+\\|\\varphi\\|\_{C^{2,\\alpha}(\\Omega)}, $

which follows by virture of the maximum principle and the estimate ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq23)). The desired result will then follow from the contraction mapping principle applied to each subinterval in a sufficiently fine partition of the interval $ {\[0,1\]}$.  
Now having the existence of solutions on balls, we are in the position to imitate the Perron's method of subharmonic functions to settle the solvability of the Dirichlet problem with continuous boundary data on general domains.  

There are two essential ingredients in Perron's argument: we shall first establish the existence of a "perspective solution", called *Perron solution*, whose existence is essentially irrelevant to the boundary; then we shall study the behaviors of the Perron solution near the boundary, whose geometry lies in the centre of the question.  

For the first part we need a uniqueness result that will be a consequence of the following.  

> **Theorem 7** *[](https://www.blogger.com/null)(E. Hopf's Strong Maximum Principle) Let $ {L}$ be uniformly elliptic and $ {Lu\\geq0}$ ($ {\\leq0}$) in $ {\\Omega}$ (may not be bounded). If $ {c\\leq0}$ and $ {c/\\lambda}$ is locally bounded, then $ {u}$ cannot achieve a non-negative maximum (non-positive minimum) in the interior of $ {\\Omega}$ unless $ {u}$ is constant.*

It also follows a useful *comparison principle*: if $ {u}$ is a *subsolution* to the equation $ {Lu=f}$, i.e.  

$ \\displaystyle Lu\\geq f, $

and $ {v}$ a *supersolution*, i.e.  

$ \\displaystyle Lv\\leq f, $

and note that  

$ \\displaystyle L(u-v)\\geq0 $

then by Theorem ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(E.-Hopf%27s-Strong)) $ {u\\leq v}$ on $ {\\partial B}$ implies either $ {u<v}$ or $ {u\\equiv v}$ in $ {B}$. Call a function $ {u\\in C^{0}(\\Omega)}$ to be a *subfunction (superfunction)* relative to the boundary data $ {\\varphi}$ if $ {u}$ is a subsolution (supersolution) in $ {\\Omega}$ and $ {u\\leq\\varphi}$ ($ {u\\geq\\varphi}$) on $ {\\partial\\Omega}$. By the comparison principle we see that every subfunction is less than or equal to a superfunction. Denote by $ {S\_{\\varphi}}$ the set of all subfunctions in $ {\\Omega}$ relative to $ {\\varphi}$. In case $ {\\Omega}$ is bounded, $ {L}$ is uniformly elliptic and source term is bounded, then $ {S\_{\\varphi}}$ is non-empty and bounded from above.  
Note that subsolutions are closed with respect to maximum: if $ {u\_{1},\\dots,u\_{n}}$ are subsolutions, then so is $ {\\max(u\_{1},\\dots,u\_{n})}$; also if $ {v}$ is a subsolution, then function, called *$ {L}$-lifting* of $ {v}$ on $ {B}$, defined by  

$ \\displaystyle V(x)=\\begin{cases} \\bar{v}(x) & x\\in B\\\\ v(x) & x\\in\\Omega\\backslash B \\end{cases} $

where $ {\\bar{u}}$ satisfies the Dirichlet problem $ {L\\bar{u}=f}$ and $ {\\bar{u}=u}$ on $ {\\partial B}$, is also a subsolution. Now, consider  

$ \\displaystyle u(x):=\\sup\_{v\\in S\_{\\varphi}}v(x). $

By definition there is a sequence of subsolutions $ {u\_{n}}$ in $ {S\_{\\varphi}}$ converging pointwisely to $ {u}$. We may assume the sequence is bounded by replacing $ {u\_{n}}$ by $ {\\max(u\_{n},\\inf\\varphi)}$. Now for any $ {y\\in\\Omega}$, any ball $ {B=B(y,r)\\subset\\Omega}$, consider $ {U\_{n}}$ the $ {L}$-lifting of $ {u\_{n}}$ on $ {B}$. Then by the interior estimate, for any $ {B'\\subset\\subset B}$ we have the uniform convergence of $ {U\_{n}}$ and its derivatives up to the second order. Let the limit be $ {U}$, we see that $ {U(y)=u(y)}$ and $ {U}$ satisfies $ {LU=f}$ in $ {B}$, and by maximum principle $ {u=U}$ in $ {B}$. This shows that  

$ \\displaystyle Lu=f $

in any open balls contained in $ {\\Omega}$, which is out Perron solution.  
The question of whether the Perron solution $ {u}$ has the correct boundary value is related to the property of the set $ {S\_{\\varphi}}$ (and also the super solutions dominate it), and in turn the geometric properties of the boundary, through the concept of *(local) barrier functions*, which in effect controls the behavior of the sequence $ {u\_{n}}$ defined above near the boundary. For our interests it suffices to know a sufficient condition on $ {\\partial\\Omega}$ for these barrier functions to exist, namely the *exterior sphere condition*, or the more general *exterior cone* condition. We summarise the discussion in the form of the following general existence theorem.  

> **Theorem 8** *Let $ {L}$ be uniformly elliptic in a bounded domain $ {\\Omega}$, with $ {C\_{\\text{loc}}^{\\alpha}(\\Omega)}$-coefficients and the source term, and $ {c\\leq0}$. Suppose moreover that $ {\\Omega}$ satisfy the exterior sphere condition. Then if $ {\\varphi}$ is continuous on $ {\\partial\\Omega}$, the Dirichlet problem*  
> 
> *$ \\displaystyle Lu=f\\quad\\text{in }\\Omega,\\quad u=\\varphi\\quad\\text{on }\\partial\\Omega $*
> 
> *has a unique solution $ {u\\in C^{0}(\\Omega)\\cap C\_{\\text{loc}}^{2,\\alpha}(\\Omega)}$.*
