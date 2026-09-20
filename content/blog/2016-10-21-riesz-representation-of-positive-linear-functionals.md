---
id: 2016-10-21-riesz-representation-of-positive-linear-functionals
title: "Riesz Representation of Positive Linear Functionals"
date: 2016-10-21
tags: ["functional analysis", "real analysis"]
source: https://sylqiu.blogspot.com/2016/10/riesz-representation-of-positive-linear.html
publish: true
---
Recall that a measure space consists of three basic components: a set $ {X}$; a $ {\\sigma}$-algebra $ {\\mathfrak{M}}$ on $ {X}$; a (positive, or unsigned) measure $ {\\mu:\\mathfrak{M}\\rightarrow\[0,+\\infty\]}$. If $ {X}$ is a *topological space*, then there is another way than outer measures to construct measurable sets and measures, namely via the celebrated *Riesz representation theorem*.  

With a *topology* on $ {X}$ and some extra assumptions on it, one can start with evaluating integrals of *continuous functions* over compact sets using *piecewise constant functions*, i.e. Riemann integration. This first contruction is more *natural* as for the topological space $ {X}$, in the sense that one does NOT need extra data, compared to evaluating integrals using simple finctions, presuming the construction of measurable sets on $ {X}$.  

It is of interest to ask whether one can *complete* this "Riemann model'' to the "Lebesgue model'' in a standard way; the answer is affirmative, given by the Riesz representation, and even more is true.  

Taking a slight abstraction, the data of the "Riemann model'' can be thought of as a *positive linear functional* as follows. Denote by $ {C\_{c}(X)=C\_{c}(X\\rightarrow\\mathbb{R})}$ to be the space of real-valued continuous functions with compact support in $ {X}$. A linear functional $ {\\Lambda:C\_{c}(X)\\rightarrow\\mathbb{\\mathbb{R}}}$ is said to be *positive* if  

$ \\displaystyle \\Lambda f\\geq0\\text{ whenever }f\\geq0. $

Given any open subset $ {G\\subset X}$, consider the class of continuous functions $ {f}$ such that $ {0\\leq f\\leq1}$ on $ {G}$ and $ {f=0}$ outside of $ {G}$, denoted by $ {f\\prec G}$. To get some idea, we can first define the "measure'' of the set $ {G}$ by[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu(G)=\\sup\_{f\\prec G}\\Lambda f.\\tag{$\\star$} \\ \\ \\ \\ \\ $](https://www.blogger.com/null)

[](https://www.blogger.com/null)In fact, one can use open sets as a gauge to construct an outer measure using the above definition. The Riesz representation theorem says that there corresponds a unique *unsigned Borel measure* that "does the same thing'' with the linear functional. Notice that an unsigned Borel measure can be obviously ensembled to be a linear functional.  

However, it is rather intricate to find the right condition for the sets to be measurable (in the sense of Caratheodory). The main techinical issue in developing this machinary is, not surprisingly, topological.  

In the following, I shall follow both of the Rudin's book \[R\] and [Terry's notes.](https://terrytao.wordpress.com/category/teaching/245b-real-analysis/)  

#### 

**

**1\. Urysohn's lemma**

**

Let $ {X}$ be a topological space. It is not always possible to approximate the indicator function of a closed set using continuous functions in a reasonable way. However, we do have a characterization of when it is possible.  

> **Lemma 1** *(Urysohn) The following are equivalent:*  
> 
> *-   Every pair of disjoint closed sets $ {F\_{1},F\_{2}}$ in $ {X}$ can be separated by disjoint open neighborhoods $ {G\_{1}\\supset F\_{1}}$, $ {G\_{2}\\supset F\_{2}}$.
> -   For every closed set $ {F}$ in $ {X}$ and every open neighborhood $ {G}$ of $ {F}$, there exists a continuous function $ {f:X\\rightarrow\[0,1\]}$ such that
>     
>     $ \\displaystyle \\chi\_{F}(x)\\leq f(x)\\leq\\chi\_{G}(x), $
>     
>     for which we will also write $ {F\\prec f\\prec G}$.*

A topological space satisfying one of the above properties is said to be *normal*.  
*Proof:* Assume the first statement. By noticing that the complement of open set is closed, it is equivalent to the statement for every closed set $ {{F\_{1}}}$ in $ {X}$ and every open neighborhood $ {G\_{0}}$ of $ {F\_{1}}$, there exists an open set $ {G\_{1/2}}$ and a closed set $ {F\_{1/2}}$ such that  

$ \\displaystyle F\_{1}\\subset G\_{1/2}\\subset F\_{1/2}\\subset G\_{0}. $

We can continue  

$ \\displaystyle {F\_{1}\\subset G\_{3/4}\\subset F\_{3/4}\\subset G\_{1/2}\\subset F\_{1/2}\\subset G\_{1/4}\\subset F\_{1/4}\\subset G\_{0}}, $

and so on. In the iteratrions we have the indices for each $ {G\_{q}\\subset F\_{q}}$ are just dyadic rationals between $ {\[0,1\]}$. Define  

$ \\displaystyle f(x)=\\sup\_{x\\in G\_{q}}q=\\inf\_{x\\in F\_{q}}q. $

Since dyadic rationals are dense in $ {\[0,1\]}$, we have for $ {a\\in\[0,1\]}$, sets such as  

$ \\displaystyle \\begin{array}{rcl} f^{-1}(x>a) & = & \\bigcup\_{q>a}G\_{q}\\\\ f^{-1}(x<a) & = & X-\\bigcap\_{q<a}F\_{q} \\end{array} $

are open, and consequently $ {f}$ is continuous. Conversely, the second statement is equivalent to that for every pair of disjoint closed sets $ {F\_{1},F\_{2}}$, there is a continuous function $ {f:X\\rightarrow\[0,1\]}$ such that $ {f=1}$ on $ {F\_{1}}$ and $ {f=0}$ on $ {F\_{2}}$. Then the sets $ {f^{-1}(x>2/3)}$ and $ {f^{-1}(x<1/3)}$ are open and disjoint, and containing $ {F\_{1}}$ and $ {F\_{2}}$ respectively.$ \\Box$  

> **Remark 1** A topological space $ {X}$ being normal is a *separation property*, viz. the ability to distinguish distinct sets via *topological methods*. It turns out that the study of separation properties is a quite delicate matter. For instance, listed in an order of increasing strength, two subsets $ {A,B}$ are said to be *separated* if each is disjoint from the other's closure; to be *separated by neighborhoods* if they have disjoint neighborhoods; to be *separated by closed neighborhoods*; to be *separated by continuous function* if there exists a continuous function from $ {X}$ to $ {\\mathbb{R}}$ taking distinct constant values on each set; to be *precisely separated by continuous functions* if there exists a continuous function with each pre-image of two distinct singleton being exactly each set respectively. Urysohn's lemma thus establishes the equivalence between the separation of closed sets by neighborhoods and by continuous functions.

A topological space is said to be *Hausdorff* if two distinct points can be separated by neighborhoods. Clearly, if $ {X}$ is normal and every point in it is closed, then $ {X}$ is also Hausdorff. Unfortunately, the converse it not true. However, for compact ones we do have:  

> **Lemma 2** *[](https://www.blogger.com/null)A compact Hausdorff space is normal.*

The Hausdorff property can well be extended to subspaces of a Hausdorff space, while the normal property CANNOT.  

Now back to the "Riemann model''. Besides separation property, as in integration on $ {\\mathbb{R}^{n}}$ we would also require some local "smallness'' for the space, so that the integration makes sense at least locally. A property in this respect is *locally compactness*. Now we have our model space of study.  

> **Definition 3** *A topological space $ {X}$ is said to be *locally compact Hausdorff*, abbr. *LCH*, if $ {X}$ is Hausdorff, and every point in $ {X}$ has a neighborhood with compact closure, i.e. a *relatively compact* neighborhood.*

In light of Lemma [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemA-compact-Hausdorff), one can establish a Urysohn type of result for LCH spaces.  

> **Lemma 4** *(Urysohn's lemma)[](https://www.blogger.com/null)Let $ {X}$ be a LCH space, $ {K\\subset X}$ a compact subset, and $ {G}$ be a open neighborhood of $ {K}$. Then there exists a function $ {f\\in C\_{c}(X)}$ such that $ {K\\prec f\\prec G}$.*

*Proof:* Let $ {U\_{x}}$ be a open neighborhood of $ {x}$ with compact closure. Then the collection $ {\\{U\_{x}\\}\_{x\\in K}}$ forms an open cover of $ {K}$. Since $ {K}$ is compact, there exists a finite subfamily $ {\\{U\_{1},\\dots,U\_{N}\\}}$ that forms a cover of $ {K}$, whose union has compact closure. Let $ {G'=\\bigcup\_{n=1}^{N}U\_{n}\\cap G}$. Then $ {\\overline{G'}}$ is a compact Hausdorff space. Now apply Lemma [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemA-compact-Hausdorff) to get a continuous function $ {f}$ on $ {\\overline{G'}}$, and define $ {f=0}$ outside of $ {\\overline{G'}}$. $ \\Box$  

Here we see that LCH spaces are desirable for approximation using functions in $ {C\_{c}(X)}$.  

Sometimes it is convenient to have spaces that allows us to extend local construction globally, using *partition of unity*. The property we need in addition is that the open cover $ {\\{U\_{\\alpha}\\}\_{\\alpha\\in A}}$ is *finitely overlapping*, meaning that every $ {x\\in X}$ belongs to at most finitely many $ {U\_{\\alpha}}$. Topological spaces that have for every open cover a finitely overlapping refinement will be called *paracompact*. The construction of partition of unity follows straightforwardly from Lemma [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemLCH%20urysohn).  

> **Lemma 5** *Let $ {X}$ be a LCH space, and let $ {\\{U\_{\\alpha}\\}\_{\\alpha\\in A}}$ be an open cover of $ {X}$ such that each $ {U\_{\\alpha}}$ is relatively compact, and the cover is finitely overlapping. Then there exists a family of continuous functions $ {\\{f\_{\\alpha}\\}\_{\\alpha\\in A}}$ such that each $ {f\_{\\alpha}}$ has support contained in $ {U\_{\\alpha}}$, and*  
> 
> *$ \\displaystyle \\sum\_{\\alpha\\in A}f\_{\\alpha}(x)=1 $*
> 
> *for all $ {x\\in X}$.*

#### **2\. the Riesz representation theorem and regularity of Borel measures**

Now we are ready to build up the machinery that *completes* the "Riemann model'' to the "Lebesgue model'' on a LCH space $ {X}$. The "Lebesgue model'' here refers to a measure space $ {(X,\\mathfrak{M},\\mu)}$ such that $ {\\mu}$ restricts to a *Borel measure*. Recall that the *Borel $ {\\sigma}$-algebra* on $ {X}$ is the smallest $ {\\sigma}$-algebra on $ {X}$ that contains all the open sets in $ {X}$.  

> **Definition 6** *(Unsigned Borel Measure) Let $ {X}$ be a LCH space. A measure $ {\\mu:\\mathcal{B}\\rightarrow\[0,+\\infty\]}$ is called *Borel* if $ {\\mathcal{B}}$ is the Borel $ {\\sigma}$-algebra on $ {X}$.*

As we will see later, $ {X}$ being merely LCH will give rise to some *regularity issues* of the constructed Borel measure. So addtionally we need assume $ {X}$ to be *$ {\\sigma}$-compact* so that these regularity issues disappear. It is thus useful to have the following definiton:  

> **Definition 7** *(Unsigned Radon Measure, regularity) Let $ {X}$ be a LCH space that is also $ {\\sigma}$-compact, and let $ {\\mathcal{B}}$ be the Borel $ {\\sigma}$-algebra. An *unisigned Radon measure* is a unsigned Borel measure $ {\\mu:\\mathcal{B}\\rightarrow\[0,+\\infty\]}$ with the following regularity properties:*  
> 
> *-   (Local finiteness) For any compact subset $ {K}$ of $ {X}$, $ {\\mu(K)}$ is finte;
> -   (Outer regularity) For any Borel set $ {E\\in\\mathcal{B}}$ , $ {\\mu(E)=\\inf\\{\\mu(G):G\\supset E,\\text{ and }G\\text{ open}\\}}$;
> -   (Inner regularity) For any Borel set $ {E\\in\\mathcal{B}}$, $ {\\mu(E)=\\sup\\{\\mu(K):K\\subset E,\\text{ and }K\\text{ compact}\\}}$.*

> **Remark 2** *Note that in the construction of outer measures, outer regularity is built-in for *any* set. There also exist constructions of Radon measures on spaces that are not $\\sigma$-compact or not LCH, but we will not touch this point.*

Now we start our construction. Given a positive linear functional $ {\\Lambda:C\_{c}(X)\\rightarrow\\mathbb{R}}$, for every open set $ {G\\subset X}$, we define as in ([$\\star$](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)):[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu(G)=\\sup\_{f\\prec G}\\Lambda f. \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Positivity of $ {\\Lambda}$ implies the monotonicity of $ {\\mu}$ on open sets. Using open sets as a gauge, we can define for every subset $ {E\\subset X}$ an outer measure,[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu(E)=\\inf\\{\\mu(G):G\\supset E,\\text{ and }G\\text{ open}\\}. \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)The countable sub-additivity of $ {\\mu}$ thus follows from this definition. As Caratheodory's measurability suggests, we need sets that can be "approximated from below'', i.e. those inner regular ones to form a $ {\\sigma}$-algebra and thus a measure space. Then by Caratheodory's extension theorem, the measure space will be complete. So define  

$ \\displaystyle \\mathfrak{M}\_{c}=\\{E\\subset X:\\mu(E)<+\\infty\\text{ and }E\\text{ is inner regular}\\}, $

that is, $ {E\\in\\mathfrak{M}\_{c}}$ is such that $ {\\mu(E)<+\\infty}$ and[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu(E)=\\sup\\{\\mu(K):K\\subset E,\\text{ and }K\\text{ compact}\\}. \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and  

$ \\displaystyle \\mathfrak{M}=\\{E\\subset X:E\\cap K\\in\\mathfrak{M}\_{c}\\text{ for all compact }K\\subset X\\} $

> **Theorem 8** *[](https://www.blogger.com/null)(Riesz representation theorem for positive linear functionals; general case) Let $ {X}$ be a LCH space, and $ {\\Lambda:C\_{c}(X)\\rightarrow\\mathbb{R}}$ a positive linear functional. Let $ {\\mu}$ and $ {\\mathfrak{M}}$ be construced as above. Then $ {\\mathfrak{M}}$ is a complete $ {\\sigma}$-algebra containing the Borel $ {\\sigma}$-algebra $ {\\mathcal{B}}$, and $ {\\mu}$ is the unique measure on $ {\\mathfrak{M}}$ such that $ {\\Lambda=I\_{\\mu}}$, i.e. for any $ {f\\in C\_{c}(X)}$,[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\Lambda f=\\int\_{X}fd\\mu. \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)In addition, $ {\\mu}$ is locally finite, outer regular for all $ {E\\in\\mathfrak{M}}$ and inner regular for every open set and every $ {E\\in\\mathfrak{M}}$ such that $ {\\mu(E)<\\infty}$.*

*Proof:* Let us first prove the uniqueness part. Since Property ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) holds for every open set and every set of finite measure, it suffices to prove that whenever $ {\\mu\_{1}}$ and $ {\\mu\_{2}}$ satisfy the theorem, then  

$ \\displaystyle \\mu\_{1}(K)=\\mu\_{2}(K) $

for all $ {K}$ compact. Fix $ {K}$ and $ {\\epsilon>0}$, there exists an open set $ {G\\subset X}$ such that  

$ \\displaystyle \\mu\_{2}(K)+\\epsilon>\\mu\_{2}(G). $

By Urysohn's lemma, there exists a continuous function such that $ {K\\prec f\\prec G}$. Hence  

$ \\displaystyle \\begin{array}{rcl} \\mu\_{1}(K)=\\int\_{X}\\chi\_{K}d\\mu & \\leq & \\int\_{X}fd\\mu\_{1}\\\\ & = & \\int\_{X}fd\\mu\_{2}\\\\ & \\leq & \\int\_{X}\\chi\_{G}d\\mu\_{2}\\\\ & = & \\mu\_{2}(G)<\\mu\_{2}(K)+\\epsilon. \\end{array} $

Exchanging the role of $ {\\mu\_{1}}$ and $ {\\mu\_{2}}$, and since $ {\\epsilon}$ is arbitrary, we get $ {\\mu\_{1}=\\mu\_{2}}$.  

It is clear that defining $ {\\mu(E)}$ by ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) gives us an outer measure. And from ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), if $ {K}$ is compact and $ {K\\prec f}$, letting $ {G\_{a}=f^{-1}(x>a)}$, we have  

$ \\displaystyle \\mu(K)\\leq\\mu(G\_{a})=\\sup\_{g\\prec G\_{a}}\\Lambda g\\leq a^{-1}\\Lambda f. $

Taking $ {a\\rightarrow1}$, we have $ {\\mu(K)\\leq\\Lambda f}$ and hence $ {\\mu}$ is also locally finite. In fact, we have  

$ \\displaystyle \\mu(K)=\\inf\\{\\Lambda f:K\\prec f\\} $

for $ {K}$ compact.  Indeed, ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) shows that for any $ {\\epsilon>0}$, there exists $ {G}$ open such that $ {\\mu(K)+\\epsilon>\\mu(G)}$. Using Urysohn's lemma, there exists $ {f\\in C\_{c}(X)}$ such that $ {K\\prec f\\prec G}$. Thus  

$ \\displaystyle \\Lambda f\\leq\\mu(G)<\\mu(K)+\\epsilon. $

Next we show that $ {\\mathfrak{M}}$ is a complete $ {\\sigma}$-algebra containing all Borel sets.  

**Step 1**: $ {\\mathfrak{M}\_{c}}$ contains all open sets of finite measure.  
Let $ {G}$ be open with $ {\\mu(G)<+\\infty}$. To check the inner regularity of $ {G}$, it suffices to find  for any $ {\\epsilon>0}$, a compact $ {K\\subset G}$ such that,  

$ \\displaystyle \\mu(G)<\\mu(K)+\\epsilon. $

Note that by ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) there exists $ {f\\in C\_{c}(X)}$ with $ {f\\prec G}$ such that $ {\\mu(G)<\\Lambda f+\\epsilon}$. Let $ {K}$ be the support of $ {f}$. We have $ {K\\subset G}$, and clearly $ {\\Lambda f\\leq\\mu(K)}$.  

**Step 2**: $ {\\mu}$ is countably additive restricted to $ {\\mathfrak{M}\_{c}}$, and $ {\\mathfrak{M}\_{c}}$ is a Boolean ring, i.e. closed under finite set operations within.  
Suppose $ {E=\\bigcup\_{i=1}^{\\infty}E\_{i}}$, where $ {\\{E\_{i}\\}\_{i=1}^{\\infty}}$ is a collection of mutually disjoint members of $ {\\mathfrak{M}\_{c}}$. We are to show  

$ \\displaystyle \\mu(E)\\geq\\sum\_{i=1}^{\\infty}\\mu(E\_{i}). $

If $ {\\mu(E)=+\\infty}$, there is nothing to prove. Assume $ {\\mu(E)<+\\infty}$. Since $ {E\_{i}}$ can be approximated from below by compact sets (inner regular), we first notice that[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu(K\_{1}\\cup K\_{2})=\\mu(K\_{1})+\\mu(K\_{2}) \\ \\ \\ \\ \\ (6)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for disjoint compact sets $ {K\_{1}}$ and $ {K\_{2}}$. Indeed, we can approximate them using continuous functions: for any $ {\\epsilon>0}$, there is $ {K\_{1}\\cup K\_{2}\\prec g}$ such that ,  

$ \\displaystyle \\Lambda g<\\mu(K\_{1}\\cup K\_{2})+\\epsilon. $

Using Urysohn's lemma, two compact sets can be separated by continuous functions: there is $ {f\\in C\_{c}(X)}$ such that $ {f=1}$ on $ {K\_{1}}$ and $ {f=0}$ on $ {K\_{2}}$ . Then $ {K\_{1}\\prec fg}$ and $ {K\_{2}\\prec(1-f)g}$. Hence  

$ \\displaystyle \\begin{array}{rcl} \\mu(K\_{1})+\\mu(K\_{2}) & \\leq & \\Lambda(fg)+\\Lambda(g-fg)\\\\ & = & \\Lambda g<\\mu(K\_{1}\\cup K\_{2})+\\epsilon. \\end{array} $

Thus ([6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)) is established.  
Let again $ {\\epsilon>0}$. For each $ {E\_{i}}$, there is a compact set $ {K\_{i}\\subset E\_{i}}$ such that  

$ \\displaystyle \\mu(E\_{i})<\\mu(K\_{i})+\\frac{\\epsilon}{2^{i}}. $

Induction on ([6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we obtain  

$ \\displaystyle \\begin{array}{rcl} \\mu(E)\\geq\\mu(\\bigcup\_{i=1}^{n}K\_{i}) & = & \\sum\_{i=1}^{n}\\mu(K\_{i})\\\\ & > & \\sum\_{i=1}^{n}\\mu(E\_{i})-\\epsilon \\end{array} $

for all $ {n>0}$. Thus $ {\\mu}$ is countably additive restricted to $ {\\mathfrak{M}\_{c}}$. This also shows that $ {E\\in\\mathfrak{M}\_{c}}$ when $ {\\mu(E)<+\\infty}$. Now given any $ {E\\in\\mathfrak{M}\_{c}}$, we can approximate it from above and below: if $ {\\epsilon>0}$, there exists $ {K}$ compact and $ {G}$ open such that $ {K\\subset E\\subset G}$ with $ {G-V\\in\\mathfrak{M}\_{c}}$ and $ {\\mu(G-V)<\\epsilon}$. So for any $ {E\_{1},E\_{2}\\in\\mathfrak{M}\_{c}}$, there is $ {G\_{i},K\_{i}}$ as described for $ {i=1,2}$. First, notice that  

$ \\displaystyle E\_{1}-E\_{2}\\subset G\_{1}-K\_{2}\\subset(G\_{1}-K\_{1})\\cup(K\_{1}-G\_{2})\\cup(G\_{2}-K\_{2}). $

It follows that  

$ \\displaystyle \\mu(E\_{1}-E\_{2})\\leq\\epsilon+\\mu(K\_{1}-G\_{2})+\\epsilon. $

Since $ {K\_{1}-G\_{2}}$ is compact, we have $ {E\_{1}-E\_{2}\\in\\mathfrak{M}\_{c}}$. In case of $ {E\_{1}\\cup E\_{2}}$, we can write it as a disjoint union $ {(E\_{1}-E\_{2})\\cup E\_{2}}$ of sets in $ {\\mathfrak{M}\_{c}}$. This shows $ {E\_{1}\\cup E\_{2}\\in\\mathfrak{M}\_{c}}$. Finally,  

$ \\displaystyle {E\_{1}\\cap E\_{2}=E\_{1}-(E\_{1}-E\_{2})\\in\\mathfrak{M}\_{c}}$.

**Step 3**: $ {\\mathfrak{M}}$ is a $ {\\sigma}$-algebra containing all Borel sets.  
Let $ {K}$ be compact and $ {A\\in\\mathfrak{M}}$. First, we have $ {A^{c}\\cap K=K-(A\\cap K)\\in\\mathfrak{M}\_{c}}$. If $ {F}$ is closed in $ {X}$, since $ {F\\cap K}$ is compact, $ {F\\in\\mathfrak{M}}$, in particular $ {X\\in\\mathfrak{M}}$.  
Now it suffices to show closure under countable unions. Suppose $ {\\tilde{E}=\\bigcup\_{i=1}^{\\infty}\\tilde{E}\_{i}}$ where $ {\\tilde{E}\_{i}\\in\\mathfrak{M}}$. Consider the set $ {E\\cap K}$. We want to write it as a disjoint union of sets in $ {\\mathfrak{M}\_{c}}$ so that $ {E\\cap K\\in\\mathfrak{M}\_{c}}$. Hence we define $ {E\_{1}=\\tilde{E}\_{1}\\cap K}$, $ {E\_{n}=(A\_{n}-K)-\\bigcup\_{i=1}^{n-1}E\_{i}}$, and we are done.  

**Step 4**: $ {\\mathfrak{M}\_{c}}$ consists of precisely the sets $ {E\\in\\mathfrak{M}}$ with $ {\\mu(E)<+\\infty}$. Hence $ {\\mu}$ is outer regular for all $ {E\\in\\mathfrak{M}}$ and inner regular for every open set and every $ {E\\in\\mathfrak{M}}$ such that $ {\\mu(E)<\\infty}$. And finally, $ {\\mu}$ satisfies ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)) for all $ {f\\in C\_{c}(X)}$.  
It is clear that $ {\\mathfrak{M}\_{c}\\subset\\mathfrak{M}}$. Let $ {E\\in\\mathfrak{M}}$ with $ {\\mu(E)<+\\infty}$. By definition ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), for any $ {\\epsilon>0}$, there exists an open set $ {G\\supset E}$ with $ {\\mu(G)<\\mu(E)+\\epsilon<\\infty}$. Since $ {G\\in\\mathfrak{M}\_{c}}$, there exists $ {K\\subset G}$ compact such that  

$ \\displaystyle \\mu(G-K)<\\epsilon. $

Since $ {E\\cap K\\in\\mathfrak{M}\_{c}}$, it can be approximated from below by, say, $ {H\\subset E\\cap K}$:  

$ \\displaystyle \\mu(E\\cap K)<\\mu(H)+\\epsilon. $

Thus $ {E}$ can be approximated by $ {H}$ from below:  

$ \\displaystyle \\mu(E)\\leq\\mu(E\\cap K)+\\mu(G-K)<\\mu(H)+2\\epsilon $

and thus $ {E\\in\\mathfrak{M}\_{c}}$. It remains to check ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)). By linearity, it suffices to show  

$ \\displaystyle \\Lambda f\\leq\\int\_{X}fd\\mu. $

Since $ {f}$ is compactly supported, it is bounded and its range is contained in a compact subset of $ {\\mathbb{R}}$, say the interval $ {\[a,b\]}$. The idea is simple: subdivide the interval $ {\[a,b\]}$ and define a partition of unity $ {h\_{i}}$ sitting on a slightly bigger open set containing the corresponding preimages of the subintervals. By Urysohn's lemma, on each preimage one can bound $ {\\Lambda h\_{i}f}$ from above by the integration of a simple function, valued as the upper limit of the subinterval increased by $ {\\epsilon}$ that goes to zero when the subdivision is finer by continuity. Finally rearrange the expression of the upper bound to involve a term that can be bounded by $ {\\int\_{X}fd\\mu}$, with the remaining terms can be chosen arbitrarily small. See \[R\]. $ \\Box$  

As noted before, there are examples when $ {X}$ is LCH and the $ {\\mu}$ contructed is not inner regular for all Borel sets. Such regularity issues can be avoided if we assume $ {X}$ is $ {\\sigma}$-compact (or $\\sigma$-finite). A first consequence is that under $ {\\sigma}$-compactness, sets in the $ {\\sigma}$-algebra defined in Theorem [8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Riesz-representation-theorem) can now be approximated from below by closed sets.  

> **Proposition 9** *Let $ {X}$ be $ {LCH}$ and also $ {\\sigma}$-compact. Let $ {\\mu}$ and $ {\\mathfrak{M}}$ be the ones in Theorem [8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Riesz-representation-theorem). Then if $ {E\\in\\mathfrak{M}}$ and $ {\\epsilon>0}$, then there is a closed set $ {F}$ and an open set $ {G}$ such that $ {F\\subset E\\subset G}$ and*  
> 
> *$ \\displaystyle \\mu(G-F)<\\epsilon. $*

The idea is to first use compactness, and then the "$\\epsilon /2^i$-trick". Since closed sets in $ {X}$ are also $ {\\sigma}$-compact, this immediately implies  

> **Theorem 10** *[](https://www.blogger.com/null)(Riesz representation theorem for positive linear functionals; $ {\\sigma}$-compact case) Let $ {X}$ be $ {LCH}$ and also $ {\\sigma}$-compact. Let $ {\\Lambda:C\_{c}(X)\\rightarrow\\mathbb{R}}$ be a positive linear functional. Then there exists a unique Radon measure $ {\\mu}$ on $ {X}$ such that $ {\\Lambda=I\_{\\mu}}$ (and in fact, every measurable set is inner regular).*

> **Remark 3** *Using the uniqueness part of Theorem [10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Riesz-representation-theorem-1), one can prove that a locally finite Borel measure is always a Radon measure with the extra assumption that every open set in $ {X}$ is also $ {\\sigma}$-compact (such as a LCH and $ {\\sigma}$-compact metric space). However, it is NOT true when the assumption does not hold. See \[R\], Exercise 18, Chapter 2.*
