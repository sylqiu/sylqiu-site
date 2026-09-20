---
id: 2017-06-15-distributions-in-and-the-fourier-transform
title: "Distributions in $\\mathbb{R}^{d}$ and the Fourier transform"
date: 2017-06-15
tags: ["functional analysis", "harmonic analysis"]
source: https://sylqiu.blogspot.com/2017/06/distributions-in-mathbbrd-and-fourier.html
publish: true
---
Let us recall the integration by part formula:  

$ \\displaystyle \\int\_{\\Omega}\\frac{\\partial f}{\\partial x\_{i}}\\varphi\\,dx+\\int\_{\\Omega}f\\frac{\\partial\\varphi}{\\partial x\_{i}}\\,dx=\\int\_{\\partial\\Omega}f\\varphi\\,\\nu\_{i}d\\Gamma $

where functions are smooth and integrable, and $ {\\partial\\Omega}$ is regular. If the RHS vanishes, in particular when the function $ {\\varphi}$ is compactly supported in $ {\\Omega}$, then  

$ \\displaystyle \\int\_{\\Omega}f\\frac{\\partial\\varphi}{\\partial x\_{i}}\\,dx=-\\int\_{\\Omega}\\frac{\\partial f}{\\partial x\_{i}}\\varphi\\,dx, $

and more generally, in multi-index notation  

$ \\displaystyle \\int\_{\\Omega}f(\\partial\_{x}^{\\alpha}\\varphi)\\,dx=(-1)^{|\\alpha|}\\int\_{\\Omega}(\\partial\_{x}^{\\alpha}f)\\varphi\\,dx. $

The map $ {(u,v)\\mapsto\\int\_{\\Omega}uv\\,dx}$ is easily seen to be symmetric, bilinear and positive definite, so can be morally viewed as an inner product $ {\\langle u,v\\rangle}$, or more generally, a duality pairing. Then we see from the above that the linear differential operator $ {\\partial\_{x}^{\\alpha}}$, whose *domain* is $ {C\_{c}^{\\infty}(\\Omega)}$, has its *adjoint* $ {(-1)^{|\\alpha|}\\partial\_{x}^{\\alpha}}$.  

While for an ordinary function $ {f}$ that is merely integrable, the expression $ {\\partial\_{x}^{\\alpha}f}$ doesn't make too much sense, however, the expression $ {\\int\_{\\Omega}f(\\partial\_{x}^{\\alpha}\\varphi)\\,dx}$ is still well-defined. This suggests an extension of the adjoint operator, initially defined on smooth functions, to a larger space. For that we need to choose a topology on $ {C\_{c}^{\\infty}(\\Omega)}$ (one that makes it into a *locally convex topological vector space*), from which we can get its dual space $ {C\_{c}^{\\infty}(\\Omega)'}$, as the candidate space for extension. The topology should be such that the resulting extension is "reasonable'' enough: if a sequence $ {f\_{n}\\in C\_{c}^{\\infty}(\\Omega)}$ is such that  

$ \\displaystyle \\langle\\varphi,f\_{n}\\rangle\\rightarrow\\langle\\varphi,f\\rangle $

holds for all $ {\\varphi\\in C\_{c}^{\\infty}(\\Omega)}$, which in particular implies  

$ \\displaystyle \\langle\\partial\_{x\_{i}}\\varphi,f\_{n}\\rangle\\rightarrow\\langle\\partial\_{x\_{i}}\\varphi,f\\rangle $

for all $ {\\varphi\\in C\_{c}^{\\infty}(\\Omega)}$, then it should hold that  

$ \\displaystyle \\langle\\partial\_{x\_{i}}\\varphi,f\\rangle=\\langle\\varphi,-\\partial\_{x\_{i}}f\\rangle $

since it holds true for the sequence $ {f\_{n}}$. In other words, the adjoint operator should be continuously extended, with respect to the duality pairing topology, i.e. the *weak\* topology*. As such, the topology to be placed on $ {C\_{c}^{\\infty}(\\Omega)}$ is expected to be very strong, in order for the unbounded operators such as $ {\\partial\_{x}^{\\alpha}}$ to have a continuous extension. This means that we will get a very large dual space $ {C\_{c}^{\\infty}(\\Omega)'}$, known as the space of *distributions* on $ {\\Omega}$.  

This post has been mainly influenced by Terry's notes, where many quotations are from him; also Hörmander's Analysis of linear partial differential operators, Vol. 1, and Stein's several books. The applications of this part of the theory are so fascinating that I decide to devote my next post to them.  

**1\. Generalities**

From now we shall focus on the case $ {\\Omega=\\mathbb{R}^{d}}$.  

> **Definition 1** *A *distribution* $ {\\lambda}$ in $ {\\mathbb{R}^{d}}$ is a linear functional on $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ such that for every compact set $ {K\\subset\\mathbb{R}^{d}}$, there is $ {C=C(K)>0}$, $ {k=k(K)\\in\\mathbb{N}}$ such that[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle |\\langle\\varphi,\\lambda\\rangle|\\leq C\\sum\_{|\\alpha|\\leq k}\\sup|\\partial^{\\alpha}\\varphi| \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)for all $ {\\varphi\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$.*

Being defined by linear duality, a distribution will be studied through testing it against $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ functions. Thus these functions are often called test functions, when the type of duality is clear.  

Note that we always put $ {\\lambda}$ into the slot on the right in the duality bracket. The space of distributions is endowed with the conjugate complex structure, that is  

$ \\displaystyle \\langle\\varphi,c\\lambda\\rangle=\\bar{c}\\langle\\varphi,\\lambda\\rangle\\quad\\forall c\\in\\mathbb{C}, $

to keep the analogy with the Hermitian inner product. The continuity condition ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is equivalent to saying that $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ is equipped with the *smooth topology*. The space of distributions $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})^{\*}}$, equipped with the corresponding weak\* topology, will thus be Hausdorff, thanks to the Hahn-Banach theorem. The weak\* convergence for a sequence $ {\\lambda\_{n}\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})^{\*}}$ will be refered to as the convergence *in distribution*.  

**Density argument.** Suppose the inclusion into some normed vector space  

$ \\displaystyle \\iota:C\_{c}^{\\infty}(\\mathbb{R}^{d})\\hookrightarrow X, $

is continuous and dense. Then the adjoint of this inclusion is a continuous injection into the space of distributions  

$ \\displaystyle \\iota^{\*}:X^{\*}\\hookrightarrow C\_{c}^{\\infty}(\\mathbb{R}^{d})^{\*}, $

where $ {X^{\*}}$ is equipped with the weak\* topology with respect to the topology of $ {X}$ (objects in $ {X^{\*}}$ can of course be paired up with $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ functions). Because of the continuous injection, weak\* convergence in $ {X^{\*}}$ will imply convergence in the sense of distributions.  
We have seen many such situations already, for example:  

-   If $ {X=(C\_{0}(\\mathbb{R}^{d}),\\|\\cdot\\|\_{\\infty})}$, or $ {X=C\_{c}(\\mathbb{R}^{d})}$, then $ {X^{\*}=M(\\mathbb{R}^{d})}$, the space of finite Radon measures, which is the content of the Riesz representation theorem (complex valued case);
-   If $ {X=L^{p}(\\mathbb{R}^{d})}$, $ {1\\leq p<\\infty}$, then $ {X^{\*}=L^{q}(\\mathbb{R}^{d})}$, with $ {1/p+1/q=1}$;
-   If $ {X=\\mathcal{S}(\\mathbb{R}^{d})}$, the space of *Schwartz functions*, then $ {\\mathcal{S}(\\mathbb{R}^{d})^{\*}}$ is the space of *tempered distributions*, which will be studied later.  

We see that the notion of distribution generalises that of functions and measures. In fact, say a distribution is of *order* $ {k}$ if there is a same non-negative integer $ {k}$, and not smaller, applies to all compact sets $ {K}$ in the definition. Then distributions of order 0 can be paired with test functions in the space $ {(C\_{0}(\\mathbb{R}^{d}),\\|\\cdot\\|\_{\\infty})}$, and thus can be identified with finite Radon measures. Say a distribution $ {\\lambda}$ is *non-negative* if $ {\\langle\\varphi.\\lambda\\rangle\\geq0}$ for all $ {\\varphi\\geq0\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$, then by density of $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ in $ {C\_{c}(\\mathbb{R}^{d})}$ in the uniform convergence topology, $ {\\lambda}$ can again be identified with a non-negative Radon measure, by Riesz representation.  
There are distributions that are not Radon measures, nor locally integrable functions. For example:  

-   **Derivative of the Dirac delta:** the distribution

    $ \\displaystyle \\varphi\\mapsto-\\partial\_{x\_{i}}\\varphi(0) $

    is of order 1, thus does not arise from a locally integrable function nor a Radon measure.
-   **Principal value of $ {1/x}$:** let $ {d=1}$. The distribution

    $ \\displaystyle \\varphi\\mapsto\\lim\_{\\epsilon\\rightarrow0}\\int\_{|x|>\\epsilon}\\frac{\\varphi(x)}{x}dx $

    does not arise from a locally integrable function nor a Radon measure ($ {1/x}$ is not locally integrable). Note that the limit exists because of not only the decay of $ {\\varphi}$ at infinity, but also that $ {1/x}$ is an odd function that allows to pass the estimate of $ {\\varphi(x)/x}$ near the origin to the difference quotient $ {(\\varphi(x)-\\varphi(0))/x}$, which is controled by the derivative of $ {\\varphi}$.
-   **Distributional interpretations of $ {1/|x|}$**: let $ {d=1}$. For any $ {r>0}$, the distribution

    $ \\displaystyle \\lambda\_{r}:\\varphi\\mapsto\\int\_{|x|<r}\\frac{\\varphi(x)-\\varphi(0)}{|x|}dx+\\int\_{|x|\\geq r}\\frac{\\varphi(x)}{|x|}dx $

    does not arise from a locally integrable function nor a Radon measure ($ {1/|x|}$ is not locally integrable). Again, the appearance of $ {\\varphi(x)-\\varphi(0)}$ makes the first integral convergent. Note that for different $ {r,r'}$, $ {\\lambda\_{r}}$ and $ {\\lambda\_{r'}}$ differ by a constant multiple of the Dirac delta distribution $ {\\varphi\\mapsto\\varphi(0)}$.  

Let us now set out the rules for manipulating distributions.  

**Multiplied by a smooth function.** We can multiply a test function by a smooth function in the duality bracket (which results in another test function), so we can define the multiplication of a distribution with a smooth function by the adjoint of such an operation:  

$ \\displaystyle \\langle\\varphi,\\lambda h\\rangle=\\langle\\varphi,h\\lambda\\rangle:=\\langle\\bar{h}\\varphi,\\lambda\\rangle $

for all test functions $ {\\varphi\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$.  

**Action of linear bijection.** For such a linear transformation $ {L:\\mathbb{R}^{d}\\rightarrow\\mathbb{R}^{d}}$, we can define  

$ \\displaystyle \\langle\\varphi,\\lambda\_{L}\\rangle:=\\langle\\frac{1}{\\det L}\\varphi\\circ L^{-1},\\lambda\\rangle. $

**Convolving with a compactly supported absolutely integrable function.** For such a function $ {h}$ we can define  

$ \\displaystyle \\langle\\varphi,\\lambda\*h\\rangle=\\langle\\varphi,h\*\\lambda\\rangle:=\\langle\\varphi\*\\tilde{h},\\lambda\\rangle $

where $ {\\tilde{h}(x):=\\overline{h(-x)}}$. Note that $ {\\varphi\*\\tilde{h}}$ is again a test function. Moreover, we have the following important result.  

> **Proposition 2** *If $ {h\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$, then $ {\\lambda\*h}$ is a $ {C^{\\infty}}$-function.*

*Proof:* Formally, $ {\\lambda\*h=\\int\\lambda(x)h(y-x)\\thinspace dx}$ is defined and varies smoothly in the $ {y}$-variable. It remains to justfy  

$ \\displaystyle \\langle\\varphi,\\int\\lambda(x)h(y-x)\\thinspace dx\\rangle=\\langle\\int\\varphi\\overline{h(y-x)}\\thinspace dx,\\lambda\\rangle $

for all test functions $ {\\varphi}$. Since $ {\\lambda:C\_{c}^{\\infty}(\\mathbb{R}^{d})\\rightarrow\\mathbb{C}}$ is continuous, and the Riemann sum $ {\\sum\_{n\\in\\mathbb{Z}^{d}}\\varphi(n\\epsilon)\\overline{h(y-n\\epsilon)}}$ converges to $ {\\int\\varphi\\overline{h(y-x)}}$ in distribution, the desired equality holds by passing to the limit. $ \\Box$  

 We say a sequence of $ {C\_{c}^{\\infty}}$-functions $ {\\varphi\_{n}}$ forms an *approximation to the identity* if each $ {\\varphi\_{n}\\geq0}$, $ {\\int\\varphi\_{n}\\thinspace dx=1}$, and the support shrinks to the origin. Since  

$ \\displaystyle \\int\\psi(x)\\varphi\_{n}(x)\\thinspace dx=\\psi(0)\\int\_{B(0,r)}\\varphi\_{n}(x)\\thinspace dx+o(r)\\rightarrow\\psi(0) $

we see that the sequence $ {\\varphi\_{n}}$ converges to the Dirac delta $ {\\varphi\_{n}\\rightarrow\\delta}$ in distribution. What is more, we have the following useful facts  

> **Lemma 3** *[](https://www.blogger.com/null)Let $ {\\varphi\_{n}}$ be an approximation to the identity.*  
> 
> *-   If $ {f\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$, then $ {f\*\\varphi\_{n}\\rightarrow f}$ in the smooth topology;
> -   If $ {f\\in C(\\mathbb{R}^{d})}$, then $ {f\*\\varphi\_{n}\\rightarrow f}$ uniformly on compact sets;
> -   If $ {f\\in L^{p}(\\mathbb{R}^{d})}$, $ {1\\leq p<\\infty}$, then $ {f\*\\varphi\_{n}\\rightarrow f}$ in $ {L^{p}}$.*

As a corollary of (1), we see that the test function space $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ is dense in the space of distributions. Thus operations on test functions that is continuous with respect to the distributional topology can be extended to distributions.  

**Differentiation of distributions.** As motivated in the begining, the differentiation of a distribution $ {\\lambda}$ can be defined by  

$ \\displaystyle \\langle\\varphi,P\\lambda\\rangle=\\langle P^{\*}\\varphi,\\lambda\\rangle $

where $ {P}$ is any linear partial differential operator with *smooth coefficients*, and $ {P^{\*}}$ is the adjoint operator of $ {P}$. If $ {P}$ is a partial derivative operator, the distribution $ {P\\lambda}$ obtained is called a *distributional derivative*. If a distributional derivative happens to be a locally integrable function, then it is called a *weak derivative*. Since these operators are continuous in the distributional topology, a number of manipulations with derivatives, e.g. the product rule, continue to hold whenever the product is allowed in the distributional topology.  

 Many non-smooth functions have distributional derivatives that make sense intuitively. For example, the locally integrable function $ {H(x)=\\chi\_{(0,\\infty)}}$ is called the *Heaviside function*. Its distributional derivative is the Dirac delta measure $ {\\delta\_{0}}$ at the origin, since by the fundamental theorem of calculus  

$ \\displaystyle \\int\_{\\mathbb{R}}\\varphi(x)H'(x)\\,dx=-\\int\_{\\mathbb{R}}\\varphi'(x)H(x)\\,dx=\\varphi(0). $

It's also easy to see that the distributional derivative of $ {\\chi\_{(a,b)}}$ is the signed measure $ {\\delta\_{a}-\\delta\_{b}}$, since  

$ \\displaystyle \\int\_{\\mathbb{R}}\\varphi(x)\\chi\_{(a,b)}'(x)\\,dx=-\\int\\varphi'(x)\\chi\_{(a,b)}(x)\\,dx=\\varphi(a)-\\varphi(b). $

We also have the high dimensional analog of the above, known as the *Gauss-Green formula*, or *divergence theorem*. Assume that $ {\\Omega\\subset\\mathbb{R}^{d}}$ is an open set with $ {C^{1}}$-boundary, then it holds that[](https://www.blogger.com/null)  

[$ \\displaystyle \\int\_{\\mathbb{R}^{d}}(\\partial\_{j}\\varphi)\\chi\_{\\Omega}\\,dx=-\\int\_{\\partial\\Omega}\\varphi\\nu\_{j}d\\Gamma, \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {\\nu\_{j}}$ is the $ {j}$-th component of the unit outward normal vector, and $ {d\\Gamma}$ is the Euclidean surface measure on $ {\\partial\\Omega}$. Thus we have the distributional equality  

$ \\displaystyle \\partial\_{j}\\chi\_{S}=\\nu\_{j}d\\Gamma. $  

**The Fourier transform on tempered distributions.** The Schwartz space $ {\\mathcal{S}(\\mathbb{R}^{d})}$ consists of smooth functions with all their derivatives rapidly decreasing at infinity. The topology is given by the family of norms indexed in $ {N\\geq0}$,  

$ \\displaystyle \\|\\varphi\\|\_{N}=\\sup\_{x\\in\\mathbb{R}^{d},|\\alpha|,|\\beta|\\leq N}|x^{\\beta}(\\partial\_{x}^{\\alpha}\\varphi)(x)|. $

A *tempered distribution* is a continuous linear functional on $ {\\mathcal{S}(\\mathbb{R}^{d})}$. Since the Fourier transform  

$ \\displaystyle \\mathcal{F}:\\varphi\\mapsto\\varphi^{\\wedge}(\\xi)=\\int\_{\\mathbb{R}^{d}}\\varphi(x)e^{-2\\pi ix\\cdot\\xi}\\thinspace dx $

is a continuous bijection on $ {\\mathcal{S}(\\mathbb{R}^{d})}$, whose inverse is given by  

$ \\displaystyle \\mathcal{F}:\\psi\\mapsto\\psi^{\\vee}(x)=\\int\_{\\mathbb{R}^{d}}\\psi(\\xi)e^{2\\pi ix\\cdot\\xi}\\thinspace d\\xi, $

we define  

$ \\displaystyle \\langle\\varphi,\\lambda^{\\wedge}\\rangle=\\langle\\varphi^{\\vee},\\lambda\\rangle $

as the inverse of the Fourier transform is also its adjoint, under the complex conjugate structure on the space of tempered distributions. The Fourier transform will be studied in greater details in a separate section. Before that we just note several facts regarding the tempered distributions.  

 A $ {C^{\\infty}}$-function $ {\\psi}$ is said to be *increasing slowly* if for each multi-index $ {\\alpha}$, $ {|\\partial^{\\alpha}\\psi|=O(|x|^{N\_{\\alpha}})}$ for some $ {N\_{\\alpha}\\geq0}$. The product of a tempered distribution with a slowly increasing $ {C^{\\infty}}$-function is still tempered. A tempered distribution convolving with a Schwartz function is a slowly increasing $ {C^{\\infty}}$-function. A distribution $ {\\lambda}$ is said to be *supported* on a closed set $ {F}$ if its complement $ {F^{c}}$ is the largest open set such that  

$ \\displaystyle \\langle\\varphi,\\lambda\\rangle=0 $

whenever $ {\\varphi}$ is supported within $ {F^{c}}$. A distribution with compact support is easily seen to be tempered. In particular this is the case for the Dirac delta distribution, whose support is the singleton $ {\\{0\\}}$. Such distribution is said to have *point support*. A compactly supported distribution convolving with a Schwartz function remains a Schwartz function. From this, we can even define convolutions of tempered distributions with compactly supported distributions.  

A final remark: in general, one cannot perform non-linear operations on distributions, such as taking absolute value, and multiplication of distribution with anything rougher than a smooth function. In the former case, there is no good sense of adjointness to those operations, and in the latter, in whose possible definition does not always lead to a proper test function.  

**2\. The Fourier transform in $ {\\mathbb{R}^{d}}$; the action of translation**

We start by noting the intimate relation between the Fourier transform in the Euclidean space $ {\\mathbb{R}^{d}}$ and a naturual group action on it, namely, the translation by an element of $ {\\mathbb{R}^{d}}$  

$ \\displaystyle \\tau\_{x}:y\\mapsto y-x. $

The action naturally introduces a linear operator on functions defined on the Euclidean space, by  

$ \\displaystyle \\tau\_{x}f(y):=f(y-x). $

The linear operator $ {\\tau\_{x}}$ leaves the space $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$ (say) invariant, and is continuous. In many cases when the function space is a normed vector space, the operator norm is one. Most importantly, it is *unitary* with respect to the inner product $ {\\langle f,g\\rangle:=\\int\_{\\mathbb{R}^{d}}fg\\thinspace dx}$. We are now interested in finding its eigenfunctions; those are functions with the property  

$ \\displaystyle f(y-x)=c(x)f(y)\\ y\\in\\mathbb{R}^{d} $

for all $ {x\\in\\mathbb{R}^{d}}$, for some $ {c(x)}$. Observe that the function is determined by its value at the origin and $ {c(x)}$. If $ {f(0)=0}$, then $ {f\\equiv0}$ on $ {\\mathbb{R}^{d}}$. Discard this uninteresting case and assume $ {f(0)=1}$, we have  

$ \\displaystyle c(x)=f(-x) $

and therefore,[](https://www.blogger.com/null)  

[$ \\displaystyle f(y-x)=f(-x)f(y). \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Assuming $ {f}$ is absolutely integrable, observe that if $ {g\\in C\_{c}^{\\infty}(\\mathbb{R}^{d})}$, then  

$ \\displaystyle \\begin{array}{rcl} \\int\_{\\mathbb{R}^{d}}f(x)g(y-x)\\thinspace dx & = & \\int\_{\\mathbb{R}^{d}}f(y-x)g(x)\\thinspace dx\\\\ & = & f(y)\\int\_{\\mathbb{R}^{d}}f(-x)g(x)\\thinspace dx. \\end{array} $

Since the LHS is smooth, we obtain that $ {f}$ is in fact smooth. Now differentiating ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) with respect to $ {y}$ gives,  

$ \\displaystyle \\partial\_{j}f(y-x)=f(-x)\\partial\_{j}f(y). $

Taking value at $ {y=0}$ and making a change of variable, we have a system of differential equations  

$ \\displaystyle \\partial\_{j}f(x)=f(x)\\partial\_{j}f(0),\\ x\\in\\mathbb{R}^{d}. $

By the assumption $ {f(0)=1}$, and writing $ {a=(\\partial\_{j}f(0))\_{j=1}^{d}}$  

$ \\displaystyle f(x)=e^{x\\cdot a}. $

Thus we have determined all eigenfunctions of the translation operator; these functions are also called *characters* of the *locally compact abelian group* $ {\\mathbb{R}^{d}}$. Fourier analysis on $ {\\mathbb{R}^{d}}$ studies an essentially arbitrary function $ {f}$ by decomposing it into the sum (integral) of bounded characters, that is when $ {a=-2\\pi i\\xi}$ is purely imaginary; these are the *plane waves* with frequency $ {\\xi\\in\\mathbb{R}^{d}}$. Each frequency is given the associated *Fourier coefficient*, via the Fourier transform  

$ \\displaystyle f^{\\wedge}(\\xi)=\\int\_{\\mathbb{R}^{d}}f(x)e^{-2\\pi ix\\cdot\\xi}\\thinspace dx. $

As a first manifestation of the relation between the Fourier transform and translation, one considers the action of translation before and after the Fourier transform, respectively. One has, for integrable $ {f}$,[](https://www.blogger.com/null)  

[$ \\displaystyle (\\tau\_{x\_{0}}f)^{\\wedge}(\\xi)=e^{-2\\pi ix\_{0}\\cdot\\xi}f^{\\wedge}(\\xi), \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and[](https://www.blogger.com/null)  

[$ \\displaystyle \\tau\_{\\xi\_{0}}f^{\\wedge}(\\xi)=\\left(e^{2\\pi ix\\cdot\\xi\_{0}}f(x)\\right)^{\\wedge}. \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)In other words,  

 *the Fourier transform takes translation to frequency modulation, and conversely.* 

 Note also that ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7)) in effect states that Fourier transform *diagonalises* translation. More aspects of this relation will be explored in what follows. Because of this feature, the Fourier transform tends to simplify any problem that enjoys a translational symmetry; this is in particular the case with PDE with constant coefficients.  

**The Fourier transform on $ {\\mathcal{S}(\\mathbb{R}^d)'}$.** We shall first recall the fact that the Fourier transform is a continuous bijection on $ {\\mathcal{S}(\\mathbb{R}^{d})}$. That it is so follows from the rapid decrease of a Schwartz function $ {\\varphi}$ and all its derivatives, where it is legitmate to perform differentiation up to any order of the integral $ {\\int\_{\\mathbb{R}^{d}}\\varphi(x)e^{-2\\pi ix\\cdot\\xi}\\thinspace dx}$. We have by differentiating in $ {\\xi}$-variable,[](https://www.blogger.com/null)  

[$ \\displaystyle \\partial\_{j}\\varphi^{\\wedge}(\\xi)=-2\\pi i(x\_{j}\\varphi)^{\\wedge}(\\xi), \\ \\ \\ \\ \\ (6)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and integrating by parts in $ {x}$-variable shows that[](https://www.blogger.com/null)  

[$ \\displaystyle (\\partial\_{j}\\varphi)^{\\wedge}(\\xi)=2\\pi i\\xi\_{j}\\varphi^{\\wedge}(\\xi). \\ \\ \\ \\ \\ (7)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)From here we get another important fact:    

*the Fourier transform takes differentiation to multiplication (by polynomial up to constants), and conversely.* 

 Note also that ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#5)) in effect states that Fourier transform *diagonalises* differentiation. Since the Fourier transform of a integrable function is bounded, ([6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) and ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#5)) impliy that functions of the form  

$ \\displaystyle \\xi^{\\beta}(\\partial^{\\alpha}\\varphi^{\\wedge})(\\xi), $

as the Fourier transform of $ {{\\displaystyle (}2\\pi i)^{-|\\beta|}\\partial^{\\beta}((2\\pi i)^{|\\alpha|}x^{\\alpha}f(x))}$, is bounded, thus $ {\\varphi^{\\wedge}}$ is Schwartz. From here it is also easy to see that the Fourier transform is continuous on $ {\\mathcal{S}(\\mathbb{R}^{d})}$. It remains to show the inversion formula,  

$ \\displaystyle \\varphi(x)=\\int\_{\\mathbb{R}^{d}}\\varphi^{\\wedge}(\\xi)e^{2\\pi ix\\cdot\\xi}\\thinspace d\\xi. $

Since the double integral  

$ \\displaystyle \\int\_{\\mathbb{R}^{d}}e^{2\\pi ix\\cdot\\xi}\\int\_{\\mathbb{R}^{d}}\\varphi(y)e^{-2\\pi iy\\cdot\\xi}\\thinspace dyd\\xi $

is not absolutely convergent unless $ {f}$ identically vanishes, certain care has to be taken. The strategy is to multiply a test function that has rapid decrease. One can use any Schwartz function with certain normalization, but it is natural to use Gaussians  

$ \\displaystyle g(x)=e^{-\\pi|x|^{2}}. $

We note its two important properties  

-   $ {g^{\\wedge}(0)=\\int\_{\\mathbb{R}^{d}}g(x)\\,dx=1}$;
-   $ {g^{\\wedge}(x)=g(x)}$.

Now consider the above double integral as the limit of absolutely convergent integrals  

$ \\displaystyle \\begin{array}{rcl} \\int\_{\\mathbb{R}^{d}}\\varphi^{\\wedge}(\\xi)e^{2\\pi ix\\cdot\\xi}\\thinspace d\\xi & = & \\lim\_{\\epsilon\\rightarrow0}\\int\_{\\mathbb{R}^{d}}e^{2\\pi ix\\cdot\\xi}g^{\\wedge}(\\epsilon\\xi)\\int\_{\\mathbb{R}^{d}}\\varphi(y)e^{-2\\pi iy\\cdot\\xi}\\thinspace dyd\\xi\\\\ & = & \\lim\_{\\epsilon\\rightarrow0}\\int\_{\\mathbb{R}^{d}}\\varphi(y)\\int\_{\\mathbb{R}^{d}}g^{\\wedge}(\\epsilon\\xi)e^{-2\\pi i(y-x)\\cdot\\xi}\\thinspace d\\xi dy\\\\ & = & \\lim\_{\\epsilon\\rightarrow0}\\int\_{\\mathbb{R}^{d}}\\varphi(y)\\frac{1}{\\epsilon^{d}}g(\\frac{y-x}{\\epsilon})dy\\\\ & = & \\lim\_{\\epsilon\\rightarrow0}\\int\_{\\mathbb{R}^{d}}\\varphi(x+\\epsilon z)g(z)dz=\\varphi(x). \\end{array} $

We have in fact proved a multiplication formula  

$ \\displaystyle \\int\_{\\mathbb{R}^{d}}\\varphi^{\\wedge}(\\xi)\\psi(\\xi)\\,d\\xi=\\int\_{\\mathbb{R}^{d}}\\varphi(x)\\psi^{\\wedge}(x)\\,dx $

for $ {\\varphi}$, $ {\\psi\\in\\mathcal{S}(\\mathbb{R}^{d})}$. A little more manipulation on this shows the*Parseval's formula*  

$ \\displaystyle \\int\_{\\mathbb{R}^{d}}\\varphi^{\\wedge}(\\xi)\\overline{\\psi^{\\wedge}(\\xi)}\\,d\\xi=\\int\_{\\mathbb{R}^{d}}\\varphi(x)\\overline{\\psi(x)}\\,dx, $

and when $ {\\varphi\\equiv\\psi}$, the *Plancherel's identity*  

$ \\displaystyle \\|\\varphi^{\\wedge}\\|\_{2}^{2}=\\|\\varphi\\|\_{2}^{2}. $

By duality, these altogether imply:  

> **Theorem 4** *The Fourier transform is an continuous bijection of the space of tempered distribution $ \\mathcal{S}(\\mathbb{R}^{d})'$.*

**The Fourier transform on $ {L^{p}(\\mathbb{R}^d)}$, $ {1\\leq p\\leq 2}$.** Let us now use density argument to get theorems for the Fourier transform on $ {L^{p}}$ spaces, $ {1\\leq p\\leq2}$, with particular interests in $ {p=2}$. We start by the following property of the Fourier transform of an absolutely integrable function. The decaying at infinity is known as the *Riemann-Lebesgue lemma*.  

> **Theorem 5** *If $ {f\\in L^{1}(\\mathbb{R}^{d})}$, then $ {f^{\\wedge}}$ is continuous, belongs to $ {L^{\\infty}(\\mathbb{R}^{d})}$ with*  
> 
> *$ \\displaystyle \\|f^{\\wedge}\\|\_{\\infty}\\leq\\|f\\|\_{1} $*
> 
> *Moreover, $ {f^{\\wedge}(\\xi)\\rightarrow0}$ as $ {|\\xi|\\rightarrow+\\infty}$.*

However, in general an $ {L^{1}}$-function does not have its Fourier transform in $ {L^{1}}$. The following theorem thus has to encounter this possibility.  

> **Theorem 6** *If $ {f\\in L^{1}(\\mathbb{R}^{d})}$ and $ {f^{\\wedge}\\in L^{1}(\\mathbb{R}^{d})}$, then the inversion formula holds for almost every $ {x}$.*

Now we turn to the $ {L^{2}}$ case. The Plancherel's identity indicates a direct way to uniquely extend the Fourier transform on $ {\\mathcal{S}(\\mathbb{R}^{d})}$ to $ {L^{2}(\\mathbb{R}^{d})}$: for each $ {f\\in L^{2}(\\mathbb{R}^{d})}$, as Lemma [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lem3) suggests that we approximate the function by a sequence in $ {C\_{c}^{\\infty}(\\mathbb{R}^{d})}$, with the convergence in $ {L^{2}}$. The estimate provided by The Plancherel's identity thus allows us to define the Fourier transform as the unique $ {L^{2}}$-limit of the sequence of the corresponding Fourier transforms. This definition also coincides with the approach of restricting the Fourier transform on the space of tempered distributions, since the ingredients are in fact identical. We summarised it as:  

> **Theorem 7** *The Fourier transform is a unitary mapping of $ {L^{2}(\\mathbb{R}^{d})}$.*

The intermediate case follows from a textbook application of the *Riesz-Torin interpolation theorem*.  

> **Theorem 8** *(Hausdorff-Young) If $ {f\\in L^{p}(\\mathbb{R}^{d})}$, $ {1\\leq p\\leq2}$, then $ {f^{\\wedge}\\in L^{q}(\\mathbb{R}^{d})}$, $ {1/p+1/q=1}$. Moreover,*  
> 
> *$ \\displaystyle \\|f^{\\wedge}\\|\_{q}\\leq\\|f\\|\_{p}. $*

**Fourier multipliers.** We'd like to continue to investigate the relation between the Fourier transform and translation. There is a way to unify the previous two discussions, by means of convolution with a kernel $ {K\\in\\mathcal{S}(\\mathbb{R}^{d})'}$,  

$ \\displaystyle \\int\_{\\mathbb{\\mathbb{R}}^{d}}K(x-y)\\varphi(y)\\thinspace dy. $

Indeed, one has  

$ \\displaystyle \\tau\_{x\_{0}}\\varphi(x)=\\int\_{\\mathbb{R}^{d}}\\delta\_{x\_{0}}(x-y)\\varphi(y)\\thinspace dy $

where $ {\\delta\_{x\_{0}}}$ is the translated Dirac delta $ {\\delta(x-x\_{0})}$; also,  

$ \\displaystyle \\partial\_{j}\\varphi(x)=-\\int\_{\\mathbb{R}^{d}}\\partial\_{j}\\delta(x-y)\\varphi(y)\\thinspace dy. $

The point is that differential operator *commutes* with the translation operator, which commutes with itself. It is easy to see that linear operators of "convolution type'', at least formally, commutes with the translation operator  

$ \\displaystyle \\tau\_{x\_{0}}\\int\_{\\mathbb{\\mathbb{R}}^{d}}K(x-y)\\varphi(y)\\thinspace dy=\\int\_{\\mathbb{\\mathbb{R}}^{d}}K(x-y)\\tau\_{x\_{0}}\\varphi(y)\\thinspace dy. $

We have the following important fact about concolution and the Fourier transform.  

> **Proposition 9** *$ {If}$ $ {\\lambda}$ is a tempered distribution and $ {\\varphi\\in\\mathcal{S}(\\mathbb{R}^{d})}$, then $ {\\lambda\*\\varphi}$ is a slowly increasing $ {C^{\\infty}}$-function, which when considered as a tempered distribution satisfies*  
> 
> *$ \\displaystyle (\\lambda\*\\varphi)^{\\wedge}=\\varphi^{\\wedge}\\lambda^{\\wedge}. $*

The classical result on finite dimensional linear algebra that commuting linear operators under mild conditions can be *simultaneously diagonalised* has a clear analogy in our setting -- our convolutional operators can be all diagonalised by the Fourier transform, and represented as pointwise multiplications in the frequency space by their Fourier transforms, known as their *symbols*. In principle,  

*translation invariant operators in the physical domain correspond to multiplication by symbols in the Fourier domain, and conversely.* 

 It can be shown that a bounded linear operators on $ {L^{p}}$, $ {1\\leq p\\leq\\infty}$ , that commutes with all translations must arise as a tempered distribution. Not much more is known (to my knowledge, up to Stein's 1971 book). However, there is a classification for an bounded linear operators mapping $ {L^{1}}$, $ {L^{2}}$ to themselves, respectively. The $ {L^{2}}$ case is of particular interest, because of the unitarity of the Fourier transform.  

> **Theorem 10** *Let $ {T}$ be a bounded linear operator mapping $ {L^{2}(\\mathbb{R}^{d})}$ to itself. Then $ {T}$ commutes with all translations in $ {\\mathbb{R}^{d}}$ if and only if there is a bounded measurable funciton $ {m:\\mathbb{R}^{d}\\rightarrow\\mathbb{C}}$, called a "multiplier'', so that*  
> 
> *$ \\displaystyle (Tf)^{\\wedge}(\\xi)=m(\\xi)f^{\\wedge}(\\xi),\\ f\\in L^{2}(\\mathbb{R}^{d}), $*
> 
> *with $ {\\|T\\|=\\|m\\|\_{\\infty}}$.*

We see that $ {m}$ is the corresponding symbol of the convolutional kernel associated to $ {T}$.  

From this one can define  

> **Definition 11** *A *Fourier multiplier operator* $ {T\_{m}}$ is defined on the Schwartz space by*  
> 
> *$ \\displaystyle T\_{m}\\varphi=(mf^{\\wedge})^{\\vee} $*
> 
> *where $ {m}$ is bounded measurable function.*

By Plancherel's identity such operators has a continuous extension to $ {L^{2}(\\mathbb{R}^{d})}$. It's a natural question to ask that whether an operator so defined can be continuously exteneded to general $ {L^{p}}$. However, in 1971, Charles Fefferman showed  

> **Theorem 12** *(Fefferman's ball multiplier counterexample) The ball multiplier $ {T\_{B}}$, defined by*  
> 
> *$ \\displaystyle (T\_{B}f)^{\\wedge}=\\chi\_{B}f^{\\wedge} $*
> 
> *where $ {\\chi\_{B}}$ is the characteristic function of the unit ball in $ {\\mathbb{R}^{d}}$, is not bouned on $ {L^{p}(\\mathbb{R}^{d})}$ if $ {d>1}$ and $ {p\\neq2}$.*
