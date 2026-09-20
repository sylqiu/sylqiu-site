---
id: 2017-02-12-convergence-and-compactness-ii-weak-compactness
title: "Convergence and compactness II: Weak compactness"
date: 2017-02-12
tags: ["functional analysis", "real analysis"]
source: https://sylqiu.blogspot.com/2017/02/ii-weak-compactness.html
publish: true
---
This post is a continuation of the [previous post](http://sylqiu.blogspot.hk/2017/01/convergence-and-compactness-i.html) on convergence and compactness. Here we study the important notions of weak and weak\* convergence in details, and to provide ourselves a fundamental framework for studying *compactness methods* in PDEs. Major reference is Terry's notes, and also several discussions found in Mathstackexchange.  

 **1.1. Compactness in the norm topology**

We recall first the Heine-Borel theorem for metric spaces.  

> **Theorem 1** *[](https://www.blogger.com/null)(Heine-Borel) Let $ {(X,d)}$ be a metric space. Let $ {K\\subset X}$. The following are equivalent:*  
> 
> *-   $ {K}$ is sequential compact;
> -   $ {K}$ is compact, i.e. every open cover has a finite subcover;
> -   $ {K}$ is complete, and totally bounded, i.e. for each $ {\\epsilon>0}$ there is a finite number of metric balls of radius $ {\\epsilon}$ covers $ {K}$.*

Several simplifications can be made if the metric space $ {X}$ is a *finite dimensional* normed vector space over $ {\\mathbb{R}}$. First,  

> **Proposition 2** *$ {X}$ as a finite dimensional normed vector space will be automatically complete.*

In fact, more is true: any two norms on a finite dimensional vector space are equivalent, and we can identify this space with $ {\\mathbb{R}^{n}}$ equipped with the $ {\\ell^{1}}$-norm. Given this, we can show  

> **Proposition 3** *$ {K\\subset X}$ is bounded if and only if totally bounded.*

It suffices to show for the closed cube $ {Q=\[-1,1\]^{n}}$ is totally bounded. If not, let $ {\\{U\_{\\alpha}\\}\_{\\alpha\\in A}}$ be a collection of infinite open balls of the same radius that cover $ {Q}$ but without a finite subcover. Because $ {n}$ is finite, we can subdivide $ {Q}$ into $ {2^{n}}$ closed cubes of equal sides. By pigeon hole principle, at least one of the cubes requires infinite cover. Call this cube $ {Q\_{1}}$. Continuing, we have a nested sequence  

$ \\displaystyle Q\_{1}\\supset Q\_{2}\\supset\\cdots $

which by completeness satisfies $ {\\bigcap\_{n=1}^{\\infty}Q\_{n}=\\{x\\}}$ for some $ {x\\in Q}$. But then the sequence will eventually lies in one covering ball. This is enough to deduce a contradiction. Finally, since complete subsets are also closed, we conclude the usual Heine-Borel theorem that $ {K\\subset X}$ if and only if $ {K}$ is closed and bounded.  
In the case of infinite dimensional Banach space (since compact sets are neccesarily complete, a Banach space in fact gives us more compact sets), the norm topology is so strong that it forces the compact sets to be "almost finite dimensional''.  

> **Proposition 4** *[](https://www.blogger.com/null)Let $ {V}$ be a Banach space and $ {K\\subset V}$. Then $ {K}$ is compact if and only if $ {K}$ is closed and bounded, and for each $ {\\epsilon>0}$, $ {K}$ lies in the $ {\\epsilon}$-neighborhood of some finite dimensional subspace $ {W\\subset V}$.*

This follows by a direct application of Theorem [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Heine-Borel\)).  

> **Example 1** *By Proposition [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop4), we see that in $ {\\ell^{p}(\\mathbb{N})}$, $ {1\\leq p<\\infty}$, a subset $ {K}$ is compact if and only if $ {K}$ is closed and bounded, and also *uniformaly integrable at the spatial infinity*, in the sense that for each $ {\\epsilon>0}$, there is $ {n>0}$ such that*  
> 
> *$ \\displaystyle \\left(\\sum\_{m>n}|f(m)|^{p}\\right)^{1/p}\\leq\\epsilon $*
> 
> *for all $ {f\\in K}$. Hence we see that the "moving bump'' $ {(e\_{n})\_{n=1}^{\\infty}}$ is not compact, despite being closed and bounded in $ {\\ell^{p}(\\mathbb{N}).}$*

We conclude this section with a construction of F. Riesz, which leads to the remarkable converse to the statement that closed unit ball is compact if the space is finite dimensional. Thus in particular, compact sets in an infinite dimensional space must have empty interior.  
Consider an infinite dimensional normed vector space $ {X}$, and $ {W\\subset X}$ a finite dimensional subspace. Take $ {x\\in X}$. Then there is $ {y\\in W}$ such that it is a distance minimizer:  

$ \\displaystyle \\|x-y\\|\\leq\\|x-w\\| $

for all $ {w\\in W}$. This follows from the completeness of $ {W}$, note however $ {y}$ need not be unique unless the space is uniformly convex. Now take $ {p\\notin W}$. Then there is $ {w\_{p}\\in W}$ such that  

$ \\displaystyle \\|p-w\_{p}\\|=\\inf\_{w\\in W}\\|p-w\\|=R>0. $

Put  

$ \\displaystyle x=\\frac{p-w\_{p}}{R} $

so that $ {\\|x\\|=1}$. And we find that  

$ \\displaystyle \\begin{array}{rcl} \\inf\_{w\\in W}\\|x-w\\| & = & \\inf\_{w\\in W}\\|\\frac{p-w\_{p}}{R}-w\\|\\\\ & = & \\inf\_{w\\in W}\\|\\frac{p-w\_{p}-R\\cdot w}{R}\\|=1. \\end{array} $

Hence the point $ {x}$ is such that $ {\\|x\\|=1}$ and $ {\\|x-w\\|\\geq1}$ for all $ {w\\in W}$. This says that for any finite dimensional subspace, there exists a point on the unit sphere that is away form that subspace. This entails the following property of the unit sphere $ {S}$ in $ {X}$: pick any $ {x\_{0}\\in S}$, and let $ {x\_{n}}$ be a point such that $ {\\|x-w\\|\\geq1}$ for all $ {w\\in\\text{span}\\{x\_{0},\\dots x\_{n-1}\\}}$. Then the sequence $ {(x\_{n})\_{n=0}^{\\infty}}$ cannot have any convergent subsequence. The noncompactness of $ {S}$ thus follows.  

**1.2. The weak and weak\* topologies**

Recall that a topological vector space $ {V}$ is a vector space with a topology such that vector space operations are continuous with respect to that topology. We shall refer to this given topology as the *strong topology* on $ {V}$. This topology gives rise to the notion of dual space $ {V^{\*}}$ of $ {V}$, defined to be the space of all *continuous linear functionals* on $ {V}$.  
If the space is finite dimensional, its dual space can be identified with the space itself by a choice of basis $ {\\{e\_{1},\\dots,e\_{n}\\}}$ and the map  

$ \\displaystyle \\Phi:e\_{i}\\mapsto\\Phi(e\_{i})=\\delta\_{i}, $

where $ {\\delta\_{i}}$ is the Kronecker delta. The choice of basis had identified $ {V}$ with $ {\\mathbb{R}^{n}}$, on which the product topology can be shown to be equivalent to any norm topology. Yet it is also the weakest topology that makes any $ {\\lambda\\in V^{\*}}$ continuous, since a linear combination of $ {\\delta\_{i}}$'s is essentially the same with the corresponding linear combination of coordinate projection $ {\\pi\_{i}}$'s. The situation is quite different for infinite dimensional spaces. We make the following definition.  

> **Definition 5** *The *weak topology* on a topological vector space $ {V}$ is generated by all the semi-norms (i.e. a norm except that $ {\\|v\\|=0}$ does not neccessarily imply $ {v=0}$) of the following form*  
> 
> *$ \\displaystyle \\|\\cdot\\|\_{\\lambda}:\\|v\\|\_{\\lambda}=|\\lambda(v)|, $*
> 
> *for $ {\\lambda\\in V^{\*}}$. The basic open sets generated by $ {\\|\\cdot\\|\_{\\lambda}}$ are of the form*  
> 
> *$ \\displaystyle \\{v\\in V:|\\lambda(v)|<c\\}, $*
> 
> *for $ {c>0}$. A sequence $ {(v\_{n})\_{n=1}^{\\infty}}$ converging to $ {v\\in V}$ in the weak topology satisfies*  
> 
> *$ \\displaystyle \\lambda(v\_{n})\\rightarrow\\lambda(v) $*
> 
> *for all $ {\\lambda\\in V^{\*}}$. We call the sequence $ {(v\_{n})\_{n=1}^{\\infty}}$ converges *weakly* to $ {v}$, and denote it by*  
> 
> *$ \\displaystyle v\_{n}\\rightharpoonup v. $*

By this definition, all $ {\\lambda\\in V^{\*}}$ is continuous in the weak topology, since $ {\\lambda}$ is continuous in the topology generated by its own semi-norm $ {\\|\\cdot\\|\_{\\lambda}}$. Also, the weak topology is easily seen to be the weakest of this kind (i.e. contains fewest open sets). Thus it is weaker than the strong topology.  
In a similar spirit,  

> **Definition 6** *The *weak\* topology* on the dual space $ {V^{\*}}$ of a topological vector space $ {V}$ is generated by all the semi-norms*  
> 
> *$ \\displaystyle \\|\\cdot\\|\_{v}:\\|\\lambda\\|\_{v}=|\\lambda(v)|, $*
> 
> *for $ {v\\in V.}$ Similarly, a sequence $ {(\\lambda\_{n})\_{n=1}^{\\infty}}$ converging to $ {\\lambda\\in V^{\*}}$ in the weak\* topology satisfies*  
> 
> *$ \\displaystyle \\lambda\_{n}(v)\\rightarrow\\lambda(v) $*
> 
> *for all $ {v\\in V}$. We call the sequence $ {(\\lambda\_{n})\_{n=1}^{\\infty}}$ converges *weak-starly* to $ {\\lambda}$, and denote it by*  
> 
> *$ \\displaystyle \\lambda\_{n}\\rightharpoonup^{\*}\\lambda. $*

Note that weak\* topology on $ {V^{\*}}$ depends on which predual $ {V}$ we use, so one cannot talk about *the* weak\* topology unless the predual is specified or there is no confusion in the context.  
By making use of the bidual $ {\\left(V^{\*}\\right)^{\*}}$, we can also talk about the weak topology on $ {V^{\*}}$, and so on. The relation between the definitions of these topologies can be schematically shown as follows:  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkRPcLD-1aloc80SnVpIg3VlfPquiKCOocZNrLA6S8gYaPbL0t0ZbpMwWBxjDBr0xVaOUxN1aipO74u7ug_T-p9Kka08jp8rQ173T967WHw04PEziVRePxTNSSl_srH6a7qnJh3A3rdRs/s400/diagram_wtop.jpeg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkRPcLD-1aloc80SnVpIg3VlfPquiKCOocZNrLA6S8gYaPbL0t0ZbpMwWBxjDBr0xVaOUxN1aipO74u7ug_T-p9Kka08jp8rQ173T967WHw04PEziVRePxTNSSl_srH6a7qnJh3A3rdRs/s1600/diagram_wtop.jpeg)

Because of the embedding $ {V\\hookrightarrow\\left(V^{\*}\\right)^{\*}}$(which uses Hahn-Banach theorem), the weak\* topology on $ {V^{\*}}$ is weaker than the weak topology on $ {V^{\*}}$.  
From now on we shall be mainly interested in case $ {V}$ is a normed vector space.  

> **Remark 1** *In probability literature people usually refer to the weak-star convergence of measures as *weak convergence of measures* or *vague convergence of measures*, perhaps because the dual spaces of measure spaces are seldom considered.*

The first question regards to the notion of weak and weak-star convergence is that if their limits, if exist, is unique. This is non-trivial since the topology generated by each individual semi-norm is non-Hausdorff (since each one has a non-trivial kernel). That *altogether* they generate a Hausdorff topology is due to the Hahn-Banach theorem.  

> **Proposition 7** *Let $ {V}$ be a normed vector space. Then the weak and weak\* topologies on $ {V}$ and $ {V^{\*}}$are Hausdorff.*

*Proof:* By Hahn Banach, if $ {\\lambda(v)=0}$ for all $ {\\lambda\\in V^{\*}}$, then $ {v=0}$. $ \\Box$  

> **Example 2** *[](https://www.blogger.com/null)Let $ {V=c\_{0}(\\mathbb{N})}$ (equipped with sup-norm), $ {V^{\*}=\\ell^{1}(\\mathbb{N})}$, $ {\\left(V^{\*}\\right)^{\*}=\\ell^{\\infty}(\\mathbb{N})}$, and let $ {e\_{1},e\_{2},\\dots}$ be the standard basis of either of the three spaces that will be specified in the context.*  
> 
> *-   $ {(e\_{n})\_{n=1}^{\\infty}}$ converges weakly to $ {0}$ in $ {V}$, but not in the sup-norm;
> -   $ {(e\_{n})\_{n=1}^{\\infty}}$ converges weak-starly to $ {0}$ in $ {V^{\*}}$, but not weakly in $ {V^{\*}}$;
> -   $ {\\left(\\sum\_{m=n}^{\\infty}e\_{m}\\right)\_{n=1}^{\\infty}}$ converges weak-starly to $ {0}$ in $ {\\left(V^{\*}\\right)^{\*}}$, but not weakly. The latter can be explained as follows. Recall that the dual space of $ {\\ell^{\\infty}(\\mathbb{N})}$ is strictly larger than $ {\\ell^{1}(\\mathbb{N})}$. One can use Hahn-Banach theorem to extend the limit functional (which is continuous) defined on the space of bounded convergent sequence $ {c(\\mathbb{N})\\subset\\ell^{\\infty}(\\mathbb{N})}$ to a generalised limit functional $ {\\lim^{\*}\\in\\left(\\ell^{\\infty}(\\mathbb{N})\\right)}$ . Then since $ {\\sum\_{m=n}^{\\infty}e\_{m}\\in c(\\mathbb{N})\\subset\\ell^{\\infty}(\\mathbb{N})}$ for each $ {n}$, $ {\\lim^{\*}(\\sum\_{n=m}^{\\infty}e\_{n})=1\\neq0}$ for each $ {n}$, thus the seqeunce $ {\\left(\\lim^{\*}(\\sum\_{n=m}^{\\infty}e\_{n})\\right)\_{n=1}^{\\infty}}$does not converge to zero.*
> 
> *But it is perhaps quite surprising that in $ {V^{\*}=\\ell^{1}(\\mathbb{N})}$, a sequence converges weakly will also converge strongly. This is known as the *Schur property* of $ {\\ell^{1}(\\mathbb{N})}$, where in this case depends quite strongly on the discrete nature of $ {\\mathbb{N}}$. Nevertheless, the unit ball $ {B=\\{x\\in\\ell^{1}(\\mathbb{N}):\\|x\\|\_{1}<1\\}}$ is open in the strong topology, but not in the weak topology, so these two topologies are not the same, abide having the same converging sequences. The reason is that a non-empty weakly open set needs to be unbounded, since any weakly open set is the union of finite intersetions of the sets of the form  
> *  
> 
> *$ \\displaystyle U=\\{x:|\\lambda(x)|<c\\} $*
> 
> *for $ {c>0}$. Hence in particular, the kernel of $ {\\lambda}$ is contained in $ {U}$. So once a open set is non-empty, it contains at least a one dimensional subspace spanned by a vector in the kernel of some $ {\\lambda}$. And since $ {\\ker\\lambda}$ has at most codimension one, finite intersections of this kind of sets contain at least a one dimensional subsepace. In fact, this also implies the weak topology of a normed vector space is not *normable*.*

Although the weak topology is not normable, and so *a priori* there is no notion of boundedness of sets, it turns out sets that are *weakly bounded* (i.e. $ {E\\subset V}$ such that $ {\\lambda(E)}$ is bounded for each $ {\\lambda\\in V^{\*}}$\\}) are also *strongly bounded* (i.e. bounded in norm), due to the *uniform boundedness principle*.  

> **Proposition 8** *[](https://www.blogger.com/null)Let $ {V}$ be a normed vector space, and $ {E\\subset V}$. Then $ {E}$ is strongly bounded if and only if weakly bounded.*

*Proof:* We show the "if'' part. By the isometric embedding $ {V\\hookrightarrow(V^{\*})^{\*}}$, each $ {x\\in E}$ can be thought of as an element in $ {(V^{\*})^{\*}}$. Then $ {\\sup\_{x\\in E}|\\lambda(v)|<+\\infty}$ for each $ {\\lambda}$. By the uniform boundedness principle, $ {\\sup\_{x\\in E}\\|x\\|\_{V}<+\\infty}$. $ \\Box$  

Making use of the basic inequality $ {|\\lambda(v)|\\leq\\|\\lambda\\|\_{V^{\*}}\\|v\\|\_{V}}$, we obtain  

> **Corollary 9** *[](https://www.blogger.com/null)Weakly and weak-starly convergent sequences are bounded. In fact, if $ {x\_{n}\\rightharpoonup x}$ in $ {V}$, then*  
> 
> *$ \\displaystyle \\|x\\|\_{V}\\leq\\liminf\_{n\\rightarrow\\infty}\\|x\_{n}\\|\_{V}. $*
> 
> *Similarly, if $ {\\lambda\_{n}\\rightharpoonup^{\*}\\lambda}$ in $ {V^{\*}}$, then*  
> 
> *$ \\displaystyle \\|\\lambda\\|\_{V^{\*}}\\leq\\liminf\_{n\\rightarrow\\infty}\\|\\lambda\_{n}\\|\_{V^{\*}}. $*
> 
> *Moreover, strict inequalities can hold. See Example [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exa1).*

We shall develop the converse to the above corollary except relaxed to subsequences in reflexive spaces, known as the *Banach-Eberlein-Smulian theorem*. Thus weak and weak\* topologies enjoy much better compactness properties, in contrast to the strong (i.e. norm) topologies. For later purpose we need the following observation, which follows directly from the above corollary.  

> **Lemma 10** *[](https://www.blogger.com/null)Let $ {V}$ be a Banach space. Then the closed unit ball in $ {V}$ is closed in the weak topology; also, the closed unit ball in $ {V^{\*}}$ is closed in the weak\* topology.*

Note that the statement for unit sphere is certainly false (more or less a paraphrase of that strict inequality can hold in Corollary [9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#corWeakly-and-weak-starly)).  

**1.3. Weak compactness: from the view****point** **of product topological spaces, again**

> **Example 3** *Let $ {V=c\_{0}(\\mathbb{N})}$ (equipped with sup-norm), $ {V^{\*}=\\ell^{1}(\\mathbb{N})}$, $ {\\left(V^{\*}\\right)^{\*}=\\ell^{\\infty}(\\mathbb{N})}$ .*  
> 
> *-   Suppose $ {x\_{n}\\rightharpoonup x}$ in $ {V}$. We know the sequence is bounded in sup-norm. By definition of weak convergence, we have
>     
>     $ \\displaystyle \\sum\_{i=1}^{\\infty}a^{(i)}x\_{n}^{(i)}\\rightarrow\\sum\_{i=1}^{\\infty}a^{(i)}x^{(i)}<+\\infty $
>     
>     for all $ {a=(a^{(i)})\_{i=1}^{\\infty}\\in\\ell^{1}(\\mathbb{N})}$. Then take
>     
>     $ \\displaystyle a=\\sum\_{i=1}^{\\infty}\\frac{1}{2^{i}}e\_{i}. $
>     
>     We see that
>     
>     $ \\displaystyle \\sum\_{i=1}^{\\infty}\\frac{1}{2^{i}}\\left|x\_{n}^{(i)}-x^{(i)}\\right|\\rightarrow0. $
>     
>     This implies $ {x\_{n}\\rightarrow x}$ pointwisely in $ {V}$. By a similar argument we can see that the converse is also true: a bounded sequence that converges pointwisely will also converge weakly in $ {V}$.
> -   Similarly, a sequence $ {\\lambda\_{n}\\rightharpoonup^{\*}\\lambda}$ in $ {V^{\*}}$ if and only if the sequence $ {(\\lambda\_{n})\_{n=1}^{\\infty}}$ is bounded in $ {\\ell^{1}(\\mathbb{N})}$ and converge pointwise to $ {\\lambda}$. For the "only if'' part, we take $ {x=e\_{i}}$ the standard basis in $ {c\_{0}(\\mathbb{N})}$ and verify the statement. For the "if'' part, note by definition that each $ {x\\in c\_{0}(\\mathbb{N})}$ satisfies for any $ {\\epsilon>0}$, there is $ {m>0}$ such that
>     
>     $ \\displaystyle \\sup\_{n>m}|x^{(n)}|<\\epsilon. $
>     
>     The pointwise convergence of $ {\\lambda\_{n}\\in\\ell^{1}(\\mathbb{N})}$ thus implies for all $ {x\\in V}$
>     
>     $ \\displaystyle \\begin{array}{rcl} (\\lambda\_{n}-\\lambda)(x) & = & \\sum\_{i=1}^{\\infty}(\\lambda\_{n}^{(i)}-\\lambda^{(i)})x^{(i)}\\\\ & \\leq & \\epsilon\\left(\\sup\_{0<i<m}|x^{(i)}|+\\|\\lambda\_{n}\\|+\\|\\lambda\\|\\right) \\end{array} $
>     
>     for $ {n,m}$ large enough. This establishes the claimed equivalence.
> -   We can regard the situation (1) as a weak-starly convergent sequence in $ {\\left(V^{\*}\\right)^{\*}}$ via the isometric embedding $ {V\\hookrightarrow\\left(V^{\*}\\right)^{\*}}$.*

As is perhaps anticipated, the space $ {\\ell^{1}(\\mathbb{N})}$ (or $ {\\ell^{\\infty}(\\mathbb{N})}$) at the level of sets can be embedded into the product space $ {\\mathbb{R}^{\\mathbb{N}}=\\prod\_{i=1}^{\\infty}\\mathbb{R}^{(i)}}$. Furhtermore, if we consider the closed unit ball $ {B^{\*}}$ (or more generally any closed bounded subset) in$ {\\ell^{1}(\\mathbb{N})}$ (or $ {\\ell^{\\infty}(\\mathbb{N})}$) to be embedded into the product space $ {\[-1,1\]^{\\mathbb{N}}}$ (note that $ {\\|a\\|\_{1}\\leq1}$ implies $ {|a^{(i)}|\\leq1}$ for all $ {i\\in\\mathbb{N}}$; similar statement holds for $ {\\|\\cdot\\|\_{\\infty}}$), the argument given in the above example in effect identified the weak{\*} topology with the product topology on $ {\[-1,1\]^{\\mathbb{N}}}$ restricted to $ {B^{\*}}$. Moreover, $ {B^{\*}}$ is closed in $ {\[-1,1\]^{\\mathbb{N}}}$ by Lemma [10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem13). Now the *Tychonoff theorem* implies that $ {\[-1,1\]^{\\mathbb{N}}}$ is compact with product topology, so $ {B^{\*}}$ is compact in the weak\* topolgy. The sequential compactness $ {B}$ follows similarly.  
The above argument can be generalized, leading to the *Banach-Alaoglu theorem*.  

> **Theorem 11** *[](https://www.blogger.com/null)(Banach-Alaoglu) Let $ {V}$ be a normed vector space. Then the closed unit ball of $ {V^{\*}}$ is compact in the weak\* topology.*

Some additional care is needed for its sequential counterpart.  

> **Theorem 12** *(Sequential Banach-Alaoglu) Let $ {V}$ be a separable normed vector space. Then the closed unit ball of $ {V^{\*}}$ is sequentially compact in the weak\* topology.*

*Proof:* Let $ {B}$, $ {B^{\*}}$ be the closed unit ball in $ {V}$ and $ {V^{\*}}$. Any element $ {\\lambda\\in B^{\*}}$ maps $ {B}$ to $ {\[-1,1\]}$, as shown by the inequality[](https://www.blogger.com/null)  

[$ \\displaystyle |\\lambda(x)|\\leq\\|\\lambda\\|\\|x\\|\\leq\\|x\\|\\leq1 \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for $ {x\\in B}$. Since $ {V}$ is separable, there is a countable dense (in the sense of norm) subset $ {Q\\subset B}$. Restrict $ {B^{\*}}$ to $ {Q}$, we can identify $ {B^{\*}\\downharpoonright\_{Q}}$ with a closed subset of $ {\[-1,1\]^{Q}}$, which by the *sequential Tychonoff theorem* is sequentially compact in the product topology. Therefore, any sequence in $ {B^{\*}}$ contains a subsequence converging pointwisely on $ {Q}$. But by the estimate ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) (which in effect says $ {B^{\*}}$ is uniformly equicontinuous on $ {B}$), we conclude that the subsequence converges pointwisely on $ {B}$. The sequential compactness of $ {B^{\*}}$ thus follows. $ \\Box$  

> **Remark 2** *[](https://www.blogger.com/null)One can also prove the theorem by observing that the weak\* topology on the closed unit ball $ {B^{\*}}$is *metrisable*: let $ {\\{x\_{i}\\}\_{i=1}^{\\infty}}$ be an enumeration of the countable dense subset in $ {B}$, define*  
> 
> *$ \\displaystyle d(\\lambda\_{1},\\lambda\_{2})=\\sum\_{n=1}^{\\infty}\\frac{1}{2^{n}}\\left|\\lambda\_{1}(x\_{n})-\\lambda\_{2}(x\_{n})\\right| $*
> 
> *which is a metric induces the weak\* topology on $ {B^{\*}}$. And then invoke the Heine-Borel theorem [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Heine-Borel\)) and the Banach-Alaoglu theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Banach-Alaoglu\)-Let-).*

> **Remark 3** *It is essential to have the separability assumption. A counterexample: the closed unit ball in $ {\\left(\\ell^{\\infty}(\\mathbb{N})\\right)^{\*}}$ is not sequentially compact.*

If the space $ {V}$ is reflexive, i.e. $ {V\\equiv\\left(V^{\*}\\right)^{\*}}$, then by identifying the weak\* topology on $ {\\left(V^{\*}\\right)^{\*}}$ and the weak topology on $ {V}$, and combining with Proposition ([8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#prop11)), we obtain:  

> **Corollary 13** *(Banach-Eberlein-Smulian) If $ {V}$ is a reflexive Banach space, then any bounded sequence in contains a weakly convergent subseqeunce.*

> **Remark 4** *In fact, the converse to the above corollary is also true. See [here](http://math.stackexchange.com/questions/199478/equivalence-of-reflexive-and-weakly-compact) for more discussion.*

> **Remark 5** *One should compare the Banach-Eberlein-Smulian theorem to the Heine-Borel theorem for metric spaces. The value of the former theorem lies in the fact that weak topology on an infinite dimensional normed vector space is not *metrisable*, so that the latter theorem doesn't apply.*  
> *It is especially curious in the case of a separable Hilbert space, in which case the weak and weak\* topologies are identified. While the weak topology is not metrisable, when restricted to the closed unit ball, it becomes metrisable, as the Remark [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#remmetrisable) shows.*
