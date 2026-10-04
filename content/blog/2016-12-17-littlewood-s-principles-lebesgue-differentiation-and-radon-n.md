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
-   The class $ {L^{1}(\mathbb{R}^{n})}$ of extended real-valued Lebesgue integrable functions (more correctly, their equivalent classes) on $ {\mathbb{R}^{n}}$ is defined to be the measurable funcitons can be approximated by the subclass of simple functions on $ {\mathbb{R}^{n}}$, where one asks for the convergence of the integral of simple functions to converge to a real number, namely the convergence in $ {L^{1}}$-norm $ {\|\cdot\|_{1}}$.

It is evident that  

$ \displaystyle \text{\{step functions}\}\subset\text{\{simple functions}\}\subset L^{1}(\mathbb{R}^{n}). $

By construction, the family of simple functions is in dense in $ {L^{1}(\mathbb{R}^{n})}$. The family of step functions is also dense in the family of simple functions, which follows from the regulariy of Lebesgue measurable sets:  

> **Lemma 1** *(Littlewood's First principle) Let $ {\mathfrak{M}}$ be the $ {\sigma}$-algebra of Lebesgue measurable sets in $ {\mathbb{R}^{n}}$. Then for any $ {E\in\mathfrak{M}}$, there exist an open set $ {G}$ and closed set $ {F}$ with $ {F\subset E\subset G}$ and $ {\mu(G-F)<\epsilon}$.*  
> *Since closed sets in $ {\mathbb{R}^{n}}$ are $ {\sigma}$-compact, so in particular if $ {\mu(E)<\infty}$ we can choose $ {F}$ to be compact (this is the inner regularity of Lebesgue measurable sets). Consequently, there exist an $ {F_{\sigma}}$ set $ {A}$ and a $ {G_{\delta}}$ set $ {B}$ such that $ {A\subset F\subset B}$ and $ {\mu(B-A)=0}$.*

In fact, the Lebesgue outer measure $ {\mu_{*}}$ defines a *pesudometric* on the set of subsets of $ {\mathbb{R}^{n}}$, namely, by defining  

$ \displaystyle d(A,B)=\mu_{*}(A\Delta B) $

where $ {\Delta}$ refers to symmetric difference of the two sets. The pseudometic thus defines a topology on $ {\mathcal{P}(\mathbb{R}^{n})}$. Here one also sees the role played by the measure zero sets. The Lebesgue $ {\sigma}$-algebra $ {\mathfrak{M}}$ is the *completion* of Borel $ {\sigma}$-algebra $ {\mathcal{B}}$ on $ {\mathbb{R}^{n}}$ with respect to the pseudometric. In particular $ {\mathfrak{M}}$ is *complete*, and is in fact unique in the sense of extension, thanks to Hahn-Kolmogorov extension theorem. In this spirit, we also have:  

> **Theorem 2** *(Riesz-Fischer) $ {L^{1}(\mathbb{R}^{n})}$ is a Banach space with respect to $ {\|\cdot\|_{1}}$. More generally, $ {L^{p}(\mathbb{R}^{n})}$ is complete with respect to $ {\|\cdot\|_{p}}$ for $ {1\leq p\leq\infty}$.*

Combined with the Lemma [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem1), we have the following *compeletion* with respect to $ {\|\cdot\|_{1}}$-norm  

$ \displaystyle \overline{\text{\{step functions}\}}=\overline{\text{\{simple functions}\}}=L^{1}(\mathbb{R}^{n}).      (1)$

On the other hand, in light of Riesz representation theorem, one can also approximate measurable functions with continuous functions of compact support. Thus we also have another completion with respect to $ {\|\cdot\|_{1}}$-norm  

$ \displaystyle \overline{\{C_{c}(\mathbb{R}^{n})\}}=L^{1}(\mathbb{R}^{n}). $

This fact is illustrated in  

> **Theorem 3** *(Littlewood's second principle) Let $ {f\in L^{1}(\mathbb{R}^{n})}$. Then for any $ {\epsilon>0}$, there exists a compactly supported continuous function $ {g\in C_{c}(\mathbb{R}^{n})}$ such that*  
> 
> *$ \displaystyle \|f-g\|_{1}<\epsilon. $*

*Proof:* In view of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), we only need to do it for the indicator function $ {\chi_{E}}$ for some measurable $ {E}$ with $ {\mu(E)<\infty}$. Apply Lemma [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem1), we have an open set $ {G}$ and a compact set $ {K}$ such that $ {K\subset E\subset G}$ and $ {\mu(G-K)<\epsilon}$. Now use Urysohn's lemma. $ \Box$  

The above can be roughly summerised as "measurable sets are not so different from open and closed sets in terms of taking their measures; integrable functions are not so different from simple functions in terms of taking their integrals''. This can be also applied to "mode of convergence'': Given a pointwise almost everywhere converging sequence of measurable functions, away from an exceptional set that is small, one can control at least locally its mode of convergence.  
We say that $ {f_{n}:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ converges *locally uniformly* to $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ if for every compact set $ {K\subset\mathbb{R}^{n}}$, $ {f_{n}}$ converges uniformly to $ {f}$.  

> **Theorem 4** *(Littlewood's third principle, Egorov's theorem) Let $ {f_{n}:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ be a sequence of measurable functions that converge pointwise almost everywhere to $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$. Let $ {\epsilon>0}$. Then there exists a measurable set $ {A_{\epsilon}\subset\mathbb{R}^{n}}$ with $ {\mu(A_{\epsilon})<\epsilon}$ such that $ {f_{n}\rightarrow f}$ locally uniformly on $ {\mathbb{R}^{n}-A_{\epsilon}}$.*  
> *In particular, if $ {f}$ is finitely supported, i.e. $ {E=\text{supp}(f)}$ is of finite measure, then there is a compact set $ {K_{\epsilon}}$ that takes the place of $ {\mathbb{R}^{n}-A_{\epsilon}}$ as above.*

*Proof:* After modifying a set of measure zero, we may assume $ {f_{n}\rightarrow f}$ pointwisely everywhere. Thus for every $ {x\in X}$, and for every $ {m>0}$, there exists $ {N=N(m)>0}$ such that  

$ \displaystyle |f_{n}(x)-f(x)|\leq1/m $

for all $ {n>N}$. Let $ {E_{m,N}=\{x\in X:|f_{n}(x)-f(x)|>1/m,\text{ for some }n>N\}}$. Then for fixed $ {m}$, $ {E_{m,N}}$ is measurable, descending in $ {N}$, and  

$ \displaystyle \bigcap_{N=1}^{\infty}E_{m,N}=\emptyset. $

Let $ {K}$ be any compact set. We then have by dominated convergence of measure,  

$ \displaystyle \lim_{N\rightarrow\infty}\mu(E_{m,N}\cap K)=0. $

Let $ {K_{i}}$ be such that $ {\mathbb{R}^{n}=\bigcup_{i=1}^{\infty}K_{i}}$. Then for any $ {m>0}$ we can find $ {N_{m}>0}$ big enough such that for all $ {N>N_{m}}$,  

$ \displaystyle \mu(E_{m,N}\cap K_{m})<\epsilon/2^{m}. $

Now let $ {A_{\epsilon}=\bigcup_{m=1}^{\infty}E_{m,N_{m}}\cap K_{m}}$. Then $ {A_{\epsilon}}$ is measurable with $ {\mu(A_{\epsilon})<\epsilon}$, and on $ {K-A_{\epsilon}}$  

$ \displaystyle |f_{n}(x)-f(x)|\leq1/m $

for all $ {n>N_{m}}$. This shows that $ {f_{n}\rightarrow f}$ locally uniformly on $ {\mathbb{R}^{n}-A_{\epsilon}}$. $ \Box$  

We record a direct consequence of the above theorem.  

> **Theorem 5** *(Lusin's theorem) Let $ {f}$ be a measurable function on $ {\mathbb{R}^{n}}$. Then for any $ {\epsilon>0}$, there exists a measurable set $ {A_{\epsilon}\subset\mathbb{R}^{n}}$ such that $ {\mu(A_{\epsilon})<\epsilon}$ and $ {f\downharpoonright_{\mathbb{R}^{n}-A_{\epsilon}}}$ is continuous.*

> **Remark 1** *Note that there is a difference in saying that $ {f\downharpoonright_{\mathbb{R}^{n}-A_{\epsilon}}}$ is continuous and $ {f}$ in continuous on $ {\mathbb{R}^{n}-A_{\epsilon}}$, where in the second case we cannot ignore $ {A_{\epsilon}}$ from the consideration of continuity. One may ask if $ {f\downharpoonright_{\mathbb{R}^{n}-A_{\epsilon}}}$ actually *arises from* some continuous function on $ {\mathbb{R}^{n}}$. Using *Tietze extension theorem*, one can show that it is true for spaces that are sufficiently nice such as $ {\mathbb{R}^{n}}$, namely the topological spaces that are *normal* and measurable sets are inner regular. Of course, all our discussion above can be applied to the situation where $ {\mathbb{R}^{n}}$ is replaced by a $ {\sigma}$-compact LCH space, where all measurable sets are inner regular.*

It is sometimes useful to use semi-continuous functions due to their generality.  

> **Definition 6** *(Semi-continuity) Let $ {X}$ be a topological space. A function $ {f:X\rightarrow\mathbb{R}}$ is said to be *upper semi-continuous, abbr. u.s.c.* if $ {f^{-1}((-\infty,a))}$ is open for all real $ {a}$; it is *lower semi-continuous, l.s.c.* if $ {-f}$ is u.s.c..*

An equivalent formulation in terms of local property is that $ {f}$ is u.s.c. at $ {x_{0}}$ if for any $ {\epsilon>0}$, there exist a neighborhood $ {U}$ of $ {x_{0}}$ such that  

$ \displaystyle f(y)-f(x_{0})<\epsilon $

for all $ {y\in U}$. In a metric space, this property can be expressed more succintly as  

$ \displaystyle \limsup_{y\rightarrow x_{0}}f(y)\leq f(x_{0}). $

Similarly, $ {f}$ is l.s.c. at $ {x_{0}}$ if for any $ {\epsilon>0}$, there exist a neighborhood $ {U}$ of $ {x_{0}}$ such that  

$ \displaystyle f(x_{0})-f(y)<\epsilon $

for all $ {y\in U}$; in a metric space we have  

$ \displaystyle \liminf_{y\rightarrow x_{0}}f(y)\geq f(x_{0}). $

Combining the two, we see that a function is continuous if and only if it is both l.s.c and u.s.c. Semi-continuous functions are "stable'' under operation of supremum and infimum:  

> **Proposition 7** *Let $ {\{f_{i}:X\rightarrow\mathbb{R}\}_{i\in I}}$ be a collection of u.s.c. functions. Then the pointwise supremum defines a new u.s.c. function, i.e.*  
> 
> *$ \displaystyle f(x):=\sup_{i\in I}f_{i}(x) $*
> 
> *is u.s.c.. Likewise, the pointwise infimum of any collection of l.s.c. functions is again l.s.c..*

*Proof:* It suffices to note that the set  

$ \displaystyle f^{-1}((-\infty,a))=\bigcup_{i\in I}f_{i}^{-1}((-\infty,a)) $

is open. $ \Box$  

The most fundamental examples of semi-continuous functions are indicator functions of open and closed sets. We have for example $ {G\subset X}$ is open if and only if $ {\chi_{G}}$ is l.s.c.. This can be easily seen by noticing that $ {\chi^{-1}((a,+\infty))}$ is either $ {G}$ or $ {\emptyset}$. Furthermore, they are often (when the topological space is nice) the first "cheap'' extension from something defined using continuous functions. For instance,  

> **Proposition 8** *Let $ {X}$ be normal and Hausdorff. Then $ {f}$ is u.s.c. if and only if*  
> 
> *$ \displaystyle f(x)=\inf\{g(x):g\in C(X\rightarrow(-\infty,+\infty]),g\geq f\} $*
> 
> *for all $ {x\in X}$. Likewise, $ {f}$ is l.s.c. if and only if*  
> 
> *$ \displaystyle f(x=\sup\{g(x):g\in C(X\rightarrow(-\infty,+\infty]),g\leq f\} $*
> 
> *for all $ {x\in X}$.*

*Proof:* We note that if $ {f(x)=\inf\{g(x):g\in C(X\rightarrow(-\infty,+\infty]),g\geq f\}}$, then $ {f^{-1}((-\infty,a))=\bigcup_{g\geq f}g^{-1}((-\infty,a))}$ which is open for any $ {a\in\mathbb{R}}$. Conversely, suppose $ {f}$ is u.s.c., and denote $ {\tilde{f}(x)=\inf\{g(x):g\in C(X\rightarrow(-\infty,+\infty]),g\geq f\}}$. Clearly, we have $ {f(x)\leq\tilde{f}(x)}$. Now suppose for some $ {x_{0}}$, $ {f(x_{0})<\tilde{f}(x_{0})}$. Since $ {f}$ is u.s.c. at $ {x_{0}}$, there is a neighborhood $ {U}$ of $ {x_{0}}$ such that  

$ \displaystyle f(y)<\tilde{f}(x_{0}) $

for all $ {y\in U}$. Since the space is normal and Hausdorff, one can take a continuous function $ {g}$ such that $ {g(x_{0})<\tilde{f}(x_{0})}$, and $ {g\geq f}$ on $ {X\backslash U}$. It then can be clearly extended in $ {U}$ such that $ {g(y)\geq f(y)}$ for all $ {y\in U}$ using the above inequality. $ \Box$  

> **Remark 2** *One way to contruct the Borel measure in the Riesz representation theorem for a compact hausdorff space $ {X}$ is to extend the positive functional on bounded continuous functions $ {B(X)}$ to l.s.c. ones, using the above proposition. See Terry's notes for more details.*

Coupled with the regularity of measurable sets, one can obtain results on approximation by semi-continuous functions, in spirit similar to Littlewood's second principle, for example, the *Vitali-Caratheodory's theorem*.  
Finally, we record an example of u.s.c. function that will be useful later in this note.  

> **Proposition 9** *The *Hardy-Littlewood maximal function* of $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$, defined to be*  
> 
> *$ \displaystyle Mf(x):=\sup_{r>0}\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)\right|dy $*
> 
> *is upper semi-continuous if $ {f}$ is abosolutely integrable. Consequently, the maximal function of $ {f}$ is measurable.*

*Proof:* In view of Proposition [7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propsup-semi), it suffices to show the functions $ {f_{r}}$ indexed by $ {r}$, defined by  

$ \displaystyle f_{r}(x):=\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)\right|dy $

is continuous. This follows directly from the following lemma. $ \Box$  

> **Lemma 10** *(Absolute continuity) Let $ {f\in L^{1}(\mu)}$. Then for each $ {\epsilon>0}$, there is some $ {\delta>0}$ such that*  
> 
> *$ \displaystyle \int_{E}|f|d\mu<\epsilon $*
> 
> *whenever $ {\mu(E)<\delta}$.*

*Proof:* Suppose not. Let $ {E_{n}}$ be measurable with $ {\mu(E_{n})\leq2^{-n}}$, $ {A_{n}=\bigcup_{k\geq n}^{\infty}E_{n}}$, so that  

$ \displaystyle \mu(A_{n})\leq\sum_{j}\mu(E_{n})=2^{1-n}. $

Suppose $ {\epsilon_{0}>0}$ is such that  

$ \displaystyle \int_{A_{n}}|f|d\mu>\epsilon_{0}. $

Then by dominated convergence theorem,  

$ \displaystyle 0=\int_{A}|f|d\mu=\lim_{n\rightarrow\infty}\int_{A_{n}}|f|d\mu>\epsilon_{0}, $

a contradiction. $ \Box$  

#### **1.2. Density argument: Lebesgue differentiation theorem**

The power of Littlewood's principles not only lies in helping one to understand the behavior of various "Lebesgue'' type of contructions, e.g. measurable sets, functions only defined almost everywhere etc., but also allow one to attack a problem first by looking at a "simpler version'', namely the subject class being replaced by one of its dense subclasses. Consider the following statement concerning the translation invariance of Lebesgue measure: If $ {m}$ is a Borel measure defined on $ {(\mathbb{R}^{n},\mathcal{B})}$ and is translational invariant, then there is a positive constant $ {\lambda>0}$ such that  

$ \displaystyle m(E)=\lambda\mathcal{L}^{n}(E) $

for all $ {E\in\mathcal{B}}$. By finite additivity and translation invariance, we see that the conclusion obviously hold for *dyadic meshes*, i.e. the cubes with sides of length $ {2^{n}}$, $ {n\in\mathbb{Z}}$. Since dyadic meshes are dense in the space of measurable sets, using Fatou's lemma, we see that the result holds by taking limit. In this subsection we are interested in the following convergence theorem, a generalization of *the first fundamental theorem of calculus*:  

> **Theorem 11** *(Lebesgue differentiation theorem) Let $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ be absolutely integrable. Then for almost every $ {x\in\mathbb{R}^{n}}$,*  
> 
> *$ \displaystyle \lim_{r\rightarrow0^{+}}\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)-f(x)\right|dy=0      (2)$*
> 
> *and*  
> 
> *$ \displaystyle \lim_{r\rightarrow0^{+}}\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}f(y)dy=f(x). $*
> 
> *The point $ {x\in\mathbb{R}^{n}}$ such that ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) holds is called a Lebesgue point of $ {f}$. Thus, for $ {f\in L^{1}(\mathbb{R}^{n})}$, almost every point is a Lebesgue point of $ {f}$.*

There are in general two ingredients to prove such converging result, known as *density argument*:  

1.  Verification of the statement for objects in the dense subclass;
2.  A *quantitative estimate* that bounds the "maximal error''.

It is easy to verify Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm) for continuous compactly supported functions on $ {\mathbb{R}^{n}}$, which form a dense subclass of $ {L^{1}(\mathbb{R}^{n})}$. In the following we will develop the corresponding quantitative estimates. The first one is *Markov inequality*.  

> **Theorem 12** *(Markov inequality) Let $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ be absolutely integrable. Then*  
> 
> *$ \displaystyle \mathcal{L}^{n}(\{x\in\mathbb{R}^{n}:\left|f(x)\right|\geq\lambda\})\leq\frac{1}{\lambda}\int_{\mathbb{R}^{n}}|f(t)|dt. $*

*Proof:* Note that  

$ \displaystyle \begin{array}{rcl} \lambda\cdot\mathcal{L}^{n}(\{x\in\mathbb{R}^{n}:\left|f(x)\right|\geq\lambda\}) & \leq & \int_{\left|f\right|\ge\lambda}\left|f(y)\right|dy\\ & \leq & \int_{\mathbb{R}^{n}}\left|f(y)\right|dy. \end{array} $

$ \Box$  

> **Theorem 13** *(Hardy-Littlewood mximal inequality, weak type estimate) Let $ {f:\mathbb{R}^{n}\rightarrow\mathbb{R}}$ be absolutely integrable, and $ {\lambda>0}$. Then*  
> 
> *$ \displaystyle \mathcal{L}^{n}(\{x\in\mathbb{R}^{n}:Mf(x)\geq\lambda\})\leq\frac{C_{n}}{\lambda}\int_{\mathbb{R}^{n}}|f(t)|dt $*
> 
> *for some constant $ {C_{n}>0}$ depending only on the dimension $ {n}$.*

Now we quickly show how to use the quantitative estimate Theorem [13](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Hardy-Littlewood-mximal-inequal) to deduce Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm).  
*Proof of Theorem 11:* Let $ {\epsilon>0}$. By Littlewood's second principle, there exists a $ {g\in C_{c}(\mathbb{R}^{n})}$ such that  

$ \displaystyle \int_{\mathbb{R}^{n}}|f(x)-g(x)|dx\leq\epsilon. $

Using HL maximal inequality,  

$ \displaystyle \mathcal{L}^{n}(\{x\in\mathbb{R}^{n}:M(f-g)(x)\geq\lambda\})\leq C_{n}\frac{\epsilon}{\lambda}. $

Using Markov inequality,  

$ \displaystyle \mathcal{L}^{n}(\{x\in\mathbb{R}^{n}:\left|f(x)-g(x)\right|\geq\lambda\})\leq\frac{\epsilon}{\lambda}. $

By subadditivity, we conclude that except on a set of measure $ {(1+C_{n})\epsilon/\lambda}$, we have  

$ \displaystyle \frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)-g(y)\right|dy<\lambda $

and  

$ \displaystyle \left|f(x)-g(x)\right|<\lambda. $

Using Theorem [11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lebesgue-differentiation-thm) for continuous functions, we have for all $ {r}$ small enough,  

$ \displaystyle \frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|g(y)-g(x)\right|dy<\lambda. $

Now, using triangle inequality,  

$ \displaystyle \begin{alignedat}{1} & \left|\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}f(y)dy-f(x)\right|\\ \leq & \left|\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}f(y)dy-g(x)\right|+\left|f(x)-g(x)\right|\\ \leq & \frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)-g(y)\right|dy+\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|g(y)-g(x)\right|dy+\left|f(x)-g(x)\right|\\ < & 3\lambda \end{alignedat} $

for all $ {r}$ sufficiently close to zero. In particular we have  

$ \displaystyle \limsup_{r\rightarrow0^{+}}\left|\frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}f(y)dy-f(x)\right|<3\lambda $

for all $ {x}$ outside a set of measure $ {(1+C_{n})\epsilon/\lambda}$. Fix $ {\lambda}$ and send $ {\epsilon}$ to zero, the ineuqality holds for almost all $ {x}$. Finally, sending $ {\lambda}$ to zero, we conclude the desired result. $ \Box$  

To establish the HL maximal inequality, it suffices to deal with the strict inequality case, i.e.  

$ \displaystyle E=\{x\in\mathbb{R}^{n}:M(f-g)(x)>\lambda\} $

since the non-strict case follows by an epsilon adjustment on $ {\lambda}$. This formulation allows us to deduce that whenever $ {x\in E}$, there exists $ {r>0}$ such that  

$ \displaystyle \frac{1}{\mathcal{L}^{n}(B(x,r))}\int_{B(x,r)}\left|f(y)\right|dy>\lambda.      (3)$

We will also take advantage of the inner regularity of Lebesgue measure (as again a manifestation of Littlewood's first principle): it suffices to establish the estimate for all compact $ {K\subset E}$. For each $ {x\in K}$, let $ {B(x,r)}$ be such that ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) holds. Then $ {\{B(x,r)\}_{x\in K}}$ forms a covering of $ {K}$ and  

$ \displaystyle \mathcal{L}^{n}(B(x,r))<\frac{1}{\lambda}\int_{B(x,r)}\left|f(y)\right|dy. $

Since $ {K}$ is compact, one finds a finite subcovering $ {\{B_{i}\}_{i=1}^{n}}$. However, because of the potential intersections among $ {B_{i}}$'s, one cannot conclude the estimate Theorem [13](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Hardy-Littlewood-mximal-inequal)directly. We will get around this issue by a Vitali covering type of argument.  

> **Lemma 14** *(Vitali convering lemma) Let $ {\{B_{1},\dots,B_{n}\}}$ be a collection of open balls in $ {\mathbb{R}^{n}}$. Then there exists a subcollection $ {\{B_{1}',\dots B_{m}'\}}$ such that*  
> 
> *$ \displaystyle \bigcup_{i=1}^{n}B_{i}\subset\bigcup_{i=1}^{m}3B_{i}' $*
> 
> *where $ {3B_{i}'}$ is the 3-concentric dilation of $ {B_{i}'}$.*

Now we quickly finish the proof of the HL maximal inequality.  
*Proof of Theorem 13:* Following the above argement, and using Vitali convering lemma, we have  

$ \displaystyle \begin{array}{rcl} \mathcal{L}^{n}(K) & \leq & \mathcal{L}^{n}(\bigcup_{i=1}^{n}B_{i})\\ & \leq & 3^{n}\mathcal{L}^{n}(\bigcup_{i=1}^{m}B_{i}')\\ & \leq & \frac{3^{n}}{\lambda}\int_{B(x,r)}\left|f(y)\right|dy\leq\frac{3^{n}}{\lambda}\int_{\mathbb{R}^{n}}\left|f(y)\right|dy. \end{array} $

$ \Box$  

Finally we prove the Vitali covering lemma.  
*Proof of Lemma 14:* We use a "greedy algorithm'' to pick out the subcollection $ {\{B_{i}'\}_{i=1}^{n}}$. Starting with the ball of largest radius in the finite collection and set it as $ {B_{1}'}$. Choose $ {B_{k}'}$ to be the biggest ball that doesn't intersect any of the previous balls. The process will stop for some $ {m\leq n}$, when all balls left unselected have intersection with some ball in the chosen subcollection $ {\{B_{i}'\}_{i=1}^{m}}$. Next we make an important observation: any ball that intersects with $ {B_{i}'}$ will be of smaller radius than $ {B_{i}'}$. If not, then either in the first step we didn't choose the largest ball, or we didn't choose the ball of largest radius and disjoint from the previous ones. Then by trangle inequality we see that any ball that intersects $ {B_{i}'}$ will be contained in $ {3B_{i}'}$. $ \Box$  

> **Remark 3** *As an exercise appeared in Terry's notes, one can in fact improve the constant $ {3^{n}}$ to $ {2^{n}}$, by the observation that the $ {2}$-concentric dilated ball contains the centers of the balls that intersect with it. To achieve this, one has to have enough balls in the finite collection. It is a good exercise for "epsilon of room'' type of argument, see this [MSE question](http://math.stackexchange.com/questions/1984653/improving-the-constant-in-hardy-littlewood-maximal-inequality-from-3d-to-2d) for more details.*  
> *There is also a version of Vitali covering lemma dealing with countable collection of open balls, with the constant changed to $ {5}$. Effectively, this transport the argument using regularity of Lebesgue measurable set in the covering lemma. However, one gets a worse constant.*

#### **1.3. Signed measures and Radon-Nikodym derivatives**

One usually goes through the contruction of Lebesgue integration on $ {\mathbb{R}}$ by definining first integrals of *non-negative functions*, then decomposing a function $ {f}$ into its positive and negative parts, i.e. the *Jordan decomposition of functions*  

$ \displaystyle f=f^{+}-f^{-}      (4)$

where $ {f^{+}=\max\{f,0\}}$ and $ {f^{-}=\max\{-f,0\}}$. Then define  

$ \displaystyle \int fd\mathcal{L}^{1}=\int f^{+}d\mathcal{L}^{1}-\int f^{-}d\mathcal{L}^{1}      (5)$

if the RHS is finite. $ {f}$ is thus called abolutely integrable. This process has its measure-theoretic analog. We have defined unsigned measures on a $ {\sigma}$-algebra. In view of ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we introduce the notion of a *signed measure*.  

> **Definition 15** *(Signed measure) A *signed measure* is a set function $ {\mu:\mathcal{\mathfrak{M}\rightarrow\mathbb{R}}}$ on the $ {\sigma}$-algebra $ {\mathfrak{M}}$ of $ {X}$ such that*  
>   
> 
> *-   $ {\mu(\emptyset)=0;}$
> -   $ {\mu}$ can take $ {+\infty}$ or $ {-\infty}$, but not both (this is to avoid the situations such as $ {+\infty-\infty}$);
> -   If $ {E_{1},E_{2}\dots\subset X}$ is a countable collection of disjoint measurable sets, then
>     
>     $ \displaystyle \sum_{i=1}^{\infty}\mu(E_{i})=\mu(\bigcup_{i=1}^{\infty}E_{i}), $
>     
>     with the LHS absolutely convergent if the RHS is finite.*

We first have an analog to the decompostion ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)):  

> **Theorem 16** *(Hahn decomposition) Let $ {\mu}$ be a signed measure. Then there exists a partition $ {X=X_{+}\cup X_{-}}$ such that $ {\mu\downharpoonright_{X_{+}}\geq0}$ and $ {\mu\downharpoonright_{X_{-}}\leq0}$.*

*Proof:* Assume without loss of generality that $ {\mu}$ avoids $ {-\infty}$. Let $ {\mathfrak{M}_{-}=\{E\in\mathfrak{M}:\mu\downharpoonright_{E}\geq0\}}$. Note that $ {\emptyset\in\mathfrak{M}_{-}}$. Define  

$ \displaystyle m_{-}:=\inf_{E\in\mathfrak{M}_{-}}\mu(E). $

We claim that $ {m_{-}}$ is finite, and is achieved by some set $ {X_{-}\in\mathfrak{M}_{-}}$. Let $ {E_{1},E_{2},\dots}$ be a minimizing sequence, i.e. $ {\mu(E_{n})\rightarrow m_{-}}$ as $ {n\rightarrow+\infty}$. Let $ {X_{-}=\bigcup_{n}E_{n}}$. We see that $ {\mu\downharpoonright_{X_{-}}\leq0}$ and $ {\mu(X_{-})=m_{-}}$. In particular, $ {m_{-}}$ is finite. Let $ {X_{+}=X\backslash X_{-}}$. We claim that $ {X_{+}}$ is such that $ {\mu\downharpoonright_{X_{+}}\geq0}$. Supose not, then there exists a subset $ {E_{1}\subset X_{+}}$ such that $ {\mu(E_{1})<0}$. If $ {\mu\downharpoonright_{E}\leq0}$, then $ {E_{1}\cup X_{-}}$ as a disjoint union has strictly smaller measure than $ {X_{-}}$, contrary to our construction of $ {X_{-}}$. Thus $ {E_{1}}$ contains a set with strictly smaller measure. Let $ {n_{1}}$ be large enough such that there exist $ {E_{2}\subset E_{1}}$ with  

$ \displaystyle \mu(E_{2})\leq\mu(E_{1})-\frac{1}{n_{1}}<0. $

If $ {\mu\downharpoonright_{E_{2}}\leq0}$, then we are done again. If not, continuing this, we either stop with a $ {\mu\downharpoonright_{E_{n}}\leq0}$ as a contradiction, or get a nested sequence  

$ \displaystyle E_{1}\supset E_{2}\supset\cdots\supset E_{j}\supset\cdots $

in $ {X_{+}}$ with strictly decreasing (negaitve) measure. Let $ {E=\bigcap_{j}E_{j}}$. Then $ {E}$ also has negative measure, hence finite by our assumption. This implies $ {n_{j}\rightarrow+\infty}$. So $ {E}$ cannot contain any subset of strictly smaller measure, which means $ {\mu\downharpoonright_{E}\leq0}$, a contradction. $ \Box$  

> **Definition 17** *Let $ {\mu}$ and $ {\lambda}$ be two signed measures on a $ {\sigma}$-algebra $ {\mathfrak{M}}$. We say a set $ {E\in\mathfrak{M}}$ is $ {\mu}$-null if $ {\mu\downharpoonright_{E}}$ the restriction of $ {\mu}$ to $ {E}$ is zero; and $ {\mu}$ is *supported* on $ {E}$ if the complement of $ {E}$ is $ {\mu}$-null. Then*  
>   
> 
> *-   $ {\lambda}$ is said to be *absolutely continuous* with respect to $ {\mu}$, denoted $ {\lambda\ll\mu}$, if every $ {\mu}$-null set is also $ {\lambda}$-null.
> -   $ {\lambda}$ and $ {\mu}$ are said to be *mutually singular*, denoted $ {\lambda\perp\mu}$, if their supports are mutually disjoint.*

If for a signed measure $ {\mu}$, we can define unsigned measures on $ {\mathfrak{M}}$ $ {\mu_{+}:=\mu\downharpoonright_{X_{+}}}$ and $ {\mu_{-}:=\mu\downharpoonright_{X_{-}}}$. We thus see that $ {\mu_{+}}$ and $ {\mu_{-}}$ are mutually singular, and  

$ \displaystyle \mu=\mu_{+}-\mu_{-}, $

which is called the *Jordan decompostion* of $ {\mu}$. If there is another pair of unsigned measures $ {\mu_{1}}$ and $ {\mu_{2}}$ satisfying $ {\mu_{1}\perp\mu_{2}}$, $ {\mu=\mu_{1}-\mu_{2}}$. We get  

$ \displaystyle \mu_{+}-\mu_{1}=\mu_{-}-\mu_{2} $

with LHS and RHS being mutually singular, and thus are zero measures. We thus conclude that the Jordan decompostion is unique, and refer to $ {\mu_{+}}$, $ {\mu_{1}}$ as the *positive and negative variantion* of $ {\mu}$. The *totoal variation measure* of $ {\mu}$, denoted $ {|\mu|}$, is defined to be $ {|\mu|=\mu_{+}+\mu_{-}}$.  

> **Remark 4** *For a signed measure $ {\mu}$, one can define*  
> 
> *$ \displaystyle |\mu|(E)=\sup_{E=\sqcup_{i}E_{i}}\sum_{i}|\mu(E_{i})|. $*
> 
> *The two defintions will be seen to be equivalent once we have *Radon-Nikodym theorem*.*

Given the analogs between functions and measures, now we explore further their relationship.  
One direction is immediate: given a $ {\mu}$-measurable function $ {f}$, one can define a signed measure $ {\lambda_{f}}$ by  

$ \displaystyle \lambda_{f}(E)=\int_{E}fd\mu $

provided the RHS can possibly reach either $ {+\infty}$ or $ {-\infty}$ but not both. Indeed, by taking the Jordan decomposition of $ {f=f^{+}-f^{-}}$, $ {\lambda}$ can be seen as a difference of two unsigned measures (in fact the Jordan decomposition of $ {\lambda}$). Since RHS, when ranging over $ {E\in\mathfrak{M}}$, can take at most one of the infinity values $ {+\infty}$ and $ {-\infty}$, we see that at least one of the two unsigned measure is finite. Moreover, one has an essentially uniqueness result when the $ {\mu}$ is $ {\sigma}$-finite;  

> **Lemma 18** *If $ {\mu}$ is $ {\sigma}$-finite, and there are two signed measures $ {\lambda_{f}}$, $ {\lambda_{g}}$ such that $ {\lambda_{f}=\lambda_{g}}$, then $ {f=g}$ a.e..*

*Proof:* By Jordan decomposition, it suffices to prove when $ {f,g:X\rightarrow[0,\infty]}$. Assume first $ {\mu}$ is a finite measure on $ {X}$. Suppose $ {f\neq g}$ on a set of positive measure, say $ {E}$. We claim that there is a set $ {E'\subset E}$ such that on $ {E'}$ either $ {f>g}$ or $ {f<g}$. Let $ {E_{1}=\{x\in E:f(x)>g(x)\}}$. We have $ {E_{1}}$ and $ {E\backslash E_{1}}$ are measurable. If $ {E_{1}}$ has positive measure, then we are done; otherwise $ {E\backslash E_{1}}$ has positive measure. Let $ {E'}$ be the one with positive measure. Then it is clear that $ {\lambda_{f}(E')>\lambda_{g}(E')>0}$, a contradiction. $ \Box$  

The above result does not hold in case $ {X}$ is not $ {\sigma}$-finite, just by considering the simple case when $ {X=\{0\}}$ with $ {\mu(\{0\})=\infty}$. We will refer the function $ {f}$ as the *Radon-Nikodym derivaitve* of $ {\lambda_{f}}$ with respect to $ {\mu}$.  
On the other hand, we see that if a signed measure $ {\lambda}$ is not such that $ {\lambda\ll\mu}$, where $ {\mu}$ is a unsigned reference measure. Then it is not possible to obtain $ {\lambda}$ from $ {\mu}$ in the above fashion, namely by "multiplying'' a measurable function. However, the obstruction can be precisely described if $ {\mu}$ is $ {\sigma}$-finite.  

> **Theorem 19** *(Lebesgue-Radon-Nikodym) Let $ {\mu}$ be unsigned and $ {\sigma}$-fininte, and $ {\lambda}$ be a signed $ {\sigma}$-finite measure. Then there exists a unique decomposition*  
> 
> *$ \displaystyle \lambda=\lambda_{f}+\lambda_{s}, $*
> 
> *where $ {f:X\rightarrow\mathbb{R}}$ is measurable and $ {\lambda_{s}\perp\mu}$, called the Lebesgue decomposition. Clearly, $ {\lambda_{f}\ll\mu}$. Futhermore, if $ {\lambda}$ is unsigned, then so is $ {f}$ and $ {\lambda_{s}}$. If $ {\lambda}$ is finite, then $ {f\in L^{1}(\mu)}$ and $ {\lambda_{s}}$ is also finite.*

In particular, if we have $ {\lambda\ll\mu}$, then the theorem implies that there is a measurable function $ {f:X\rightarrow\mathbb{R}}$ such that  

$ \displaystyle \lambda(E)=\int_{E}fd\mu. $

If one regards measures as "generalized functions'', then the theorem provides an analog for *the second fundamental theorem of calculus*. The famous example of *Cantor's function*, a.k.a. *Devil's step function* thus reminds us that the class of absolutely continuous functions is the largest class that the 2nd FTC applies. Here, one sees the defect of "classical derivatives'', as they are not able to capture this kind of variations of monotone functions.  
*Proof:* We refer to the proof of the case when both $ {\mu,\lambda}$ are unsigned and finite in Terry's notes. It is done by choosing the function $ {f}$ whose $ {\mu}$-induced meausre is "closest'' to $ {\mu}$. The uniqueness follows from [18](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem22) and the observation that $ {\lambda_{f}}$ for nonzero $ {f}$ cannot be singular to $ {\mu}$. Assuming the result in the finite case, and write $ {X=\bigsqcup X_{i}}$ as a disjoint union, where $ {X_{i}}$ is such that $ {\mu\downharpoonright_{X_{i}},\lambda\downharpoonright_{X_{i}}}$ are finite unsigned and signed measures respctively. Hence  

$ \displaystyle \lambda\downharpoonright_{X_{i}}=\lambda_{f}\downharpoonright_{X_{i}}+\lambda_{s}\downharpoonright_{X_{i}}. $

Using Jordan decomposition, we easily see that  

$ \displaystyle \begin{array}{rcl} \lambda & = & \sum_{i}(\lambda\downharpoonright_{X_{i},+}-\lambda\downharpoonright_{X_{i},-})\\ & = & \sum_{i}(\lambda_{f}\downharpoonright_{X_{i},+}-\lambda_{f}\downharpoonright_{X_{i},-})+\sum_{i}(\lambda_{s}\downharpoonright_{X_{i},+}-\lambda_{s}\downharpoonright_{X_{i},-}). \end{array} $

$ \Box$  

> **Remark 5** *One can also establish the theorem via $ {L^{p}}$-$ {L^{q}}$ duality (due to von Neuman), and the duality can also be established via Lebesgue-Radon-Nikodym theorem. Rudin's book takes this approach.*

We can in fact get a slightly more precise Lebesgue decomposition than the one above. Let $ {X}$ be such that every point is measurable. We say a measure $ {\mu}$ is *continuous* if $ {\mu(\{x\})=0}$ for all $ {x\in X}$. Let $ {\mu,\lambda}$ be as above, and furthermore $ {\mu}$ is continuous, then there is a unique decompostion  

$ \displaystyle \lambda=\lambda_{ac}+\lambda_{sc}+\lambda_{pp}, $

where $ {\lambda_{ac}\ll\mu}$, $ {\lambda_{sc}}$ is singular to $ {\mu}$ and continuous, and $ {\lambda_{pp}}$ suppoted on an at most countable set. Here, $ {\lambda_{sc}}$, $ {\lambda_{pp}}$ are called *singular continuous* and *pure point* components of $ {\lambda}$ respectively. The decomposition for the case of unsigned measures above (later it extends to the signed case as well) is analogous to the decomposition of monotone function in the 1-dimensional case. Recall that if $ {F:\mathbb{R}\rightarrow\mathbb{R}}$ is non-decreasing, then the only discontinuities of $ {F}$ are *"jump discontinuities"*. There are at most countably many such jumps. If furthermore $ {F}$ is bounded, one has a unique *continuous-singular* decomposition:  

$ \displaystyle F=F_{c}+F_{pp} $

where $ {F_{c}}$ is continuous non-decreasing and $ {F_{pp}}$ is a *jump function*. Combining this with a HL-type of inequality for *Dini's numbers* gives an important result of almost everywhere differentiablity for monotone functions:  

> **Theorem 20** *A monotone function $ {F:\mathbb{R}\rightarrow\mathbb{R}}$ is differentiable almost everywhere.*

Much as we have Jordan decomposition for a signed measure, we have a decomposition result saying that any function of *bounded variation* can be written as a difference of two monotone functions. And thus the almost everywhere differentiablity extends to the function class of bounded variation. These "variations'' for both functions and measures are obviously related, via the Lebesgue-Radon-Nikodym theorem, which is manifested in the construction of *Lebesgue-Stieltjes measure*.  

For a discussion for the situation in $\mathbb{R}$, I find this [note](https://www.math.ucdavis.edu/~hunter/m218a_09/ch3A.pdf) by Hunter amusing.
