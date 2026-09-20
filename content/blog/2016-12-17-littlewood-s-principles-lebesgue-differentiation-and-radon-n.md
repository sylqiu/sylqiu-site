---
id: 2016-12-17-littlewood-s-principles-lebesgue-differentiation-and-radon-n
title: "Littlewood's principles, Lebesgue differentiation and Radon-Nikodym derivative"
date: 2016-12-17
tags: ["real analysis"]
source: https://sylqiu.blogspot.com/2016/12/littlewoods-principles-lebesgue.html
publish: true
---
There are numerous occasions when the first step of proving some result is a verification for relatively simple case, this strategy can be justified if one is able to control of "maximal error" from the simple case to the general case, known as "density argument". We will follow this approach to develop Lebesgue differentiation theorem. Finally we explore the relationship between measures and classical derivatives, via the important *Lebesgue-Radon-Nikodym theorem*.  
The major reference for this note is [Terry's notes](https://terrytao.wordpress.com/category/teaching/245a-real-analysis/) for both 254A and 254B.  

#### **1.1. Littlewood's three principles**

In analysis, one often considers a class of objects that can be, under some criterion, approximated by objects in a more restrictive but simpler subclass. For instances,  

-   Any real number can be approximated by a sequence of rational numbers, in the sense that the absolute value of the difference coverges to zero, namely convergence in the Euclidean norm.
-   The class $ {L^{1}(\\mathbb{R}^{n})}$ of extended real-valued Lebesgue integrable functions (more correctly, their equivalent classes) on $ {\\mathbb{R}^{n}}$ is defined to be the measurable funcitons can be approximated by the subclass of simple functions on $ {\\mathbb{R}^{n}}$, where one asks for the convergence of the integral of simple functions to converge to a real number, namely the convergence in $ {L^{1}}$-norm $ {\\|\\cdot\\|\_{1}}$.

It is evident that  

$ \\displaystyle \\text{\\{step functions}\\}\\subset\\text{\\{simple functions}\\}\\subset L^{1}(\\mathbb{R}^{n}). $

By construction, the family of simple functions is in dense in $ {L^{1}(\\mathbb{R}^{n})}$. The family of step functions is also dense in the family of simple functions, which follows from the regulariy of Lebesgue measurable sets:  

> **Lemma 1** *[](https://www.blogger.com/null)(Littlewood's First principle) Let $ {\\mathfrak{M}}$ be the $ {\\sigma}$-algebra of Lebesgue measurable sets in $ {\\mathbb{R}^{n}}$. Then for any $ {E\\in\\mathfrak{M}}$, there exist an open set $ {G}$ and closed set $ {F}$ with $ {F\\subset E\\subset G}$ and $ {\\mu(G-F)<\\epsilon}$.*  
> *Since closed sets in $ {\\mathbb{R}^{n}}$ are $ {\\sigma}$-compact, so in particular if $ {\\mu(E)<\\infty}$ we can choose $ {F}$ to be compact (this is the inner regularity of Lebesgue measurable sets). Consequently, there exist an $ {F\_{\\sigma}}$ set $ {A}$ and a $ {G\_{\\delta}}$ set $ {B}$ such that $ {A\\subset F\\subset B}$ and $ {\\mu(B-A)=0}$.*

In fact, the Lebesgue outer measure $ {\\mu\_{\*}}$ defines a *pesudometric* on the set of subsets of $ {\\mathbb{R}^{n}}$, namely, by defining  

$ \\displaystyle d(A,B)=\\mu\_{\*}(A\\Delta B) $

where $ {\\Delta}$ refers to symmetric difference of the two sets. The pseudometic thus defines a topology on $ {\\mathcal{P}(\\mathbb{R}^{n})}$. Here one also sees the role played by the measure zero sets. The Lebesgue $ {\\sigma}$-algebra $ {\\mathfrak{M}}$ is the *completion* of Borel $ {\\sigma}$-algebra $ {\\mathcal{B}}$ on $ {\\mathbb{R}^{n}}$ with respect to the pseudometric. In particular $ {\\mathfrak{M}}$ is *complete*, and is in fact unique in the sense of extension, thanks to Hahn-Kolmogorov extension theorem. In this spirit, we also have:  

> **Theorem 2** *(Riesz-Fischer) $ {L^{1}(\\mathbb{R}^{n})}$ is a Banach space with respect to $ {\\|\\cdot\\|\_{1}}$. More generally, $ {L^{p}(\\mathbb{R}^{n})}$ is complete with respect to $ {\\|\\cdot\\|\_{p}}$ for $ {1\\leq p\\leq\\infty}$.*

Combined with the Lemma [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem1), we have the following *compeletion* with respect to $ {\\|\\cdot\\|\_{1}}$-norm[](https://www.blogger.com/null)  

[$ \\displaystyle \\overline{\\text{\\{step functions}\\}}=\\overline{\\text{\\{simple functions}\\}}=L^{1}(\\mathbb{R}^{n}). \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)On the other hand, in light of Riesz representation theorem, one can also approximate measurable functions with continuous functions of compact support. Thus we also have another completion with respect to $ {\\|\\cdot\\|\_{1}}$-norm  

$ \\displaystyle \\overline{\\{C\_{c}(\\mathbb{R}^{n})\\}}=L^{1}(\\mathbb{R}^{n}). $

This fact is illustrated in  

> **Theorem 3** *(Littlewood's second principle) Let $ {f\\in L^{1}(\\mathbb{R}^{n})}$. Then for any $ {\\epsilon>0}$, there exists a compactly supported continuous function $ {g\\in C\_{c}(\\mathbb{R}^{n})}$ such that*  
> 
> *$ \\displaystyle \\|f-g\\|\_{1}<\\epsilon. $*

*Proof:* In view of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), we only need to do it for the indicator function $ {\\chi\_{E}}$ for some measurable $ {E}$ with $ {\\mu(E)<\\infty}$. Apply Lemma [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem1), we have an open set $ {G}$ and a compact set $ {K}$ such that $ {K\\subset E\\subset G}$ and $ {\\mu(G-K)<\\epsilon}$. Now use Urysohn's lemma. $ \\Box$  

The above can be roughly summerised as "measurable sets are not so different from open and closed sets in terms of taking their measures; integrable functions are not so different from simple functions in terms of taking their integrals''. This can be also applied to "mode of convergence'': Given a pointwise almost everywhere converging sequence of measurable functions, away from an exceptional set that is small, one can control at least locally its mode of convergence.  
We say that $ {f\_{n}:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ converges *locally uniformly* to $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ if for every compact set $ {K\\subset\\mathbb{R}^{n}}$, $ {f\_{n}}$ converges uniformly to $ {f}$.  

> **Theorem 4** *(Littlewood's third principle, Egorov's theorem) Let $ {f\_{n}:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ be a sequence of measurable functions that converge pointwise almost everywhere to $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$. Let $ {\\epsilon>0}$. Then there exists a measurable set $ {A\_{\\epsilon}\\subset\\mathbb{R}^{n}}$ with $ {\\mu(A\_{\\epsilon})<\\epsilon}$ such that $ {f\_{n}\\rightarrow f}$ locally uniformly on $ {\\mathbb{R}^{n}-A\_{\\epsilon}}$.*  
> *In particular, if $ {f}$ is finitely supported, i.e. $ {E=\\text{supp}(f)}$ is of finite measure, then there is a compact set $ {K\_{\\epsilon}}$ that takes the place of $ {\\mathbb{R}^{n}-A\_{\\epsilon}}$ as above.*

*Proof:* After modifying a set of measure zero, we may assume $ {f\_{n}\\rightarrow f}$ pointwisely everywhere. Thus for every $ {x\\in X}$, and for every $ {m>0}$, there exists $ {N=N(m)>0}$ such that  

$ \\displaystyle |f\_{n}(x)-f(x)|\\leq1/m $

for all $ {n>N}$. Let $ {E\_{m,N}=\\{x\\in X:|f\_{n}(x)-f(x)|>1/m,\\text{ for some }n>N\\}}$. Then for fixed $ {m}$, $ {E\_{m,N}}$ is measurable, descending in $ {N}$, and  

$ \\displaystyle \\bigcap\_{N=1}^{\\infty}E\_{m,N}=\\emptyset. $

Let $ {K}$ be any compact set. We then have by dominated convergence of measure,  

$ \\displaystyle \\lim\_{N\\rightarrow\\infty}\\mu(E\_{m,N}\\cap K)=0. $

Let $ {K\_{i}}$ be such that $ {\\mathbb{R}^{n}=\\bigcup\_{i=1}^{\\infty}K\_{i}}$. Then for any $ {m>0}$ we can find $ {N\_{m}>0}$ big enough such that for all $ {N>N\_{m}}$,  

$ \\displaystyle \\mu(E\_{m,N}\\cap K\_{m})<\\epsilon/2^{m}. $

Now let $ {A\_{\\epsilon}=\\bigcup\_{m=1}^{\\infty}E\_{m,N\_{m}}\\cap K\_{m}}$. Then $ {A\_{\\epsilon}}$ is measurable with $ {\\mu(A\_{\\epsilon})<\\epsilon}$, and on $ {K-A\_{\\epsilon}}$  

$ \\displaystyle |f\_{n}(x)-f(x)|\\leq1/m $

for all $ {n>N\_{m}}$. This shows that $ {f\_{n}\\rightarrow f}$ locally uniformly on $ {\\mathbb{R}^{n}-A\_{\\epsilon}}$. $ \\Box$  

We record a direct consequence of the above theorem.  

> **Theorem 5** *(Lusin's theorem) Let $ {f}$ be a measurable function on $ {\\mathbb{R}^{n}}$. Then for any $ {\\epsilon>0}$, there exists a measurable set $ {A\_{\\epsilon}\\subset\\mathbb{R}^{n}}$ such that $ {\\mu(A\_{\\epsilon})<\\epsilon}$ and $ {f\\downharpoonright\_{\\mathbb{R}^{n}-A\_{\\epsilon}}}$ is continuous.*

> **Remark 1** *Note that there is a difference in saying that $ {f\\downharpoonright\_{\\mathbb{R}^{n}-A\_{\\epsilon}}}$ is continuous and $ {f}$ in continuous on $ {\\mathbb{R}^{n}-A\_{\\epsilon}}$, where in the second case we cannot ignore $ {A\_{\\epsilon}}$ from the consideration of continuity. One may ask if $ {f\\downharpoonright\_{\\mathbb{R}^{n}-A\_{\\epsilon}}}$ actually *arises from* some continuous function on $ {\\mathbb{R}^{n}}$. Using *Tietze extension theorem*, one can show that it is true for spaces that are sufficiently nice such as $ {\\mathbb{R}^{n}}$, namely the topological spaces that are *normal* and measurable sets are inner regular. Of course, all our discussion above can be applied to the situation where $ {\\mathbb{R}^{n}}$ is replaced by a $ {\\sigma}$-compact LCH space, where all measurable sets are inner regular.*

It is sometimes useful to use semi-continuous functions due to their generality.  

> **Definition 6** *(Semi-continuity) Let $ {X}$ be a topological space. A function $ {f:X\\rightarrow\\mathbb{R}}$ is said to be *upper semi-continuous, abbr. u.s.c.* if $ {f^{-1}((-\\infty,a))}$ is open for all real $ {a}$; it is *lower semi-continuous, l.s.c.* if $ {-f}$ is u.s.c..*

An equivalent formulation in terms of local property is that $ {f}$ is u.s.c. at $ {x\_{0}}$ if for any $ {\\epsilon>0}$, there exist a neighborhood $ {U}$ of $ {x\_{0}}$ such that  

$ \\displaystyle f(y)-f(x\_{0})<\\epsilon $

for all $ {y\\in U}$. In a metric space, this property can be expressed more succintly as  

$ \\displaystyle \\limsup\_{y\\rightarrow x\_{0}}f(y)\\leq f(x\_{0}). $

Similarly, $ {f}$ is l.s.c. at $ {x\_{0}}$ if for any $ {\\epsilon>0}$, there exist a neighborhood $ {U}$ of $ {x\_{0}}$ such that  

$ \\displaystyle f(x\_{0})-f(y)<\\epsilon $

for all $ {y\\in U}$; in a metric space we have  

$ \\displaystyle \\liminf\_{y\\rightarrow x\_{0}}f(y)\\geq f(x\_{0}). $

Combining the two, we see that a function is continuous if and only if it is both l.s.c and u.s.c. Semi-continuous functions are "stable'' under operation of supremum and infimum:  

> **Proposition 7** *[](https://www.blogger.com/null)Let $ {\\{f\_{i}:X\\rightarrow\\mathbb{R}\\}\_{i\\in I}}$ be a collection of u.s.c. functions. Then the pointwise supremum defines a new u.s.c. function, i.e.*  
> 
> *$ \\displaystyle f(x):=\\sup\_{i\\in I}f\_{i}(x) $*
> 
> *is u.s.c.. Likewise, the pointwise infimum of any collection of l.s.c. functions is again l.s.c..*

*Proof:* It suffices to note that the set  

$ \\displaystyle f^{-1}((-\\infty,a))=\\bigcup\_{i\\in I}f\_{i}^{-1}((-\\infty,a)) $

is open. $ \\Box$  

The most fundamental examples of semi-continuous functions are indicator functions of open and closed sets. We have for example $ {G\\subset X}$ is open if and only if $ {\\chi\_{G}}$ is l.s.c.. This can be easily seen by noticing that $ {\\chi^{-1}((a,+\\infty))}$ is either $ {G}$ or $ {\\emptyset}$. Furthermore, they are often (when the topological space is nice) the first "cheap'' extension from something defined using continuous functions. For instance,  

> **Proposition 8** *Let $ {X}$ be normal and Hausdorff. Then $ {f}$ is u.s.c. if and only if*  
> 
> *$ \\displaystyle f(x)=\\inf\\{g(x):g\\in C(X\\rightarrow(-\\infty,+\\infty\]),g\\geq f\\} $*
> 
> *for all $ {x\\in X}$. Likewise, $ {f}$ is l.s.c. if and only if*  
> 
> *$ \\displaystyle f(x=\\sup\\{g(x):g\\in C(X\\rightarrow(-\\infty,+\\infty\]),g\\leq f\\} $*
> 
> *for all $ {x\\in X}$.*

*Proof:* We note that if $ {f(x)=\\inf\\{g(x):g\\in C(X\\rightarrow(-\\infty,+\\infty\]),g\\geq f\\}}$, then $ {f^{-1}((-\\infty,a))=\\bigcup\_{g\\geq f}g^{-1}((-\\infty,a))}$ which is open for any $ {a\\in\\mathbb{R}}$. Conversely, suppose $ {f}$ is u.s.c., and denote $ {\\tilde{f}(x)=\\inf\\{g(x):g\\in C(X\\rightarrow(-\\infty,+\\infty\]),g\\geq f\\}}$. Clearly, we have $ {f(x)\\leq\\tilde{f}(x)}$. Now suppose for some $ {x\_{0}}$, $ {f(x\_{0})<\\tilde{f}(x\_{0})}$. Since $ {f}$ is u.s.c. at $ {x\_{0}}$, there is a neighborhood $ {U}$ of $ {x\_{0}}$ such that  

$ \\displaystyle f(y)<\\tilde{f}(x\_{0}) $

for all $ {y\\in U}$. Since the space is normal and Hausdorff, one can take a continuous function $ {g}$ such that $ {g(x\_{0})<\\tilde{f}(x\_{0})}$, and $ {g\\geq f}$ on $ {X\\backslash U}$. It then can be clearly extended in $ {U}$ such that $ {g(y)\\geq f(y)}$ for all $ {y\\in U}$ using the above inequality. $ \\Box$  

> **Remark 2** *One way to contruct the Borel measure in the Riesz representation theorem for a compact hausdorff space $ {X}$ is to extend the positive functional on bounded continuous functions $ {B(X)}$ to l.s.c. ones, using the above proposition. See Terry's notes for more details.*

Coupled with the regularity of measurable sets, one can obtain results on approximation by semi-continuous functions, in spirit similar to Littlewood's second principle, for example, the *Vitali-Caratheodory's theorem*.  
Finally, we record an example of u.s.c. function that will be useful later in this note.  

> **Proposition 9** *The *Hardy-Littlewood maximal function* of $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$, defined to be*  
> 
> *$ \\displaystyle Mf(x):=\\sup\_{r>0}\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)\\right|dy $*
> 
> *is upper semi-continuous if $ {f}$ is abosolutely integrable. Consequently, the maximal function of $ {f}$ is measurable.*

*Proof:* In view of Proposition [7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propsup-semi), it suffices to show the functions $ {f\_{r}}$ indexed by $ {r}$, defined by  

$ \\displaystyle f\_{r}(x):=\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)\\right|dy $

is continuous. This follows directly from the following lemma. $ \\Box$  

> **Lemma 10** *[](https://www.blogger.com/null)(Absolute continuity) Let $ {f\\in L^{1}(\\mu)}$. Then for each $ {\\epsilon>0}$, there is some $ {\\delta>0}$ such that*  
> 
> *$ \\displaystyle \\int\_{E}|f|d\\mu<\\epsilon $*
> 
> *whenever $ {\\mu(E)<\\delta}$.*

*Proof:* Suppose not. Let $ {E\_{n}}$ be measurable with $ {\\mu(E\_{n})\\leq2^{-n}}$, $ {A\_{n}=\\bigcup\_{k\\geq n}^{\\infty}E\_{n}}$, so that  

$ \\displaystyle \\mu(A\_{n})\\leq\\sum\_{j}\\mu(E\_{n})=2^{1-n}. $

Suppose $ {\\epsilon\_{0}>0}$ is such that  

$ \\displaystyle \\int\_{A\_{n}}|f|d\\mu>\\epsilon\_{0}. $

Then by dominated convergence theorem,  

$ \\displaystyle 0=\\int\_{A}|f|d\\mu=\\lim\_{n\\rightarrow\\infty}\\int\_{A\_{n}}|f|d\\mu>\\epsilon\_{0}, $

a contradiction. $ \\Box$  

#### **1.2. Density argument: Lebesgue differentiation theorem**

The power of Littlewood's principles not only lies in helping one to understand the behavior of various "Lebesgue'' type of contructions, e.g. measurable sets, functions only defined almost everywhere etc., but also allow one to attack a problem first by looking at a "simpler version'', namely the subject class being replaced by one of its dense subclasses. Consider the following statement concerning the translation invariance of Lebesgue measure: If $ {m}$ is a Borel measure defined on $ {(\\mathbb{R}^{n},\\mathcal{B})}$ and is translational invariant, then there is a positive constant $ {\\lambda>0}$ such that  

$ \\displaystyle m(E)=\\lambda\\mathcal{L}^{n}(E) $

for all $ {E\\in\\mathcal{B}}$. By finite additivity and translation invariance, we see that the conclusion obviously hold for *dyadic meshes*, i.e. the cubes with sides of length $ {2^{n}}$, $ {n\\in\\mathbb{Z}}$. Since dyadic meshes are dense in the space of measurable sets, using Fatou's lemma, we see that the result holds by taking limit. In this subsection we are interested in the following convergence theorem, a generalization of *the first fundamental theorem of calculus*:  

> **Theorem 11** *[](https://www.blogger.com/null)(Lebesgue differentiation theorem) Let $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ be absolutely integrable. Then for almost every $ {x\\in\\mathbb{R}^{n}}$,[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\lim\_{r\\rightarrow0^{+}}\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)-f(x)\\right|dy=0 \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)and*  
> 
> *$ \\displaystyle \\lim\_{r\\rightarrow0^{+}}\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}f(y)dy=f(x). $*
> 
> *The point $ {x\\in\\mathbb{R}^{n}}$ such that ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) holds is called a Lebesgue point of $ {f}$. Thus, for $ {f\\in L^{1}(\\mathbb{R}^{n})}$, almost every point is a Lebesgue point of $ {f}$.*

There are in general two ingredients to prove such converging result, known as *density argument*:  

1.  Verification of the statement for objects in the dense subclass;
2.  A *quantitative estimate* that bounds the "maximal error''.

It is easy to verify Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm) for continuous compactly supported functions on $ {\\mathbb{R}^{n}}$, which form a dense subclass of $ {L^{1}(\\mathbb{R}^{n})}$. In the following we will develop the corresponding quantitative estimates. The first one is *Markov inequality*.  

> **Theorem 12** *(Markov inequality) Let $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ be absolutely integrable. Then*  
> 
> *$ \\displaystyle \\mathcal{L}^{n}(\\{x\\in\\mathbb{R}^{n}:\\left|f(x)\\right|\\geq\\lambda\\})\\leq\\frac{1}{\\lambda}\\int\_{\\mathbb{R}^{n}}|f(t)|dt. $*

*Proof:* Note that  

$ \\displaystyle \\begin{array}{rcl} \\lambda\\cdot\\mathcal{L}^{n}(\\{x\\in\\mathbb{R}^{n}:\\left|f(x)\\right|\\geq\\lambda\\}) & \\leq & \\int\_{\\left|f\\right|\\ge\\lambda}\\left|f(y)\\right|dy\\\\ & \\leq & \\int\_{\\mathbb{R}^{n}}\\left|f(y)\\right|dy. \\end{array} $

$ \\Box$  

> **Theorem 13** *[](https://www.blogger.com/null)(Hardy-Littlewood mximal inequality, weak type estimate) Let $ {f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ be absolutely integrable, and $ {\\lambda>0}$. Then*  
> 
> *$ \\displaystyle \\mathcal{L}^{n}(\\{x\\in\\mathbb{R}^{n}:Mf(x)\\geq\\lambda\\})\\leq\\frac{C\_{n}}{\\lambda}\\int\_{\\mathbb{R}^{n}}|f(t)|dt $*
> 
> *for some constant $ {C\_{n}>0}$ depending only on the dimension $ {n}$.*

Now we quickly show how to use the quantitative estimate Theorem [13](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Hardy-Littlewood-mximal-inequal) to deduce Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm).  
*Proof of Theorem 11:* Let $ {\\epsilon>0}$. By Littlewood's second principle, there exists a $ {g\\in C\_{c}(\\mathbb{R}^{n})}$ such that  

$ \\displaystyle \\int\_{\\mathbb{R}^{n}}|f(x)-g(x)|dx\\leq\\epsilon. $

Using HL maximal inequality,  

$ \\displaystyle \\mathcal{L}^{n}(\\{x\\in\\mathbb{R}^{n}:M(f-g)(x)\\geq\\lambda\\})\\leq C\_{n}\\frac{\\epsilon}{\\lambda}. $

Using Markov inequality,  

$ \\displaystyle \\mathcal{L}^{n}(\\{x\\in\\mathbb{R}^{n}:\\left|f(x)-g(x)\\right|\\geq\\lambda\\})\\leq\\frac{\\epsilon}{\\lambda}. $

By subadditivity, we conclude that except on a set of measure $ {(1+C\_{n})\\epsilon/\\lambda}$, we have  

$ \\displaystyle \\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)-g(y)\\right|dy<\\lambda $

and  

$ \\displaystyle \\left|f(x)-g(x)\\right|<\\lambda. $

Using Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm) for continuous functions, we have for all $ {r}$ small enough,  

$ \\displaystyle \\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|g(y)-g(x)\\right|dy<\\lambda. $

Now, using triangle inequality,  

$ \\displaystyle \\begin{alignedat}{1} & \\left|\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}f(y)dy-f(x)\\right|\\\\ \\leq & \\left|\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}f(y)dy-g(x)\\right|+\\left|f(x)-g(x)\\right|\\\\ \\leq & \\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)-g(y)\\right|dy+\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|g(y)-g(x)\\right|dy+\\left|f(x)-g(x)\\right|\\\\ < & 3\\lambda \\end{alignedat} $

for all $ {r}$ sufficiently close to zero. In particular we have  

$ \\displaystyle \\limsup\_{r\\rightarrow0^{+}}\\left|\\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}f(y)dy-f(x)\\right|<3\\lambda $

for all $ {x}$ outside a set of measure $ {(1+C\_{n})\\epsilon/\\lambda}$. Fix $ {\\lambda}$ and send $ {\\epsilon}$ to zero, the ineuqality holds for almost all $ {x}$. Finally, sending $ {\\lambda}$ to zero, we conclude the desired result. $ \\Box$  

To establish the HL maximal inequality, it suffices to deal with the strict inequality case, i.e.  

$ \\displaystyle E=\\{x\\in\\mathbb{R}^{n}:M(f-g)(x)>\\lambda\\} $

since the non-strict case follows by an epsilon adjustment on $ {\\lambda}$. This formulation allows us to deduce that whenever $ {x\\in E}$, there exists $ {r>0}$ such that[](https://www.blogger.com/null)  

[$ \\displaystyle \\frac{1}{\\mathcal{L}^{n}(B(x,r))}\\int\_{B(x,r)}\\left|f(y)\\right|dy>\\lambda. \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)We will also take advantage of the inner regularity of Lebesgue measure (as again a manifestation of Littlewood's first principle): it suffices to establish the estimate for all compact $ {K\\subset E}$. For each $ {x\\in K}$, let $ {B(x,r)}$ be such that ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) holds. Then $ {\\{B(x,r)\\}\_{x\\in K}}$ forms a covering of $ {K}$ and  

$ \\displaystyle \\mathcal{L}^{n}(B(x,r))<\\frac{1}{\\lambda}\\int\_{B(x,r)}\\left|f(y)\\right|dy. $

Since $ {K}$ is compact, one finds a finite subcovering $ {\\{B\_{i}\\}\_{i=1}^{n}}$. However, because of the potential intersections among $ {B\_{i}}$'s, one cannot conclude the estimate Theorem [13](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Hardy-Littlewood-mximal-inequal)directly. We will get around this issue by a Vitali covering type of argument.  

> **Lemma 14** *(Vitali convering lemma) Let $ {\\{B\_{1},\\dots,B\_{n}\\}}$ be a collection of open balls in $ {\\mathbb{R}^{n}}$. Then there exists a subcollection $ {\\{B\_{1}',\\dots B\_{m}'\\}}$ such that*  
> 
> *$ \\displaystyle \\bigcup\_{i=1}^{n}B\_{i}\\subset\\bigcup\_{i=1}^{m}3B\_{i}' $*
> 
> *where $ {3B\_{i}'}$ is the 3-concentric dilation of $ {B\_{i}'}$.*

Now we quickly finish the proof of the HL maximal inequality.  
*Proof of Theorem 13:* Following the above argement, and using Vitali convering lemma, we have  

$ \\displaystyle \\begin{array}{rcl} \\mathcal{L}^{n}(K) & \\leq & \\mathcal{L}^{n}(\\bigcup\_{i=1}^{n}B\_{i})\\\\ & \\leq & 3^{n}\\mathcal{L}^{n}(\\bigcup\_{i=1}^{m}B\_{i}')\\\\ & \\leq & \\frac{3^{n}}{\\lambda}\\int\_{B(x,r)}\\left|f(y)\\right|dy\\leq\\frac{3^{n}}{\\lambda}\\int\_{\\mathbb{R}^{n}}\\left|f(y)\\right|dy. \\end{array} $

$ \\Box$  

Finally we prove the Vitali covering lemma.  
*Proof of Lemma 14:* We use a "greedy algorithm'' to pick out the subcollection $ {\\{B\_{i}'\\}\_{i=1}^{n}}$. Starting with the ball of largest radius in the finite collection and set it as $ {B\_{1}'}$. Choose $ {B\_{k}'}$ to be the biggest ball that doesn't intersect any of the previous balls. The process will stop for some $ {m\\leq n}$, when all balls left unselected have intersection with some ball in the chosen subcollection $ {\\{B\_{i}'\\}\_{i=1}^{m}}$. Next we make an important observation: any ball that intersects with $ {B\_{i}'}$ will be of smaller radius than $ {B\_{i}'}$. If not, then either in the first step we didn't choose the largest ball, or we didn't choose the ball of largest radius and disjoint from the previous ones. Then by trangle inequality we see that any ball that intersects $ {B\_{i}'}$ will be contained in $ {3B\_{i}'}$. $ \\Box$  

> **Remark 3** *As an exercise appeared in Terry's notes, one can in fact improve the constant $ {3^{n}}$ to $ {2^{n}}$, by the observation that the $ {2}$-concentric dilated ball contains the centers of the balls that intersect with it. To achieve this, one has to have enough balls in the finite collection. It is a good exercise for "epsilon of room'' type of argument, see this [MSE question](http://math.stackexchange.com/questions/1984653/improving-the-constant-in-hardy-littlewood-maximal-inequality-from-3d-to-2d) for more details.*  
> *There is also a version of Vitali covering lemma dealing with countable collection of open balls, with the constant changed to $ {5}$. Effectively, this transport the argument using regularity of Lebesgue measurable set in the covering lemma. However, one gets a worse constant.*

#### **1.3. Signed measures and Radon-Nikodym derivatives**

One usually goes through the contruction of Lebesgue integration on $ {\\mathbb{R}}$ by definining first integrals of *non-negative functions*, then decomposing a function $ {f}$ into its positive and negative parts, i.e. the *Jordan decomposition of functions*[](https://www.blogger.com/null)  

[$ \\displaystyle f=f^{+}-f^{-} \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {f^{+}=\\max\\{f,0\\}}$ and $ {f^{-}=\\max\\{-f,0\\}}$. Then define[](https://www.blogger.com/null)  

[$ \\displaystyle \\int fd\\mathcal{L}^{1}=\\int f^{+}d\\mathcal{L}^{1}-\\int f^{-}d\\mathcal{L}^{1} \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)if the RHS is finite. $ {f}$ is thus called abolutely integrable. This process has its measure-theoretic analog. We have defined unsigned measures on a $ {\\sigma}$-algebra. In view of ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we introduce the notion of a *signed measure*.  

> **Definition 15** *(Signed measure) A *signed measure* is a set function $ {\\mu:\\mathcal{\\mathfrak{M}\\rightarrow\\mathbb{R}}}$ on the $ {\\sigma}$-algebra $ {\\mathfrak{M}}$ of $ {X}$ such that*  
>   
> 
> *-   $ {\\mu(\\emptyset)=0;}$
> -   $ {\\mu}$ can take $ {+\\infty}$ or $ {-\\infty}$, but not both (this is to avoid the situations such as $ {+\\infty-\\infty}$);
> -   If $ {E\_{1},E\_{2}\\dots\\subset X}$ is a countable collection of disjoint measurable sets, then
>     
>     $ \\displaystyle \\sum\_{i=1}^{\\infty}\\mu(E\_{i})=\\mu(\\bigcup\_{i=1}^{\\infty}E\_{i}), $
>     
>     with the LHS absolutely convergent if the RHS is finite.*

We first have an analog to the decompostion ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)):  

> **Theorem 16** *(Hahn decomposition) Let $ {\\mu}$ be a signed measure. Then there exists a partition $ {X=X\_{+}\\cup X\_{-}}$ such that $ {\\mu\\downharpoonright\_{X\_{+}}\\geq0}$ and $ {\\mu\\downharpoonright\_{X\_{-}}\\leq0}$.*

*Proof:* Assume without loss of generality that $ {\\mu}$ avoids $ {-\\infty}$. Let $ {\\mathfrak{M}\_{-}=\\{E\\in\\mathfrak{M}:\\mu\\downharpoonright\_{E}\\geq0\\}}$. Note that $ {\\emptyset\\in\\mathfrak{M}\_{-}}$. Define  

$ \\displaystyle m\_{-}:=\\inf\_{E\\in\\mathfrak{M}\_{-}}\\mu(E). $

We claim that $ {m\_{-}}$ is finite, and is achieved by some set $ {X\_{-}\\in\\mathfrak{M}\_{-}}$. Let $ {E\_{1},E\_{2},\\dots}$ be a minimizing sequence, i.e. $ {\\mu(E\_{n})\\rightarrow m\_{-}}$ as $ {n\\rightarrow+\\infty}$. Let $ {X\_{-}=\\bigcup\_{n}E\_{n}}$. We see that $ {\\mu\\downharpoonright\_{X\_{-}}\\leq0}$ and $ {\\mu(X\_{-})=m\_{-}}$. In particular, $ {m\_{-}}$ is finite. Let $ {X\_{+}=X\\backslash X\_{-}}$. We claim that $ {X\_{+}}$ is such that $ {\\mu\\downharpoonright\_{X\_{+}}\\geq0}$. Supose not, then there exists a subset $ {E\_{1}\\subset X\_{+}}$ such that $ {\\mu(E\_{1})<0}$. If $ {\\mu\\downharpoonright\_{E}\\leq0}$, then $ {E\_{1}\\cup X\_{-}}$ as a disjoint union has strictly smaller measure than $ {X\_{-}}$, contrary to our construction of $ {X\_{-}}$. Thus $ {E\_{1}}$ contains a set with strictly smaller measure. Let $ {n\_{1}}$ be large enough such that there exist $ {E\_{2}\\subset E\_{1}}$ with  

$ \\displaystyle \\mu(E\_{2})\\leq\\mu(E\_{1})-\\frac{1}{n\_{1}}<0. $

If $ {\\mu\\downharpoonright\_{E\_{2}}\\leq0}$, then we are done again. If not, continuing this, we either stop with a $ {\\mu\\downharpoonright\_{E\_{n}}\\leq0}$ as a contradiction, or get a nested sequence  

$ \\displaystyle E\_{1}\\supset E\_{2}\\supset\\cdots\\supset E\_{j}\\supset\\cdots $

in $ {X\_{+}}$ with strictly decreasing (negaitve) measure. Let $ {E=\\bigcap\_{j}E\_{j}}$. Then $ {E}$ also has negative measure, hence finite by our assumption. This implies $ {n\_{j}\\rightarrow+\\infty}$. So $ {E}$ cannot contain any subset of strictly smaller measure, which means $ {\\mu\\downharpoonright\_{E}\\leq0}$, a contradction. $ \\Box$  

> **Definition 17** *Let $ {\\mu}$ and $ {\\lambda}$ be two signed measures on a $ {\\sigma}$-algebra $ {\\mathfrak{M}}$. We say a set $ {E\\in\\mathfrak{M}}$ is $ {\\mu}$-null if $ {\\mu\\downharpoonright\_{E}}$ the restriction of $ {\\mu}$ to $ {E}$ is zero; and $ {\\mu}$ is *supported* on $ {E}$ if the complement of $ {E}$ is $ {\\mu}$-null. Then*  
>   
> 
> *-   $ {\\lambda}$ is said to be *absolutely continuous* with respect to $ {\\mu}$, denoted $ {\\lambda\\ll\\mu}$, if every $ {\\mu}$-null set is also $ {\\lambda}$-null.
> -   $ {\\lambda}$ and $ {\\mu}$ are said to be *mutually singular*, denoted $ {\\lambda\\perp\\mu}$, if their supports are mutually disjoint.*

If for a signed measure $ {\\mu}$, we can define unsigned measures on $ {\\mathfrak{M}}$ $ {\\mu\_{+}:=\\mu\\downharpoonright\_{X\_{+}}}$ and $ {\\mu\_{-}:=\\mu\\downharpoonright\_{X\_{-}}}$. We thus see that $ {\\mu\_{+}}$ and $ {\\mu\_{-}}$ are mutually singular, and  

$ \\displaystyle \\mu=\\mu\_{+}-\\mu\_{-}, $

which is called the *Jordan decompostion* of $ {\\mu}$. If there is another pair of unsigned measures $ {\\mu\_{1}}$ and $ {\\mu\_{2}}$ satisfying $ {\\mu\_{1}\\perp\\mu\_{2}}$, $ {\\mu=\\mu\_{1}-\\mu\_{2}}$. We get  

$ \\displaystyle \\mu\_{+}-\\mu\_{1}=\\mu\_{-}-\\mu\_{2} $

with LHS and RHS being mutually singular, and thus are zero measures. We thus conclude that the Jordan decompostion is unique, and refer to $ {\\mu\_{+}}$, $ {\\mu\_{1}}$ as the *positive and negative variantion* of $ {\\mu}$. The *totoal variation measure* of $ {\\mu}$, denoted $ {|\\mu|}$, is defined to be $ {|\\mu|=\\mu\_{+}+\\mu\_{-}}$.  

> **Remark 4** *For a signed measure $ {\\mu}$, one can define*  
> 
> *$ \\displaystyle |\\mu|(E)=\\sup\_{E=\\sqcup\_{i}E\_{i}}\\sum\_{i}|\\mu(E\_{i})|. $*
> 
> *The two defintions will be seen to be equivalent once we have *Radon-Nikodym theorem*.*

Given the analogs between functions and measures, now we explore further their relationship.  
One direction is immediate: given a $ {\\mu}$-measurable function $ {f}$, one can define a signed measure $ {\\lambda\_{f}}$ by  

$ \\displaystyle \\lambda\_{f}(E)=\\int\_{E}fd\\mu $

provided the RHS can possibly reach either $ {+\\infty}$ or $ {-\\infty}$ but not both. Indeed, by taking the Jordan decomposition of $ {f=f^{+}-f^{-}}$, $ {\\lambda}$ can be seen as a difference of two unsigned measures (in fact the Jordan decomposition of $ {\\lambda}$). Since RHS, when ranging over $ {E\\in\\mathfrak{M}}$, can take at most one of the infinity values $ {+\\infty}$ and $ {-\\infty}$, we see that at least one of the two unsigned measure is finite. Moreover, one has an essentially uniqueness result when the $ {\\mu}$ is $ {\\sigma}$-finite;  

> **Lemma 18** *[](https://www.blogger.com/null)If $ {\\mu}$ is $ {\\sigma}$-finite, and there are two signed measures $ {\\lambda\_{f}}$, $ {\\lambda\_{g}}$ such that $ {\\lambda\_{f}=\\lambda\_{g}}$, then $ {f=g}$ a.e..*

*Proof:* By Jordan decomposition, it suffices to prove when $ {f,g:X\\rightarrow\[0,\\infty\]}$. Assume first $ {\\mu}$ is a finite measure on $ {X}$. Suppose $ {f\\neq g}$ on a set of positive measure, say $ {E}$. We claim that there is a set $ {E'\\subset E}$ such that on $ {E'}$ either $ {f>g}$ or $ {f<g}$. Let $ {E\_{1}=\\{x\\in E:f(x)>g(x)\\}}$. We have $ {E\_{1}}$ and $ {E\\backslash E\_{1}}$ are measurable. If $ {E\_{1}}$ has positive measure, then we are done; otherwise $ {E\\backslash E\_{1}}$ has positive measure. Let $ {E'}$ be the one with positive measure. Then it is clear that $ {\\lambda\_{f}(E')>\\lambda\_{g}(E')>0}$, a contradiction. $ \\Box$  

The above result does not hold in case $ {X}$ is not $ {\\sigma}$-finite, just by considering the simple case when $ {X=\\{0\\}}$ with $ {\\mu(\\{0\\})=\\infty}$. We will refer the function $ {f}$ as the *Radon-Nikodym derivaitve* of $ {\\lambda\_{f}}$ with respect to $ {\\mu}$.  
On the other hand, we see that if a signed measure $ {\\lambda}$ is not such that $ {\\lambda\\ll\\mu}$, where $ {\\mu}$ is a unsigned reference measure. Then it is not possible to obtain $ {\\lambda}$ from $ {\\mu}$ in the above fashion, namely by "multiplying'' a measurable function. However, the obstruction can be precisely described if $ {\\mu}$ is $ {\\sigma}$-finite.  

> **Theorem 19** *(Lebesgue-Radon-Nikodym) Let $ {\\mu}$ be unsigned and $ {\\sigma}$-fininte, and $ {\\lambda}$ be a signed $ {\\sigma}$-finite measure. Then there exists a unique decomposition*  
> 
> *$ \\displaystyle \\lambda=\\lambda\_{f}+\\lambda\_{s}, $*
> 
> *where $ {f:X\\rightarrow\\mathbb{R}}$ is measurable and $ {\\lambda\_{s}\\perp\\mu}$, called the Lebesgue decomposition. Clearly, $ {\\lambda\_{f}\\ll\\mu}$. Futhermore, if $ {\\lambda}$ is unsigned, then so is $ {f}$ and $ {\\lambda\_{s}}$. If $ {\\lambda}$ is finite, then $ {f\\in L^{1}(\\mu)}$ and $ {\\lambda\_{s}}$ is also finite.*

In particular, if we have $ {\\lambda\\ll\\mu}$, then the theorem implies that there is a measurable function $ {f:X\\rightarrow\\mathbb{R}}$ such that  

$ \\displaystyle \\lambda(E)=\\int\_{E}fd\\mu. $

If one regards measures as "generalized functions'', then the theorem provides an analog for *the second fundamental theorem of calculus*. The famous example of *Cantor's function*, a.k.a. *Devil's step function* thus reminds us that the class of absolutely continuous functions is the largest class that the 2nd FTC applies. Here, one sees the defect of "classical derivatives'', as they are not able to capture this kind of variations of monotone functions.  
*Proof:* We refer to the proof of the case when both $ {\\mu,\\lambda}$ are unsigned and finite in Terry's notes. It is done by choosing the function $ {f}$ whose $ {\\mu}$-induced meausre is "closest'' to $ {\\mu}$. The uniqueness follows from [18](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem22) and the observation that $ {\\lambda\_{f}}$ for nonzero $ {f}$ cannot be singular to $ {\\mu}$. Assuming the result in the finite case, and write $ {X=\\bigsqcup X\_{i}}$ as a disjoint union, where $ {X\_{i}}$ is such that $ {\\mu\\downharpoonright\_{X\_{i}},\\lambda\\downharpoonright\_{X\_{i}}}$ are finite unsigned and signed measures respctively. Hence  

$ \\displaystyle \\lambda\\downharpoonright\_{X\_{i}}=\\lambda\_{f}\\downharpoonright\_{X\_{i}}+\\lambda\_{s}\\downharpoonright\_{X\_{i}}. $

Using Jordan decomposition, we easily see that  

$ \\displaystyle \\begin{array}{rcl} \\lambda & = & \\sum\_{i}(\\lambda\\downharpoonright\_{X\_{i},+}-\\lambda\\downharpoonright\_{X\_{i},-})\\\\ & = & \\sum\_{i}(\\lambda\_{f}\\downharpoonright\_{X\_{i},+}-\\lambda\_{f}\\downharpoonright\_{X\_{i},-})+\\sum\_{i}(\\lambda\_{s}\\downharpoonright\_{X\_{i},+}-\\lambda\_{s}\\downharpoonright\_{X\_{i},-}). \\end{array} $

$ \\Box$  

> **Remark 5** *One can also establish the theorem via $ {L^{p}}$-$ {L^{q}}$ duality (due to von Neuman), and the duality can also be established via Lebesgue-Radon-Nikodym theorem. Rudin's book takes this approach.*

We can in fact get a slightly more precise Lebesgue decomposition than the one above. Let $ {X}$ be such that every point is measurable. We say a measure $ {\\mu}$ is *continuous* if $ {\\mu(\\{x\\})=0}$ for all $ {x\\in X}$. Let $ {\\mu,\\lambda}$ be as above, and furthermore $ {\\mu}$ is continuous, then there is a unique decompostion  

$ \\displaystyle \\lambda=\\lambda\_{ac}+\\lambda\_{sc}+\\lambda\_{pp}, $

where $ {\\lambda\_{ac}\\ll\\mu}$, $ {\\lambda\_{sc}}$ is singular to $ {\\mu}$ and continuous, and $ {\\lambda\_{pp}}$ suppoted on an at most countable set. Here, $ {\\lambda\_{sc}}$, $ {\\lambda\_{pp}}$ are called *singular continuous* and *pure point* components of $ {\\lambda}$ respectively. The decomposition for the case of unsigned measures above (later it extends to the signed case as well) is analogous to the decomposition of monotone function in the 1-dimensional case. Recall that if $ {F:\\mathbb{R}\\rightarrow\\mathbb{R}}$ is non-decreasing, then the only discontinuities of $ {F}$ are *"jump discontinuities"*. There are at most countably many such jumps. If furthermore $ {F}$ is bounded, one has a unique *continuous-singular* decomposition:  

$ \\displaystyle F=F\_{c}+F\_{pp} $

where $ {F\_{c}}$ is continuous non-decreasing and $ {F\_{pp}}$ is a *jump function*. Combining this with a HL-type of inequality for *Dini's numbers* gives an important result of almost everywhere differentiablity for monotone functions:  

> **Theorem 20** *A monotone function $ {F:\\mathbb{R}\\rightarrow\\mathbb{R}}$ is differentiable almost everywhere.*

Much as we have Jordan decomposition for a signed measure, we have a decomposition result saying that any function of *bounded variation* can be written as a difference of two monotone functions. And thus the almost everywhere differentiablity extends to the function class of bounded variation. These "variations'' for both functions and measures are obviously related, via the Lebesgue-Radon-Nikodym theorem, which is manifested in the construction of *Lebesgue-Stieltjes measure*.  

For a discussion for the situation in $\\mathbb{R}$, I find this [note](https://www.math.ucdavis.edu/~hunter/m218a_09/ch3A.pdf) by Hunter amusing.
