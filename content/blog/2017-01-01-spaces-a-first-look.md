---
id: 2017-01-01-spaces-a-first-look
title: "$ {L^{p}}$ spaces: a first look"
date: 2017-01-01
tags: ["functional analysis", "real analysis"]
source: https://sylqiu.blogspot.com/2017/01/lp-spaces-first-look.html
publish: true
---
\[**Note**\]: This post grows out of my need to record various basic results on $L^p$ spaces, also to look into the details of more interesting topics including *modes of convergence*, *dual spaces*, *interpolations of $L^p$ spaces*,...  
Here I also tried to synthesise some results that are often seen as exercises in textbooks to fit into the picture. After finish writing I feel what lies at the core in this part of the theory is, of course, *Hölder's inequality.*  
The main references are Stein and Sakarchi's book of functional analysis, Rudin's book and Terry's notes.  

In the construction of Lebesgue integration on a general unsigned measure space $ {(X,\\mathfrak{M},\\mu)}$, the class of $ {L^{1}}$-integrable functions is readly built into the integration theory, namely, the extended-real-valued measurable functions $ {f:X\\rightarrow\[-\\infty,+\\infty\]}$ satisfying the absolute integrable condition  

$ \\displaystyle \\int\_{X}|f|d\\mu<\\infty. $

A notable feature of Lebesgue integration is that it doen't "count'' the behavior of a function on a null set. Indeed, recall that we have adopted the convention that  

$ \\displaystyle +\\infty\\cdot0=-\\infty\\cdot0=0 $

which we have to use when *definining* the integral for simple functions. This makes the multiplilcation to be *upward continuous*, in the sense that if $ {x\_{n}\\geq0\\nearrow x}$ and $ {y\_{n}\\geq0\\nearrow y}$, then $ {x\_{n}y\_{n}\\geq0\\nearrow xy}$. We don't have this general convergence for monotonely decreasing ones. Ultimately, it leads to approximating integrals from below rather than above, as prominently shown by *monotone convergence theorem*. Thus we see that the measurable function can behave arbitrarily on an unknown null set, where the integral (if exists) still remains unchanged. It is now that we take a step forward to consider "functions'' that are only defined *almost everywhere, abbr. a.e.*, i.e. the equivalent classes modulo a.e. equality, with the caution that we now lost the ability to evaluate the equivalent class $ {\[f\]}$ at a specific point $ {x\\in X}$. However it is almost harmless to think of these equivalent classes as functions in practice. We deonte by $ {L^{1}(\\mu)}$, or simply $ {L^{1},}$ the space of all equivalent classes of functions that are absolutely integrable on the measure space $ {(X,\\mathfrak{M},\\mu)}$. And the context should be clear where we are using functions or equivalent classes. As an immediate consequence of $ {L^{1}}$-integrability, we have $ {|f|<\\infty}$ a.e. This is sometimes useful for developing a.e. convergence of certain integrands.  

Now we can define $ {L^{p}(\\mu)}$ to be the space of all measurable functions $ {f}$ such that its $ {p}$-th power is absolutely integrable, $ {0<p<\\infty}$. And the notation  

$ \\displaystyle \\|f\\|\_{p}=\\left(\\int\_{X}|f|^{p}d\\mu\\right)^{1/p}. $

We also define $ {L^{\\infty}(\\mu)}$ to be the space of *essentially bounded* measurable functions, namely there exists $ {0<M<+\\infty}$ such that  

$ \\displaystyle |f(x)|\\leq M\\quad a.e.\\ x $

and the notation  

$ \\displaystyle \\|f\\|\_{\\infty}=\\inf\\{M:|f(x)|\\leq M\\quad a.e.\\ x\\}. $

In this post we shall look into some generalities of $ {L^{p}}$ spaces.  

#### **1.1. Various structures on $ {L^{p}}$, $ {0<p\\leq\\infty}$**

Here we will be working in the base field $ {\\mathbb{R}}$. Of course, the case of $ {\\mathbb{C}}$ as the base field is similar.  

**Vector space structure**

Fix $ {0<p<\\infty}$ and $ {f,g\\in L^{p}}$, we have a pointwise crude bound  

$ \\displaystyle |f(x)+g(x)|\\leq2\\max\\{|f(x)|,|g(x)|\\}; $

taking $ {p}$-th power, we have  

$ \\displaystyle \\begin{array}{rcl} |f(x)+g(x)|^{p} & \\leq & 2^{p}\\max\\{|f(x)|,|g(x)|\\}^{p}\\\\ & = & 2^{p}\\max\\{|f(x)|^{p},|g(x)|^{p}\\}\\\\ & \\leq & 2^{p}(|f(x)|^{p}+|g(x)|^{p}); \\end{array} $

integrating, we see that $ {f+g\\in L^{p}}$. Similarly, we can verify that $ {c\\cdot f\\in L^{p}}$ for $ {c\\in\\mathbb{R}}$. For $ {p=\\infty}$ the verification is easier. This shows that $ {L^{p}}$, $ {0<p\\leq\\infty}$, is a vector space over the reals.  

**Metric and Norm structure**

First we discuss *non-dengeneracy* of $ {\\|\\cdot\\|\_{p}}$. We have that $ {\\|f\\|\_{p}=0}$ if and only if $ {f=0}$, where the equivalent class definition is crucially used. Indeed, abusing the notation we take a function $ {f}$ from the equivalent class $ {f}$, then we can set up the "exceptional sets'' by defining \\begin{align\*} E\_{n} & =\\{x\\in X:|f(x)|\\geq1/n\\}  
E & =\\{x\\in X:|f(x)|\\neq0\\} \\end{align\*} so that  

$ \\displaystyle E=\\bigcup\_{n=1}^{\\infty}E\_{n}. $

It is often easier to deal with subparts $ {E\_{n}}$ which have specific controls, rather than $ {E}$ itself. Indeed, a contradiction argument shows that $ {E\_{n}}$ is null for each $ {n}$, and hence $ {E}$ as a countable union of null set is null. We thus conclude that $ {\\|f\\|\_{p}=0}$ implies $ {f=0}$ a.e.. Now if $ {0<p<1}$, by the elementary inequality $ {(x+y)^{p}\\leq x^{p}+y^{p}}$ for $ {x,y>0}$, we have[](https://www.blogger.com/null)  

[$ \\displaystyle \\|f+g\\|\_{p}^{p}\\leq\\|f\\|\_{p}^{p}+\\|g\\|\_{p}^{p}. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Thus it is possible to equip $ {L^{p}}$, $ {0<p<1}$, a metric structure by declaring $ {d(f,g)=\\|f-g\\|\_{p}^{p}}$. However, this metric is not *homogeneous*. While the homogeneity of $ {\\|\\cdot\\|\_{p}}$, $ {0<p\\leq\\infty}$ is clear, not all $ {0<p\\leq\\infty}$ can be endowed with a norm structure.  

> **Proposition 1** *Let $ {0<p\\leq\\infty}$, and $ {f,g\\in L^{p}}$.*  
> 
> *-   (Quasi-triangle inequality)
>     
>     $ \\displaystyle \\|f+g\\|\_{p}\\leq C\\left(\\|f\\|\_{p}+\\|g\\|\_{p}\\right) $
>     
>     for some constant $ {C}$.
> -   The best constant for $ {0<p<1}$ in above is $ {C=2^{\\frac{1}{p}-1}}$. In particular, the triangle inequality is faulse when $ {0<p<1}$. In these cases we only have $ {\\|\\cdot\\|\_{p}}$ as quasi-norms.
> -   When $ {p\\geq1}$, the best constant is $ {C=1}$. This is known as Minkowski inequality, and thus $ {\\|\\cdot\\|\_{p}}$ defines a norm on $ {L^{p}}$ when $ {p\\geq1}$.*

To show (2), we need an important inequality that exploits convexity.  

> **Lemma 2** *(Jensen's inequality, integral version) Let $ {\\mu}$ be a probability measure on $ {\\Omega}$ (i.e. $ {\\mu}$ is unsigned and $ {\\mu(\\Omega)=1}$). If $ {f\\in L^{1}(\\mu)}$ with range $ {a<f(x)<b}$, $ {a,b}$ can possibly take $ {\\pm\\infty}$, and $ {\\varphi:(a,b)\\rightarrow\\mathbb{R}}$ is convex, then*  
> 
> *$ \\displaystyle \\varphi(\\int\_{\\Omega}fd\\mu)\\leq\\int\_{\\Omega}(\\varphi\\circ f)d\\mu. $*
> 
> *Note that the corresponding discrete version can be obtained by considering counting measure.*

Recall that $ {\\varphi}$ is convex if  

$ \\displaystyle \\varphi((1-\\theta)x+\\theta y)\\leq(1-\\theta)\\varphi(x)+\\theta\\varphi(y); $

assuming without loss of generality that $ {x<y}$, subtracting $ {\\varphi(x)}$ on both sides and dividing by $ {\\theta(y-x)}$, we get  

$ \\displaystyle \\frac{\\varphi((1-\\theta)x+\\theta y)-\\varphi(x)}{\\theta(y-x)}\\leq\\frac{\\varphi(y)-\\varphi(x)}{y-x}; $

rewriting $ {s=x}$, $ {u=y}$, $ {t=(1-\\theta)x+\\theta y}$, we have $ {a<s<t<u<b}$ and the equivalent formulation  

$ \\displaystyle \\frac{\\varphi(t)-\\varphi(s)}{t-s}\\leq\\frac{\\varphi(u)-\\varphi(t)}{u-t}. $

*Proof:* Let $ {t=\\int\_{\\Omega}fd\\mu}$. Clearly $ {a<t<b}$. Let $ {s}$ be such that $ {a<s<t}$ and  

$ \\displaystyle \\beta=\\sup\_{a<s<t}\\frac{\\varphi(t)-\\varphi(s)}{t-s}. $

Then $ {\\beta\\geq\\frac{\\varphi(t)-\\varphi(s)}{t-s}}$ and rearranging we get  

$ \\displaystyle \\varphi(s)\\geq\\varphi(t)+\\beta(s-t) $

for $ {a<s<t}$. Also by convexity $ {\\beta\\leq\\frac{\\varphi(u)-\\varphi(t)}{u-t}}$ for any $ {u>t}$, and rearraging we see  

$ \\displaystyle \\varphi(u)\\geq\\varphi(t)+\\beta(u-t). $

Thus $ {\\varphi(s)\\geq\\varphi(t)+\\beta(s-t)}$ holds for all $ {a<s<b}$. Since $ {\\varphi}$ is continuous (as a result of convexity), $ {\\varphi\\circ f}$ is measurable. Hence taking $ {s=f(x)}$, integrating the inequality, and recall our choice of $ {t}$ and $ {\\mu(\\Omega)=1}$, we get  

$ \\displaystyle \\begin{array}{rcl} & & \\int\_{\\Omega}\\varphi(f(x))d\\mu-\\varphi(\\int\_{\\Omega}f(x)d\\mu)+\\beta(\\int\_{\\Omega}f(x)d\\mu-\\int\_{\\Omega}f(x)d\\mu)\\\\ & = & \\int\_{\\Omega}\\varphi(f(x))d\\mu-\\varphi(\\int\_{\\Omega}f(x)d\\mu)\\\\ & \\geq & 0 \\end{array} $

$ \\Box$  

 Now, observe that $ {t\\mapsto|t|^{1/p}}$ is convex if $ {0<p<1}$, by ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), homogeneity of $ {\\|\\cdot\\|\_{p}}$ and discrete version of Jensen's inequality,  

$ \\displaystyle \\begin{array}{rcl} \\|f+g\\|\_{p} & = & 2\\|\\frac{1}{2}f+\\frac{1}{2}g\\|\_{p}\\\\ & \\leq & \\left(2(\\|\\frac{1}{2}f\\|\_{p}^{p}+\\|\\frac{1}{2}g\\|\_{p}^{p})\\right)^{1/p}\\\\ & \\leq & 2^{\\frac{1}{p}-1}\\left(\\|f\\|\_{p}+\\|g\\|\_{p}\\right). \\end{array} $

To prove (3), one can use the convexity of $ {t\\mapsto t^{p}}$ when $ {p\\geq1}$ to obtain a direct proof. However, we shall rely on the following inequality which itself is of considerable interest. For $ {1\\leq p\\leq\\infty}$, we call $ {q}$ the *conjugate exponent* of $ {p}$ if  

$ \\displaystyle \\frac{1}{p}+\\frac{1}{q}=1 $

with the convention $ {q=\\infty}$ if $ {p=1}$ and vice versa.  

> **Lemma 3** *(Hölder's inequality) Let $ {1\\leq p\\leq\\infty}$, $ {q}$ be the conjugate exponent of $ {p}$, and $ {f\\in L^{p}}$, $ {g\\in L^{q}}$. Then*  
> 
> *$ \\displaystyle \\int\_{X}|fg|d\\mu\\leq\\left(\\int\_{X}|f|^{p}d\\mu\\right)^{1/p}\\left(\\int\_{X}|g|^{q}d\\mu\\right)^{1/q}, $*
> 
> *with the equality achieved if and only if $ {f,g}$ are multiples of each other a.e..*

*Proof:* The endpoint cases $ {p=1,\\infty}$, as well as either $ {f}$ or $ {g}$ vanishes a.e. are trivial. So we may assume $ {1<p<\\infty}$ and $ {f,g\\neq0}$ everywhere (since we may add the zero part to the integration later, but they don't contribute to the integrals). Then replacing $ {f,g}$ by $ {f/\\|f\\|\_{p}}$, $ {g/\\|g\\|\_{q}}$, we may assume $ {\\|f\\|\_{p}=\\|g\\|\_{q}=1}$. Now it suffices to establish  

$ \\displaystyle \\int\_{X}|fg|d\\mu\\leq1. $

If $ {|f(x)|,|g(x)|>0}$, there exist $ {s(x),t(x)}$ such that $ {e^{s/p}=|f|}$, $ {e^{t/q}=|g|}$. Convexity of the exponential gives  

$ \\displaystyle e^{s/p+t/p}\\leq p^{-1}e^{s}+q^{-1}e^{t}. $

Note that the equality holds if and only if $ {s=t}$. Now, integrating both sides we get  

$ \\displaystyle \\int\_{X}|fg|d\\mu\\leq p^{-1}\\left(\\int\_{X}|f|^{p}d\\mu\\right)+q^{-1}\\left(\\int\_{X}|g|^{q}d\\mu\\right)=1. $

$ \\Box$  

 Now we deduce Minkowski's inequality from Hölder's inequality. *Proof:* We may assume $ {f,g\\in L^{p}}$ are positive, $ {1\\leq p\\leq\\infty}$. Write $ {(f+g)^{p}=f(f+g)^{p-1}+g(f+g)^{p-1}}$. By Hölder's inequality,  

$ \\displaystyle \\begin{array}{rcl} \\int(f+g)^{p} & = & \\int f(f+g)^{p-1}+\\int g(f+g)^{p-1}\\\\ & \\leq & \\left(\\int f^{p}\\right)^{1/p}\\left(\\int\\left(f+g\\right)^{q(p-1)}\\right)^{1/q}+\\left(\\int g^{p}\\right)^{1/p}\\left(\\int\\left(f+g\\right)^{q(p-1)}\\right)^{1/q}\\\\ & = & \\left(\\|f\\|\_{p}+\\|g\\|\_{p}\\right)\\left(\\int\\left(f+g\\right)^{q(p-1)}\\right)^{1/q}. \\end{array} $

Dividing both sides by $ {\\left(\\int\\left(f+g\\right)^{q(p-1)}\\right)^{1/q}}$, and recalling that $ {q(p-1)=p}$, and $ {1-1/q=1/p}$, we obtain the desired result. $ \\Box$  

> **Remark 1** *One can easily get a slightly more general form of Hölder's inequality*  
> 
> *$ \\displaystyle \\|fg\\|\_{r}\\leq\\|f\\|\_{p}\\|g\\|\_{q} $*
> 
> *for $ {{\\displaystyle \\frac{1}{r}=\\frac{1}{p}+\\frac{1}{q}},}$ $ {p,q>0}$ and $ {f\\in L^{p}}$, $ {g\\in L^{q}}$. We see that Hölder's inequality is useful to get a upper bound in terms of norms of larger exponents. One can deduce a "reverse'' Hölder's inequality:*  
> 
> *$ \\displaystyle \\|fg\\|\_{1}\\geq\\|f\\|\_{r}\\|g\\|\_{s} $*
> 
> *for $ {0<r<1}$ with $ {s}$ (now $ {<0}$) still defined by the comjugate exponent formula. We see that in this case we can get a lower bound in terms of norm of smaller exponents. So in general, one cannot hope to obtain an upper bound in terms of norms of lower exponents, or vice versa, solely based Hölder's inequality without other prices to pay (e.g. Moser's iteration).* 

**Metric-induced topological structure on $ {L^{p}}$, $ {0<p\\leq\\infty}$.**

The (quasi-)norms $ {\\|\\cdot\\|\_{p}}$ will naturally induce a topology on $ {L^{p}}$, by declaring the collection of all open (quasi-)metric balls  

$ \\displaystyle B(x,r)=\\{y\\in L^{p}:\\|x-y\\|\_{p}<r\\} $

to be a *base* of the topology, in other words the topology generated by the open (quasi-)metric balls. Recall that a *base* of the topology means that any open set can be written as a possibly uncountable union of the elements in the base. To see that they can form a base of the topology, consider $ {z\\in B(x,r)}$. We ask if there exists $ {t>0}$ such that $ {B(z,t)\\subset B(x,r)}$. Indeed, if $ {1\\leq p\\leq\\infty}$ we may take $ {t=(r-\\|x-z\\|\_{p})/2}$, then by Minkowski inequality, we have for every $ {z'\\in B(z,t)}$  

$ \\displaystyle \\|x-z'\\|\_{p}\\leq\\|x-z\\|\_{p}+\\|z-z'\\|\_{p}<\\|x-z\\|\_{p}+t<r; $

in case $ {0<p<1}$, we may take $ {t^{p}=(r^{p}-\\|x-z\\|\_{p}^{p})/2}$ and use inequality ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)). Note the crucial role played by these "triangle inequalities''. Because of the non-degeneracy of $ {\\|\\cdot\\|\_{p}}$, these topologies are Hausdorff. A sequence $ {f\_{n}\\in L^{p}}$ is said to be convergent in $ {L^{p}}$ of there is $ {f\\in L^{p}}$ such that $ {\\|f\_{n}-f\\|\_{p}\\rightarrow0}$ as $ {n\\rightarrow\\infty}$. We refer to this convergence as the *strong convergence* in $ {L^{p}}$. Because the topology induced by $ {L^{p}}$ is Hausdorff, the limit, if exists, is unique.  

**Banach space structure of $ {L^{p}}$, $ {1\\leq p\\leq\\infty}$**

Now $ {L^{p}}$, $ {1\\leq p\\leq\\infty}$, is known to have a *normed vector space* structure. With the metric induced by the norm $ {\\|\\cdot\\|\_{p}}$, we can talk about *(metric) Cauchy sequences* and *completeness* of these metric spaces. To prove that $ {L^{p}}$'s are complete, we single out a useful argument that generalizes *Weierstrass M-test*:  

> **Lemma 4** *Let $ {(X,\\|\\cdot\\|)}$ be a normed space. The following statements are equivalent:*  
> 
> *-   $ {X}$ is a complete metric space.
> -   Every sequence $ {f\_{n}\\in V}$ which is absolutely convergent (i.e. $ {\\sum\_{n=1}^{\\infty}\\|f\_{n}\\|<\\infty}$), is also conditionally convergent (i.e. $ {\\sum\_{n=1}^{N}f\_{n}}$ converges to a limit as $ {N\\rightarrow\\infty}$).*

*Proof:* Assuming (1), and an absolutely convergent sequence $ {f\_{n}}$, we have for each $ {\\epsilon>0}$, there exist $ {N>0}$ such that $ {\\sum\_{n=N}^{\\infty}\\|f\_{n}\\|\\leq\\epsilon}$. Then for $ {l>k\\geq N}$, and by triangle inequality  

$ \\displaystyle \\|\\sum\_{n=1}^{l}f\_{n}-\\sum\_{n=1}^{k}f\_{n}\\|\\leq\\|\\sum\_{n=k+1}^{l}f\_{n}\\|\\leq\\sum\_{n=k+1}^{l}\\|f\_{n}\\|\\leq\\epsilon. $

Thus $ {\\{\\sum\_{n=1}^{N}f\_{n}\\}\_{N}}$ is a Cauchy sequence, and converges to a limit in $ {X}$. Reversing the argument we obtain the converse. $ \\Box$  

> **Proposition 5** *[](https://www.blogger.com/null)$ {L^{p}}$ is a Banach space for every $ {1\\leq p\\leq\\infty}$.*

*Proof:* We show that any absolutely convergent series $ {\\sum\_{n=1}^{\\infty}f\_{n}}$ in $ {L^{p}}$ is also conditionally convergent in $ {L^{p}}$.  
For $ {1\\leq p<\\infty}$, let $ {M:=\\sum\_{n=1}^{\\infty}\\|f\_{n}\\|\_{p}<\\infty}$. By triangle inequality,  

$ \\displaystyle \\|\\sum\_{n=1}^{N}|f\_{n}|\\|\_{p}\\leq\\sum\_{n=1}^{N}\\|f\_{n}\\|\_{p}\\leq M $

for all $ {N}$. By Fatou's lemma, $ {\\|\\sum\_{n=1}^{\\infty}|f\_{n}|\\|\_{p}\\leq M}$. In particular, $ {\\sum\_{n=1}^{\\infty}|f\_{n}|<\\infty}$ a.e.. and so is $ {\\sum\_{n=1}^{\\infty}f\_{n}<\\infty}$ a.e.. Write $ {F(x)=\\sum\_{n=1}^{\\infty}f\_{n}}$. We see by dominated convergence theorem that $ {\\sum\_{n=1}^{N}f\_{n}}$ converges to $ {F}$ strongly in $ {L^{p}}$. For $ {p=\\infty}$, let $ {E\_{N}=\\{x\\in X:\\sum\_{n=1}^{N}|f\_{n}|>M\\}}$. We see that $ {E\_{N}}$ has measure zero for each $ {N>0}$. Then $ {E=\\bigcup\_{N}E\_{N}}$ is a null set.Thus for each $ {x}$ outside of $ {E}$, we have  

$ \\displaystyle \\sum\_{n=1}^{N}|f\_{n}(x)|\\leq M $

for all $ {N}$. By triangle inequality we see that the series converges uniformly outside of $ {E}$. $ \\Box$  

 Recycling the proof where we find an a.e. converging series, we obtain:  

> **Corollary 6** *A sequence $ {f\_{n}}$ converging strongly to $ {f}$ in $ {L^{p}}$ contains a subsequence converging to $ {f}$ a.e..*

> **Remark 2** *Borrowing the proof of Proposition [5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propLpcomplete), and taking care of the varaint of the triangle inequality, one can show that $ {L^{p}}$, $ {0<p<1}$, are complete metric spaces, though not $ {\\|\\cdot\\|\_{p}}$-normed vector spaces.*

#### **1.2. Relations between $ {L^{p}}$ spaces**

We begin by asking when there are possible inclusion relations between $ {L^{p}}$ spaces. The situation is simple when the space is of finite measure. Suppose $ {p\_{0}<p\_{1}}$, $ {f\\in L^{p\_{1}}}$. We have $ {p\_{1}/p\_{0}>1}$. So Hölder's inequality gives  

$ \\displaystyle \\int\_{X}|f^{p\_{0}}\\cdot1|d\\mu\\leq\\left(\\int\_{X}|f|^{p\_{1}}d\\mu\\right)^{p\_{0}/p\_{1}}(\\mu(X))^{1-p\_{0}/p\_{1}}. $

So we get:  

> **Proposition 7** *If $ {\\mu(X)<\\infty}$, and $ {p\_{0}\\leq p\_{1}}$, then $ {L^{p\_{1}}\\subset L^{p\_{0}}}$ and*  
> 
> *$ \\displaystyle \\|f\\|\_{p\_{0}}\\leq\\mu(X)^{\\frac{1}{p\_{0}}-\\frac{1}{p\_{1}}}\\|f\\|\_{p\_{1}}. $*

Of course, such inequality is not expected to hold when the underlying space has infinite measure. For example, the function  

$ \\displaystyle f(x)=\\frac{1}{x^{1/p}(\\log(x^{2})+1)} $

on $ {(0,+\\infty)}$ belongs to only $ {L^{p}((0,+\\infty),\\mathcal{L}^{1})}$. To see what are the issues, we consider the example of Lebesgue measure $ {\\mathcal{L}}$ on $ {\\mathbb{R}}$. There is plenty of room for a function in $ {L^{r}(\\mathcal{L})}$ to fail $ {L^{s}}$ integrability, for $ {0<r<s\\leq\\infty}$. Consider  

$ \\displaystyle f(x)=\\sum\_{n=1}^{\\infty}\\left(2^{n}\\right)^{1/s}1\_{\[n,n+2^{-n}\]} $

which is in $ {L^{r}(\\mathcal{L})}$ but not in $ {L^{s}(\\mathcal{L})}$. So even if the individual support $ {1\_{\[n,n+2^{-n}\]}}$ get exponentially decreasing measure, the function can blowup no slower than the decrease in support.  
  On the other hand, we have a reversed inclusion for $ {\\ell^{p}(\\mathbb{Z})}$ - the space $ {\\mathbb{Z}}$ equipped with counting measure. Indeed, as a special case it is easy to see that $ {\\ell^{p}(\\mathbb{Z})\\subset\\ell^{\\infty}(\\mathbb{Z})}$ since $ {\\sup|a\_{n}|\\leq\\left(\\sum|a\_{n}|^{p}\\right)^{1/p}<\\infty}$ if $ {\\{a\_{n}\\}\\in\\ell^{p}(\\mathbb{Z})}$. Now if $ {p\_{0}\\leq p\_{1}}$ and $ {\\{a\_{n}\\}\_{n\\in\\mathbb{Z}}\\in\\ell^{p\_{0}}}$,  

$ \\displaystyle \\begin{array}{rcl} \\sum|a\_{n}|^{p\_{1}} & = & \\sum|a\_{n}|^{p\_{0}}|a\_{n}|^{p\_{1}-p\_{0}}\\\\ & \\leq & \\left(\\sup|a\_{n}|\\right){}^{p\_{1}-p\_{0}}\\sum|a\_{n}|^{p\_{0}}\\leq\\left(\\sum|a\_{n}|^{p\_{0}}\\right)^{p\_{1}/p\_{0}}. \\end{array} $

We can improve from $ {\\ell^{p}}$ to slightly more general setting. Assume every set in $ {X}$ of positive measure is of measure at least $ {m}$. Let $ {f\\in L^{p}}$. We find a bound for the supremum in terms of $ {L^{p}}$-norm. Let $ {x\\in X}$ be such that  

$ \\displaystyle |f(x)|+\\epsilon>\\sup|f(x)|. $

And let $E$ be a set of finite positive measure where each $x\\in E$ satisfies the above for some $\\epsilon$small enough. Then  

$ \\displaystyle \\int\_{X\\backslash E}|f(x)|^{p}d\\mu+\\int\_{E}\\left(|f(x)|+\\epsilon\\right)^{p}d\\mu\\geq\\int\_{E}\\left(|f(x)|+\\epsilon\\right)^{p}d\\mu>\\int\_{E}\\sup|f(x)|d\\mu \\geq m\\cdot\\sup|f(x)|. $

Sending $ {\\epsilon\\rightarrow0}$, we have $ {\\|f\\|\_{p}^{p}\\geq\\int\_{E}\\sup|f(x)|d\\mu\\geq m\\cdot\\sup|f(x)|}$. So we have for $ {p\_{0}\\leq p\_{1}}$  

$ \\displaystyle \\begin{array}{rcl} \\left(\\int\_{X}|f|^{p\_{1}}\\right)^{1/p\_{1}} & = & \\left(\\int\_{X}|f|^{p\_{0}}|f|^{p\_{1}-p\_{0}}\\right)^{1/p\_{1}}\\\\ & \\leq & \\left(\\int|f|^{p\_{0}}\\right)^{1/p\_{1}}\\left(\\sup|f|^{p\_{1}-p\_{0}}\\right)^{1/p\_{1}}\\\\ & \\leq & \\left(\\int|f|^{p\_{0}}\\right)^{1/p\_{1}}\\left(\\int|f|^{p}\\right)^{\\frac{1}{p\_{0}p\_{1}}(p\_{1}-p\_{0})}m^{\\frac{1}{p\_{0}p\_{1}}(p\_{1}-p\_{0})}\\\\ & = & \\left(\\int|f|^{p\_{0}}\\right)^{1/p\_{0}}m^{\\frac{1}{p\_{0}}-\\frac{1}{p\_{1}}}. \\end{array} $

Summarising, we have:  

> **Proposition 8** *If $ {p\_{0}\\leq p\_{1}}$, then $ {\\ell^{p\_{0}}(\\mathbb{Z})\\subset\\ell^{p\_{1}}(\\mathbb{Z})}$. Futhermore, we have $ {\\|a\_{n}\\|\_{p\_{1}}\\leq\\|a\_{n}\\|\_{p\_{0}}}$. More generally, if $ {(X,\\mathfrak{M},\\mu)}$ is such that every set in $ {X}$ of positive measure is of measure at least $ {m}$. Then $ {L^{p\_{0}}\\subset L^{p\_{1}}}$, and $ {\\left(\\int\_{X}|f|^{p\_{1}}\\right)^{1/p\_{1}}\\leq\\left(\\int|f|^{p\_{0}}\\right)^{1/p\_{0}}m^{\\frac{1}{p\_{0}}-\\frac{1}{p\_{1}}}}$.*

We can now chacterise the finite measure spaces $ {(X,\\mathfrak{M},\\mu)}$ such that $ {L^{r}(\\mu)=L^{s}(\\mu)}$ for $ {1<r<s\\leq\\infty}$.  

> **Proposition 9** *Suppose $ {\\mu(X)<\\infty}$. Then $ {L^{r}(\\mu)=L^{s}(\\mu)}$ for $ {1<r<s\\leq\\infty}$ if and only if every set in $ {X}$ of positive measure is of measure at least $ {m}$.*

Next we ask if we have $ {f\\in L^{r}\\cap L^{s}}$, do we have $ {f\\in L^{p}}$ if $ {r<p<s}$? This is a prototypical question of *interpolation*, which ask if one can extablish the bound for the "in between'' cases given the bound of the "endpoint'' cases. Here, letting  

$ \\displaystyle \\frac{1}{p}=\\frac{\\theta}{r}+\\frac{1-\\theta}{s}, $

we note that by Hölder's inequality  

$ \\displaystyle \\begin{array}{rcl} \\left(\\int|f|^{p}\\right)^{1/p} & = & \\left(\\int|f|^{p\\theta}|f|^{p(1-\\theta)}\\right)^{1/p}\\\\ & \\leq & \\left(\\int|f|^{\\theta\\cdot\\frac{r}{\\theta}}\\right)^{\\theta/r}\\left(\\int|f|^{(1-\\theta)\\cdot\\frac{s}{1-\\theta}}\\right)^{(1-\\theta)/s}\\\\ & \\leq & \\|f\\|\_{r}^{\\theta}\\|f\\|\_{s}^{1-\\theta}. \\end{array} $

Hence $ {f\\in L^{p}}$. Taking logarithm of the above inequality, we see that  

$ \\displaystyle \\log\\|f\\|\_{p}\\leq\\theta\\log\\|f\\|\_{r}+(1-\\theta)\\log\\|f\\|\_{s}. $

This says the function $ {p\\mapsto\\log\\|f\\|\_{p}}$ is *convex*.  

  Finally, we inspect under the finite measure assuption $ {\\mu(X)<\\infty}$, the convergence of $ {\\|\\cdot\\|\_{p}}$ when $ {p\\rightarrow0}$ or $ {\\infty}$. We have  

> **Proposition 10** *Suppose $ {\\mu(X)<\\infty}$ and $ {f\\in L^{\\infty}}$. Then $ {f\\in L^{p}}$ for all $ {p<\\infty}$ and*  
> 
> *$ \\displaystyle \\|f\\|\_{p}\\rightarrow\\|f\\|\_{\\infty} $*
> 
> *as $ {p\\rightarrow\\infty}$.*

*Proof:* We may assume ssume $ {f\\neq0}$, otherwise we may restrict to the support of $ {f}$. We already know that $ {f\\in L^{p}}$. Note that  

$ \\displaystyle \\|f\\|\_{p}\\leq\\left(\\int\_{X}\\|f\\|\_{\\infty}^{p}d\\mu\\right)^{1/p}=\\|f\\|\_{\\infty}\\mu(X)^{1/p}. $

Letting $ {p\\rightarrow\\infty}$ we get $ {\\limsup\_{p\\rightarrow\\infty}\\|f\\|\_{p}\\leq\\|f\\|\_{\\infty}}$. On the other hand, let $ {E\_{\\epsilon}=\\{x\\in X:|f(x)|\\geq\\|f\\|\_{\\infty}-\\epsilon\\}}$. We have $ {\\mu(E\_{\\epsilon})\\geq\\delta\_{\\epsilon}>0}$. Then  

$ \\displaystyle \\int\_{X}|f|^{p}d\\mu\\geq\\delta\_{\\epsilon}(\\|f\\|\_{\\infty}-\\epsilon)^{p}. $

Taking $ {1/p}$-th pwer, and sending $ {p\\rightarrow\\infty}$, we have $ {\\liminf\_{p\\rightarrow\\infty}\\|f\\|\_{p}\\geq\\|f\\|\_{\\infty}-\\epsilon}$. Finally, sending $ {\\epsilon\\rightarrow0}$ we obtain the desired result. $ \\Box$  

> **Proposition 11** *Suppose $ {\\mu(X)<\\infty}$ and $ {f\\in L^{p\_{0}}}$ for some $ {0<p\_{0}\\leq\\infty}$. Then $ {f\\in L^{p}}$ for all $ {p<p\_{0}}$ and*  
> 
> *$ \\displaystyle \\|f\\|\_{p}^{p}\\rightarrow\\mu(\\text{supp}(f)) $*
> 
> *as $ {p\\rightarrow0}$.*

*Proof:* Write $ {E=\\text{supp}(f)}$. We already know that $ {f\\in L^{p}}$ for all $ {p<p\_{0}}$. Since $ {p\_{0}/p>1}$, by Hölder's inequality,  

$ \\displaystyle \\int\_{X}|f\\chi\_{E}|^{p}d\\mu\\leq\\left(\\int\_{X}|f|^{p\\cdot\\frac{p\_{0}}{p}}d\\mu\\right)^{\\frac{p}{p\_{0}}}\\mu(E)^{1-\\frac{p}{p\_{0}}}=\\|f\\|\_{p\_{0}}^{p}\\mu(E)^{1-\\frac{p}{p\_{0}}}. $

Sending $ {p\\rightarrow0}$, we get $ {\\limsup\_{p\\rightarrow0}\\|f\\|\_{p}^{p}\\leq\\mu(E)}$. On the other hand, let $ {E\_{\\epsilon}=\\{x\\in X:|f(x)|\\geq\\epsilon\\}}$. We have $ {\\mu(E\_{\\epsilon})\\rightarrow\\mu(E)}$ when $ {\\epsilon\\rightarrow0}$. Then  

$ \\displaystyle \\int\_{X}|f|^{p}d\\mu\\geq\\epsilon^{p}\\mu(E\_{\\epsilon}). $

Taking $ {p\\rightarrow0}$, we get $ {\\liminf\_{p\\rightarrow0}\\|f\\|\_{p}^{p}\\geq\\mu(E\_{\\epsilon})}$. Sending $ {\\epsilon\\rightarrow0}$, we obtain the desired result. $ \\Box$
