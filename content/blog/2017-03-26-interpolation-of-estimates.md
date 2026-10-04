---
id: 2017-03-26-interpolation-of-estimates
title: "Interpolation of $ {L^{p}}$ estimates"
date: 2017-03-26
tags: ["harmonic analysis", "real analysis"]
source: https://sylqiu.blogspot.com/2017/03/interpolation-of-lp-estimates.html
publish: true
---
In this post I collect some background material of the very useful interpolation technique, i.e. the *Marcinkiewicz interpolation theorem*, which is used for example in the $L^p$-estimates of strong solutions of an elliptic equation.  It says that if we have a pair of "weak type" estimate of a sublinear operator, then one can in fact "interpolate" these estimates to be a "strong type" estimate in the intermediate cases (which fails in the endpoint cases). A prototypical example is *Hardy-Littlewood maximal operator*, where we have the inequality  

$m\{x:f^*(x)>\alpha\}\leq \frac{C}{\alpha} \| f\|_{L^1(\mathbb{R^d})},$

and a trivial estimate  

$\|f^*\|_{L^\infty} \leq \|f\|_{L^\infty}$, 

Then it holds that

$\|f^*\|_{L^p} \leq C(p)\|f\|_{L^p}$, 

for all $1< p< \infty$. 

The *M. Riesz -Thorin interpolation theorem* is also collected, as an illustration of the complex interpolation method. In contrast to the above, it interpolates two "strong type" estimate. But because of the use of complex analysis, the constants are often optimal. Its many applications include the *Hausdorff-Young inequality*, which says the Fourier transform is bounded from $ L^p $ to $ L^q $, with $1 \leq p \leq 2$ and $ 1/p + 1/q = 1$. And also the boundedness of *Hilbert transform* on $ L^p $ for $ 1 < p < \infty $. For discussions on these examples, see Stein's book on functional analysis, whereas here I have basically followed [Terry's note](https://terrytao.wordpress.com/2009/03/30/245c-notes-1-interpolation-of-lp-spaces/) for this exposition. 

Throughout this post we will assume our underlying measure spaces are $\sigma$-finite, so that we can do limiting argument in cases such as $p=\infty$, but otherwise can be extended to non-$\sigma$-finite cases as well.  

**1.1. Interpolation of $ {L^{p}}$ functions**

*Hölder's inequality*  

$ \displaystyle \int|fg|\leq\left(\int|f|^{p}\right)^{\frac{1}{p}}\left(\int|g|^{p'}\right)^{\frac{1}{p'}} $

where $ {p'\geq p\geq1}$, $ {\frac{1}{p}+\frac{1}{p'}=1}$, and of course $ {f\in L^{p},g\in L^{p'}}$, is the most fundamental *log-convexity result* in the theory of $ {L^{p}}$ spaces. A simple proof of the inequality relies on the convexity of the exponential function  

$ \displaystyle e^{s/p+t/p'}\leq\frac{1}{p}e^{s}+\frac{1}{p'}e^{t},      (1)$

where we have taken  

$ \displaystyle e^{s}=|f|^{p},e^{t}=|g|^{p'}. $

There are many things can be inferred from Hölder's inequality. For example, it implies the linear functional $ {\int\cdot g}$ is bounded on $ {L^{p}}$. This bound is crucial in developing the duality between $ {L^{p}}$ and $ {L^{p'}}$. In this regard, we have the following useful result.  

> **Lemma 1** *Suppose $ {1\leq p,p'\leq\infty}$ are conjugate components. If $ {g\in L^{p'}}$,*  
> 
> *$ \displaystyle \|g\|_{L^{p'}}=\sup_{\|f\|_{L^{p}}\leq1}\left|\int fg\right|. $*
> 
> *Furthermore, if $ {g}$ is integrable on all sets of finite measure, and*  
> 
> *$ \displaystyle \sup_{\underset{f\text{ simple}}{\|f\|_{L^{p}}\leq1}}\left|\int fg\right|=M<+\infty, $*
> 
> *then $ {g\in L^{q'}}$ with $ {\|g\|_{L^{p'}}=M}$.*

Second, if we have $ {f\in L^{p}\cap L^{p'}}$, then taking $ {g=f}$, we obtain  

$ \displaystyle \int|f^{2}|\leq\left(\int|f|^{p}\right)^{\frac{1}{p}}\left(\int|f|^{p'}\right)^{\frac{1}{p'}}, $

implying that in fact $ {f\in L^{2}}$ also, where we note that we must have  

$ \displaystyle \frac{1}{p'}\leq\frac{1}{2}\leq\frac{1}{p}. $

The above result can be amplified, that is, if we have $ {f\in L^{p_{0}}\cap L^{p_{1}}}$ with $ {0<p_{0}<p_{1}\leq\infty}$, then also $ {f\in L^{p_{\theta}}}$ for all $ {p_{0}<p_{\theta}<p_{1}}$. This is a prototypical example of *interpolation of functions*, which can be proved by establishing the (sharp) bound  

$ \displaystyle \|f\|_{L^{p_{\theta}}}\leq\|f\|_{L^{p_{0}}}^{1-\theta}\|f\|_{L^{p_{1}}}^{\theta},      (2)$

where  

$ \displaystyle \frac{1}{p_{\theta}}=\frac{1-\theta}{p_{0}}+\frac{\theta}{p_{1}},0\leq\theta\leq1. $

The bound says in particular that the $ {L^{p}}$-norm is log-convex with respect to the index $ {p}$ (i.e. $ {p\mapsto\log\|\cdot\|_{L^{p}}}$ is convex).  
A simple proof of this bound is based on a "change of variable'' in Hölder's inequality. Taking $ {p}$ as above, and inserting $ {f^{p}=f^{(1-\theta)p}\cdot f^{\theta p}}$ in the LHS of the Hölder's inequality with exponents $ {\frac{(1-\theta)p_{\theta}}{p_{0}}+\frac{\theta p_{\theta}}{p_{1}}=1}$,  

$ \displaystyle \begin{array}{rcl} \int|f^{p_{\theta}}| & = & \int|f{}^{(1-\theta)p_{\theta}+\theta p_{\theta}}|\\ & \leq & \left(\int|f{}^{(1-\theta)p_{\theta}\cdot\frac{p_{0}}{(1-\theta)p}}|\right)^{\frac{(1-\theta)p_{\theta}}{p_{0}}}\left(\int|f{}^{\theta p\cdot\frac{p_{1}}{\theta p_{\theta}}}|\right)^{\frac{\theta p_{\theta}}{p_{1}}}. \end{array} $

This approach is in close spirit to the convexity method as in ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)).  

A second approach is "divide-and-conquer''. We first reduce to the normalised case $ {\|f\|_{L^{p_{0}}}=\|f\|_{L^{p_{1}}}=1}$ (by multiplying the measure by suitable cconstants) and split  

$ \displaystyle f=f\cdot1_{|f|\leq1}+f\cdot1_{|f|>1}      (3)$

into a sum of bounded function and an integrable function (which consequently has finite support, since it is lower bounded by a indicator function). Since $ {p_{\theta}>p_{0}}$, we have  

$ \displaystyle \|f\cdot1_{|f|\leq1}\|_{L^{p_{\theta}}}^{p_{\theta}}=\int_{|f|\leq1}|f|^{p_{\theta}}\leq\int|f|^{p_{0}}=1, $

and since $ {p_{1}>p_{\theta}}$  

$ \displaystyle \|f\cdot1_{|f|>1}\|_{L^{p_{\theta}}}^{p_{\theta}}=\int_{|f|>1}|f|^{p_{\theta}}\leq\int|f|^{p_{1}}=1. $

Apply the quasi-traingle inequality ($ {p_{\theta}<1}$) or triangle inequality ($ {p_{\theta}\geq1}$) to the splitting ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), we obtain  

$ \displaystyle \|f\|_{L^{p_{\theta}}}\leq C_{p_{\theta}},      (4)$

Note that the bound ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) provided by this divide-and-conquer argument already implies the inclusion relation  

$ \displaystyle L^{p_{0}}\cap L^{p_{1}}\hookrightarrow L^{p_{\theta}}\hookrightarrow L^{p_{0}}+L^{p_{1}}. $

Since the constant depends *only* on $ {p_{\theta}}$ (indeed, recall from Proposition 1 in [this previous post](http://sylqiu.blogspot.hk/2017/01/lp-spaces-first-look.html) that the best constant is $ {2^{1/p_{\theta}}}$ when $ {p_{\theta}<1}$, and $ {2}$ when $ {p_{\theta}\geq1}$), this allows to eliminate the constant by the *tensor power trick*. We replace the underlying space by its Cartesian power $ {X^{M}}$ with product $ {\sigma}$-algebra and product measure. Define the map  

$ \displaystyle f^{\otimes M}:(x_{1},\dots,x_{M})\mapsto f(x_{1})\cdots f(x_{M}). $

And by Fubini-Tonelli's theorem,  

$ \displaystyle \|f^{\otimes M}\|_{L^{p}(X^{M})}=\|f\|_{L^{p}(X)}^{M} $

for all $ {0<p<\infty}$. So $ {f^{\otimes M}}$ obeys the same normalisation condition, thus the bound ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) extends to this case with the same constant  

$ \displaystyle \|f^{\otimes M}\|_{L^{p_{\theta}}(X^{M})}=\|f\|_{L^{p}(X)}^{M}\leq C_{p_{\theta}}. $

Hence,  

$ \displaystyle \|f\|_{L^{p_{\theta}}}\leq C_{p_{\theta}}^{1/M}. $

Sending $ {M\rightarrow+\infty}$, we obtain the desired result. This divide-and-conquer strategy belongs to a larger class of method known as the *real-variable interpolation method*.  

Finally, a third approach is to embed the index $ {p}$ into a strip in the complex plane $ {\mathbb{C}}$, known as the *complex interpolation method*. As indices appear in the exponents, at least for simple functions, the new function now depends *holomorphically* on the complex index $ {s}$, so that one can exploit powerful tools in complex analysis such as the *Phragmén-Lindelöf principle*. We will use its following variant.  

> **Theorem 2** *(Lindelöf's Three-lines Lemma) Let $ {s\mapsto f(s)}$ be a holomorphic function on the strip $ {S:=\{\sigma+it:0\leq\sigma\leq1;t\in\mathbb{R}\}}$, with qualitative growth condition*  
> 
> *$ \displaystyle |f(\sigma+it)|\leq C\exp(\exp((\pi-\delta)|t|))      (5)$*
> 
> *for all $ {\sigma+it\in S}$ and some constants $ {C,\delta>0}$. Suppose*  
> 
> *$ \displaystyle |f(0+it)|\leq B_{0} $*
> 
> *and*  
> 
> *$ \displaystyle |f(1+it)|\leq B_{1} $*
> 
> *for all $ {t\in\mathbb{R}}$. Then we have a log-convex bound*  
> 
> *$ \displaystyle |f(\theta+it)|\leq B_{\theta} $*
> 
> *for all $ {0\leq\theta\leq1}$, where $ {B_{\theta}=B_{0}^{1-\theta}B_{1}^{\theta}}$.*

The term "three-lines'' refers to the fact that the supremum of $ {f}$ on the line $ {\text{Re}(s)=t}$ in the strip is constroled by the maxima of $ {f}$ on the two sides of the strip.  
To prove the bound ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) using Theorem [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lindelf%27s-Three-lines-Lemma\)), we first reduce to the case where $ {f}$ is a non-negative simple function, which in particular is has finite support. Now consider  

$ \displaystyle s\mapsto\int|f|^{(1-s)p_{0}+sp_{1}} $

which is holomorphic. Moreover, if $ {\sigma=0}$,  

$ \displaystyle \begin{array}{rcl} \left|\int|f|^{(1-it)p_{0}+itp_{1}}\right| & = & \left|\int|f|^{p_{0}+it(-p_{0}+p_{1})}\right|\\ & \leq & \int|f|^{p_{0}}, \end{array} $

and similarly if $ {\sigma=1}$,  

$ \displaystyle \begin{array}{rcl} \left|\int|f|^{-itp_{0}+(1+it)p_{1}}\right| & = & \left|\int|f|^{p_{1}+it(-p_{0}+p_{1})}\right|\\ & \leq & \int|f|^{p_{1}}. \end{array} $

The growth condition ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#5)) is also easily seen to be satisfied. Thus we conclude the estimate for simple functions. The general case follows by invoking monotone convergence theorem.  

**1.2. The M.Riesz-Thorin interpolation theorem**

The interpolation of functions can be thought of as a statement about a linear operator  

$ \displaystyle \begin{array}{rcl} T_{f}:\mathbb{R} & \rightarrow & \text{Simp}(X\rightarrow\mathbb{R})\\ c & \mapsto & c\cdot f \end{array} $

Here we denote $ {\text{Simp}(X\rightarrow\mathbb{R})}$ to be the space of simple functions on $ {X}$, and identify $ {\mathbb{R}}$ with the function space on a point. It then asserts that if $ {T_{f}}$ is bounded on $ {L^{p_{1}}(X)}$ and $ {L^{p_{1}}(X)}$, i.e. has operator norm $ {\|f\|_{L^{p_{0}}},\|f\|_{L^{p_{1}}}<\infty}$, then it is also bounded on the intermediate spaces $ {L^{p_{\theta}}(X)}$. From this formulation we immediately see that the dual statement hold in the *opposite category*. Namely, the linear operator  

$ \displaystyle \begin{array}{rcl} T_{\lambda}':\text{Simp}(X\rightarrow\mathbb{R}) & \rightarrow & \mathbb{R}\\ f & \mapsto & \lambda(f) \end{array} $

satisfies a similar interpolation statement.  
We can now easily formulate an interpolation statement for linear operators.  

> **Theorem 3** *(M.Riesz-Thorin) Let $ {0<p_{0}<p_{1}\leq\infty}$ and $ {1\leq q_{0}<q_{1}\leq\infty}$. Let $ {X}$, $ {Y}$ be $ {\sigma}$-finite measure spaces and*  
> 
> *$ \displaystyle T:L^{p_{0}}(X)+L^{p_{1}}(X)\rightarrow L^{q_{0}}(Y)+L^{q_{1}}(Y) $*
> 
> *be a linear operator satisfies the bounds*  
> 
> *$ \displaystyle \|Tf\|_{L^{q_{0}}(Y)}\leq B_{0}\|f\|_{L^{p_{0}}(X)}, $*
> 
> *for all $ {f\in L^{p_{0}}(X)}$, and*  
> 
> *$ \displaystyle \|Tf\|_{L^{q_{1}}(Y)}\leq B_{1}\|f\|_{L^{p_{1}}(X)} $*
> 
> *for all $ {f\in L^{p_{1}}(X)}$. Then we have*  
> 
> *$ \displaystyle \|Tf\|_{L^{q_{\theta}}(Y)}\leq B_{\theta}\|f\|_{L^{p_{\theta}}(X)},      (6)$*
> 
> *for all $ {0<\theta<1}$ and $ {f\in L^{p_{\theta}}(X)}$, where*  
> 
> *$ \displaystyle \frac{1}{p_{\theta}}=\frac{1-\theta}{p_{0}}+\frac{\theta}{p_{1}},\quad\frac{1}{q_{\theta}}=\frac{1-\theta}{q_{0}}+\frac{\theta}{q_{1}}. $*

If $ {p_{0}=p_{1}}$ in the above, then the statement directily follows from the proof of the bound ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)). *Proof:* Note that the assumption $ {p_{0}<p_{1}}$ forces $ {p_{\theta}}$ to be finite. We first establish the statement for simple functions, with normalisation $ {\|f\|_{L^{p_{\theta}}(X)}=1}$. By Lemma [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#lemSuppose--are), to establish the bound ([6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7)), it suffices to show  

$ \displaystyle \left|\int(Tf)g\right|\leq B_{\theta}\|f\|_{L^{p_{\theta}}(X)}\|g\|_{L^{q_{\theta}'}(X)}, $

where $ {\frac{1}{q_{\theta}}+\frac{1}{q_{\theta}'}=1}$, and $ {g}$ is simple with $ {\|g\|_{L^{q_{\theta}'}}=1}$.  
Write $ {f=|f|\text{sgn}(f)}$, $ {g=|g|\text{sgn}(g)}$, and consider  

$ \displaystyle f_{s}:=|f|^{(1-s)\frac{p_{\theta}}{p_{0}}+s\frac{p_{\theta}}{p_{1}}}\text{sgn}(f),\quad g_{s}:=|g|^{(1-s)\frac{q_{\theta}'}{q_{0}'}+s\frac{q_{\theta}'}{q_{1}'}}\text{sgn}(g). $

Note that by this definition, $ {|f_{0}^{p_{0}}|=|f^{p_{\theta}}|}$, $ {|g_{0}^{q_{0}'}|=|g^{q_{\theta}'}|}$, $ {|f_{1}^{p_{1}}|=|f^{p_{\theta}}|}$, $ {|g_{1}^{q_{1}'}|=|g^{q_{\theta}'}|}$, and $ {f_{\theta}=f}$, $ {g_{\theta}=g}$. Hence,  

$ \displaystyle \begin{cases} \|f_{s}\|_{L^{p_{0}}(X)}=1,\|g_{s}\|_{L^{q_{0}'}(X)}=1 & \text{if }\text{Re}(s)=0\\ \|f_{s}\|_{L^{p_{1}}(X)}=1,\|g_{s}\|_{L^{q_{1}'}(X)}=1 & \text{if }\text{Re}(s)=1 \end{cases}. $

Now, the function $ {s\mapsto\int(Tf_{s})g_{s}}$ is holomorphic, and using Hölder  

$ \displaystyle \left|\int(Tf)g\right|\leq B_{0}\|f\|_{L^{p_{0}}(X)}\|g\|_{L^{q_{0}'}(X)}, $

$ \displaystyle \left|\int(Tf)g\right|\leq B_{1}\|f\|_{L^{p_{1}}(X)}\|g\|_{L^{q_{1}'}(X)}, $

we see that it satisfies the conditions of Theorem [2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thm\(Lindelf%27s-Three-lines-Lemma\)). So we conclude the proof in the case of simple functions.  

In general, we can do approximation using simple functions via a divide-and-conquer argument. Given any $ {f\in L^{p_{\theta}}(X)}$, we split  

$ \displaystyle f=f\cdot1_{|f|\leq1}+f\cdot1_{|f|>1} $

and notice that the bounded component, which lies in $ {L^{p_{1}}(X)\cap L^{p_{\theta}}(X)}$, and the integrable component, which lies in $ {L^{p_{0}}(X)\cap L^{p_{\theta}}(X)}$, can be respectively approximated by simple functions $ {f_{n}^{L}}$, $ {f_{n}^{U}}$ in the respective spaces. The bound on operator on $ {L^{p_{0}}(X)}$ and $ {L^{p_{1}}(X)}$ implies $ {T(f_{n}^{L})\rightarrow T(f\cdot1_{|f|\leq1})}$ in $ {L^{p_{1}}}$ and $ {T(f_{n}^{U})\rightarrow T(f\cdot1_{|f|>1})}$ in $ {L^{p_{0}}}$. Extracting an almost everywhere convergent subsequence $ {T(f_{n})\rightarrow f}$, and using the bound obtained from the case of simple functions, we conclude the desired result. $ \Box$  

> **Definition 4** *We say a linear operator \\begin{align\*} T:\\text{Simp}(X & \\rightarrow\\mathbb{R})\\rightarrow\\text{Simp}(Y\\rightarrow\\mathbb{R}) \\end{align\*} is of *strong type* $ {(p,q)}$ if there is a constant $ {C(p,q)}$ such that*  
> 
> *$ \displaystyle \|Tf\|_{L^{q}(Y)}\leq C(p,q)\|f\|_{L^{p}(X)}. $*

It is easy to see that if $ {T}$ is of strong type $ {(p,q)}$, then $ {T}$ continuously extends to the space $ {L^{p}(X)}$ becuase of the density of simple functions. The M.Riesz-Thorin theorem thus asserts that, if $ {T}$ is of strong type $ {(p_{0},q_{0})}$ and $ {(p_{1},q_{1})}$, then $ {T}$ is also of strong type $ {(p_{\theta},q_{\theta})}$. For this reason, define the *strong type diagram* of $ {T}$ to be the set of all $ {(1/p,1/q)\in[0,+\infty)\times[0,1]}$ such that $ {T}$ is of strong type $ {(p,q)}$. We see that  

> **Corollary 5** *With $ {T}$ as before,*  
> 
> 1.  The strong type digram of $ {T}$ is a convex set.
> 2.  The operator norm $ {C(p,q)}$ is a log-convex function on the strong type diagram.

**1.3. The Marcinkiewicz interpolation theorem**

If we are interested in a quantity such as $ {\|f\|_{L^{p}}}$, not all information of $ {f}$ is need. It would be sufficient to know its *distribution function*  

$ \displaystyle \lambda_{f}:\mathbb{R}_{\geq0}\rightarrow[0,+\infty] $

defined by  

$ \displaystyle \lambda_{f}(t):=\mu(\{x\in X:|f(x)|\geq t\})=\int_{X}1_{|f|\geq t}d\mu. $

We see that $ {\lambda_{f}(t)}$ encodes the *"height"* $ {t}$, and *"width"* $ {\mu(\{x\in X:|f(x)|\geq t\})}$ of the function $ {f}$.  
If $ {f\in L^{p}}$, we have the equality  

$ \displaystyle \|f\|_{L^{p}}^{p}=p\int_{0}^{+\infty}\lambda_{f}(t)t^{p}\frac{dt}{t}      (7)$

for all $ {0<p<+\infty}$, and for $ {p=+\infty}$  

$ \displaystyle \|f\|_{L^{\infty}}=\inf\{t\geq0;\lambda_{f}(t)=0\}. $

We also have an easy and useful bound, known as *Chebyshev's inequality*  

$ \displaystyle \lambda_{f}(t)\leq\frac{1}{t^{p}}\|f\|_{L^{p}}^{p}.      (8)$

Now make the following observation on ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7-1)) and ([8](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq8)).  

> **Proposition 6** *Let $ {0<p<+\infty}$, and $ {f\in L^{p}}$. We have*  
> 
> *$ \displaystyle c_{p}\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{np}\leq\|f\|_{L^{p}}^{p}\leq C_{p}\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{np} $*
> 
> *for some constants $ {c_{p},C_{p}}$ depending only on $ {p}$. Thus the $ {L^{p}}$-norm is comparable to the quantity $ {\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})^{1/p}2^{n}}$ for any fixed $ {p}$, for which we shall use the more succint notation $ {\sim_{p}}$. More generally, if we define*  
> 
> *$ \displaystyle \|f\|_{L^{p,q}\text{dyadic}}:=\left(\sum_{n\in\mathbb{Z}}\left(\lambda_{f}(2^{n})^{1/p}2^{n}\right)^{q}\right)^{1/q}, $*
> 
> *and*  
> 
> *$ \displaystyle \|f\|_{L^{p,q}}:=\left(\int_{0}^{+\infty}\left(\lambda_{f}(t)^{1/p}t\right)^{q}\frac{dt}{t}\right)^{1/q}, $*
> 
> *then it holds that*  
> 
> *$ \displaystyle \|f\|_{L^{p,q}\text{dyadic}}\sim_{p,q}\|f\|_{L^{p,q}} $*
> 
> *and*  
> 
> *$ \displaystyle \lim_{q\rightarrow+\infty}\|f\|_{L^{p,q}\text{dyadic}}\sim_{p}\sup_{t\geq0}\left(t\lambda_{f}(t)^{1/p}\right) $*
> 
> *whenever the either of the two quantities makes sense.*

*Proof:* First assume that $ {f\in L^{p}}$. Notice that  

$ \displaystyle p\int_{0}^{+\infty}\lambda_{f}(t)t^{p-1}dt=\int_{0}^{+\infty}\lambda_{f}(t^{1/p})dt. $

We will approximate the RHS with step functions tagged on dyadic points $ {(2^{np})_{n\in\mathbb{Z}}}$. Since $ {\lambda_{f}(t)}$ is non-increasing, we have on the interval $ {[2^{(n-1)p},2^{np}]}$  

$ \displaystyle 2^{(n-1)p}(2^{p}-1)\lambda(2^{n})\leq\int_{2^{(n-1)p}}^{2^{np}}\lambda_{f}(t^{1/p})dt\leq2^{(n-1)p}(2^{p}-1)\lambda(2^{n-1}). $

Summing up, we get  

$ \displaystyle c_{p}\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{np}\leq\|f\|_{L^{p}}^{p}\leq C_{p}\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{np}. $

For the second part, the comparison result follows in a similar argument as above. Then one can use an approporiate limiting argument to deal with the case $ {q\rightarrow+\infty}$ (first reduce the function $\left(\lambda_{f}(t)^{1/p}\right)^{q}t^{q-1}$ to finite measure support, then use the corresponding property $ {\|\cdot\|_{q}\rightarrow\|\cdot\|_{\infty}}$ mentioned [in this previous post](http://sylqiu.blogspot.hk/2017/01/lp-spaces-first-look.html)). $ \Box$  

 This motivates the following definition.  

> **Definition 7** *Let $ {0<p,q\leq\infty}$. The *Lorentz space* $ {L^{p,q}(X)}$ is the space of all measurable functions $ {f:X\rightarrow\mathbb{C}}$ such that $ {\|f\|_{L^{p,q}}<\infty}$, modulo almost everywhere equivalence. If $ {q=\infty}$, the space $ {L^{p,\infty}(X)}$ is also called the *weak $ {L^p}$* space. We also take the convention $ {L^{\infty,\infty}=L^{\infty}}$.*

Thus Proposition [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propLet-,-and) says that the $ {\ell^{q}(\mathbb{Z})}$ norm of the sequence  

$ \displaystyle n\rightarrow2^{n}\lambda_{f}(2^{n})^{1/p} $

is enough to capture the size of the quantity $ {\|f\|_{L^{p,q}}}$. Moreover, the $ {\ell^{p}}$ spaces enjoy the inclusion property  

$ \displaystyle \ell^{p}(\mathbb{Z})\hookrightarrow\ell^{q}(\mathbb{Z}) $

for all $ {0<p\leq q\leq\infty}$.  
This implies the corresponding inclusions for Lorentz spaces. From the inclusion  

$ \displaystyle \{|f+g|>t\}\subset\{|f|>t/2\}\cup\{|g|>t/2\}, $

we have  

$ \displaystyle \lambda_{f+g}(t)\leq\lambda_{f}(t/2)+\lambda_{g}(t/2).      (9)$

By shifting indices, and making use of the comparison result, it now easily follows the quasi-triangle inquality  

$ \displaystyle \|f+g\|_{L^{p,q}}\leq C_{p,q}(\|f\|_{L^{p,q}}+\|g\|_{L^{p,q}}). $

Hence Lorentz spaces are quasi-normed spaces with $ {\|\cdot\|_{L^{p,q}}}$ for all $ {0<p,q\leq\infty}$.  
Now we turn to interpolation of weak $ {L^{p}}$ estimates. Let $ {p_{0}<p_{1}}$, and suppose we have  

$ \displaystyle \|f\|_{L^{p_{0},\infty}}\leq B_{0} $

and  

$ \displaystyle \|f\|_{L^{p_{1},\infty}}\leq B_{1}. $

From definition, these imply  

$ \displaystyle \lambda_{f}(t)\leq\frac{B_{0}^{p_{0}}}{t^{p_{0}}}\text{ and }\lambda_{f}(t)\leq\frac{B_{1}^{p_{1}}}{t^{p_{1}}} $

for all $ {t>0}$. Hence by scalar interpolation, for all $ {0<\theta<1}$, with $ {p_{\theta},B_{\theta}}$ defined as before,  

$ \displaystyle \lambda_{f}(t)\leq\frac{B_{\theta}^{p_{\theta}}}{t^{p_{\theta}}}. $

This result can be strengthened if two bounds $ {B_{0},B_{1}}$ are different. Namely, let $ {t_{0}}$ be the unique value of $ {t}$ such that $ {\frac{B_{0}^{p_{0}}}{t^{p_{0}}}=\frac{B_{1}^{p_{1}}}{t^{p_{1}}}}$, then for any $ {\epsilon}$ small enough,  

$ \displaystyle \lambda_{f}(t)\leq\frac{B_{\theta}^{p_{\theta}}}{t^{p_{\theta}}}\min\{\frac{t}{t_{0}},\frac{t_{0}}{t}\}^{\epsilon}.      (10)$

Indeed, note that if $ {t\leq t_{0}}$, we obviously have  

$ \displaystyle \lambda_{f}(t)\leq\frac{B_{\theta}^{p_{\theta}}}{t^{p_{\theta}}}\left(\frac{t}{t_{0}}\right)^{\epsilon} $

as the log-log plot of the RHS is a line staying above one of bounds $ {\frac{B_{0}^{p_{0}}}{t^{p_{0}}}}$, $ {\frac{B_{1}^{p_{1}}}{t^{p_{1}}}}$, and similarly for the case $ {t\geq t_{0}}$. Putting ([10](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq9)) into ([7](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq7-1)), we upgrade the weak $ {L^{p}}$estimate to strong $ {L^{p}}$ estimate:  

$ \displaystyle \|f\|_{L^{p_{\theta}}}\leq C_{p_{0},p_{1},\theta}B_{\theta} $

essentially because $ {\int_{t\leq t_{0}}t^{\epsilon-1}dt}$ and $ {\int_{t\geq t_{0}}t^{-\epsilon-1}dt}$ are integrable. From here we also see that the constant $ {C_{p_{0},p_{1},\theta}}$ must diverge when $ {\theta\rightarrow0}$ or $ {1}$, since under which case $ {\epsilon}$ must tent to zero. So there is no hope for using the tensor power trick.  
There is also an operator version of the above result, known as the *Marcinkiewicz interpolation theorem* .  

> **Definition 8** *We say that a linear operator*  
> 
> *$ \displaystyle T:\text{Simp}(X\rightarrow\mathbb{R})\rightarrow\text{Simp}(Y\rightarrow\mathbb{R}) $*
> 
> *is of *weak type* $ {(p,q)}$ if it has a continuous extension from $ {L^{p}(X)}$ to $ {L^{q,\infty}(Y)}$.*

> **Theorem 9** *(Marcinkiewicz) Let $ {0<p_{0},p_{1},q_{0},q_{1}\leq\infty}$ and $ {0<\theta<1}$ be such that $ {q_{0}\neq q_{1}}$,$ {p_{0}<p_{1}}$, and $ {p_{1}\leq q_{1}}$,$ {p_{2}\leq q_{2}}$. Let $ {T}$ be a linear operator of weak type $ {(p_{0},q_{0})}$ and weak type $ {(p_{1},q_{1})}$. Then $ {T}$ is of strong type $ {(p_{\theta},q_{\theta})}$.*

*Proof:* Let's first assume $ {q_{0},q_{1}<+\infty}$ . By assumption, there exist $ {B_{0}}$, $ {B_{1}>0}$ such that  

$ \displaystyle \lambda_{Tf}(t)\leq B_{0}^{q_{0}}\frac{\|f\|_{L^{p_{0}}(X)}^{q_{0}}}{t^{q_{0}}}      (11)$

for all $ {f\in L^{p_{0}}(X)}$, and  

$ \displaystyle \lambda_{Tf}(t)\leq B_{1}^{q_{1}}\frac{\|f\|_{L^{p_{1}}(X)}^{q_{1}}}{t^{q_{1}}}      (12)$

for all $ {f\in L^{p_{1}}(X)}$.  
Below the fold we shall use the notation  

$ \displaystyle A\lesssim B $

to mean $ {A\leq C(p_{0},p_{1},q_{0},q_{1},\theta,B_{0},B_{1})B}$. Thus it suffices to show  

$ \displaystyle \|Tf\|_{L^{q_{\theta}}(Y)}\lesssim\|f\|_{L^{p_{\theta}}(X)}. $

We may normalize $ {\|f\|_{L^{p_{\theta}}(X)}=1}$. By Proposition [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propLet-,-and),  

$ \displaystyle 1=\|f\|_{L^{p_{\theta}}(X)}\sim_{p_{\theta}}\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{p_{\theta}n}      (13)$

then the goal is to show  

$ \displaystyle \sum_{n\in\mathbb{Z}}\lambda_{Tf}(2^{n})2^{q_{\theta}n}\lesssim\sum_{n\in\mathbb{Z}}\lambda_{f}(2^{n})2^{p_{\theta}n}.      (14)$

For this we need to compare  

$ \displaystyle \lambda_{Tf}(2^{n})'s\text{ and }\lambda_{f}(2^{n})'s $

making use of the given bound ([11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq11)),([12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq12)). One approach is to use *dyadic decompostion* of the function  

$ \displaystyle f=\sum_{m\in\mathbb{Z}}f_{m} $

where $ {f_{m}:=f\cdot1_{2^{m}<|f|\leq2^{m+1}}}$, which is of course $ {L^{p}}$ integrabal if $ {f}$ is $ {L^{p}}$ integrable. Applying $ {T}$ on both sides, we have  

$ \displaystyle Tf=\sum_{m\in\mathbb{Z}}Tf_{m} $

and using a similar argument as in ([9](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq10)), we have  

$ \displaystyle \lambda_{Tf}(2^{n})\leq\sum\lambda_{Tf_{m}}(c_{n,m}2^{n})      (15)$

whenever $ {c_{n,m}}$ are positive constants with $ {\sum_{n,m}c_{m}\leq1}$. We shall optimise the choice of these coefficients later.  
Now applying the bound ([11](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq11)),([12](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq12)) to $ {Tf_{m}}$, for $ {i=0,1}$, we have  

$ \displaystyle \lambda_{Tf_{m}}(c_{n,m}2^{n})\lesssim c_{n,m}^{-q_{i}}2^{-nq_{i}}\|f_{m}\|_{L^{p_{i}}(X)}^{q_{i}}. $

Also, we have by defintion of $ {f_{m}}$,  

$ \displaystyle \|f_{m}\|_{L^{p_{i}}(X)}\lesssim2^{m}\lambda_{f}(2^{m})^{1/p_{i}}. $

Putting the above together, we have  

$ \displaystyle \lambda_{Tf_{m}}(c_{n,m}2^{n})\lesssim c_{n,m}^{-q_{i}}2^{-nq_{i}}2^{mq_{i}}\lambda_{f}(2^{m})^{q_{i}/p_{i}}. $

Then from [15](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq13), the goal [14](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq13-1) is equivalent to  

$ \displaystyle \sum_{n}2^{nq_{\theta}}\sum_{m}\min_{i}\{c_{n,m}^{-q_{i}}2^{-nq_{i}}2^{mq_{i}}\lambda_{f}(2^{m})^{q_{i}/p_{i}}\}\lesssim1. $

Substitute $ {2^{mp_{\theta}q_{i}/p_{i}}\lambda_{f}(2^{m})^{q_{i}/p_{i}}}$ by $ {a_{m}^{q_{i}/p_{i}}}$ (where $ {a_{m}}$ is the summand in ([13](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq14))), the summand in the above is  

$ \displaystyle \min_{i}\{c_{n,m}^{-q_{i}}2^{-nq_{i}}2^{mq_{i}}2^{-mp_{\theta}q_{i}/p_{i}}a_{m}^{q_{i}/p_{i}}\}. $

Since $ {q_{i}/p_{i}\geq1}$, from the inclusion $ {\ell^{1}\subset\ell^{q_{i}/p_{i}}}$ we have $ {a_{m}^{q_{i}/p_{i}}\lesssim a_{m}}$. Thus we will be done if we can show for each $ {m\in\mathbb{Z}}$,  

$ \displaystyle \sum_{n}\min_{i}\{2^{nq_{\theta}}c_{n,m}^{-q_{i}}2^{-nq_{i}}2^{mq_{i}}2^{-mp_{\theta}q_{i}/p_{i}}\}\lesssim1. $

We now simplify the expression in the bracket,  

$ \displaystyle \begin{array}{rcl} 2^{nq_{\theta}}c_{n,m}^{-q_{i}}2^{-nq_{i}}2^{mq_{i}}2^{-mp_{\theta}q_{i}/p_{i}} & = & c_{n,m}^{-q_{i}}2^{-q_{i}(m-mp_{\theta}/p_{i})}2^{n(q_{\theta}-q_{i})}\\ & = & c_{n,m}^{-q_{i}}2^{(n\alpha q_{\theta}-mp_{\theta})q_{i}x_{i}} \end{array} $

where  

$ \displaystyle \frac{1}{p_{i}}=\frac{1}{p_{\theta}}+x_{i};\quad\frac{1}{q_{i}}=\frac{1}{q_{\theta}}+\alpha x_{i} $

for some $ {x_{0}>0>x_{1}}$ and $ {\alpha\in\mathbb{R}}$. Thus the summand looks like  

$ \displaystyle \min\{c_{n,m}^{-q_{0}}2^{(n\alpha q_{\theta}-mp_{\theta})q_{0}x_{0}},c_{n,m}^{-q_{1}}2^{(n\alpha q_{\theta}-mp_{\theta})q_{1}x_{1}}\}. $

if we take $ {c_{n,m}}$ to be, say, a sufficiently small multiple of $ {2^{-\beta|n\alpha q_{\theta}-mp_{\theta}|}}$ where $ {\beta=\frac{1}{2}\min\{|x_{0}|,|x_{1}|\}}$, and note that $ {x_{0}>0}$ and $ {x_{1}<0}$, the target expression becomes summable in $ {n}$ and also $ {c_{n,m}}$ is summable in $ {m}$. Finally, as Proposition [6](https://www.blogger.com/blogger.g?blogID=4046755691971152965#propLet-,-and) indicates, the case $ {q_{0},q_{1}=+\infty}$ can be handled by a limiting argument. $ \Box$
