---
id: 2017-01-06-hahn-banach-theorem-dual-spaces-and-their-representations
title: "Hahn-Banach theorem, Dual spaces and Their Representations"
date: 2017-01-06
tags: ["functional analysis", "real analysis"]
source: https://sylqiu.blogspot.com/2017/01/hahn-banach-theorem-dual-spaces-and.html
publish: true
---
**1.1. From Radon-Nikodym theorem to Linear functionals on $ {L^{p}}$, $ {1\\leq p<\\infty}$**

In case $ {1\\leq p\\leq\\infty}$, we have Hölder's inequality  

$ \\displaystyle \\int\_{X}|f\\bar{g}|d\\mu\\leq\\left(\\int\_{X}|f|^{p}\\right)^{1/p}\\left(\\int\_{X}|g|^{q}\\right)^{1/q} $

where $ {q}$ is the conjugate exponent of $ {p}$, and $ {f\\in L^{p}}$, $ {g\\in L^{q}}$. Thus fixing $ {g\\in L^{q}}$, we can regard the map  

$ \\displaystyle \\lambda\_{g}:f\\mapsto\\int\_{X}f\\bar{g}d\\mu $

as a *bounded linear functional* (thus equivalently continuous) on $ {L^{p}}$. Since the equality in Hölder's inequality holds if and only if $ {f}$ and $ {\\bar{g}}$ are scalar multiple of each other, taking $ {{\\displaystyle f=\\frac{\\text{sign}(g)g^{q-1}}{\\|g^{q-1}\\|\_{p}}}}$ (note that this lies in $ {L^{p}}$) , we see that the *operator norm* of $ {\\lambda\_{g}}$ is exactly $ {\\|g\\|\_{q}}$. Thus we see that the map $ {\\iota:g\\mapsto\\lambda\_{g}\\in\\mathscr{L}(L^{p}\\rightarrow\\mathbb{C})}$ is an *isometric embedding* of $ {L^{q}}$ into the space of bounded linear functional on $ {L^{p}}$. We shall see that the map $ {\\iota}$ is in fact an isometry, for $ {1\\leq p<\\infty}$. Before developing the general theory of *dual spaces*, here is a quick application of Radon-Nikodym theorem when the measure $ {\\mu}$ is $ {\\sigma}$-finite. Recall that  

> **Theorem 1** *(Radon-Nikodym theorem) If on $ {(X,\\mathfrak{M})}$ $ {\\mu}$ is an unsigned $ {\\sigma}$-finite measure, and $ {\\nu}$ is an signed finite measure, then follwing are equivalent:*  
> 
> *-   $ {\\nu=\\mu\_{f}}$ for some absolutely integrable $ {f}$;
> -   $ {\\nu(E)=0}$ whenever $ {\\mu(E)=0}$;
> -   For all $ {\\epsilon>0}$, there is $ {\\delta>0}$ such that $ {|\\nu(E)|<\\epsilon}$ whenever $ {\\mu(E)<\\delta}$.*

Of course, the corollary extends to the cases where $ {\\lambda}$ is a finite signed measure or complex measure.  
*Proof:* (1) implies (3) (this is absolute continuity of integrals). (3) implies (2). By Lebesgue-Radon-Nikodym theorem, (2) implies (1). $ \\Box$  

> **Theorem 2** *[](https://www.blogger.com/null)Let $ {1\\leq p<\\infty}$, and assume $ {\\mu}$ is $ {\\sigma}$-finite. Let $ {\\lambda:L^{p}\\rightarrow\\mathbb{C}}$ be a bounded linear functional. Then there exists a unique $ {g\\in L^{q}}$ such that $ {\\lambda=\\lambda\_{g}}$.*

*Proof:* The uniqueness follows from that if $ {\\lambda\_{g'}=\\lambda\_{g}}$, then $ {\\int\_{E}g'-gd\\mu=0}$ for any measurable $ {E}$, thus $ {g=g'}$ a.e..  
Suppose first that $ {\\mu}$ is finite. Now to show that every bounded linear functional $ {\\lambda}$ on $ {L^{p}}$ arises as $ {\\lambda\_{g}}$ for some $ {g}$, following the suggestion of Radon-Nikodym we define a set function $ {\\nu:\\mathfrak{M}\\rightarrow\\mathbb{C}}$ by[](https://www.blogger.com/null)  

[$ \\displaystyle \\nu(E):=\\lambda(\\chi\_{E}). \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Since $ {\\lambda}$ is linear, and $ {\\chi\_{E\_{1}\\sqcup E\_{2}}=\\chi\_{E\_{1}}+\\chi\_{E\_{2}}}$, finite additivity follows. Since $ {\\mu}$ is finite, dominated convergence theorem shows whenever $ {E\_{1},E\_{2},\\dots}$ is a sequence of disjoint set,  

$ \\displaystyle \\mu(\\bigsqcup\_{n}E\_{n})=\\sum\_{n}\\mu(E\_{n}), $

i.e. $ {\\chi\_{\\sqcup\_{i=1}^{n}E\_{i}}}$ converges in $ {L^{p}}$. Since $ {\\lambda}$ is continuous, $ {\\lambda(\\chi\_{\\sqcup\_{i=1}^{n}E\_{i}})}$ converges in $ {L^{p}}$. Thus $ {\\nu}$ is countably additive, and hence a finite complex measure. By Radon-Nikodym, there is a $ {g\\in L^{1}}$ such that $ {\\nu=\\mu\_{g}}$, which defines a \`\`functional''  

$ \\displaystyle \\lambda\_{g}:f\\mapsto\\int\_{X}fd\\mu\_{g}=\\int\_{X}f\\bar{g}d\\mu $

where we haven't known which space it acts on, so for now it's just a notation! By construction ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), $ {\\lambda\_{g}}$ and $ {\\lambda}$ agree on indicator functions $ {\\chi\_{E}}$. By linearity, they agree on simple functions. Since the space of simple function is dense in $ {L^{\\infty}}$, any function $ {f\\in L^{\\infty}}$ is a uniform limit of a sequence of simple functions $ {f\_{i}}$. Then  

$ \\displaystyle \\begin{array}{rcl} |\\lambda\_{g}(f\_{i})-\\lambda(f)| & \\leq & |\\lambda\_{g}(f\_{i})-\\lambda(f\_{i})|+|\\lambda(f\_{i})-\\lambda(f)|\\\\ & = & |\\lambda(f\_{i})-\\lambda(f)|\\rightarrow0 \\end{array} $

since $ {\\lambda}$ is continuous and $ {\\|f\_{i}-f\\|\_{p}\\rightarrow0}$, while  

$ \\displaystyle |\\lambda\_{g}(f\_{i})-\\lambda\_{g}(f)|\\leq\\int\_{X}\\|f\_{i}-f\\|\_{\\infty}|g|d\\mu\\rightarrow0. $

Thus $ {\\lambda\_{g}}$ and $ {\\lambda}$ agree on $ {L^{\\infty}}$. Since $ {\\mu}$ is finite, $ {L^{\\infty}\\subset L^{p}}$ is dense by dominated convergence theorem, they will agree on all functions in $ {L^{p}}$ if $ {\\lambda\_{g}}$ can be defined on $ {L^{p}}$. Now it suffices to show $ {g\\in L^{q}}$. For $ {p=1}$, taking any $ {E\\in\\mathfrak{M}}$, since $ {\\lambda}$ is bounded, there is a constant $ {C}$  

$ \\displaystyle |\\lambda(\\chi\_{E})|=|\\int\\chi\_{E}\\bar{g}d\\mu|\\leq C\\mu(E) $

we conclude that $ {|g|\\leq C}$ a.e. and thus $ {g\\in L^{\\infty}}$. For $ {1<p<\\infty}$, we take $ {f\_{n}=|g|^{q-1}\\chi\_{|g|\\leq n}\\in L^{\\infty}}$ and  

$ \\displaystyle \\begin{array}{rcl} |\\lambda(f\_{n})| & = & |\\int\_{X}|g|^{q-1}\\chi\_{|g|\\leq n}\\bar{g}d\\mu|\\\\ & = & \\int\_{X}|g|^{q}\\chi\_{|g|\\leq n}d\\mu\\\\ & \\leq & C\\|f\_{n}\\|\_{p}\\\\ & = & C\\left(\\int\_{X}|g|^{q}\\chi\_{|g|\\leq n}d\\mu\\right)^{1/p}. \\end{array} $

Thus $ {\\left(\\int\_{X}|g|^{q}\\chi\_{|g|\\leq n}d\\mu\\right)^{1/q}\\leq C}$ uniformly in $ {n}$. Taking $ {n\\rightarrow\\infty}$ and by monotone convergence theorem, we conclude that $ {g\\in L^{q}}$. To extend to the $ {\\sigma}$-finite setting, find an ascending sequence of finite measure sets $ {E\_{n}}$ that exhaust $ {X}$, then apply the above argument to get $ {g\_{n}}$ defined on each $ {E\_{n}}$. Uniqueness shows that these $ {g\_{n}}$ all agree on common defined areas, and their $ {L^{q}}$-norm are bounded by the same constant (the operator norn of $ {\\lambda}$) as the above has shown. Thus use monotone convergence to conclude the desired result. $ \\Box$  

The Radon-Nikodym theorem is used in a rather crucial way, and so is Hölder's inequality! The first gives us the candidate, and the second tells us it is bounded in $ {L^{q}}$.  
In fact, The Radon-Nikodym theorem itself can be regarded as a manifestation of *duality*, where the notion of *convexity* will play a crucial role. Not incidentally, Hölder's inequality as we have seen, depends ultimately on the convexity of the exponential function.  
It would be more fruitful to discuss these in the more general setting of *topological vector spaces* (i.e. those equipped with a topology such that vector space operations are continuous), and to see how they are related by one of the most important results in functional analysis: the Hahn-Banach theorem.  

**1.2. Continuous linear functionals and Hahn-Banach theorem**

The space $ {\\mathscr{L}(L^{p}\\rightarrow\\mathbb{C})}$ we saw in the last section is a special case of spaces of continuous linear operators. Let $ {X,Y}$ be topological vector spaces, and let $ {\\mathscr{L}(X\\rightarrow Y)}$ denote the space of all continuous linear operators from $ {X}$ to $ {Y}$. It has the structure of a vector space: define \\begin{align\*} (S+T)(x): & =Sx+Tx, \\end{align\*} and for any $ {c\\in\\mathbb{C},}$  

$ \\displaystyle cSx:=c(Sx). $

Because $ {+,c\\cdot}$ are continuous operations on $ {Y}$, we see that $ {S+T}$, $ {cS}$ are again continuous linear operators. If $ {X,Y}$ are normed, then equipping with the operator norm we turn $ {\\mathscr{L}(X\\rightarrow Y)}$ into a normed vector space. Furthermore, if $ {Y}$ is complete, then $ {\\mathscr{L}(X\\rightarrow Y)}$ is complete also, regardless the completeness of $ {X}$. Indeed, if $ {A\_{1},A\_{2},\\dots}$ is a Cauchy sequence, for any $ {x\\in X}$ we can define $ {A(x)=\\lim\_{n\\rightarrow\\infty}A\_{n}(x)}$ since $ {Y}$ is complete. Thus defined $ {A}$ is continuous:  

$ \\displaystyle \\|A(x)\\|\\leq\\|(A-A\_{n})x\\|+\\|A\_{n}\\|\\|x\\| $

and for $ {n,m}$ large enough  

$ \\displaystyle \\begin{array}{rcl} \\|(A\_{n}-A)x\\| & \\leq & \\|(A-A\_{m})x\\|+\\|(A\_{m}-A\_{n})x\\|\\\\ & \\leq & \\|(A-A\_{m})x\\|+\\epsilon\\|x\\| \\end{array} $

and choosing $ {m}$ large enough, which depends on $ {x}$, we get  

$ \\displaystyle \\|(A\_{n}-A)x\\|\\leq2\\epsilon\\|x\\|. $

We see $ {\\|A\_{n}-A\\|\\rightarrow0}$ as $ {n\\rightarrow\\infty}$.  

> **Definition 3** *The space $ {\\mathscr{L}(X\\rightarrow\\mathbb{C})}$ of all continuous linear functionals on a topological vector space $ {X}$ is called the *dual space* of $ {X}$, denoted $ {X^{\*}}$.*

From the above discussion we see that $ {X^{\*}}$ is a Banach space. And if $ {X\_{1},X\_{2}}$ are identified with some dense subspaces of the Banach space $ {X}$, their dual spaces will be isometric to $ {X^{\*}}$. This says that any densely defined linear functional on a Banach space has a unique isometric extension.  
The dual space of a Hilbert space is particularly simple:  

> **Theorem 4** *[](https://www.blogger.com/null)(Riesz representation for Hilbert spaces) Let $ {(H.(\\cdot,\\cdot))}$ be a (complex) Hilbert space, $ {\\lambda:H\\rightarrow\\mathbb{C}}$ is a continuous linear functional. Then there exists a unique $ {v}$ in $ {H}$ such that $ {\\lambda=(\\cdot,v)}$. In particular, we see that the dual space of a Hilbert space is isomorphic to itself.*

*Proof:* Uniqueness is easy. Suppose $ {\\lambda\\neq0}$. Then the kernel of $ {\\lambda}$ is not the whole space, so pick a $ {w}$ not in the kernel and normalise to unit length. Then for any $ {x\\in H}$, it projects to $ {w}$ with coefficient $ {\\lambda(x)/\\lambda(w)}$, what is remaining writes  

$ \\displaystyle x-\\frac{\\lambda(x)}{\\lambda(w)}w $

and is orthogonal to $ {w}$, so $ {(x,w)=\\lambda(x)/\\lambda(w)}$ and $ {\\lambda(x)=(x,\\overline{\\lambda(w)}w)}$, as desired. $ \\Box$  

 However, it is absolutely not trivial that thedual space of some other topological vector space isn't just $ {\\{0\\}}$ !  

> **Example 1** *[](https://www.blogger.com/null)Equipp $ {\[0,1\]}$ with the usual Lebesgue measure. Consider the metric space $ {L^{1/2}\[0,1\]}$ of $ {1/2}$-integrable extended-real-valued functions, with metric $ {d(f,g)=\\|f-g\\|\_{\\frac{1}{2}}^{\\frac{1}{2}}}$ , which we have seen in a previous post. Suppose $ {\\varphi\\in\\left(L^{1/2}\\right)^{\*}}$ is non-trivial. Then the image of $ {\\varphi}$ is the whole real line, in particular there exists $ {f\_{0}\\in L^{1/2}}$ such that*  
> 
> *$ \\displaystyle \\varphi(f\_{0})\\geq1. $*
> 
> *We will find a sequence $ {f\_{n}\\rightarrow0}$ in $ {d(\\cdot,\\cdot)}$ yet $ {\\varphi(f\_{n})\\geq1}$ for each $ {n}$, violating the continuity of $ {\\varphi}$, and conclude that $ {\\left(L^{1/2}\\right)^{\*}=\\{0\\}}$! The construction uses a \`\`pigeon hole'' argument. Observe that the function $ {s\\mapsto\\int\_{0}^{s}|f(x)|^{1/2}dx}$ is continuous. So there exists $ {t\\in(0,1)}$ such that  
> *  
> 
> *$ \\displaystyle \\int\_{0}^{t}|f(x)|^{1/2}dx=\\frac{1}{2}\\int\_{0}^{1}|f(x)|^{1/2}dx. $*
> 
> *Let $ {g\_{1}(x)=f\\cdot\\chi\_{\[0,t\]}}$ and $ {g\_{2}=f-g\_{1}}$. Then by linearity, one of $ {g\_{i}}$ must be such that $ {\\varphi(g\_{i})\\geq2^{-1}}$. So $ {\\varphi(2g\_{i})\\geq1}$. Let $ {f\_{1}=2g\_{i}}$. On the other hand, we have $ {|f|\_{0}^{1/2}=|g\_{1}|^{1/2}+|g\_{2}|^{1/2}}$ since $ {g\_{1},g\_{2}}$ has disjoint support. So  
> *  
> 
> *$ \\displaystyle \\int\_{0}^{1}|g\_{1}(x)|^{1/2}dx=\\int\_{0}^{1}|g\_{2}(x)|^{1/2}dx=\\frac{1}{2}\\int\_{0}^{1}|f(x)|^{1/2}dx. $*
> 
> *These imply*  
> 
> *$ \\displaystyle \\int\_{0}^{1}|f\_{1}(x)|^{1/2}dx=2^{1/2}\\int\_{0}^{1}|g\_{i}(x)|^{1/2}dx=2^{-1/2}\\int\_{0}^{1}|f(x)|^{1/2}dx. $*
> 
> *Iterating this process, we obtain the desired sequence.  
> *

Looking at the above example more closely, we get two more conclusions: fisrt, the dual space of the metric space $ {L^{p}\[0,1\]}$, $ {0<p<1}$ are all trivial; second, in such a space, there exists a sequence of functions $ {f\_{1},f\_{2},\\dots}$ such that $ {\\|f\_{n}\\|\_{p}^{p}\\rightarrow0}$ but $ {\\|\\frac{1}{n}\\sum\_{i=1}^{n}f\_{i}\\|\_{p}^{p}\\rightarrow\\infty}$, that is the *convex combination* of a collection of points in the unit ball may lie outside of the unit ball! We say that such spaces are not *locally convex*.  

> **Definition 5** *(Local convexity) A topological vector space is said to be *locally comvex* if the convex open sets are a base for the topology.*

The reason why a non-trival continuous linear functional fail to exist in the setting of Example [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exaEquipp--with) can be cast as follows: the kernel of such a continuous linear functional is a closed subspace with codimension one (we also say that the kernel forms a hyperplane), namely there is a one dimensional subspace where the linear functional doesn't vanish. However if such a continuous linear functional were to exist, the closed hyperplane would need to separate a non-empty open convex subset $ {K}$ and another point lying outside of $ {K}$. However one can show that only the space $ {L^{1/2}}$ itself is open and convex in $ {L^{1/2}}$.  
The geometric form of *Hahn-Banach theorem* is already lurking in the background. However, we won't get into the theory of topological vector spaces any more here. We therefore state the theorem when $ {X}$ is a normed vector space.  

> **Theorem 6** *(Hahn-Banach) Let $ {X}$ be a normed vector space, and $ {Y}$ be a subspace of $ {X}$. Then any continuous linear functional $ {\\lambda\\in Y^{\*}}$ can be extended to a (not neccessarily unique) continuous linear functional $ {\\tilde{\\lambda}\\in X^{\*}}$ with the same operator norm.*

As an immediate consequence, for any nonzero element $ {x\\in X}$, We can define a linear functional $ {\\lambda}$ on the subspace spanned by $ {x}$ by $ {\\lambda(x)=\\|x\\|\_{X}}$ and extend by linearity. We have that $ {\\|\\lambda\\|\_{X\\rightarrow\\mathbb{C}}=1}$. By Hahn-Banach theorem, $ {\\lambda}$ extends isometrically to a linear functinoal $ {\\tilde{\\lambda}}$ on $ {X}$. Thus $ {X^{\*}}$ is non-trivial.  
Moreover, one can take the dual of the dual space, and naturally define a mapping $ {\\iota:X\\rightarrow(X^{\*})^{\*}}$ by  

$ \\displaystyle \\iota(x)\\lambda=\\lambda(x). $

We have $ {{\\displaystyle \\|\\iota(x)\\|\_{(X^{\*})^{\*}}=\\sup\_{\\|\\lambda\\|\\neq0}\\frac{|\\lambda(x)|}{\\|\\lambda\\|}\\leq\\frac{\\|\\lambda\\|\\|x\\|\_{X}}{\\|\\lambda\\|}=\\|x\\|\_{X}},}$ and by taking $ {\\lambda}$ such that $ {\\lambda(x)=\\|x\\|\_{X}}$ (as above) we see that $ {\\|\\iota(x)\\|\_{(X^{\*})^{\*}}=\\|x\\|\_{X}}$. This shows  

> **Theorem 7** *$ {\\iota:X\\rightarrow(X^{\*})^{\*}}$ is an isometric embedding.*

In general $ {\\iota}$ is only an inclusion, which is clear if $ {X}$ is not complete. There are Banach spaces $ {X}$ whose double dual $ {(X^{\*})^{\*}}$ is strictly larger than $ {X}$.  

> **Example 2** *Consider the space of compactly supported sequences $ {c\_{c}(\\mathbb{N})}$ with sup-norm $ {\\|\\cdot\\|\_{\\infty}}$. Let $ {\\lambda}$ be a bounded linear functional on $ {c\_{c}(\\mathbb{N})}$. For any $ {\\alpha=\\sum\\alpha\_{k}e\_{k}\\in c\_{c}(\\mathbb{N})}$ where only finitely many $ {\\alpha\_{k}\\neq0}$, we have by linearity*  
> 
> *$ \\displaystyle \\lambda(\\sum\\alpha\_{k}e\_{k})=\\sum\\alpha\_{k}\\lambda(e\_{k}). $*
> 
> *Thus we may write $ {\\lambda=\\sum\\lambda(e\_{k})e\_{k}^{\*}}$ where $ {e\_{k}^{\*}}$ is the "Kronecker delta'' (obviously we changed the notation to fit our purpose). Then*  
> 
> *$ \\displaystyle |\\lambda\\alpha|=\\left|\\sum\\alpha\_{k}\\lambda(e\_{k})\\right|\\leq\\sum|\\alpha\_{k}\\lambda(e\_{k})|\\leq\\|\\alpha\\|\_{\\infty}\\sum|\\lambda(e\_{k})|. $*
> 
> *Note that we can take $ {\\alpha=\\sum\_{k=1}^{n}\\text{sign}(\\lambda(e\_{k}))e\_{k}}$ and thus $ {|\\lambda\\alpha|=\\sum\_{k=1}^{n}|\\lambda(e\_{k})|}$. $ {\\lambda}$ is bounded means*  
> 
> *$ \\displaystyle \\sum\_{k=1}^{n}|\\lambda(e\_{k})|\\leq\\|\\lambda\\|\\|\\alpha\\|\_{\\infty}=\\|\\lambda\\|<\\infty $*
> 
> *holds for every $ {n}$. Thus the dual space of $ {c\_{c}(\\mathbb{N})}$ contains $ {\\ell^{1}(\\mathbb{N})}$, and easily elements in $ {\\ell^{1}(\\mathbb{N})}$ act as bounded lineat functional since*  
> 
> *$ \\displaystyle |\\lambda\\alpha|=\\left|\\sum\\alpha\_{k}\\lambda(e\_{k})\\right|\\leq\\sum|\\alpha\_{k}\\lambda(e\_{k})|\\leq\\|\\alpha\\|\_{\\infty}\\sum|\\lambda(e\_{k})|<\\infty $*
> 
> *if $ {\\lambda\\in\\ell^{1}(\\mathbb{N})}$. Thus $ {(c\_{c}(\\mathbb{N}))^{\*}\\equiv\\ell^{1}(\\mathbb{N})}$. The completion of $ {c\_{c}(\\mathbb{N})}$ under the sup-norm is the space $ {c\_{0}(\\mathbb{N})}$ of sequences that converge to zero. Thus $ {(c\_{0}(\\mathbb{N}))^{\*}\\equiv\\ell^{1}(\\mathbb{N})}$, recalling that any bounded linear functinal on $ {c\_{c}(\\mathbb{N})}$ extends uniquely to $ {c\_{0}(\\mathbb{N})}$ with the same operator norm. But the dual of $ {\\ell^{1}(\\mathbb{N})}$ is $ {\\ell^{\\infty}(\\mathbb{N})}$, which strictly contains $ {c\_{0}(\\mathbb{N})}$, as a special case of Theorem [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmLet-,-and) with $ {X=\\mathbb{N}}$ equipped with counting measure.*

We thus call $ {X}$ *reflexive* if $ {\\iota}$ is surjective. The canonical example of a relexive space is a Hilbert space, which is easily seen by applying Riesz representation twice. As we have shown in the begining of the post, under the $ {\\sigma}$-finite setting, the Lebesgue spaces $ {L^{p}}$, $ {1<p<\\infty}$ are also reflexive. This can in fact be extended beyond the $ {\\sigma}$-finite setting. What it relies on is a convexity result that guarantees an analog of *projection property* in a Hilbert space.  

> **Proposition 8** *(Hanner's inequalities) For $ {f,g\\in L^{p}(X,\\mathfrak{M},\\mu)}$ not neccessarily $ {\\sigma}$-finite, we have for $ {1\\leq p\\leq2}$*  
> 
> *$ \\displaystyle \\|f+g\\|\_{p}^{p}+\\|f-g\\|\_{p}^{p}\\geq\\left(\\|f\\|\_{p}+\\|g\\|\_{p}\\right)^{p}+\\left|\\|f\\|\_{p}+\\|g\\|\_{p}\\right|^{p} $*
> 
> *with the inequality reversed when $ {2\\leq p<\\infty}$. So if $ {p=2}$, the equality holds as a variant of parallalogram rule for the Hilbert space $ {L^{2}}$.*

The proposition (or alternatively, *Clarkson's inequality*) implies that $ {L^{p}}$, $ {1<p<\\infty}$ are *uniformly convex*, meaning that the unit ball in $ {L^{p}}$ is uniformly "round''; more precisely, for each $ {\\epsilon>0}$ there is $ {\\delta=\\delta(\\epsilon)}$ such that whenever $ {f,g\\in L^{p}}$ with $ {\\|f\\|\_{p}=\\|g\\|\_{p}=1}$ and $ {\\|f-g\\|\_{p}\\geq\\epsilon}$, then $ {\\|(f+g)/2\\|\_{p}\\leq1-\\delta}$.  

> **Proposition 9** *(Unique minimizer) Let $ {Y}$ be a closed subspace of a uniformly convex Banach space $ {X}$, and $ {x\_{0}\\in X}$. Then there exists a unique $ {y\\in Y}$ such that*  
> 
> *$ \\displaystyle \\|y-x\\|=\\inf\_{z\\in Y}\\|z-x\\|. $*

*Proof:* We may assume $ {x\_{0}\\notin Y}$. Then the infimum is positive, say $ {d}$, since $ {Y}$ is closed. Let $ {z\_{n}}$ be a minimizing sequence in $ {Y}$, namely $ {\\|z\_{n}-x\_{0}\\|\\rightarrow d}$ as $ {n\\rightarrow\\infty}$. We shall show that it is Cauchy, so that it converges to the minimizer $ {y\\in Y}$ since $ {Y}$ is closed. Suppose not, then by passing to a subsequence we find for some $ {\\epsilon\_{0}}$, $ {\\|z\_{n}-z\_{m}\\|>\\epsilon\_{0}}$ for all $ {m,n>0}$. Then  

$ \\displaystyle \\liminf\_{n,m\\rightarrow\\infty}\\|\\frac{z\_{n}-x\_{0}}{\\|z\_{n}-x\_{0}\\|}-\\frac{z\_{m}-x\_{0}}{\\|z\_{m}-x\_{0}\\|}\\|\\geq\\frac{1}{d}\\|z\_{n}-z\_{m}\\|>\\epsilon\_{0}/d. $

By uniform convexity, there is $ {\\delta>0}$  

$ \\displaystyle \\limsup\_{n,m\\rightarrow\\infty}\\|\\frac{z\_{n}-x\_{0}}{2\\|z\_{n}-x\_{0}\\|}+\\frac{z\_{m}-x\_{0}}{2\\|z\_{m}-x\_{0}\\|}\\|\\leq\\frac{1}{2d}\\limsup\_{n,m\\rightarrow\\infty}\\|z\_{n}+z\_{m}-2x\_{0}\\|=1\\leq1-\\delta $

a contradiction. $ \\Box$  

 This projection property helps to find the element in $ {L^{q}}$ that provides the linear functional in a similar way as we did in Theorem [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Riesz-representation-for), we omit the details.  

> **Remark 1** *It is worth mentioning that every uniformly convex Banach space is reflexive, a result known as *Milman-Pettis theorem*. Thus the reflexivity of $ {L^{p}}$, $ {1<p<\\infty}$ follows as a special case. Nevertheless the above argument is still needed to show the dual space of $ {L^{p}}$ is precisely $ {L^{q}}$.*

Assuming the duality of $ {L^{p}}$, $ {1<p<\\infty}$ , it is also possible to prove under the finite measure setting that the dual space of $ {L^{1}}$ is $ {L^{\\infty}}$ (and thus extends to $ {\\sigma}$-finite setting as usual). The argument exploits various inclusion relations of $ {L^{p}}$ spaces in the finite measure setting: given a continuous linear functional $ {\\lambda}$ defined on $ {L^{1}}$, we can restrict it to $ {L^{p}}$ for $ {p>1}$ to find the correponding functional $ {\\lambda\_{g\_{q}}}$ for some $ {g\\in L^{q}}$. Since any $ {L^{1}}$ function can be approximated to arbitrary accuracy by a function in $ {L^{p}}$ (indeed, $ {L^{p}\\subset L^{1}}$ is dense since $ {L^{p}}$ contains $ {L^{\\infty}}$ which is dense), the functioncal $ {\\lambda\_{g\_{q}}}$ thus approximates $ {\\lambda}$. Since all $ {\\lambda\_{g\_{q}}}$ are compatible with $ {\\lambda}$, and $ {L^{p}\\subset L^{1}}$, $ {g\_{q}}$ must be independent of $ {q}$. $ {g}$ must lie in $ {L^{\\infty}}$ since $ {\\lambda}$ is a bounded functional.  
It is an important fact that $ {L^{1}}$ is not reflexive in general, because the dual space of $ {L^{\\infty}}$ can be strictly larger than $ {L^{1}}$. This can be seen by the simple example of $ {\\ell^{\\infty}(\\mathbb{N})}$. Then limit functional $ {\\lim}$ is a continuous linear operator on $ {(c(\\mathbb{N}),\\|\\cdot\\|\_{\\infty})}$, the space of sequences that coverges, with operator norm $ {1}$. $ {c(\\mathbb{N})}$ is a subspace of $ {\\ell^{\\infty}(\\mathbb{N})}$ and thus by Hahn-Banach theorem, the limit functional extends to a bounded linear functional on $ {\\ell^{\\infty}(\\mathbb{N})}$, which vanishes on $ {c\_{0}(\\mathbb{N})}$. Thus this functional does not lie in $ {\\ell^{1}(\\mathbb{N})}$. This argument can extend to $ {L^{\\infty}(X)}$ where $ {X}$ contains a countable collection of disjoint set of positive measures (so that $ {L^{\\infty}}$ contains a isometric copy of $ {\\ell^{\\infty}(\\mathbb{N})}$).  

**1.3. Radon-Nikodym revisit**

First let us quickly show how the $ {L^{p}}$-$ {L^{q}}$ duality can be used to deduce Radon-Nikodym theorem. For simplicity, restrict to the case where we have two finite unsigned measure $ {\\nu}$ and $ {\\mu}$ on $ {X}$. Then $ {\\nu+\\mu}$ is again a finite unsigned measure. Taking $ {\\nu+\\mu}$ as our reference measure, we see that the functional $ {I\_{\\mu}:f\\mapsto\\int\_{X}fd\\mu}$ is continuous on the space $ {L^{1}(\\nu+\\mu)}$, then there exists $ {g\\in L^{\\infty}(\\nu+\\mu)}$ such that $ {I\_{\\mu}}$ can be represented to be[](https://www.blogger.com/null)  

[$ \\displaystyle I\_{\\mu}(f)=\\int\_{X}fd\\mu=\\int\_{X}f\\bar{g}d(\\nu+\\mu). \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Taking $ {f=\\chi\_{E}}$, we see that $ {g}$ must be real and non-negative, and $ {g\\leq1}$ $ {\[\\nu+\\mu\]}$-a.e.. Rearranging, we see that  

$ \\displaystyle \\int\_{X}fd\\mu-\\int\_{X}fgd\\mu=\\int\_{X}f(1-g)d\\mu=\\int\_{X}fgd\\nu. $

Let $ {E\_{0}=\\{x\\in X:g<1\\}}$ and $ {E\_{1}=\\{x\\in X:g=1\\}}$. We see that $ {E\_{0}}$ and $ {E\_{1}}$ are disjoint and $ {E\_{0}\\sqcup E\_{1}}$ has full $ {\\left(\\nu+\\mu\\right)}$-measure. Moreover, setting $ {f=\\chi\_{E\_{1}}}$  

$ \\displaystyle \\int\_{E\_{1}}(1-g)d\\mu=0=\\int\_{E\_{1}}gd\\nu, $

and thus  

$ \\displaystyle \\int\_{E\_{0}}(1-g)d\\mu=\\int\_{X}gd\\nu. $

We then verify by ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#7)) that $ {\\mu\\downharpoonright\_{E}}$ is singular to $ {\\nu}$, and $ {d\\mu=\\frac{g}{1-g}d\\nu}$ on $ {E\_{0}}$. This gives us the desired Lebesgue decompostion  

$ \\displaystyle d\\mu=\\frac{g}{1-g}d\\nu+d\\mu\\downharpoonright\_{E}. $

In fact, one can deduce Radon-Nikodym based solely on Riesz representation of the Hilbert space $ {L^{2}}$, exploiting the finite measure property of the space (as an observation due to von Neumann). We refer the details to Rudin's book.  

**1.4. Bounded linear functionals on LCH spaces**

Recall if $ {X}$ is locally compact Hausdorff (LCH), Riesz representation theorem says that every positive linear functional on $ {C\_{c}(X)}$ has a standard representation as an unsigned Borel measure on $ {X}$ that is finite on every compact set. If furthermore $ {X}$ is $ {\\sigma}$-compact, then the Borel measure is $ {\\sigma}$-finite, and is in fact a Radon measure. We expect to have an analogous representation theorem for bounded linear functionals on $ {C\_{c}(X)}$.  
The question is actually, what is the dual space of $ {C\_{c}(X)}$? This isn't well-posed since we haven't specify what norm (and hence topology) we put on $ {C\_{c}(X)}$. If $ {X}$ also comes with a measure, we may well use $ {L^{p}}$-norm ($ {1\\leq p\\le\\infty}$), and the representation is then given by the $ {L^{p}}$-$ {L^{q}}$ duality if $ {p\\neq\\infty}$.  
But there is a natural topology we can put on $ {C\_{c}(X)}$, namely the *topology of uniform convergence*, which can be given by the sup-norm $ {\\sup\_{x\\in X}|\\cdot|}$ (note we don't need any measure to define this). Thus any the limit of any convergent sequence is continuous, which means the completion of $ {C\_{c}(X)}$ is still a space of continuous function. But which one?  
Let $ {C\_{0}(X)}$ be the space of all continuous function that vanishes at infinity: for all $ {\\epsilon>0}$ there is a compact set $ {K\\subset X}$ such that $ {|f(x)|<\\epsilon}$ outside of $ {K}$. In particular, any element in $ {C\_{0}(X)}$ is bounded. We shall show that $ {C\_{c}(X)}$ is dense in $ {C\_{0}(X)}$ and $ {C\_{0}(X)}$ is complete with respect to the sup-norm.  
Indeed, given $ {f\\in C\_{0}(X)}$ and $ {\\epsilon>0}$, there is a compact set $ {K}$ such that $ {f(x)<\\epsilon}$ outside of $ {K}$. From Urysohn's lemma, there is a continous function $ {K\\prec g\\prec X}$. Taking $ {h=gf}$ we see that $ {\\sup|f-h|<\\epsilon}$. To see $ {C\_{0}(X)}$ is complete, take any Cauchy sequence $ {f\_{n}}$. But then $ {f\_{n}}$ converges uniformly to some $ {f}$. To see that $ {f\\in C\_{0}(X)}$, simply note that $ {\\sup|f\_{n}-f|}$ is small for $ {n}$ large enough.  
Now consider a Bounded linear functional $ {I}$ on $ {C\_{0}(X\\rightarrow\\mathbb{C})}$. Without loss of generality we may assume $ {\\|I\\|=1}$. And by separating the real and imaginaty part of the functions in $ {C\_{0}(X\\rightarrow\\mathbb{C})}$, and the values of the functionals, we may focus on the space $ {C\_{0}(X\\rightarrow\\mathbb{R})}$ and real-valued functionals instead. We wish to reduce to the unsigned case so that we can use the representation theorem. So we need decompose $ {I}$ into positive linear functionals. This is obviously similar to the case of decomposing signed measures into unsigned measures.  

> **Lemma 10** *(Jordan decomposition of functionals) Let $ {I\\in\\left(C\_{0}(X\\rightarrow\\mathbb{R})\\right)^{\*}}$. Then there exist positive bounded linear functionals $ {I^{+}}$, $ {I^{-}}$ such that $ {I=I^{+}-I^{-}}$.*

*Proof:* It is useful to have a \`\`total variation'' defined first. Note that if $ {\\Lambda}$ is a positive linear functional, then by Jordan decomposition of functions and linearity of $ {\\Lambda}$,  

$ \\displaystyle \\Lambda f=\\Lambda f^{+}-\\Lambda f^{-}. $

So the behavior of $ {\\Lambda}$ is entirely determined by its action on $ {C\_{c}(X\\rightarrow\\mathbb{R}\_{\\geq0})}$. So define first $ {I^{+}}$ a functional on $ {C\_{c}(X\\rightarrow\\mathbb{R}\_{\\geq0})}$ such that  

$ \\displaystyle I^{+}(f)=\\sup\\{\\left|I(h)\\right|:h\\in C\_{c}(X\\rightarrow\\mathbb{R}),|h|\\leq f\\}. $

Then $ {I^{+}(f)\\geq0}$, and $ {0\\leq f\_{1}\\leq f\_{2}}$ implies $ {I^{+}(f\_{1})\\leq I^{+}(f\_{2})}$. And if $ {c>0}$, we have $ {I^{+}(cf)=cI^{+}(f)}$. We need to establish linearity. Fix $ {f\_{1},f\_{2}\\in C\_{c}(X\\rightarrow\\mathbb{R}\_{\\geq0})}$, for any $ {\\epsilon>0}$ there exist $ {h\_{1}}$,$ {h\_{2}\\in C\_{c}(X\\rightarrow\\mathbb{R})}$ such that $ {|h\_{i}|\\leq f\_{i}}$, $ {I^{+}(f\_{i})\\leq|I(h\_{i})|+\\epsilon}$. Thus we have super-additivity:  

$ \\displaystyle \\begin{array}{rcl} I^{+}(f\_{1})+I^{+}(f\_{2}) & \\leq & |I(h\_{1})|+|I(h\_{2})|+2\\epsilon\\\\ & = & I\\left(\\text{sign}(I(h\_{1}))h\_{1}+\\text{sign}(I(h\_{1}))h\_{2}\\right)+2\\epsilon\\\\ & \\leq & I^{+}(|h\_{1}|+|h\_{2}|)+2\\epsilon\\leq I^{+}(f\_{1}+f\_{2})+2\\epsilon \\end{array} $

where the last two inequalities follows by definition of $ {I^{+}}$. On the other hand, if $ {g\\in C\_{c}(X\\rightarrow\\mathbb{R}\_{\\geq0})}$ is such that $ {g\\leq f\_{1}+f\_{2}}$. Then there is $ {g\_{1},g\_{2}\\in C\_{c}(X\\rightarrow\\mathbb{R}\_{\\geq0})}$ such that $ {g\_{i}\\leq f\_{i}}$. From this we get  

$ \\displaystyle |I(g)|=|I(g\_{1}+g\_{2})|\\leq|I(g\_{1})|+|I(g\_{2})|\\leq I^{+}(f\_{1})+I^{+}(f\_{2}) $

for any such $ {g}$. Thus we have sub-additivity and the linearity follows. Now since $ {I}$ is a bounded functional, $ {I^{+}}$ is bounded also, since for any $ {\\epsilon>0}$  

$ \\displaystyle I^{+}(|f|)\\leq|I(h)|+\\epsilon\\leq\\|I\\|\\|h\\|+\\epsilon=\\|h\\|+\\epsilon $

for some $ {h}$, thus we get $ {I^{+}(f)\\leq\\|f\\|}$. Taking $ {I^{-}=I^{+}-I}$ we obtain the claim. $ \\Box$  

> **Theorem 11** *(Riesz representation) If $ {X}$ is LCH, then every bounded linear functional $ {I}$ on $ {C\_{0}(X\\rightarrow\\mathbb{C})}$ is represented by a unique complex radon measure $ {\\mu}$, in the sense that*  
> 
> *$ \\displaystyle I(f)=\\int\_{X}fd\\mu $*
> 
> *for all $ {f\\in C\_{0}(X\\rightarrow\\mathbb{C})}$. Moreover, the norm of $ {I}$ is the total variation of $ {\\mu}$.*

*Proof:* Uniqueness is easy. As before we may reduce the to case $ {C\_{0}(X\\rightarrow\\mathbb{R})}$ and real-valued functionals, and $ {\\|I\\|=1}$. Taking $ {I=I^{+}-I^{-}}$ as in the previous lemma, we find Borel measures $ {\\mu\_{+}}$ and $ {\\mu\_{}}$ as their representations. Since $ {I^{+}}$, $ {I^{-}}$ are bounded, $ {\\mu\_{+}}$ and $ {\\mu\_{-}}$ are finite Borel measures, and so is $ {\\mu\_{+}-\\mu\_{-}}$. Thus they are all finite Radon measures.  
We in fact have $ {\\mu^{+}(X)\\leq1}$, and the linear functional $ {I}$ satisfies for all $ {f\\in C\_{c}(X)}$  

$ \\displaystyle |I(f)|\\leq I^{+}(|f|)=\\int\_{X}|f|d\\mu\_{+}. $

So $ {I}$ can also be extended to a linear functional on $ {L^{1}(\\mu\_{+})}$, with $ {L^{1}}$-operator norm at most one. And by Radon-Nikodym there is a Borel function $ {g\\in L^{\\infty}}$ with $ {|g|\\leq1}$ such that  

$ \\displaystyle I(f)=\\int\_{X}fgd\\mu\_{+}, $

which holds for all $ {C\_{c}(X)}$ and thus also for $ {C\_{0}(X)}$. Hence $ {d\\mu=gd\\mu\_{+}}$. Since $ {\\|I\\|=1}$, and $ {|\\int\_{X}gd\\mu\_{+}|\\leq\\int\_{X}|g|d\\mu\_{+}}$, we have  

$ \\displaystyle \\int\_{X}|g|d\\mu\_{+}\\geq\\|I\\|=1. $

Combining with the fact that $ {|g|\\leq1}$ we see that $ {|g|=1}$ $ {\[\\mu\_{+}\]}$-a.e. and $ {\\mu\_{+}(X)=1}$. Hence we conclude  

$ \\displaystyle d|\\mu|=|g|d\\mu\_{+}=d\\mu\_{+} $

and $ {|\\mu|(X)=\\mu\_{+}(X)=1=\\|I\\|}$. $ \\Box$  

> **Remark 2** *This result, written more succintly $ {(C\_{0}(X))^{\*}\\equiv M(X)}$ where $ {M(X)}$ is the space of finite Radon measures on a LCH space $ {X}$, generalizes the earlier discussion*  
> 
> *$ \\displaystyle (c\_{0}(\\mathbb{N}))^{\*}\\equiv\\ell^{1}(\\mathbb{N}). $*
