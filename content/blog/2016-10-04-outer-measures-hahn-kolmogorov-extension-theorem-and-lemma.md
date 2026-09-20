---
id: 2016-10-04-outer-measures-hahn-kolmogorov-extension-theorem-and-lemma
title: "Outer Measures, Hahn-Kolmogorov Extension Theorem and $ {\\pi}$-$ {\\lambda}$  Lemma"
date: 2016-10-04
tags: ["measure theory", "probability theory", "real analysis"]
source: https://sylqiu.blogspot.com/2016/10/outer-measures-hahn-kolmogorov.html
publish: true
---
Outer measure turns out to be an important construction not only appearing in measure theory, but also in probability theory. One approach of developing Lebesgue measure is via outer measure, with the advantage being intuitive, as shown in the following. Along the way of construction, we motivate the Caratheodory's definition of measurability, as is suggested in this [MO question](http://mathoverflow.net/questions/34007/demystifying-the-caratheodory-approach-to-measurability). This way of thinking is also apparent in [Terry's notes](https://terrytao.wordpress.com/category/teaching/245a-real-analysis/), which is also the major reference for this article.

  The Caratheodory extension theorem allows one to construct a measure from an outer measure. This in turn leads to Hahn-Kolmogorov extension theorem, which is a powerful tool to generate examples of measures. Roughly speaking, it standardizes the model of extending from more elementary finite additive measures, such as the Jordan measure, to desirable countably additive measures, such as the Lebesgue measure. It is also a nice place to put forward the Dykin's $ {\\pi}$-$ {\\lambda}$ machinery, which follows Amir Dembo's notes in probability theory.

####     **An outer measure approach to Jordan measure and Lebesgue measure on $ {\\mathbb{R}^{n}}$**    

In Riemann integration theory on $ {\\mathbb{R}^{n}}$, one debuts with defining for each box a volume, where a box is a cartesian product of simple finite intervals; then for *elementary sets*, which consist of *finite union of boxes*, with which then constructing a *Jordan measure*, denoted by $ {m}$. Elementary sets are good for approximating *Jordan measurable sets*, by definition.  

> **Definition 1** *[](https://www.blogger.com/null)(Jordan measurability) A set $ {E\\subset\\mathbb{R}^{d}}$ is Jordan measurable if[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\sup\_{A\\subset E}m(A)=\\inf\_{B\\supset E}m(B) \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)where $ {A}$ and $ {B}$ ranges over elementary sets. The supremum and infimum are called *inner Jordam measure* and *outer Jordan measure* respectively.*

The flavour is really the same with that of a Riemann integral. However, this way of thinking -- approximating from above and below -- is also useful for later constructions.  
Many desirable properties holds for a Jordan measure as listed in the following. Later they will be slightly adjusted in the Lebesgue case.  

> **Proposition 2** *(Properties of Jordan measure) [](https://www.blogger.com/null)Let $ {E}$, $ {F}$ be Jordan measurable. Then*  
> 
> *-   (Boolean closure property) $ {E\\cap F}$,$ {E\\cup F}$, $ {E\\backslash F}$ are Jordan measurable, whence finite elementary set operations on finitely many Jordan measurable sets produce jordan measurable sets. We say that Jordan measurable sets form a Boolean algebra.
> -   (Non-negativity) $ {m(E)\\geq0}$;
> -   (Finite additivity and sub-additivity) $ {m(E\\cup F)\\leq m(E)+m(F)}$ with equality holds whenever $ {E\\cap F=\\emptyset}$. Whence $ {m(\\bigcup\_{i=1}^{n}E\_{i})\\leq\\sum\_{i=1}^{n}m(E\_{i})}$ with equality holds whenever $ {\\{E\_{i}\\}}$ is mutually disjoint.
> -   (Monotonicity) If $ {E\\subset F}$, then $ {m(E)\\leq m(F)}$;
> -   (Translation invariance) For any $ {x\\in\\mathbb{R}^{n}}$, $ {E+x}$ is Jordan measurable, and $ {m(E+x)=m(E)}$.*

One normally puts a normalization such as $ {m(\[0,1\])=1}$. Then this Jordan measure will be *uniquely determined*.  
By construction, the Jordan measure is not suitable for any unbounded set, because any elementary set (which is a finite union of boxes) is unable to cover it and thus will admit infite outer Jordam measure. But it's even worse, as the characterisation of Riemann integrability suggests, they are not suitable for measuring sets with \`\`too many holes or oscillations'' (compare with discontinuity). This failure can be often checked using the following property:  

> **Proposition 3** *Let $ {E\\subset\\mathbb{R}^{n}}$. $ {\\overline{E}=\\text{cl}(E)}$ has the same outer Jordan measure with $ {E}$; $ {E^{o}=\\text{int}(E)}$ has the same inner Jordan measure with $ {E}$.*

So that we see, in particular, $ {\\mathbb{Q}\\cap\[0,1\]}$ is not Jordan measurable.  

> **Remark 1** *[](https://www.blogger.com/null)It is worthwhile to point out that ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eqcaratheodory)) in Definiton [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#def\(Jordan-measurability\)-A) in fact points to a *Carathéodory type* of property: if $ {E}$ is Jordan measurable, and $ {B\\supset E}$ is elementary, then*  
> 
> *$ \\displaystyle m(B)=m(E)+m(B\\backslash E). $*
> 
> *This will be further abstracted when we discuss *outer measure*.*

To remedy, one has to forgo the restriction to elementary sets to embrace a family of more flexible sets, informally called a \`\`gauge'', and to allow approximation by *countably* many gauge sets (this being another reason why one would like to define $ {\\sigma}$-algebras). In other words, we need an *extension* of Jordan measurability. The sub-additivity property (3) in Proposition [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop2) suggests one should approximate a set from above -- this is the basic idea of an *outer measure*.  

> **Remark 2** *[](https://www.blogger.com/null)An \`\`inner measure'' can in fact follow from this outer measure approach, namely by approximating the complement from above. Of course, to avoid issues such as $ {\\infty-\\infty}$ we have to assume some boundedness of the set. However, these measures of a set need not agree. This, partially, will lead to the concept of a new set measurability.*

Now we go back to $ {\\mathbb{R}^{n}}$. Lebesgue's construction shows that *open boxes* in $ {\\mathbb{R}^{n}}$ is more than enough to be a gauge. Recall that any open set $ {G\\subset\\mathbb{R}^{n}}$ can be written as a countable union of open boxes. Since countable set operations on open boxes generate the *Borel* $ {\\sigma}$-*algebra* on $ {\\mathbb{R}^{n}}$, the Lebesgue measure obtained is an example of *Borel measures*. A powerful way to construct Borel measures via *Riesz Representation Theorem*, along with the *regularity* issues of the measure, will be discussed by a following chapter.  
As in the case for Jordan measure, we first assign a volume $ {|\\cdot|}$ to every open box in $ {\\mathbb{R}^{n}}$.  

> **Definition 4** *(Lebesgue outer measure) Let $ {E\\subset\\mathbb{R}^{n}}$ be any subset. The Lebesgue outer measure of $ {E}$ is defined to be*  
> 
> *$ \\displaystyle m^{\*}(E)=\\inf\_{\\bigcup\_{i=1}^{\\infty}B\_{i}\\supset E}\\sum\_{i=1}^{\\infty}|B\_{i}| $*
> 
> *where $ {B\_{i}}$ are open boxes.*

Note that a Lebesgue outer measure is given to any subset of $ {\\mathbb{R}^{n}}$. We see that an outer measure is a set function $ {m^{\*}:2^{\\mathbb{R}^{n}}\\rightarrow\[0,\\infty\]}$. The countable sub-additivity is built into the definition, however, it is generally not true even for finite additivity (in fact, from Proposition [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#proplebesgue), such sets have to be non-measurable).  

> **Definition 5** *(Lebesgue measurability and Lebesgue measure) A set $ {E\\subset\\mathbb{R}^{n}}$ is said to be Lebesgue measurable if for any $ {\\epsilon>0}$, there exists an open set $ {U\\subset\\mathbb{R}^{n}}$, $ {E\\subset U}$ such that*  
> 
> *$ \\displaystyle m^{\*}(U\\backslash E)\\leq\\epsilon. $*
> 
> *If $ {E}$ is Lebesgue measurable, then the Lebesgue measure of $ {E}$ is defined by*  
> 
> *$ \\displaystyle m(E)=m^{\*}(E). $*

> **Proposition 6** *(Properties of Lebesgue measure) [](https://www.blogger.com/null)Let $ {E}$, $ {F}$ be Lebesgue measurable. Then*  
> 
> *-   ($ {\\sigma}$-closure and Borel property) The collection of Lebesgue measurable sets in $ {\\mathbb{R}^{n}}$ is a $ {\\sigma}$-algebra, which is complete with respect to the Lebesgue measure, and contains the Borel $ {\\sigma}$-algebra. In particular, it contains all Jordan measurable sets in $ {\\mathbb{R}^{n}}$;
> -   (Non-negativity) $ {m(E)\\geq0}$;
> -   (Countable additivity and sub-additivity)
>     
>     $ \\displaystyle m(\\bigcup\_{i=1}^{\\infty}E\_{i})\\leq\\sum\_{i=1}^{\\infty}m(E\_{i}) $
>     
>     with equality holds whenever $ {\\{E\_{i}\\}}$ is measurable and mutually disjoint.
> -   (Monotonicity) If $ {E\\subset F}$, then $ {m(E)\\leq m(F)}$;
> -   (Translation invariance) For any $ {x\\in\\mathbb{R}^{n}}$, $ {E+x}$ is Lebesgue measurable, and $ {m(E+x)=m(E)}$.*
> 
> *Also, the Lebesgue measure is unique up to normalization. If one use the same volumes of boxes to construct the Jordan measure, then the Lebesgue measure agrees with the Jordan measure on all Jordan measurable sets. In this case we say that Lebesgue measure is an extension of the Jordan measure.*

Properties (1) - (4) will follow from properties of a more general outer measure. The property of translation invariance, besides strong intuition, has close relation to the additive group structure of $ {\\mathbb{R}^{n}}$. A generalization of this property, satisfied by the so-called *Haar measure*, will be discussed somewhat later in the sequel. With translation invariance and the *axiom of chice*, one can construct a non-measurable set in $ {\\mathbb{R}^{n}}$.  

####     **Outer measure**    

Motivated by the above construction, we axiomatize outer measure:  

> **Definition 7** *Let $ {X}$ be a set. An outer measure is a set function $ {\\mu^{\*}:2^{X}\\rightarrow\[0,\\infty\]}$ that satisfies*  
> 
> *-   $ {\\mu^{\*}(\\emptyset)=0}$;
> -   (Monotonicity) If $ {E\\subset F\\subset X}$, then $ {\\mu^{\*}(E)\\leq\\mu^{\*}(F)}$;
> -   (Countable sub-additivity) If $ {\\{E\_{i}\\}\_{i=1}^{\\infty}}$ is a countable collection of subsets of $ {X}$, then $ {\\mu^{\*}(\\bigcup\_{i=1}^{\\infty}E\_{i})\\leq\\sum\_{i=1}^{\\infty}\\mu^{\*}(E\_{i})}$.*

Here $ {X}$ need not be a topological space, and *a priori* there is no prefered \`\`gauge system'' in this abstract setting (although one can define one using a *pre-measure*, but I prefer to delay it, otherwise seems to make things just more confusing). To define the measurability is somewhat tricky at first. Remark [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#remIt-is-worthwhile) and [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#remAn-inner-measure) somewhat explain the following approach taken by Carathéodory.  

> **Definition 8** *[](https://www.blogger.com/null)(Carathéodory's measurability) Let $ {\\mu^{\*}}$ be an outer measure on $ {X}$. A set $ {E\\subset X}$ is said to be measurable with respect to $ {\\mu^{\*}}$ if for ***any*** set $ {A\\subset X}$,[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\mu^{\*}(A)=\\mu^{\*}(A\\cap E)+\\mu^{\*}(A\\backslash E). \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)*

Note that the issue of $ {\\infty-\\infty}$ as admitted by the \`\`inner measure'' is cleverly avoided.  
A first good sign is that null sets are always measurable under this definition.  

> **Proposition 9** *[](https://www.blogger.com/null)If $ {E}$ is such that $ {\\mu^{\*}(E)=0}$, then $ {E}$ is measurable.*

*Proof:* Let $ {A}$ be any set in $ {X}$. Since $ {A\\cap E\\subset E}$, $ {A\\backslash E\\subset A}$, by monotonicity of outer measure we see that  

$ \\displaystyle \\mu^{\*}(A\\cap E)=0,\\quad\\mu^{\*}(A)\\geq\\mu^{\*}(A\\backslash E) $

It now suffices to show $ {\\mu^{\*}(A)\\leq\\mu^{\*}(A\\backslash E)}$, but the sub-additivity of ourter measure implies  

$ \\displaystyle \\mu^{\*}(A)\\leq\\mu^{\*}(A\\cap E)+\\mu^{\*}(A\\backslash E). $

$ \\Box$  
Moreover, the collection of measurable sets form a $ {\\sigma}$-algebra.  

> **Theorem 10** *(Carathéodory extension theorem) Let $ {\\mu^{\*}}$ be an outer measure on $ {X}$, and $ {\\mathcal{B}}$ be the collection of all measurable sets with repect to $ {\\mu^{\*}}$. Denote by $ {\\mu:\\mathcal{B}\\rightarrow\[0,\\infty\]}$ to be the restriction of $ {\\mu^{\*}}$ to $ {\\mathcal{B}}$. Then $ {\\mathcal{B}}$ is a $ {\\sigma}$-algebra, and $ {\\mu}$ is a measure.*

By Proposition [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propcomplete), the measure $ {\\mu}$ is complete.  
The proof of this theorem is refered to this blog post of Terry. I particularly like his way of indexing when showing ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) implies Boolean closure property.  

####     **Set families, Hahn-Kolmogorov extension theorem and $ {\\pi}$-$ {\\lambda}$ lemma**    

The *extension* from Jordan measurability to Lebesgue measurability can be astracted. In order to formulate this abstraction more precisely, it is handy to have the following definition.  

> **Definition 11** *(Boolean algebra) Let $ {X}$ be a set. A *Boolean algebra* is a collection $ {\\mathcal{A}}$ of subsets of $ {X}$ such that*  
> 
> *-   $ {\\emptyset\\in\\mathcal{A}}$;
> -   (Boolean closure) If $ {E\\in\\mathcal{A}}$, then $ {E^{c}\\in\\mathcal{A}}$; If $ {E,F\\in\\mathcal{A}}$, then $ {E\\cup F\\in\\mathcal{A}}$, $ {E\\cap F\\in\\mathcal{A}}$.*
> 
> *A *finite additive measure* $ {\\mu\_{0}}$ is a set function on a Boolean algebra such that $ {\\mu\_{0}(\\emptyset)=0}$ and the finite additivity property in Proposition [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop2) is satisfied.*

It can be checked that the collection of all Jordan measurable sets in $ {\\mathbb{R}^{n}}$ is a Boolean algebra, and the Jordan measure is a finite additive measure.  
We are now interested in the question if one can extend a finite additive measure to a measure. An obvious necessary condition is that the finite additive measure has to be countable additive within the Boolean algebra. The notion of pre-measure makes this precise.  

> **Definition 12** *(Pre-measure) A *pre-measure* on a Boolean algebra $ {\\mathcal{A}}$ is a finitely additive measure $ {\\mu\_{0}:\\mathcal{\\mathcal{A}}\\rightarrow\[0,\\infty\]}$ such that*  
> 
> *$ \\displaystyle \\mu\_{0}(\\bigcup\_{i=1}^{\\infty}E\_{i})=\\sum\_{i=1}^{\\infty}\\mu\_{0}(E\_{i}) $*
> 
> *whenever $ {\\{E\_{i}\\}}$ is a collection of mutually disjoint elements in $ {\\mathcal{A}}$.*

The Boolean algebra $ {\\mathcal{A}}$ can facilitate as a gauge system for $ {X}$, out of which one can construct an outer measure[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu^{\*}(E)=\\inf\\{\\sum\_{i=1}^{\\infty}\\mu\_{0}(E\_{i}):E\\subset\\bigcup\_{i=1}^{\\infty}E\_{i},\\quad E\_{i}\\in\\mathcal{A}\\text{ for all }i\\}. \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Then by Caratheodory's extension theorem, one can obtain from this outer measure a countable additive measure.  

> **Definition 13** *A meaure $ {\\nu}$, finitely or countably additive, on respectively a Boolean or $ {\\sigma}$-algebra $ {\\mathcal{E}}$ on $ {X}$, is said to be $ {\\sigma}$-finite if $ {X}$ is a countable union of sets $ {\\{E\_{i}\\}\_{i=1}^{\\infty}}$ in $ {\\mathcal{E}}$ of finite measure, i.e. $ {\\nu(E\_{i})<\\infty}$ for all $ {i}$.*

> **Theorem 14** *(Hahn-Kolmogorov extension theorem) Let $ {\\mu\_{0}:\\mathcal{A}\\rightarrow\[0,\\infty\]}$ be a pre-measure on a Boolean algebra $ {\\mathcal{A}}$ in $ {X}$. Then there exist a $ {\\sigma}$-algebra $ {\\mathcal{B}}$ and a countably additive measure $ {\\mu:\\mathcal{B}\\rightarrow\[0,\\infty\]}$, such that $ {\\mu}$ is an extension of $ {\\mu\_{0}}$. In addition, if $ {\\mu\_{0}}$ is $ {\\sigma}$-finite, then the extension is unique.*

This theorem is very important, as one can now reduce the work into checking the requirements for a pre-measure. For example, the construction of *Lebesgue Stieltjes measure* follows this approach.  
It is useful to introduce the following machinery to prove the uniqueness part of the theorem. They are also frequently used in probability theory.  

> **Definition 15** *(Dykin's $ {\\pi}$-system and $ {\\lambda}$-system)*  
> 
> *-   A $ {\\pi}$-system is a collection $ {\\mathcal{P}}$ of sets in $ {X}$ that is closed under finite intersections, i.e. if $ {E\\in\\mathcal{P}}$, $ {F\\in\\mathcal{P}}$, then $ {E\\cap F\\in\\mathcal{P}}$.
> -   A $ {\\lambda}$-system is a collection $ {\\mathcal{L}}$ of sets in $ {X}$ such that
>     1.  $ {X\\in\\mathcal{L}}$;
>     2.  (Closed under complement) If $ {E\\subset F\\in\\mathcal{L}}$, then $ {F\\backslash E\\in\\mathcal{L}}$;
>     3.  (Closed under ascending limits) If $ {E\_{i}\\in\\mathcal{L}}$, and $ {E\_{1}\\subset E\_{2}\\subset\\cdots}$ is ascending, then $ {\\bigcup\_{i=1}^{\\infty}E\_{i}\\in\\mathcal{L}}$.*

It is clear that a Boolean algebra is a $ {\\pi}$-system, though it may not be a $ {\\lambda}$-system. The basic relations of these set families is the following.  

> **Proposition 16** *[](https://www.blogger.com/null)Let $ {\\mathcal{P}}$ be a $ {\\pi}$-system. The smallest $ {\\lambda}$-system containing $ {\\mathcal{P}}$ is a $ {\\pi}$-system.*

> **Proposition 17** *[](https://www.blogger.com/null)A collection $ {\\mathcal{F}}$ of sets in $ {X}$ is a $ {\\sigma}$-algebra if and only if it is both a $ {\\pi}$-system and a $ {\\lambda}$-system.*

*Proof:* The \`\`only if'' part is trivial. Suppose $ {\\mathcal{F}}$ is both a $ {\\pi}$-system and a $ {\\lambda}$-system. Consequently $ {X\\in\\mathcal{F}}$, and also $ {\\mathcal{F}}$ is closed under complement. Also, since for any $ {E,F\\in\\mathcal{F}}$,  

$ \\displaystyle E\\cup F=(E^{c}\\cap F^{c})^{c}\\in\\mathcal{F}, $

$ {\\mathcal{F}}$ is closed under finite unions. Now let $ {\\{\\tilde{E}\_{i}\\}\_{i=1}^{\\infty}}$ be a countable collection of elements in $ {\\mathcal{F}}$. Define $ {E\_{n}=\\bigcup\_{i=1}^{n}\\tilde{E}\_{i}}$. It is clear that $ {\\{E\_{n}\\}}$ is ascending and  

$ \\displaystyle E=\\bigcup\_{n=1}^{\\infty}E\_{n}=\\bigcup\_{i=1}^{\\infty}\\tilde{E}\_{i}. $

Hence $ {E\\in\\mathcal{F}}$ as desired. $ \\Box$ Combining Proposition [16](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop18) and [17](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop19), we have:  

> **Theorem 18** *(Dykin's $ {\\pi}$-$ {\\lambda}$ lemma) If $ {\\mathcal{P}\\subset\\mathcal{L}}$ with $ {\\mathcal{P}}$ a $ {\\pi}$-system and $ {\\mathcal{L}}$ a $ {\\lambda}$-system, then the $ {\\sigma}$-algebra $ {\\sigma(\\mathcal{P})}$ generated by $ {\\mathcal{P}}$ is contained in $ {\\mathcal{L}}$, i.e. $ {\\sigma(\\mathcal{P})\\subset\\mathcal{L}}$.*

> **Proposition 19** *[](https://www.blogger.com/null)Following thw previous notations, if two measures $ {\\mu\_{1}}$ and $ {\\mu\_{2}}$ on $ {(X,\\mathcal{P})}$ agree on the $ {\\pi}$-system $ {\\mathcal{P}}$, and $ {\\mu\_{1}}$,$ {\\mu\_{2}}$ are $ {\\sigma}$-finite, then $ {\\mu\_{1}=\\mu\_{2}}$.*

Now we can prove the Hahn-Kolmogorov extension theorem.  
*Proof:* The uniqueness part follows from Proposition [19](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propunique). Now we show the extension part. Recall the outer measure defined in ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#3)):  

$ \\displaystyle \\mu^{\*}(E)=\\inf\\{\\sum\_{i=1}^{\\infty}\\mu\_{0}(E\_{i}):E\\subset\\bigcup\_{i=1}^{\\infty}E\_{i},\\quad E\_{i}\\in\\mathcal{A}\\text{ for all }i\\}. $

Let $ {\\mathcal{B}}$ be the collection of all sets $ {E\\subset X}$ that are measurable in the sense of Carathéodory with respect to $ {\\mu^{\*}}$, and let $ {\\mu}$ be the restriction of $ {\\mu^{\*}}$ to $ {\\mathcal{B}}$. By Carathéodory extension theorem, $ {\\mathcal{B}}$ is a $ {\\sigma}$-algebra and $ {\\mu}$ is a countably additive measure. It now remains to show that $ {\\mathcal{B}\_{0}\\subset\\mathcal{B}}$ and $ {\\mu}$ extends $ {\\mu}$. Let $ {E\\in\\mathcal{B}\_{0}}$. We need to show that it satisfies ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) in Definition [8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#def\(Carath=0000E9odory%27s-measurability\)-L). Let $ {A\\subset X}$ be any subset. It suffices to show[](https://www.blogger.com/null)  

[$ \\displaystyle \\mu^{\*}(A)\\geq\\mu^{\*}(A\\cap E)+\\mu^{\*}(A\\backslash E). \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Fix $ {\\epsilon>0}$. By definition of $ {\\mu^{\*}}$, one can find $ {E\_{1},E\_{2},\\dots\\in\\mathcal{B}\_{0}}$ whose union covers $ {A}$ and such that  

$ \\displaystyle \\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n})\\leq\\mu^{\*}(A)+\\epsilon. $

The sets $ {E\_{n}\\cap E\\in\\mathcal{B}\_{0}}$ thus covers $ {A\\cap E}$ and satisfy by sub-additivity  

$ \\displaystyle \\mu^{\*}(A\\cap E)\\leq\\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n}\\cap E), $

and similarly  

$ \\displaystyle \\mu^{\*}(A\\backslash E)\\leq\\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n}\\backslash E). $

But  

$ \\displaystyle \\mu\_{0}(E\_{n}\\cap E)+\\mu\_{0}(E\_{n}\\backslash E)=\\mu\_{0}(E\_{n}) $

by finite additivity of $ {\\mu\_{0}}$. Therefore, \\begin{eqnarray} & & \\mu^{\*}(A\\cap E)+\\mu^{\*}(A\\backslash E)\\\\ & \\leq & \\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n}\\cap E)+\\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n}\\backslash E) \\\\ & = & \\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n}) \\\\ & \\leq & \\mu^{\*}(A)+\\epsilon. \\end{eqnarray} Since $ {\\epsilon}$ is arbitrary, ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) follows. To show that $ {\\mu^{\*}(E)=\\mu\_{0}(E)}$, it suffices to show  

$ \\displaystyle \\mu^{\*}(E)\\geq\\mu\_{0}(E) $

since $ {E}$ covers itself. By defintion of $ {\\mu^{\*}}$, it suffices to show  

$ \\displaystyle \\sum\_{n=1}^{\\infty}\\mu\_{0}(E\_{n})\\geq\\mu\_{0}(E) $

whenever $ {\\{E\_{n}\\}}$ is a countable family in $ {\\mathcal{B}\_{0}}$ and whose union covers $ {E}$. Notice that if $ {\\{\\tilde{E}\_{n}\\}}$ is any countable family of elements in $ {\\mathcal{B}\_{0}}$covering $ {E}$, then we can construct a mutually disjoint sequence by  

$ \\displaystyle E\_{n}'=\\tilde{E}\_{n}\\backslash\\bigcup\_{i=1}^{n-1}E\_{i}\\in\\mathcal{B}\_{0}. $

Since $ {E\\in\\mathcal{B}\_{0}}$, taking $ {E\_{n}=E\_{n}'\\cap E\\in\\mathcal{B}\_{0}}$ we have a mutually disjoint family that covers exactly $ {E}$. Since $ {\\mu\_{0}}$ is a pre-measure, we have  

$ \\displaystyle \\mu\_{0}(\\bigcup\_{n=1}^{\\infty}E\_{n})=\\mu\_{0}(E). $

The extension part thus follows. $ \\Box$
