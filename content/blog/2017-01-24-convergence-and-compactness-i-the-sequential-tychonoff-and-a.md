---
id: 2017-01-24-convergence-and-compactness-i-the-sequential-tychonoff-and-a
title: "Convergence and Compactness I: the Sequential Tychonoff and Arzelá-Ascoli"
date: 2017-01-24
tags: ["functional analysis", "PDE", "real analysis"]
source: https://sylqiu.blogspot.com/2017/01/convergence-and-compactness-i.html
publish: true
---
Following the Terry's notes (up to some reorganising and exercise solving), I aim to develop the *sequential Tychonoff theorem,* which says an at most countable product of sequential compact spaces is again sequential compact. This has a beautiful application - the *Arzelá-Ascoli theorem*, giving characterisation of precompact subsets in the space of bounded continuous functions, which is particular useful in PDEs (and part of the reason to write this up). Along the way I also included (also from Terry's notes) an interesting and insightful concept - that of an *ultrafilter*.  

  From introductory mathematical analysis one is familiar with *sequences*, which in the simplest case is a *countable infinite* tuple $ {a_{0},a_{1},\dots}$ of reals, and which is said to *converge to a limit* $ {a\in\mathbb{R}}$ if for every $ {\epsilon>0}$, there exists $ {N\in\mathbb{N}}$ such that  

$ \displaystyle |a_{n}-a|\leq\epsilon $

for all $ {n\geq N}$. The number $ {a}$ captures the approximate position (in the sense of absolute value) of the sequence $ {(a_{n})_{n\in\mathbb{N}}}$ when $ {n}$ is *large enough*. The concept of convergence of elements in a metric space $ {(X,d)}$, such as $ {L^{1}}$-convergence, goes along the same line. To say it in another fashion, a sequence $ {(f_{n})_{n}}$ is said to converge to $ {f\in X}$ if for any open metric ball around $ {f}$, the tail of the sequence is *eventually* (that is, after discarding some first finite number of terms) contained in it. Note that as a conseqeunce of the non-degenercy of the metric $ {d}$, the limit, if exist, is unique. One can also consider more generally, the convergence in a topological space $ {(X,\mathcal{F})}$, where $ {(x_{n})_{n}}$ is said to converge to $ {x\in X}$ if for any neighborhood $ {U}$ of $ {x}$, the tail of the sequence is eventually contained in $ {U}$. This convergence of sequences in a topological space $ {X}$ can also be seen as a continuous property of a mapping from $ {\mathbb{N}\cup\{+\infty\}}$ to $ {X}$. More precisely, the mapping is given by  

$ \displaystyle x(\cdot):n\mapsto x_{n};+\infty\mapsto x. $

Here we give $ {\mathbb{N}}$ its natural ordering $ {\geq}$ and declare $ {+\infty\geq n}$ for all $ {n\in\mathbb{N}}$. It follows then $ {\mathbb{N}\cup\{+\infty\}}$ is a well-ordered set. The *order topology* on $ {\mathbb{N}\cup\{+\infty\}}$ is defined by declaring singletons $ {\{n\}}$ for each $ {n\in\mathbb{N}}$ and sets of the form $ {[n,+\infty]:=\{m\in\mathbb{N}\cup\{+\infty\}:m\geq n\}}$ to form a base of the topology. The map $ {x(\cdot)}$ is then continuous. The convergence in a topological space can be characterised by the follwing \`\`subsequence principle'', which is useful for identifying convergence that are not *topologisable*.  

> **Proposition 1** *(Urysohn's subsequence principle) Let $ {(x_{n})_{n\in\mathbb{N}}}$ be a sequence of in a topological space $ {X}$, and $ {x\in X}$. The following are equivalent:*  
> 
> *-   $ {x_{n}\rightarrow x}$ as $ {n\rightarrow\infty}$;
> -   Every subsequence of $ {x_{n}}$ converges to $ {x}$;
> -   Every subsequence has a further subsequence that converges to $ {x}$.*

*Proof:* The only part not clear is $ {(3)\Rightarrow(1)}$. Suppose $ {(x_{n_{j}})_{j}}$ has a further subseqeunce converging to $ {x\in X}$ but $ {x_{n}}$ does not. Then $ {x_{n}}$ has a subsequence does not converge to $ {x}$, which in turn has no further subseqeunce converging to $ {x}$, a contradiction. $ \Box$  

> **Example 1** *Pointwise almost everywhere convergence is not a convergence defined through topology. Indeed, consider the space $ {L^{\infty}[0,1]}$ and the \`\`typewriter seqeunce''*  
> 
> *$ \displaystyle f_{n,k}(x)=\chi_{[\frac{k-1}{2^{n}},\frac{k}{2^{n}}]} $*
> 
> *where $ {k=1,\dots,2^{n}}$. $ {f_{n,k}}$ converges to zero in $ {L^{\infty}}$-norm, so if $ {f_{n,k}}$ were to converge pointwisely a.e., the limit should be zero. But each point $ {x\in[0,1]}$ belongs to some dydic interval of length $ {2^{-n}}$, for each $ {n}$. We see that $ {f_{n,k}}$ does not converge to zero pointwisely a.e. Yet it is clear that every subsequence has a further subsequence converging to zero pointwisely a.e., because of $ {L^{\infty}}$ convergence.*

**1.1. Interaction with the properties of the topological space**

We begin by asking when the limit defined in the sense above, if exists, is unique. By an almost tautological argument, the uniqueness will follow from the Hausdorff property of the topological space. It is also easy to create artificial examples:  

> **Example 2** *Consider a set with two points $ {X=\{a,b\}}$, with the topology $ {\mathcal{F}=\{X,\emptyset,\{a\}\}}$. By design we see that $ {a}$ and $ {b}$ cannot be separated by disjoint open neighborhoods, and hence $ {(X,\mathcal{F})}$ is not Hausdorff. Then the constant sequence $ {(x_{n}:=a)_{n}}$ converges to $ {b}$ also.*

Roughly speaking, the Hausdorff property infers that the topology contains enough open sets in order to be able to distinguish distinct points by disjoint open sets.  
A more interesting question is when we have convergence, at least at the subsequence level. It is perhaps well known that  

> **Theorem 2** *(Bolzano-Weierstrass) A bounded sequence in $ {\mathbb{R}}$ has a convergent subsequence.*

*Proof:* There is a subsequence converging to the $ {\sup\{a_{n}\}}$. Alternatively, one constructs a monotone subsequence, then by monotone convergence theorem concludes that the subsequence converges. $ \Box$  

 In particular, any sequence in a bounded subset $ {E\subset\mathbb{R}}$ contains a converging subsequence. Such $ {E}$ is said to be *sequential precompact*. If the limit always belongs to the set $ {E}$, it is then said to be *sequential compact*. For metric spaces, sequential compactness has a rather complete characterisation:  

> **Theorem 3** *(Heine-Borel) Let $ {(X,d)}$ be a metric space. The following are equivalent:*  
> 
> *-   $ {X}$ is sequential compact;
> -   $ {X}$ is compact, i.e. every open cover has a finite subcover;
> -   Any collection of closed sets with finite intersection property (FIP) has non-empty intersection: if $ {(F_{\alpha})_{\alpha\in A}}$ a collection of closed subsets of $ {X}$ is such that any finite subcollection has non-empty intersection, then the entire collection has non-empty intersection;
> -   X is complete, and totally bounded, i.e. for each $ {\epsilon>0}$ there is a finite number of metric balls of radius $ {\epsilon}$ covers $ {X}$.*

First we can show $ {(2)\Leftrightarrow(3)}$, which holds regardless $ {X}$ is a metric space or not. Taking complement of the open sets in the cover $ {(G_{\alpha})_{\alpha\in A}}$, we obtain a collection of closed sets $ {(F_{\alpha})_{\alpha\in A}}$. That the cover has a finite subcover means the corresponding finite subcollection of closed sets has empty intersection (de Morgan's law). Taking contrapositive, we obtain $ {(3)}$. the other direction is similar.  
For $ {(1)\Rightarrow(4)}$, to show $ {X}$ is complete, take $ {(x_{n})}$ to be a Cauchy sequence. By sequential compactness, it contains a converging subsequence. Remember the sequence itself is Cauchy, thus the sequence must converge to the same limit. Now suppose $ {X}$ is not totally bounded. Then there is $ {\epsilon_{0}>0}$ such that no finite collection of $ {\epsilon_{0}}$-balls can cover $ {X}$. Take $ {x_{1}\in X}$. Choose $ {x_{n}}$ outside of the $ {\epsilon_{0}}$-balls centered at previous $ {x_{1},\dots,x_{n-1}}$. Thus we obtained a sequence  

$ \displaystyle d(x_{n},x_{m})\geq\epsilon_{0} $

for all $ {n\neq m}$. It cannot contain converging subsequence, a contradiction. Now for $ {(2)\Rightarrow(1)}$, we need an important property for metric topology.  

> **Definition 4** *A topological space $ {(X,\mathcal{F})}$ is called *first countable* if for each $ {x\in X}$, there is a countable family $ {B_{x,1},B_{x,2},\dots}$ of open neighborhood of $ {x}$ that forms a neighborhood basis of $ {x}$, i.e. for any open set $ {V_{x}}$ containing $ {x}$, there is a $ {B_{x,j}}$ such that $ {B_{x,j}\subset V_{x}}$.*

> **Lemma 5** *A metric space is first countable.*

*Proof:* Take metric balls centered at $ {x}$ with positive rational radius. $ \Box$  

 Now for any seqeunce $ {(x_{n})}$ in a compact metric space $ {X}$, it must accumulate in $ {X}$, say at $ {x}$. Taking a countable neighborhood of $ {x}$ and selecting one member of the sequence in each, we get a converging subsequence.  
Finally, $ {(4)\Rightarrow(3)}$, whose proof is unavoidably more complicated than the previous ones. Let $ {(F_{\alpha})}$ be as in $ {(3)}$. Suppose $ {X}$ is covered by $ {G_{1},\dots,G_{n}}$. Then at least one of $ {G_{i}}$ intersects all of $ {F_{\alpha}}$'s, and call such a covering set *rich*. Indeed, if not, then each $ {G_{i}}$ must miss one $ {F_{i}}$, hence by de Morgan's law the intersection of $ {F_{1},\dots,F_{n}}$ is empty.  
Since $ {X}$ is totally bounded, we can cover $ {X}$ by a sequence of finite families of metric balls $ {\{B_{n,1},\dots,B_{n,m_{n}}\}_{n}}$ with each $ {B_{n,j}}$ centered at $ {x_{n,j}}$ of radius $ {2^{-n}}$. If we look at the centers $ {\{x_{n,j}\}}$, as an infinite set it accumulates somewhere in $ {X}$, say at $ {x}$. So there is a seqeunce of balls $ {B_{k,j_{k}}}$, each intersect with the next one, with decreasing radius to zero. Then $ {x_{k}}$ is a cauchy sequence, and by completeness of $ {X}$ it converges to $ {x}$.  
Now observe that the sequence of balls $ {B_{k,j_{k}}}$ must eventually all be rich. Then $ {x}$ is a limit point of every $ {F_{\alpha}}$. Since each $ {F_{\alpha}}$ is closed, we have $ {x\in F_{\alpha}}$ for all $ {\alpha}$, and so we are done.  
We see that sequential compactness in a metric topology is the same with compactness. These two notions in general, however, are different.  
Bearing this in mind, we now discuss more about the Hausdorff property and compactness in a topological space. It turns out that they go in \`\`opposite directions'':  

> **Proposition 6** *Let $ {(X,\mathcal{F})}$ be a topological space.*  
> 
> *-   Suppose $ {X}$ is compact. Then every closed subset is also compact. If we put any weaker topology $ {\mathcal{F}'}$ than $ {\mathcal{F}}$ (i.e. $ {\mathcal{F}'\subset\mathcal{F}}$ ) on $ {X}$, $ {X}$ will still be compact. In particular, the trivial topology is always compact.
> -   Suppose $ {X}$ is Hausdorff. Then every compact subset is closed. If we put any stronger topology $ {\mathcal{F}'}$ than $ {\mathcal{F}}$ (i.e. $ {\mathcal{F}'\supset\mathcal{F}}$ ) on $ {X}$, $ {X}$ will still be Hausdorff. In particular, the discrete topology is always Hausdorff.
> -   If $ {\mathcal{F}'\subset\mathcal{F}}$ and $ {\mathcal{F}'}$ is a Hausdorff topology and $ {\mathcal{F}}$ is a compact topology, then $ {\mathcal{F}'=\mathcal{F}}$.*

In contrast to the Hausdorff property, compactness is often attained when there are \`\`fewer'' open sets. This indicates that we will have to put a \`\`weaker'' topology in order to gain \`\`more converging subsequences''.  
To see $ {(3)}$ is true, observe that since $ {\mathcal{F}'\subset\mathcal{F}}$, any closed subset in the Hausdorff topology is also closed in the compact topology, and by $ {(1)}$, it is compact in the compact topology. Also because of $ {\mathcal{F}'\subset\mathcal{F}}$ , any compact subset in the compact topology is compact in the Hausdorff topology, and by (2), it is closed in the Hausdorff topology. We thus conclude two topology has the same collection of closed sets.  
We thus see that on the same set a Hausdorff topology cannot be strictly weaker than a compact topology, so compact Hausdorff topology (*abbr.CH*) is in some sense special - for example, it is also *normal*, a property not even shared by the locally compact Hausdorff topology. This particularity can be grasped precisely by the *ultrafilters* on it.  

> **Definition 7** *A *filter* $ {p}$ on a set $ {X}$ is a collection of subsets of $ {X}$ that is*  
> 
> *-   closed under finite intersection;
> -   monotone: if $ {E\in p}$ and $ {E\subset F}$, then $ {F\in p}$;
> -   $ {\emptyset\notin p}$.*
> 
> *A filter $ {p}$ is said to be an ultrafilter if in addition for any $ {E\subset X}$, exactly one of $ {E}$ and $ {X\backslash E}$ lies in $ {p}$. For $ {x\in X}$ and an ultrafilter $ {p}$, $ {p}$ is said to *converge* to $ {x}$ if every neighorhood of $ {x}$ belongs to $ {p}$.*

> **Lemma 8** *Every filter has finite intersection property (FIP). Any collection of sets with FIP is contained in a filter.*

*Proof:* Let $ {E_{1},\dots,E_{n}}$ belong to a filter $ {p}$. By monotone property, their intersection $ {\cap_{i}E_{i}}$ is in $ {p}$ by closure property by finite intersectioning. By monotone property, it cannot be empty.  
Now let $ {\mathcal{E}}$ be a collection of set with FIP. We join more sets according to the monotone property. Clearly finite intersection property is preserved. Note that $ {\emptyset}$ is not in $ {\mathcal{E}}$, nor will be added in during the process. $ \Box$  

> **Lemma 9** *(Ultrafilter lemma) Every filter is contained in an ultrafilter*

*Proof:* Ordering the filters via inclusion, *Zorn's lemma* shows that a filter $ {p}$ is contained in a maximal filter $ {\tilde{p}}$. By maximality, it is easy to see that $ {X\in\tilde{p}}$. Now suppose there is $ {E\subset X}$ such that both $ {E,X\backslash E\notin\tilde{p}}$. Then any set in $ {\tilde{p}}$ must have non-empty portions in both $ {E,X\backslash E}$, which is impossible for $ {X}$. $ \Box$  

 Thus in particular any collection of sets with FIP is contained in an ultrafilter.  

> **Proposition 10** *Let $ {(X,\mathcal{F})}$ be a topological space.*  
> 
> *-   $ {X}$ is Hausdorff if and only if every ultrafilter on $ {X}$ has at most one limit.
> -   $ {X}$ is compact if and only if every ultrafilter on $ {X}$ has at least one limit.*
> 
> *Thus in particular $ {X}$ is CH if and only if every ultrafilter on $ {X}$ has one and only one limit.*

*Proof:* For $ {(1)}$, suppose an ultrafilter $ {p}$ on $ {X}$ has two limits $ {x}$ and $ {x'}$. Then $ {p}$ contains every neighborhood of $ {x,x'}$. Since $ {X}$ is Hausdorff, $ {x,x'}$ can be separated by disjoint open neighborhoods if $ {x\neq x'}$. Hence we must have $ {x=x'}$. For the \`\`if'' part, if there exist $ {x\neq x'}$ cannot be separated by disjoint open neighborhoods, then any two neighborhoods of $ {x}$ and $ {x'}$has non-empty intersection, and hence any finite collection of them has FIP. These neighborhoods are thus contained in an ultrafilter by the above lemmas. But then the ultrafilter will have at least two limits,  
For $ {(2)}$, let $ {p}$ be an ultrafilter on $ {X}$. Recall that in the proof of Heine-Borel we have compactness equivalent to any collection of closed sets with FIP having non-empty intersection. By the above lemmas, it suffices to show $ {p}$ has the latter property if and only if $ {X}$ is compact, and is easily verified. $ \Box$  

> **Remark 1** *As is probably anticipated, the characterisation of compactness by properties of ultrafilters sheds light on how to fix the discrepancy between sequential compactness and compactness, namely, we can introduce a collection of objects with a more general labelling system (i.e. a directed set) other than the natural numbers, creating the notion of a *net*. But as I am mainly interested in convergence of sequences and their usage in studying PDEs, and I haven't yet seen nets play a role in that direction, I shall not try to include it here. Nonetheless they are interesting when studying topological spaces themselves.*

**1.2. From the viewpoint of product spaces, and their sequential compactness property**

To make our discussion more precise, we need several definitions.  

> **Definition 11** *Let $ {(X,\mathcal{F})}$ be a topological space.*  
> 
> *-   A *base* for the topology is a collection $ {\mathcal{B}}$ of open sets such that every open set in $ {X}$ can be expressed as the union of sets in $ {\mathcal{B}}$. The elements of $ {\mathcal{B}}$ are called *basic open set*.
> -   A *sub-base* for the topology is a collection $ {\mathcal{B}}$ of subsets of $ {X}$ such that $ {\mathcal{F}}$ is the weakest topology that makes $ {\mathcal{B}}$ open, that is $ {\mathcal{B}}$ generates $ {\mathcal{F}}$, by arbitrary unions and finite intersections. The elements of $ {\mathcal{B}}$ are called *sub-basic open set*.*

Familiar examples include metric balls in a metric topology, where they form a base for the metric topology; *half-open* intervals in $ {\mathbb{R}}$, where they form a sub-base for the usual topology on $ {\mathbb{R}}$. One can go from a sub-base to a base, much like in case from half-open intervals to any open intervals, by joining their finite intersections. A result (whose proof depends on Zorn's lemma) useful in our discussion is the following, which we shall just assume.  

> **Theorem 12** *(Alexander sub-base theorem) $ {(X,\mathcal{F})}$ is a compact topological space if and only if every sub-basic open cover has a finite subcover.*

> **Definition 13** *(Product spaces) Given a family $ {(X_{\alpha},\mathcal{F}_{\alpha})_{\alpha\in A}}$ of topological spaces, let $ {X:=\prod_{\alpha\in A}X_{\alpha}}$ be the Cartesian product, equipped with projection maps $ {\pi_{\alpha}:X\rightarrow X_{\alpha}}$. The *product topology* on $ {X}$ is defined to be the topology generated by the cylinder sets $ {\pi_{\alpha}^{-1}(U_{\alpha})}$, where $ {U_{\alpha}\in\mathcal{F}_{\alpha}}$, that is, these cylinder sets form a sub-base. Equivalently, such is the weakest topology that makes the projection maps continuous.*

Perhaps surprisinly, pointwise convergence can be formulated as convergence in a product space.  

> **Example 3** *Let $ {(X,\mathcal{F})}$ be a topological space and $ {Y}$ a set. We define*  
> 
> *$ \displaystyle X^{Y}:=\{f:Y\rightarrow X\} $*
> 
> *to be the space of all functions form the set $ {Y}$ into the topological space $ {X}$. Since at each $ {y\in Y}$ one can assign all possible values in $ {X}$, the space can be in fact viewed as a product space*  
> 
> *$ \displaystyle X^{Y}=\prod_{y\in Y}X_{y} $*
> 
> *where each $ {X_{y}}$ is a copy of $ {X}$ labeled by $ {y}$. The projection $ {\pi_{y}:f\mapsto f(y)}$ is the evaluation map at $ {y\in Y}$. Then the product topology on $ {X^{Y}}$ is generated by the sets $ {G_{y,V}=\{f\in X^{Y}:f(y)\in V\}}$ for all $ {y\in Y}$ and all $ {V\subset X}$ open. A sequence of functions $ {f_{n}:Y\rightarrow X}$ is said to converge to $ {f:Y\rightarrow X}$ pointwisely if for each $ {y\in Y}$, $ {f_{n}(y)\rightarrow f(y)}$ as $ {n\rightarrow\infty}$. Compositing with the projection maps, we see that $ {f_{n}\rightarrow f}$ in the product topology if and only if $ {f_{n}\rightarrow f}$ pointwisely.*

Now we come back to the discussion of sequential compactness. Suppose now we have two sequential compact spaces $ {X_{1}}$ and $ {X_{2}}$, and form their product $ {X_{1}\times X_{2}}$. Then for any sequence $ {(x^{(m)})_{m}}$ in the product space, by ignoring the first slot, we can extract a subsequence $ {(x^{(m_{1,j})})_{j}}$ whose first slots form a converging sequence in $ {X_{2}}$. Then based on the obtained sequence, by ignoring the second slot, we can extract a further subsequence $ {(x^{(m_{2,j})})_{j}}$ whose first slots form a converging sequence in $ {X_{1}}$. Thus we obtain the sequence $ {(x^{(m_{2,j})})_{j}}$ convergent in both slots.  
When we have a product of at most countably many sequential compact spaces, by the same construction we can obtain a subsequence that is convergent is every slot. Note that if the number is infinite we cannot yet conclude a convergent subsequence in the product space. But we can use the \`\`diagonalisation trick'': we pick $ {x^{(m_{i,i})}}$ as the $ {i}$-th member to form a new subsequence, which is convergent by construction. By Example [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exaLet--be), pointwise convergence is the same as convergence in the product space. Thus this argument yields the *sequential Tychonoff thoerem*, we state it as:  

> **Theorem 14** *(Sequential Tychonoff) Any at most countable product of seqeuntially compact topological spaces is sequentially compact.*

As an application of the theorem, we now quickly formulate and prove *the theorem of Arzelá-Ascoli*, which characterises when a subset of $ {BC(X\rightarrow Y)}$ is precompact, under the uniform metric topology.  

> **Definition 15** *Let $ {(X,\mathcal{F})}$ be a topological space, $ {(Y,d_{Y})}$ be a metric space. Let $ {(f_{\alpha})_{\alpha\in A}}$ be a family of bounded continuous functions $ {BC(X\rightarrow Y)}$.*  
> 
> *-   $ {(f_{\alpha})}$ is said to be *pointwisely bounded* if for every $ {x\in X}$, the set $ {\{f_{\alpha}(x):\alpha\in A\}}$ is bounded in $ {Y}$.
> -   $ {(f_{\alpha})}$ is said to be *pointwisely precompact* if for every $ {x\in X}$, the set $ {\{f_{\alpha}(x):\alpha\in A\}}$ is precompact in $ {Y}$.
> -   $ {(f_{\alpha})}$ is said to be *equicontinuous* if for every $ {x\in X}$, and for each $ {\epsilon>0}$, there is a neighborhood $ {U}$ of $ {x}$ such that $ {d_{Y}(f_{\alpha}(x').f_{\alpha}(x))\leq\epsilon}$ for all $ {x'\in U}$ and all $ {\alpha\in A}$.
> -   If $ {(X,d_{X})}$ is also a metric space, the family $ {(f_{\alpha})}$ is said to be *uniformly equicontinuous* if for each $ {\epsilon>0}$, there is $ {\delta>0}$ such that such that $ {d_{Y}(f_{\alpha}(x').f_{\alpha}(x))\leq\epsilon}$ for all $ {x,x'}$ such that $ {d_{X}(x,x')\leq\delta}$ and all $ {\alpha\in A}$.*

For example, a *Lipschitz* function $ {f:X\rightarrow Y}$ between two metric spaces is such that there is some $ {C>0}$ with $ {d_{Y}(f(x),f(x'))\leq Cd_{X}(x,x')}$ for all $ {x,x'\in X}$, where the smallest $ {C}$ is known as the Lipschtiz constant of $ {f}$. Thus a family of Lipschitz functions with uniformly bounded Lipschitz constant is equicontinuous.  
Recall that $ {BC(X\rightarrow Y)}$ can be made into a metric space with the uniform metric  

$ \displaystyle d(f,g):=\sup_{x\in X}d_{Y}(f(x),g(x)). $

And if $ {Y}$ is complete, so will be $ {BC(X\rightarrow Y)}$. Convergence under this metric topology is the uniform convergence. The property of equicontinuity can upgrade a pointwisely convergent sequence of bounded continuous functions on a compact topological space to a uniform convergent one:  

> **Lemma 16** *Let $ {(X,\mathcal{F})}$ be a compact topological space, $ {(Y,d_{Y})}$ be a metric space, and $ {f_{n}\rightarrow f}$ is a pointwisely convergent sequence in $ {BC(X\rightarrow Y)}$, then the convergence is also uniform. The conclusion is also true when we only have $ {f_{n}\rightarrow f}$ pointwisely on a sense subset of $ {X}$.*

*Proof:* Let $ {\epsilon>0}$. For each $ {x\in X}$, there is $ {N_{x}>0}$ such that $ {d_{Y}(f_{n}(x),f(x))\leq\epsilon}$ for all $ {n\geq N}$. Since the family $ {f_{n}}$ is equicontinuous, $ {x}$ has an open neighborhood $ {U_{x}}$ such that $ {d_{Y}(f_{n}(x),f_{n}(x'))\leq\epsilon}$ for all $ {x'\in U_{x}}$ and all $ {n}$. So is the case in the limit  

$ \displaystyle d_{Y}(f(x),f(x'))\leq\epsilon. $

So in particular the limit is continuous. Also, for all $ {n\geq N_{x}}$, we have by triangular inequality  

$ \displaystyle d_{Y}(f_{n}(x'),f(x))\leq2\epsilon. $

Now clearly $ {U_{x}}$ form a open cover of $ {X}$. By compactness we can select a finite subcovering $ {U_{1},\dots,U_{M}}$, with corresponding $ {N_{1},\dots,N_{M}}$. Let $ {N=\max_{i=1}^{M}N_{i}}$. Thus for $ {n\geq N}$, we see that for all $ {x'\in X}$, there is $ {x}$ belonging to the same $ {U_{i}}$ as $ {x'}$, such that  

$ \displaystyle \begin{array}{rcl} d_{Y}(f_{n}(x'),f(x')) & \leq & d_{Y}(f_{n}(x'),f(x))+d_{Y}(f(x),f(x'))\\ & \leq & 3\epsilon. \end{array} $

This shows that the convergence is also uniform. To show the above is also true when we only have pointwise convergence on dense subset $ {Z\subset X}$, we note that by continuity of $ {f_{n}}$'s,  

$ \displaystyle d_{X}(f_{n}(x),f_{n}(z))\leq\epsilon $

for all $ {x}$ lying in some neighborhood of $ {z\in Z}$. So in fact the sequence converges pointwisely everywhere. $ \Box$  

 The result has an obvious extension to spaces that are also $ {\sigma}$-compact, only that the uniform convergence is replaced by locally uniform convergence (that is, unform convergence on compact sets). Now we state the aimed characterisation:  

> **Theorem 17** *(Arzelá-Ascoli) Let $ {Y}$ be a metric space, $ {X}$ be a compact metric space, and let $ {(f_{\alpha})_{\alpha\in A}}$ be a family of bounded continuous functions. The following are equivalent:*  
> 
> *-   $ {(f_{\alpha})_{\alpha\in A}}$ is precompact, or equivalently sequential precompact in $ {BC(X\rightarrow Y)}$;
> -   $ {(f_{\alpha})_{\alpha\in A}}$ is pointwise precompact and equicontinuous;
> -   $ {(f_{\alpha})_{\alpha\in A}}$ is pointwise precompact and uniformly equicontinuous.*
> 
> *Moreover, if $ {X}$ is instead only compact Hausdorff, then $ {(1)}$ and $ {(2)}$ in the above hold. Of course in such a case $ {(3)}$ no longer makes sense.*

In other words, under the same assumption, a sequence of functions contains a uniformly converging subsequence if and only if at each point the functions' evaluations form a sequence containing convergent subsequences, plus that the functions are equicontinuous. Such a result is comparable to the *uniform boundedness principle* for linear operators from a Banach space to a normed vector space.  

We first prove the easier part of the theorem. Suppose now $ {X}$ is a compact metric space. For $ {(1)\Rightarrow(2)}$, obviously the evaluation maps $ {f\mapsto f(x)}$ are continuous, thus the images of precompact sets under these continuous mappings are precompact. To establish equicontinuity, notice that if at $ {x_{0}\in X}$ the property fails, then there is $ {\epsilon_{0}>0}$, such that for all neighborhood of $ {x_{0}}$, there is $ {n_{0}}$ such that $ {d_{Y}(f_{n_{0}}(x_{0}),f_{n_{0}}(x'))>\epsilon_{0}}$ for some $ {x'}$ in that neighborhood. This certainly prevents any converging subsequence whose limit is continuous.  

For $ {(2)\Rightarrow(3)}$, let $ {\epsilon>0}$. At each point $ {x\in X}$ there is an open $ {\delta_{x}}$-ball satisfying the equicontinuous property. Such balls form an open cover of $ {X}$, and thus by compactness of $ {X}$ there is a finite subcover. The uniformality thus follows.  

For $ {(3)\Rightarrow(1)}$, which is the heart of the matter, we will make use of the sequential Tychonoff theorem. By extracting a countable family, we may just work with sequences. By taking the completion of $ {Y}$, we may assume $ {Y}$ is complete (so that the evaluations at each point has its subsequential limit lies in $ {Y}$). We need an important fact about compact metric spaces.  

> **Lemma 18** *A compact metric space $ {(X,d_{X})}$ is separable (contains a countable dense subset) and second countable (has a countable base for the topology).*

*Proof:* By Heine-Borel (Theorem [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Heine-Borel\)-Let-)), $ {X}$ is totally bounded. So for each rational radius there is a finite covering of $ {X}$ by balls. The centers of the all these balls are certainly dense. These balls also form a base for the topology. $ \Box$  

> **Remark 2** *In fact, a metric space is separable if and only if it is second countable. But we shall not need this fact. The lemma also easily extends to the $ {\sigma}$-compact case.*

Using the lemma, we find a countable dense subset $ {\{x_{1},x_{2},\dots\}}$ of $ {X}$. For each $ {x_{i}}$ we have the sequence $ {(f_{n}(x_{i}))_{n}}$ is precompact. In view of Lemma [16](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemLet--be), we note that it suffices to prove the sequence $ {f_{n}}$ has subsequential limit on $ {\{x_{1},\dots\}}$. But we can view $ {(f_{n}(x_{i}))_{i}}$ (note that the index is $ {i}$) as an element of $ {\prod_{i=1}^{\infty}\overline{(f_{n}(x_{i}))_{n}}}$, which is sequential compact by the sequential Tychonoff theorem. The product space being precompact is nothing but $ {f_{n}}$ has subsequential limit on $ {\{x_{1},\dots\}}$. Hence we are done.  

Finally, in case $ {X}$ is only compact Hausdorff, we only need to amend the proof for $ {(2)\Rightarrow(1)}$. Here we can *borrow the proof* of the sequential Tychonoff theorem. Fix $ {\epsilon>0}$. For each $ {x\in X}$ there is a neighborhood $ {U_{x}}$, such that there is a subsequence $ {(f_{n_{jx}})_{j_{x}}}$ where on $ {U_{x}}$ it is off the subsequential limit at $ {x}$ by at most $ {\epsilon}$ for $ {j}$ large enough (the point is that $ {f_{n_{j_{x}}}}$ does not oscillate too much on $ {U_{x}}$, note that the role played here by the Hausdorff property). This follows from the equicontinuity of $ {f_{n}}$ and convergence of $ {(f_{n_{j_{x}}})_{j_{x}}}$ at $ {x}$. Then by compactness there is a finite collection of $ {U_{1},\dots,U_{M}}$ of such neighborhoods, and thus one can choose a subsequence $ {(f_{n_{j_{\epsilon}}})_{j_{\epsilon}}}$ that has oscillation at most $ {2\epsilon}$ for points lying in the same $ {U_{i}}$ for $ {j_{\epsilon}}$ large enough. Taking $ {\epsilon=1/n}$, and finding the diagonal subsequence, we obtain a subseqeunce that is pointwisely convergent on $ {X}$. And this finishes the proof of the theorem.  

> **Remark 3** *In practice, one often uses special cases or simple extensions of the Arzela-Ascoli theorem. For instances, if the target domain in $ {\mathbb{R}^{n}}$, say, then it is enough to have pointwise boundedness and equicontinuity (which is often provided by uniform Lipschitz or Hölder condition). If the domain is locally compact Hausdorff while other assumptions the same, then we have local uniform convergence instead.  
> In any case, the *regularity* of the family is essential. Even from uniform boundedness of the family one cannot say too much about the pointwise convergence at the subsequence level in case the family lies in a space of infinite dimensions.*
