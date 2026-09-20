---
id: 2016-09-14-real-analysis-abstract-integration-theory
title: "Real Analysis: Abstract Integration Theory"
date: 2016-09-14
tags: ["measure theory", "real analysis"]
source: https://sylqiu.blogspot.com/2016/09/real-analysis-abstract-integration.html
publish: true
---
In analysis one often makes use of a sequence to study the limiting process in some space, and consequently *countable* set-theoretic operations are inevitable. We would like a space that is stable under such operations, thus follows the definition of a *$ {\\sigma}$-algebra* :  

> **Definition 1** *A *$ {\\sigma}$-algebra* on a *set* $ {X}$ is a subset $ {\\mathfrak{M}}$ of $ {\\mathcal{P}(X)}$ that satisfies*  
> 
> *-   $ {X\\in\\mathfrak{M}}$;
> -   If $ {A\\in\\mathfrak{M}}$, then $ {A^{c}=\\left(X-A\\right)\\in\\mathfrak{M}}$;
> -   If $ {\\{A\_{i}\\}\_{i=1}^{\\infty}}$ is a countable family of elements in $ {A}$, then $ {\\cup\_{i}A\_{i}\\in\\mathfrak{M}}$.*
> 
> *Elements of $ {\\mathfrak{M}}$ are called *measurable sets*.*

Here the letter "$ {\\sigma}$'' refers to the German word "summe'', an abbreviation for "countable". Since $ {\\cap\_{i}A\_{i}=\\left(\\cup\_{i}A\_{i}^{c}\\right)^{c}}$, it follows that a $ {\\sigma}$-algebra is also stable under countable intersections.  

A set $ {X}$ with a $ {\\sigma}$-algebra is called a *measurable space*. It is not necessarily a *topological space*, for instance in probability theory. Measure theory allows us to do integration on *any set*, provided on which a $ {\\sigma}$-algebra is constructed.  

However, from the Riemann integration theory one already notices a profound relation between the topological property of a function between topological spaces, viz. *continuity* and its *Riemann integrability*. Roughly speaking, over a compact set, the extent of discontinuity is the only obstruction to the Riemann integrability. For example, the characteristic function $ {\\chi\_{\\mathbb{Q}\\cap\[0,1\]}}$ of rational numbers in the unit interval is not Riemann integrable. But it is rather unsatisfactory, since the rational numbers is only a small "portion'' of the interval (it is countable), although wherein it is *dense*, in the sense that to each $ {p\\in\[0,1\]}$ there is a sequence of rational numbers getting arbitrarily close.  

In this note we will explore some general basic notions in abstract integration theory, following an axiomatic approach. This means we won't care about explicit constructions of $ {\\sigma}$-algebra and measures at the moment. Construction of a $ {\\sigma}$-algebra on a space will be discussed by a following chapter, also a more general notion of $ {L^{1}}$-integrability, as *the completion* of the notion of Riemann integrability. This completion is a special case in light of the *unique continuous extension theorem* in Banach spaces.  

We can already define a desirable kind of mappings in this axiomatic setting.  

   **1.1. Definition of a Measurable Mapping**     

  Let us begin with a set-theoretic property that we will often encounter. Let $ {f:A\\rightarrow B}$ be any mapping, $ {C,D\\subset B}$. It follows from the *definition* of a mapping that \\begin{eqnarray} f^{-1}(C\\cap D) & =f^{-1}(C)\\cap f^{-1}(D); \\\\ f^{-1}(C\\cup D) & =f^{-1}(C)\\cup f^{-1}(D). \\end{eqnarray} In fact, for *any* collection of subsets in $ {B}$ the above will hold. Thus a mapping is well-behaved in terms of preimages with respect to set-theoretic operations, which will be exploited throughout.

> **Definition 2** *Let $ {X}$ be a measurable space, $ {Y}$ be a topological space, and $ {f:X\\rightarrow Y}$. $ {f}$ is said to be *measurable* if for every open set $ {G\\subset Y}$, $ {f^{-1}(G)}$ is measurable.*

Denote by $ {F\_{\\sigma}}$ to be the collection of sets obtained by countable union of closed sets, by $ {G\_{\\delta}}$ to be the collection of sets obtained by countable intersection of open sets. Here, "$ {F}$'' stands for the French word "fermé'', meaning "closed'', and "$ {G}$'' stands for the German "geöffenet'', meaning "open'', and "$ {\\delta}$'' for "durchschnitt'', meaning "intersection''. All such sets are called *Borel sets*, forming the *Borel $ {\\sigma}$-algebra* $ {\\mathcal{B}\_{Y}}$ of the topological space $ {Y}$.  

Thus it is equivalent to say:  

> **Proposition 3** *A function is measurable if for every Borel set $ {B\\in\\mathcal{B}}$ , $ {f^{-1}(B)}$ is measurable. In particular, if $ {f\_{n}:X\\rightarrow\[-\\infty,\\infty\]}$ is measurable for each $ {n=1,2,\\dots}$, then*  
> 
> *$ \\displaystyle g=\\sup\_{n\\geq1}f\_{n},h=\\limsup\_{n\\rightarrow\\infty}f\_{n} $*
> 
> *are measurable.*

We see that the limit of a pointwise convergent sequence of measurable functions is also measurable    in contrast to the limiting behavior of continuous functions, measurable functions are much better, thanks in large to the set-theoretic property of preimages and the definition of $ {\\sigma}$-algebra.  

There is somewhat asymmetry in the definition of a measurable function. A mapping $ {g:Y\\rightarrow Z}$ between two topological spaces is said to be *Borel* if for every $ {B\\in\\mathcal{B}\_{Z}}$, $ {g^{-1}(B)\\in\\mathcal{B}\_{Y}}$. Continuous mappings fall into this category. One can show the mapping  

$ \\displaystyle g\\circ f:X\\rightarrow Z $

is measurable. This is not true general, however, even when $ {g}$ is a measurable mapping.  

Now we are interested in the space of all measurable mappings from $ {X}$ to the extended reals $ {\\hat{\\mathbb{R}}=\[-\\infty,\\infty\]}$. The strategy to study it is to first study a simpler subset that is *dense*.  

   **1.2. Simple functions**   

> **Definition 4** *A *simple function* on a measurable space $ {X}$ is of the form*  
> 
> *$ \\displaystyle s=\\sum\_{i=1}^{n}\\alpha\_{i}\\chi\_{A\_{i}}, $*
> 
> *where $ {A\_{i}}$'s are measurable sets in $ {X}$, and $ {\\alpha\_{i}\\in\[0,\\infty)}$.* 

Note that we don't allow $ {\\infty}$ to be taken by a simple function.  

Since a simple function only takes finitely number of values, it immediately follows that any simple function is measurable.  

In contrast to Riemann's approach to approximating a function, where domain of the function to be approximated is divided into boxes, we subdivide the range of the function into boxes (intervals). This has the advantage that, the preimage of each sub-interval is measurable, and thus can be approximated by simple functions. It can be easily arranged to be an approximation from below. We summarise it as  

> **Theorem 5** *[](https://www.blogger.com/null)Let $ {f:\\rightarrow\[0,\\infty\]}$ be measurable. There exists a sequence of incresing simple functions such that $ {s\_{n}\\nearrow f}$ pointwisely.*

For any measurable function $ {f:X\\rightarrow\[-\\infty,\\infty\]}$, define  

$ \\displaystyle f^{+}=\\max\\{f,0\\},f^{-}=\\max\\{-f,0\\}. $

We have $ {f=f^{+}-f^{-}}$and $ {|f|=f^{+}+f^{-}}$. We infer that  

> **Theorem 6** *The space of simple functions on $ {X}$ is dense in the space of measurable functions on $ {X}$.*

Since the addition $ {+:\\hat{\\mathbb{R}}\\times\\hat{\\mathbb{R}}\\rightarrow\\hat{\\mathbb{R}}}$ and scalar multiplication $ {\\cdot:\\mathbb{R}\\times\\hat{\\mathbb{R}}\\rightarrow\\hat{\\mathbb{R}}}$ are continuous, we can pass the addition and scalar multiplication of simple functions to the limit, provided that the limit is also real-valued. This shows  

> **Proposition 7** *The space of **real-valued** measurable functions on $ {X}$ is a real vector space.*

Of course, everything can be extended easily to the complex-valued setting.  

   **1.3. Positive Measures**   

We continue with an axiomatic approach to integration.  

> **Definition 8** *A *(positive) measure* is a set function $ {\\mu:\\mathfrak{M}\\rightarrow\[0,\\infty\]}$ and which is *countably additive*: if $ {\\{A\_{i}\\}}$ is a **disjoint** countable collection of measurable sets, then*  
> 
> *$ \\displaystyle \\mu(\\bigcup\_{i=1}^{\\infty}A\_{i})=\\sum\_{i=1}^{\\infty}\\mu(A\_{i}). $*
> 
> *The case where all sets are set to have measure $ {\\infty}$ is discarded. $ {(X,\\mathfrak{M},\\mu)}$ is called a measure space.*

The following theorem is more general than it may seem.  

> **Theorem 9** *[](https://www.blogger.com/null)(Monotone convergence and Dominated convergence:positive measure case)*  
> 
> *-   If $ {A=\\bigcup\_{n=1}^{\\infty}A\_{n}}$ and $ {\\{A\_{n}\\}}$ is an ascending seqeunce:
>     
>     $ \\displaystyle A\_{1}\\subset A\_{2}\\subset\\cdots, $
>     
>     then $ {\\mu(A\_{n})\\rightarrow\\mu(A)}$ as $ {n\\rightarrow\\infty}$.
> -   If $ {A=\\bigcap\_{n=1}^{\\infty}A\_{n}}$ and $ {\\{A\_{n}\\}}$ is a descending seqeunce:
>     
>     $ \\displaystyle A\_{1}\\supset A\_{2}\\supset\\cdots, $
>     
>     and $ {\\mu(A\_{1})}$ is finite, then $ {\\mu(A\_{n})\\rightarrow\\mu(A)}$ as $ {n\\rightarrow\\infty}$.*

*Proof:* For the monotone convergence, we break the ascending sequence into a sequence of disjoint sets by setting $ {B\_{n}=A\_{n}-A\_{n-1}}$ and $ {A\_{0}=\\emptyset}$. We have $ {A=\\bigcup\_{n=1}^{\\infty}B\_{n}}$ Countable additivity implies  

$ \\displaystyle \\mu(A)=\\sum\_{n=1}^{\\infty}\\mu(B\_{n}). $

But $ {\\mu(A\_{n})=\\sum\_{i=1}^{n}\\mu(B\_{n})}$. For the dominated convergence, we notice that the sequence of sets consisting of  

$ \\displaystyle C\_{n}=A\_{1}-A\_{n} $

is ascending. Hence by monotone convergence we have  

$ \\displaystyle \\mu(A\_{1})-\\mu(A)=\\mu(A\_{1})-\\lim\_{n\\rightarrow\\infty}\\mu(A\_{n}). $

Cancellation can be done only if $ {\\mu(A\_{1})}$ is finite. $ \\Box$  

   **1.4. Lebesgue Integration**   

Now we can define integration for simple functions. Just set  

$ \\displaystyle \\int\_{E}sd\\mu:=\\sum\_{i=1}^{n}\\alpha\_{i}\\mu(A\_{i}\\cap E). $

> **Remark 1** *If $ {\\alpha\_{k}=0}$ and $ {\\mu(A\_{k}\\cap E)=\\infty}$, by the arithmetic rule we imposed on $ {\\hat{\\mathbb{R}}}$ we have $ {\\alpha\_{k}\\cdot\\mu(A\_{k}\\cap E)=0}$.*

Here is a first result that explains what Theorem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Monotone-convergence-and) can be applied quite generally:  

> **Proposition 10** *[](https://www.blogger.com/null)If $ {s\\geq0}$, then $ {\\varphi(E)=\\int\_{E}sd\\mu}$ for $ {E\\in\\mathfrak{M}}$ defines a measure on $ {\\mathfrak{M}}$.*

> **Definition 11** *(Lebesgue integral of positive functions) If $ {f:X\\rightarrow\[0,\\infty\]}$ is measurable, and $ {E\\in\\mathfrak{M}}$, the Lebesgue integral of $ {f}$ over $ {E}$ with respect to the measure $ {\\mu}$ is defined by*  
> 
> *$ \\displaystyle \\int\_{E}fd\\mu=\\sup\_{0\\leq s\\leq f}\\int\_{E}sd\\mu. $*

This definition has exploited Theorem [5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm5).  

> **Remark 2** If $ {f(x)=\\infty}$ for all $ {x\\in E}$ and $ {\\mu(E)=0}$, then $ {\\int\_{E}f=0}$. We call such set $ {E}$ *a *null set*.* Given a $ {\\sigma}$-algebra $ {\\mathfrak{M}}$ with measure $ {\\mu}$, and a null set $ {E}$, it may happen that there is a subset $ {E'\\subset E}$ such that $ {E'\\notin\\mathfrak{M}}$. We can include such sets to form a new $ {\\sigma}$-algebra $ {\\tilde{\\mathfrak{M}}}$ and define the measure of such sets to be zero. $ {\\tilde{\\mathfrak{M}}}$ is called the completion of $ {\\mathfrak{M}}$. An ordinality argument shows that there are lot of such null sets, cf. \[R\].  
> As a consequence, regarding to integration with a measure one can define the function in an arbitrary manner on any null set, without affecting the integral. And furthermore, measurable functions on some measure space differing by a null set form an equivalence class. It is therefore convenient to consider the classes defined by the functions, rather the functions themselves, and it is convenient to speak of some property holds "almost everywhere", abbr. a.e. and left the null set unspecified.

Combining Proposition [10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop10) and Theorem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Monotone-convergence-and), we have  

> **Theorem 12** *(Lebesgue Monotone Convergence)*  
> *If$ {\\{f\_{n}\\}}$ is a sequence of measurable functions on $ {X}$ such that $ {0\\leq f\_{n}\\nearrow f}$ , then*  
> 
> *$ \\displaystyle \\int\_{X}f\_{n}d\\mu\\rightarrow\\int\_{X}fd\\mu $*
> 
> *as $ {n\\rightarrow\\infty}$.*

*Proof:* There exists $ {\\alpha\\in\[0,\\infty\]}$ such that $ {\\int\_{X}f\_{n}d\\mu\\rightarrow\\alpha}$ as it is a monotone sequence of positive numbers. Since $ {f\_{n}\\leq f}$ for all $ {n}$, we have $ {\\int\_{X}f\_{n}d\\mu\\leq\\int\_{X}fd\\mu}$, and hence  

$ \\displaystyle \\alpha\\leq\\int\_{X}fd\\mu. $

To show the other direction of the inequality, we Let $ {0\\leq s\\leq f}$ be a simple function, which can be arbitrarily close to $ {f}$. Let $ {E\_{n}=\\{x\\in X:f\_{n}(x)\\geq cs(x)\\}}$ where $ {0<c<1}$. It follows that $ {\\int\_{X}f\_{n}d\\mu\\geq\\int\_{E\_{n}}f\_{n}d\\mu\\geq c\\int\_{E\_{n}}sd\\mu}$. Since $ {f\_{n}\\nearrow f}$, the sequence $ {\\{E\_{n}\\}}$ is ascending and  

$ \\displaystyle X=\\bigcup\_{n=1}^{\\infty}E\_{n}. $

Since $ {sd\\mu}$ is a measure, Theorem [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Monotone-convergence-and) implies  

$ \\displaystyle \\int\_{E\_{n}}sd\\mu\\rightarrow\\int\_{X}sd\\mu $

as $ {n\\rightarrow\\infty}$. But then  

$ \\displaystyle \\alpha=\\int\_{X}f\_{n}d\\mu\\geq c\\int\_{X}sd\\mu $

for any $ {0<c<0}$. Hence $ {\\alpha\\geq\\int\_{X}sd\\mu}$. Since $ {0\\leq s\\leq f}$, we conclude that $ {\\alpha\\geq\\int\_{X}fd\\mu}$. $ \\Box$  

> **Corollary** *Suppose $ {f:\[0,\\infty\]}$ is measurable. Let $ {\\varphi(E)=\\int\_{E}fd\\mu}$ for each $ {E\\in\\mathfrak{M}}$. Then $ {\\varphi}$ is a positive measure.*

*Proof:* Suppose $ {E=\\bigsqcup\_{i=1}^{\\infty}E\_{i}}$ is a joint union of measurable sets. Then the functions $ {f\_{n}=\\sum\_{i=1}^{n}\\chi\_{E\_{i}}}$are such that $ {0\\leq f\_{n}\\nearrow\\chi\_{E}}$. $ \\Box$  

In general, a sequence of non-negative functions that is a.e. convergent need not be convergent in integrals, but it is always at least as large.  

> **Theorem 13** *(Fatou's lemma)*  
> *If $ {f\_{n}:X\\rightarrow\[0,\\infty\]}$ is a sequence of measurable functions, then*  
> 
> *$ \\displaystyle \\int\_{X}(\\liminf\_{n\\rightarrow\\infty}f\_{n})d\\mu\\leq\\liminf\_{n\\rightarrow\\infty}\\int\_{X}f\_{n}d\\mu. $*
> 
> *In particular, if $ {0\\leq f\_{n}\\rightarrow f}$ a.e., then $ {\\int\_{X}fd\\mu\\leq\\liminf\_{n\\rightarrow\\infty}\\int\_{X}f\_{n}d\\mu}$.*

*Proof:* Let $ {g\_{k}=\\inf\_{n\\geq k}f\_{n}}$. It is measurable and $ {g\_{k}\\leq f\_{k}}$ . Thus $ {\\int\_{X}g\_{k}d\\mu\\leq\\int\_{X}f\_{k}d\\mu}$. Since $ {0\\leq g\_{k}\\nearrow\\liminf f}$, we conclude from the monotone convergence theorem that  
\\begin{eqnarray} \\int\_{X}\\lim\_{k\\rightarrow\\infty}g\_{k}d\\mu &=&\\int\_{X}(\\liminf\_{n\\rightarrow\\infty}f\_{n})d\\mu \\\\ & \\leq & \\liminf\_{n\\rightarrow\\infty}\\int\_{X}f\_{n}d\\mu. \\end{eqnarray} $ \\Box$  

> **Definition 14** *An extended real-valued measurable functions $ {f}$ on $ {X}$ is said to be *integrable* if*  
> 
> *$ \\displaystyle \\int\_{X}|f|d\\mu<\\infty. $*
> 
> *We define $ {L^{1}(\\mu)}$ to be the space of all such functions.*  *The definition f**or complex valued measurable functions follows the same idea.*

To extend the definition of integral to all integrable functions, we need the following result.  

> **Theorem 15** *Suppose $ {f,g\\in L^{1}(\\mu)}$, and $ {\\alpha,\\beta}$ are constants. Then $ {\\alpha f+\\beta g\\in L^{1}(\\mu)}$ and $ {\\int\_{X}\\left(\\alpha f+\\beta g\\right)d\\mu=\\alpha\\int\_{X}fd\\mu+\\beta\\int\_{X}gd\\mu}$.*

Then for integrable $ {\\hat{\\mathbb{R}}}$-valued measurable function $ {f}$, just set  

$ \\displaystyle \\int\_{X}fd\\mu=\\int\_{X}f^{+}d\\mu-\\int\_{X}f^{-}d\\mu. $

> **Theorem 16** *(Lebesgue dominated covergence)*  
> *Let $ {f\_{n}:X\\rightarrow\[-\\infty,\\infty\]}$ be a sequence of measurable functions a.e. coverging to $ {f:X\\rightarrow\[-\\infty,\\infty\]}$, such that each $ {|f\_{n}|\\leq g}$ where $ {g\\in L^{1}(\\mu)}$ . Then $ {f\\in L^{1}(\\mu)}$ and*  
> 
> *$ \\displaystyle \\int\_{X}f\_{n}d\\mu\\rightarrow\\int\_{X}fd\\mu. $*

*Proof:* It is obvious that $ {|f|\\le g}$. Hence $ {f\\in L^{1}(\\mu)}$.  
By triangle inequality, $ {|f-f\_{n}|\\leq2g}$. Since $ {|f-f\_{n}|\\rightarrow0}$, by Fatou's lemma, \\begin{eqnarray} \\int\_{X}2gd\\mu & \\leq &\\liminf\\int\_{X}(2g-|f-f\_{n}|)d\\mu \\\\ & =& \\int\_{X}2gd\\mu+\\liminf\\int\_{X}\\left(-|f-f\_{n}|\\right)d\\mu. \\end{eqnarray} Since $ {g\\in L^{1}(\\mu)}$, we can cancel the term $ {\\int\_{X}2gd\\mu}$ and obtain  

$ \\displaystyle \\liminf\\int\_{X}\\left(-|f-f\_{n}|\\right)d\\mu\\geq0. $

Since the integrand is always non-positive, we conclude that  

$ \\displaystyle \\lim\\int\_{X}|f\_{n}-f|d\\mu=0. $

Since $ {\\left|\\int\_{X}f\_{n}d\\mu-\\int\_{X}fd\\mu\\right|\\leq\\int\_{X}|f\_{n}-f|d\\mu}$, the result follows. $ \\Box$  

Note: This is written in Latex and then translated to html using the really nice [program](https://lucatrevisan.wordpress.com/latex-to-wordpress/) which produces Terry style formatting. The reference is \[R\]:Rudin., Real and Complex Analysis. I thought it is helpful for me to write out some major points.
