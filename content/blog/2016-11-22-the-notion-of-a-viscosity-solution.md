---
id: 2016-11-22-the-notion-of-a-viscosity-solution
title: "The notion of a viscosity solution"
date: 2016-11-22
tags: ["PDE"]
source: https://sylqiu.blogspot.com/2016/11/the-notion-of-viscosity-solution.html
publish: true
---
Recently I have been interested in a paper by Dabon and Osher on their algorithms of computing solutions to the Hamilton-Jacobi equations. The solution to such an equation, given in the Hopf-Lax formula, is a viscosity solution.  The notion also appears to be interesting on its own. Here I only aimed to grasp the basic idea of viscosity solutions, and consequently the materials here are mostly motivational and elementary. 

This note is based on the first part of Bressan's notes "Viscosity solutions and Hamilton-Jacobi equations and optimal control problems", which quite suits my aim. I also like very much the part on Laplace equation in Luis Silvestre's notes "viscosity solutions and elliptic equations" for motivational purpose. 

**1.1. A motivating example**

Consider the equation  

$ \\displaystyle |\\nabla u|^{2}-1=0 $

with the boundary data  

$ \\displaystyle u=0\\quad x\\in\\partial\\Omega $

A solution can be provided by the distance function  

$ \\displaystyle u(x)=\\text{dist}(x,\\partial\\Omega) $

which is general not differentiable at every point. For simplicity, let us assume we are in $ {1}$-D, $ {\\Omega=(-1,1)}$. The equation is simplified to[](https://www.blogger.com/null)  

[$ \\displaystyle |u\_{x}|-1=0 \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)with $ {u(-1)=u(1)=0}$. A solution is given by $ {1-|x|}$, which is not differentiable at zero. At first, one can ask for a "weak'' solution, by relaxing $ {u}$ to be only Lipschitz continuous and that ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) holds almost everywhere. However, we then lose the uniqueness of the solution: there are infinitely many weak solutions to the Equation ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)).  
On the other hand, one can obtain a solution (also in the "weak'' sense) via the method of *vanishing viscosity*. The viscosity approximation to Equation ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1))  

$ \\displaystyle |u\_{x}^{\\epsilon}|-1=\\epsilon u\_{xx}^{\\epsilon} $

which as a parabolic PDE has smooth solutions. The term $ {\\epsilon u\_{xx}^{\\epsilon}}$ is considered as a *regulizer* of the equation. Assuming the family of solutions $ {\\{u^{\\epsilon}\\}\_{\\epsilon>0}}$ is bounded and equicontinuous on compact seubsets of $ {\\Omega}$, we can conclude via *Arzela-Ascoli theorem* that  

$ \\displaystyle u^{\\epsilon\_{j}}\\rightarrow u $

locally uniformly in $ {\\Omega}$, for some subsequence $ {\\epsilon\_{j}\\rightarrow0^{+}}$ and limit function $ {u\\in\\mathcal{C}(\\overline{\\Omega})}$. One can find in this case $ {u(x)=1-|x|}$. The method of vanishing viscosity is sometimes sensible with intuition supplied from physics. However, as the technique is not always available, one search for some characterising properties of the solutions. We will make this idea more precise in what follows.  

**1.2. A review of the Laplace equation $ {\\Delta u=0}$**

The Laplacian $ {\\Delta}$, expressed in the Euclidean coordinate  

$ \\displaystyle \\Delta=\\sum\_{i}\\frac{\\partial^{2}}{\\partial x\_{i}^{2}} $

can be interpreted as follows. Suppose $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ is $ {\\mathcal{C}^{2}}$ in a neighborhood of $ {0}$. We obtain its Taylor expansion around $ {0}$:  

$ \\displaystyle f(x)-f(0)=\\sum\_{i}f\_{x\_{i}}(0)x\_{i}+\\frac{1}{2}\\sum\_{i,k}f\_{ik}(0)x\_{i}x\_{k}+o(|x|^{2}) $

Integrating over the ball $ {B\_{r}}$,  

$ \\displaystyle \\begin{array}{rcl} \\int\_{B\_{r}}(f(x)-f(0)dx & = & \\frac{1}{2}\\sum\_{i}f\_{ii}(0)\\int\_{B\_{r}}x\_{i}^{2}dx+o(r^{2+n})\\\\ & = & \\frac{1}{2}\\Delta f(0)\\int\_{B\_{r}}x\_{i}^{2}dx+o(r^{2+n}) \\end{array} $

The integrals $ {\\int\_{B\_{r}}x\_{i}^{2}dx}$ are equal for all $ {i}$, so we set it to be $ {c\_{n}r^{n+2}}$. Now, absorbing the constant $ {{\\displaystyle \\frac{1}{2}}}$ into $ {c\_{n}}$, the above equality turns into  

$ \\displaystyle \\int\_{B\_{r}}(f(x)-f(0)dx=c\_{n}r^{n+2}\\Delta f(0)+o(r^{2+n}) $

Finally, rearranging and taking $ {r\\rightarrow0^{+}}$, we get  

$ \\displaystyle \\Delta f(0)=\\lim\_{r\\rightarrow0^{+}}\\frac{1}{c\_{n}r^{n+2}}\\int\_{B\_{r}}(f(x)-f(0)dx. $

This says the laplacian $ {\\Delta f(0)}$ measures the second order rate of change of the averages with respect to the radius (the first order vanishes, due to symmetry of the domain). One can expect the solutions to the Laplace equation  

$ \\displaystyle \\Delta u=0 $

namely the *harmonic functions*, enjoy a kind of *mean value property*. Indeed, we have the following characterisation of harmonic functions:[](https://www.blogger.com/null)  

[$ \\displaystyle u(x)=\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint{S\_{r}(x)}u(y)dS(y)=\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint\_{B\_{r}(x)}u(y)dy \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where we assume $ {u\\in\\mathcal{C}^{2}(\\Omega)}$, and $ {\\textstyle \\def\\avint{\\mathop{\\rlap{\\raise.15em{\\scriptstyle -}}\\kern-.2em\\int}\\nolimits} \\avint\_{A}}$ means averaged integral $ {{\\displaystyle \\frac{1}{|A|}\\int\_{A}}}$. Changing the equality in ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) to  

$ \\displaystyle u(x)\\leq\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint\_{S\_{r}(x)}u(y)dS(y) $

we obtain a characterisation of *subharmonic functions*.  

> **Proposition 1** *(Characterisation of subharmonic functions) Let $ {u\\in\\mathcal{C}^{2}(\\Omega)}$, $ {x\\in\\Omega}$. Then $ {\\Delta u\\geq0}$ if and only if*  
> 
> *$ \\displaystyle u(x)\\leq \\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint{S\_{r}(x)}u(y)dS(y) $*
> 
> *for all $ {r}$ such that $ {S\_{r}(x)\\subset\\Omega}$. The same holds true if we replace $ {S\_{r}(x)}$ by $ {B\_{r}(x)}$.*

*Proof:* If $ {u\\in\\mathcal{C}^{2}(\\Omega)}$ with $ {\\Delta u\\geq0}$ in $ {\\Omega}$, and $ {B\_{r}(x)\\subset\\Omega}$, then the Stoke's theorem implies that  

$ \\displaystyle \\begin{array}{rcl} \\int\_{B\_{r}(x)}\\Delta udx & = & \\int\_{S\_{r}(x)}\\frac{\\partial u}{\\partial\\nu}dS\\\\ & = & r^{n-1}\\int\_{S\_{1}(0)}\\frac{\\partial u}{\\partial r}(x+ry)dS(y)\\\\ & = & r^{n-1}\\frac{\\partial}{\\partial r}\\int\_{S\_{1}(0)}u(x+ry)dS(y)\\geq0 \\end{array} $

Since $ {u}$ is differentiable, $ {\\int\_{S\_{r}(x)}u(x)\\rightarrow u(x)}$ as $ {r\\rightarrow0^{+}}$, hence we obtain  

$ \\displaystyle u(x)\\leq\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint\_{S\_{r}(x)}u(y)dS(y). $

Conversely, if $ {\\Delta u(x\_{0})\\leq0}$ for some $ {x\_{0}\\in\\Omega}$, then the above argument shows that in a small neighborhood of $ {x\_{0}}$ the average is decreasing. $ \\Box$  

In light of this characterisation, we may now *define* subharmonic functions, or in other words $ {\\Delta u\\geq0}$, in a *weak* sense, to be the functions $ {u}$ such that  

$ \\displaystyle u(x)\\leq\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint\_{S\_{r}(x)}u(y)dS(y) $

is satisfied, for for all $ {r}$ such that $ {S\_{r}(x)\\subset\\Omega}$. Equivalently we may replace $ {S\_{r}(x)}$ by $ {B\_{r}(x)}$. One can show that under this definition the subharmonic functions are in general only *upper semi-continuous*. We can also define *superharmonic functions* to be the functions $ {u}$ such that $ {-u}$ is subharmonic. It follows that they are *lower semi-continuous*. Thus we see that if a function $ {u}$ is both subharmonic and superharmonic in the weak sense, then $ {u}$ will satisfy the mean value property  

$ \\displaystyle u(x)=\\def\\avint{\\mathop{\\,\\rlap{-}\\!\\!\\int}\\nolimits} \\avint\_{S\_{r}(x)}u(y)dS(y) $

or in other words, $ {\\Delta u=0}$ in a weak sense, and $ {u}$ will be continuous (so even *weakly harmonic* functions are smooth). We shall illustrate some usefulness of this formulation.  

> **Theorem 2** *(Maximal principle) Suppose $ {\\Omega\\subset\\mathbb{R}^{n}}$ is open and bounded. If $ {u}$ is subharmonic in $ {\\Omega}$ and $ {u\\in\\mathcal{C}(\\overline{\\Omega})}$, then*  
> 
> *$ \\displaystyle \\max\_{\\partial\\Omega}u=\\max\_{\\overline{\\Omega}}u. $*

*Proof:* Suppose $ {x\_{0}\\in\\Omega}$ is such that $ {u(x\_{0})=\\max\_{\\overline{\\Omega}}u=M.}$ Then the mean value property says that  

$ \\displaystyle M=u(x\_{0})\\leq\\int\_{B\_{r}(x)}u(y)dy\\leq M. $

Hence the set $ {\\{x\\in\\Omega:u(x)=M\\}}$ is both open and relatively closed. It follows that $ {u}$ is constant in $ {\\Omega}$ and hence in $ {\\overline{\\Omega}}$ by continuity. $ \\Box$  

Some immediate consequences are:  

> **Corollary 3** *[](https://www.blogger.com/null)(Comparison principle) Suppose $ {\\Omega\\subset\\mathbb{R}^{n}}$ is open and bounded. If $ {\\Delta u\\geq\\Delta v}$ in $ {\\Omega}$, and $ {u\\leq v}$ in $ {\\partial\\Omega}$, then $ {u\\leq v}$ in $ {\\Omega}$.*

> **Corollary 4** *[](https://www.blogger.com/null)(Uniqueness) The solution to the Dirichlet problem*  
> 
> *$ \\displaystyle \\Delta u(x)=0\\quad x\\in\\Omega $*
> 
> *with*  
> 
> *$ \\displaystyle u(x)=g\\quad\\text{ }x\\in\\partial\\Omega $*
> 
> *is unique.*

**1.3. Scenario setup**

Below the fold we will explore what notion of a solution that will enjoy properties such as Corollary [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#cor\(Comparison-principle\)-Suppose) and [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#cor\(Uniqueness\)-The-solution). This will be in large parallel to the development above, although we will be more focusing on the comparison side, rather than the maximal principle. For historical reasons, such solutions are called *viscosity solutions*, originally appeared in the work of Evans, Crandall and Lions. Indeed, it would more appropriate to describe this kind of solutions to be e.g. *comparison solutions* or something else.  

For most of the time, we will try to formulate the definition of the viscosity solutions to the first order PDE[](https://www.blogger.com/null)  

[$ \\displaystyle F(x,u,\\nabla u)=0 \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {F:\\Omega\\times\\mathbb{R}\\times\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ is continuous, and $ {\\Omega\\subset\\mathbb{R}^{n}}$ ia open and bounded. Then for the *comparison principle* we will turn to a very special class, namely the *Hamilton-Jacobi PDE*  

$ \\displaystyle u+H(x,\\nabla u)=0. $

To motivate the notions, suppose $ {u\\in\\mathcal{C}^{1}(\\Omega)}$ is a classical *subsolution* at $ {x\_{0}\\in\\Omega}$, i.e.  

$ \\displaystyle F(x,u,\\nabla u)\\leq0 $

holds for all points in a neighborhood $ {U}$ of $ {x\_{0}}$. Let $ {\\varphi\\in\\mathcal{C}^{1}(\\Omega)}$ be such that $ {u(x\_{0})-\\varphi(x\_{0})=0}$ and $ {u-\\varphi}$ attains local maximum at $ {x\_{0}}$ in $ {U}$. Then calculus implies that  

$ \\displaystyle \\nabla u(x\_{0})=\\nabla\\varphi(x\_{0}) $

and hence[](https://www.blogger.com/null)  

[$ \\displaystyle F(x\_{0},u,\\nabla u)=F(x\_{0},\\varphi,\\nabla\\varphi)\\leq0 \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)in $ {U}$. Similarly, if $ {u}$ is a classical *supersolution* at $ {x\_{0}}$, and let $ {\\psi\\in\\mathcal{C}^{1}(\\Omega)}$ be such that $ {u-\\psi}$ attains local minimum at $ {x\_{0}}$ in $ {U}$, we have  

$ \\displaystyle \\nabla u(x\_{0})=\\nabla\\psi(x\_{0}) $

and[](https://www.blogger.com/null)  

[$ \\displaystyle 0\\leq F(x,\\psi,\\nabla\\psi)=F(x,u,\\nabla u) \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Combining the two, we conclude that $ {u}$ is a classical solution locally at $ {x\_{0}}$. However, since a solution in the classical sense (namely, a differentiable one) to the Drichilet problem ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) does not exist in general, one seeks to formulate a "weak'' problem. In light of inequalities ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) and ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we will try to formulate their equivalents in a non-differentiable setting.  

**1.4. One sided differentials**

> **Definition 5** *Let $ {u:\\Omega\\rightarrow\\mathbb{R}}$ be a function. The set of *super-differentials* of $ {u}$ at $ {x\\in\\Omega}$ is defined as*  
> 
> *$ \\displaystyle D^{+}u(x):=\\left\\{ p\\in\\mathbb{R}^{n}:\\limsup\_{y\\rightarrow x}\\frac{u(y)-u(x)-\\langle p,y-x\\rangle}{|y-x|}\\leq0\\right\\} $*
> 
> *and the set of *sub-differentials* of $ {u}$ at $ {x\\in\\Omega}$ is defined as*  
> 
> *$ \\displaystyle D^{-}u(x):=\\left\\{ p\\in\\mathbb{R}^{n}:\\liminf\_{y\\rightarrow x}\\frac{u(y)-u(x)-\\langle p,y-x\\rangle}{|y-x|}\\geq0\\right\\} $*

Roughly speaking, locally the function sits below the plane situated at $ {x}$ defined by $ {p\\in D^{+}u(x)}$, and sits above the plane defined by $ {p\\in D^{-}u(x)}$, whenever the sets are nonempty. They are linear approximations to the behavior of the function at certain point, although they are not neccessarily unique unless the function is differentiable. But we are able to extract a lot of information, by comparing the function to the more regular ones, with the same *linear behavior* (in fact, we can even get quadratic information).  

> **Lemma 6** *[](https://www.blogger.com/null)Let $ {u\\in\\mathcal{C}(\\Omega)}$. Then*  
> 
> *-   $ {p\\in D^{+}u(x)}$ if and only if there is a function $ {\\varphi\\in\\mathcal{C}^{1}(\\Omega)}$ such that $ {\\nabla\\varphi(x)=p}$ and $ {u-\\varphi}$ has a local maximum at $ {x}$;
> -   $ {p\\in D^{-}u(x)}$ if and only if there is a function $ {\\psi\\in\\mathcal{C}^{1}(\\Omega)}$ such that $ {\\nabla\\psi(x)=p}$ and $ {u-\\psi}$ has a local minimum at $ {x}$;*
> 
> *Moreover, the extrema can be made to be strict, and by adding a contant we can have $ {\\varphi(x)=u(x)}$.*

*Proof:* We prove the first statement, the second is completely similar.  
Assume $ {p\\in D^{+}u(x)}$. By definition, there exist $ {\\delta>0}$ and a continuous incresing function $ {\\sigma:\[0,\\infty)\\rightarrow\\mathbb{R}}$, $ {\\sigma(0)=0}$ such that  

$ \\displaystyle u(y)\\leq u(x)+\\langle p,y-x\\rangle+\\sigma(|y-x|)|y-x| $

for $ {|y-x|<\\delta}$. Define $ {\\rho(r)=\\int\_{0}^{r}\\sigma(t)dt}$. We have obviously $ {\\rho(0)=0}$, $ {\\rho'(0)=\\sigma(0)=0}$. Observe that  

$ \\displaystyle \\begin{array}{rcl} \\rho(2r) & = & \\int\_{0}^{2r}\\sigma(t)dt\\\\ & \\geq & \\int\_{0}^{r}\\sigma(t)dt+r\\sigma(r)\\geq r\\sigma(r) \\end{array} $

since $ {\\sigma}$ is increasing. Hence the function  

$ \\displaystyle \\varphi(y)=u(x)+\\langle p,y-x\\rangle+\\rho(2|x-y|) $

is $ {\\mathcal{C}^{1}}$ and  

$ \\displaystyle \\varphi(x)=u(x)\\quad\\nabla\\varphi(x)=p. $

Moreover, for $ {|y-x|<\\delta}$ we have  

$ \\displaystyle u(y)-\\varphi(x)\\leq\\sigma(|y-x|)|y-x|-\\rho(2|x-y|)\\leq0 $

Hence $ {u-\\varphi}$ attains a local maximum at $ {x}$. By posibly adding $ {|x-y|^{2}}$ to $ {\\varphi(x)}$, we get that $ {u-\\varphi}$ attains a strict local maximum at $ {x}$. $ \\Box$  

> **Remark 1** *In the following we would be considering the simple scenario when a sequence of solutions $ {u\_{m}\\rightarrow u}$ converging uniformly. We would prefer strict local extrema because they are more stable under small perturbations. Imagine in a long and flat valley where any point could be chosen as a local minimum. Then it is clear that by a small perturbation one could get a drastically different location for the new local minimum. But if $ {x}$ is a strict local maximum of $ {u-\\varphi}$, one can show that there is a sequence of points $ {x\_{m}\\rightarrow x}$ such that $ {u\_{m}-\\varphi}$ has a local maximum at $ {x\_{m}}$ for all $ {m}$ large enough.*

The formulation in Lemma [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemequiv%20def) allows us to do some quick check about our intuitions.  

> **Lemma 7** *[](https://www.blogger.com/null)Let Let $ {u\\in\\mathcal{C}(\\Omega)}$. Then*  
> 
> *-   If $ {u}$ is differentiable at $ {x}$, then
>     
>     $ \\displaystyle D^{+}u(x)=D^{-}u(x)=\\{\\nabla u(x)\\} $
>     
> -   If the sets $ {D^{+}u(x)}$ and $ {D^{-}u(x)}$ are both nonempty, then $ {u}$ is differentiable at $ {x}$;
> -   The sets $ {\\Omega^{+}=\\{x\\in\\Omega:D^{+}u(x)\\neq\\emptyset\\}}$ and $ {\\Omega^{-}=\\{x\\in\\Omega:D^{-}u(x)\\neq\\emptyset\\}}$ are dense in $ {\\Omega}$.*

*Proof:* To see (1), assume $ {u}$ is differentiable at $ {x}$. Then $ {\\nabla u(x)\\in D^{+}u(x)}$ is obvious. Suppose a $ {\\mathcal{C}^{1}}$ function $ {\\varphi}$ is such that $ {u-\\varphi}$ attains local maximum at $ {x}$. Then calculus implies that $ {\\nabla\\varphi(x)=\\nabla u(x)}$. For $ {D^{-1}u(x)}$ the argument is the same.  
For (2), if $ {p\\in D^{+}u(x)\\cap D^{-}u(x)}$, then there exist $ {\\mathcal{C}^{1}}$ functions $ {\\varphi\_{1}}$, $ {\\varphi\_{2}}$ and $ {\\delta>0}$ such that for all $ {|x-y|<\\delta}$,  

$ \\displaystyle \\varphi\_{1}(y)\\leq u(y)\\leq\\varphi\_{2}(y) $

and the equality holds when $ {y=x}$. Then  

$ \\displaystyle   p=\\liminf\_{y\\rightarrow x}\\frac{\\varphi\_{1}(y)-\\varphi\_{1}(x)}{|y-x|}\\leq\\liminf\_{y\\rightarrow x}\\frac{u(y)-u(x)}{|y-x|}\\leq\\limsup\_{y\\rightarrow x}\\frac{\\varphi\_{2}(y)-\\varphi\_{2}(x)}{|y-x|}=p $

shows that $ {u}$ is differentiable at $ {x}$. Finally, to show that $ {\\Omega^{+}}$ is dense, for all $ {B(x\_{0},\\epsilon)\\subset\\Omega}$ we need to find $ {y\\in\\Omega^{+}\\cap B(x\_{0},\\epsilon)}$. To this end we consider the function  

$ \\displaystyle \\varphi(x)=\\frac{1}{\\epsilon^{2}-|x-x\_{0}|^{2}} $

so that $ {\\varphi(x)\\rightarrow+\\infty}$ as $ {x}$ approches $ {\\partial B(x\_{0},\\epsilon)}$. Hence $ {u-\\varphi}$ must attain a maximum, say at $ {y\\in B(x\_{0},\\epsilon)}$. Then $ {\\nabla\\varphi(y)\\in D^{+}u(y)}$ by Lemma [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemequiv%20def). The proof for $ {\\Omega^{-}}$ is the same. $ \\Box$  

**1.5. Viscosity solutions**

> **Definition 8** *A function $ {u\\in\\mathcal{C}(\\Omega)}$ is a *viscosity subsolution* of ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) if for every $ {x\\in\\Omega}$,*  
> 
> *$ \\displaystyle F(x,u(x),p)\\leq0 $*
> 
> *whenever $ {p\\in D^{+}u(x)}$. Note that if $ {D^{+}u(x)=\\emptyset}$, then the condition is trivially satisfied. Similarly, $ {u}$ is a *viscosity supersolution* if for every $ {x\\in\\Omega}$,*  
> 
> *$ \\displaystyle F(x,u(x),p)\\geq0 $*
> 
> *whenever $ {p\\in D^{-}u(x)}$. $ {u}$ is said to be a *viscosity solution* if it is both a supersolution and subsolution in the viscosity sense.*

Thanks to Lemma [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemequiv%20def), we can immediately put the definition in an equivalent form:  

> **Proposition 9** *A function $ {u\\in\\mathcal{C}(\\Omega)}$ is a viscosity subsolution of [(3)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3) if and only if for every $ {\\mathcal{C}^{1}}$ funciton $ {\\varphi(x)}$ such that $ {u-\\varphi}$ has a local maximum at $ {x}$, one has*  
> 
> *$ \\displaystyle F(x,u(x),\\nabla\\varphi(x))\\leq0. $*

The definition encompasses several situations. Notice that, using Lemma [7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem8) we can see that a classical solution, if exists, must also be a viscosity solution. By *Rademacher differentiation theorem* , a Lipschitz continuous function is differentiable almost everywhere. Thus a Lipschitz continuous solution coincides with the viscosity solution alomost everywhere if it exists.  

> **Example 1** *Let us revisit Equation [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1). It is easily checked that*  
> 
> *$ \\displaystyle u(x)=1-|x| $*
> 
> *is a viscosity solution. Any other "weak'' solution will have a local minimum in the interior $ {(-1,1)}$, where it is not differentiable. It is at such points the requirement for a supersolution fails. The viscosity solution is in fact unique, which we can easily derive form a *comparison principle* that we will illustrate later.  
> Similarly, notice also that the solutions to the viscosity approximations can never have a local minimum. Indeed, let us suppose $ {x\_{1}\\in(-1,1)}$ is a local minimum of $ {u^{\\epsilon}}$. Then  
> *  
> 
> *$ \\displaystyle |u^{\\epsilon}(x\_{1})|-1=-1=\\epsilon u\_{xx}^{\\epsilon}>0 $*
> 
> *is a contradiction. There is also a somewhat important asymmetry, appearing both in the definition of viscosity solution, as well as finding the solutions of viscosity approximation: if we replace Equation ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) with  
> *  
> 
> *$ \\displaystyle 1-|u\_{x}|=0, $*
> 
> *there is virtually no change of the equation itself, but the viscosity solution, as well as the solutions to the viscosity approximation are "flipped''. In particular, they can never have local maximum.  
>   
> *

It is plasuible to believe, and in fact it is true, that the solution obtained by vanishing viscosity will coincide with our viscosity solution. To get this result, we need a lemma concerning the stability of viscosity solutions.  

> **Lemma 10** *If $ {u\_{m}\\in\\mathcal{C}(\\overline{\\Omega})}$ is a sequence of viscosity subsolutions to*  
> 
> *$ \\displaystyle F\_{m}(x,u\_{m},\\nabla u\_{m})=0\\quad x\\in\\Omega $*
> 
> *such that $ {u\_{m}\\rightarrow u}$ uniformly, and $ {F\_{m}\\rightarrow F}$ locally uniformly, then $ {u}$ is a viscosity subsolution of [(3)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3).*

> **Theorem 11** *Let $ {u^{\\epsilon}}$ be a family of smooth subsolutions to the viscous equation*  
> 
> *$ \\displaystyle F(x,u^{\\epsilon}(x),\\nabla u^{\\epsilon}(x))=\\epsilon\\Delta u^{\\epsilon}(x)\\quad x\\in\\Omega $*
> 
> *Assume $ {u^{\\epsilon}\\rightarrow u}$ uniformly on $ {\\Omega}$ as $ {\\epsilon\\rightarrow0^{+}}$. Then $ {u}$ is a viscosity solution of [(3)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3).*

**1.6. A Comparison theorem for stationary Hamilton-Jacobi PDE**

Consider the Dirichlet problem[](https://www.blogger.com/null)  

[$ \\displaystyle u+H(x,\\nabla u)=0\\quad x\\in\\Omega, \\ \\ \\ \\ \\ (6)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {H}$ is uniformly continuous in the $ {x}$-variable:  

$ \\displaystyle \\left|H(x,p)-H(y,p)\\right|\\leq\\omega(|x-y|(1+|p|), $

where $ {\\omega:\[0,\\infty)\\rightarrow\[0,\\infty)}$ is such that $ {\\omega(r)\\rightarrow0}$ as $ {r\\rightarrow0^{+}}$, and  

$ \\displaystyle u(x)=g(x)\\quad x\\in\\partial\\Omega. $

We are now interested in the uniqueness problem. As before, let us assume we have a classical subsolution $ {u\_{1}}$ and a supersolution $ {u\_{2}}$ such that  

$ \\displaystyle u\_{1}(x)\\leq u(x)\\quad x\\in\\partial\\Omega. $

And suppose $ {u\_{1}-u\_{2}}$ attains a positive local maximum at $ {x\_{0}}$ in the interior $ {\\Omega}$. Then calculus shows that  

$ \\displaystyle \\nabla u\_{1}(x\_{0})=\\nabla u\_{2}(x\_{0}). $

On the other hand, we have  

$ \\displaystyle \\begin{array}{rcl} u\_{1}(x\_{0})+H(x\_{0},\\nabla u\_{1}(x\_{0})) & \\leq & 0\\\\ u\_{2}(x\_{0})+H(x\_{0},\\nabla u\_{2}(x\_{0})) & \\geq & 0 \\end{array} $

So, subtracting the second from the first, we get  

$ \\displaystyle u\_{1}(x\_{0})-u\_{2}(x\_{0})\\leq0 $

This is a contradiction. Hence we conclude that $ {u\_{1}(x)\\leq u\_{2}(x)}$ also in the interior. The above idea can be carried over to the non-differentiable setting. For example, there is essentially no change of argument if we have $ {u\_{1}(x\_{0})-u\_{2}(x\_{0})>0}$ and $ {p\\in D^{+}u\_{1}(x\_{0})\\cap D^{-}u\_{2}(x\_{0})}$, because by definition of viscosity subsolution, we still have  

$ \\displaystyle \\begin{array}{rcl} u\_{1}(x\_{0})+H(x\_{0},p) & \\leq & 0\\\\ u\_{2}(x\_{0})+H(x\_{0},p) & \\geq & 0. \\end{array} $

But there is no guarantee that $ {D^{+}u\_{1}(x\_{0})\\cap D^{-}u\_{2}(x\_{0})}$ is non-empty. So we are facing some technical delicacies here. The argument to get around this issue is known as "doubling the variables''.  

> **Theorem 12** *Let $ {u\_{1}}$, $ {u\_{2}\\in\\mathcal{C}(\\overline{\\Omega})}$ be viscosity subsolution and supersolution of [(6)](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7). Suppose that $ {u\_{1}(x)\\leq u\_{2}(x)}$ for all $ {x\\in\\partial\\Omega}$. Then*  
> 
> *$ \\displaystyle u\_{1}(x)\\leq u\_{2}(x)\\quad\\forall x\\in\\overline{\\Omega} $*

We thus refer to the excellent proof provided in the notes of Bressan.
