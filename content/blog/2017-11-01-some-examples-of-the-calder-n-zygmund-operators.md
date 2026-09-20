---
id: 2017-11-01-some-examples-of-the-calder-n-zygmund-operators
title: "Some Examples of the Calderón-Zygmund operators"
date: 2017-11-01
tags: ["elliptic theory", "Fourier analysis", "harmonic analysis", "PDE"]
source: https://sylqiu.blogspot.com/2017/11/some-examples-of-calderon-zygmund.html
publish: true
---
In this post we study various examples of \`\`singular integral operator''. Those included here are  

-   The Riesz transforms, which recover the Hessian of a Schwartz function from its Laplacian;
-   Regular parametrix of constant coefficient linear (hypo)elliptic operators, and their distributional derivatives, which are responsible for the regularity property of their solutions;
-   Littlewood Paley projections, which is a convenient tool of multiresolution analysis.

In the above examples the kernel of the operator is \`\`singular'', in the sense that it's not always locally integrable, yet the operator has nice boundedness properties, established by Calderón and Zymund, and others. Roughly speaking, that they can have such properties is due to the following two properties:  

-   The kernels have certain *cancellation condition*, or when it is a convolutional operator, the closely related property that their Fourier transform (i.e. corresponding multiplier) is bounded. In general it is the $L^2$ boundedness of the operator. This in some sense makes it possible to bound those functions that have big height but low oscillation.
-   The kernels, and their derivatives, have "integrable decay'', or the closely related property that their multipliers are $ {C^{\\infty}}$ functions that satisfy some differential inequalities corresponding to that decay. This in some sense makes it possible to bound those functions that have low height but big oscillation.

There is a more precise procedure to implement above intuitive argument, that is the famous *Calde**rón-Zygmund decomposition,* together with real interpolation. However, it should be noted that the argument only leads to a *weak type bound* in the endpoint case $L^{1}$ and $L^{\\infty}$, and in that case more delicate nature of the functions (cf. the $\\bf{H^{1}}$ and $BMO$) have to be considered. These boundedness properties will not be studied here, instead I want to present how these examples arise naturally in various questions, then I will identify them as such operators, and explain why studying them is important.  

**1\. The Riesz transforms**

In one of its various disguises, the Poisson integral is the \`\`Abel summation'' of the Fourier series of $ {f\\in L^{2}(S^{1})}$  

$ \\displaystyle F(re^{i\\theta})=\\sum\_{n\\in\\mathbb{Z}}f^{\\wedge}(n)r^{|n|}e^{in\\theta},0\\leq r<1 $

which harmonically extends the function $ {f}$ into the unit disk; or in case $ {f\\in L^{2}(\\mathbb{R})}$, the \`\`Abel integration'', aka the Laplace transform, of the Fourier transformation of $ {f}$  

$ \\displaystyle \\begin{array}{rcl} F(x,y) & = & \\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)e^{2\\pi i\\xi z}\\thinspace d\\xi\\\\ & = & \\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)e^{-2\\pi y|\\xi|}e^{2\\pi ix\\xi}\\thinspace d\\xi, \\end{array} $

which harmonically extends the function $ {f}$ into the upper half-space $ {\\mathbb{R}\_{+}^{2}}$. We shall turn to the $ {n}$-dimension generalisation of the latter case, namely the Poisson integral for $ {f\\in L^{2}(\\mathbb{R}^{d})}$,  

$ \\displaystyle F(y,x\_{1}\\dots,x\_{n})=\\int\_{\\mathbb{R}}f^{\\wedge}(\\xi)e^{-2\\pi y|\\xi|}e^{2\\pi i\\langle x,\\xi\\rangle}\\thinspace d\\xi,\\ y>0. $

The convolutional kernel corresponds to the Poisson integral is the inverse Fourier transform of the multiplier, that is $ {\\int\_{\\mathbb{R}^{d}}e^{-2\\pi y|\\xi|}e^{2\\pi i\\langle x,\\xi\\rangle}\\thinspace d\\xi}$, where $ {\\xi\\in\\mathbb{R}^{d}}$. For $ {d=1}$ this is easy to compute:  

$ \\displaystyle \\begin{array}{rcl} \\int\_{\\mathbb{R}}e^{-2\\pi y|\\xi|}e^{2\\pi ix\\xi}\\thinspace d\\xi & = & \\int\_{-\\infty}^{0}e^{2\\pi\\xi(y+ix)}d\\xi+\\int\_{0}^{\\infty}e^{-2\\pi\\xi(y-ix)}d\\xi\\\\ & = & \\frac{1}{2\\pi}\\left(\\frac{1}{y+ix}+\\frac{1}{y-ix}\\right)\\\\ & = & \\frac{y}{\\pi\\left(y^{2}+x^{2}\\right)}. \\end{array} $

The difficulty arises in $ {d>1}$ is that $ {e^{-2\\pi y|\\xi|}}$ in its present form does not allow separating $ {\\xi}$ into coordinates $ {\\xi\_{1},\\dots,\\xi\_{d}}$ while integrating. The trick here is to seek suitable expression of it as a weighted average of more integration-friendly functions. To do so, observe from the 1-dimensional case that  

$ \\displaystyle e^{-2\\pi y|\\xi|}=\\int\_{\\mathbb{R}}\\frac{y}{\\pi\\left(y^{2}+x^{2}\\right)}e^{-2\\pi ix\\xi}\\thinspace dx, $

and  

$ \\displaystyle \\frac{y}{\\pi\\left(y^{2}+x^{2}\\right)}=\\int\_{0}^{\\infty}e^{-\\pi(\\frac{y^{2}+x^{2}}{y})t}\\thinspace dt. $

Therefore,  

$ \\displaystyle \\begin{array}{rcl} e^{-2\\pi y|\\xi|} & = & \\int\_{\\mathbb{R}}\\int\_{0}^{\\infty}e^{-\\pi(\\frac{y^{2}+x^{2}}{y})t}e^{-2\\pi ix\\xi}\\thinspace dtdx\\\\ & = & \\int\_{0}^{\\infty}\\int\_{\\mathbb{R}}e^{-\\pi\\frac{x^{2}}{y}t}e^{-\\pi yt}e^{-2\\pi ix\\xi}\\thinspace dxdt. \\end{array} $

Note how Laplace transform in $ {t}$-variable is hidden inside the above integral. Recall $ {(e^{-\\pi x^{2}})\\hat{}=\\int\_{\\mathbb{R}}e^{-\\pi x^{2}}e^{-2\\pi ix\\xi}\\thinspace dx=e^{-\\pi\\xi^{2}}}$. So we get  

$ \\displaystyle e^{-2\\pi y|\\xi|}=y^{\\frac{1}{2}}\\int\_{0}^{\\infty}e^{-\\pi yt}e^{-\\pi\\frac{\\xi^{2}}{t}y}\\thinspace t^{\\frac{1}{2}}\\frac{dt}{t}, $

which is also valid if $ {\\xi\\in\\mathbb{R}^{d}}$. (The good thing about writing $ {\\frac{dt}{t}}$ is that it is invariant under change of variable of the form $ {t\\mapsto ct}$ for some constant $ {c}$, since it is in fact the Haar measure of the multiplicative group $ {\\mathbb{R}\_{+}}$). Thus  

$ \\displaystyle \\begin{array}{rcl} \\int\_{\\mathbb{R}^{d}}e^{-2\\pi y|\\xi|}e^{2\\pi i\\langle x,\\xi\\rangle}\\thinspace d\\xi & = & y^{\\frac{1}{2}}\\int\_{\\mathbb{R}^{d}}\\int\_{0}^{\\infty}e^{-\\pi yt}e^{-\\pi\\frac{\\xi^{2}}{t}y}e^{2\\pi i\\langle x,\\xi\\rangle}\\thinspace t^{\\frac{1}{2}}\\frac{dt}{t}d\\xi\\\\ & = & y^{\\frac{1}{2}}\\int\_{0}^{\\infty}e^{-\\pi yt}\\int\_{\\mathbb{R}^{d}}e^{-\\pi\\frac{\\xi^{2}}{t}y}e^{2\\pi i\\langle x,\\xi\\rangle}\\thinspace d\\xi t^{\\frac{1}{2}}\\frac{dt}{t} \\end{array} $

In $ {\\mathbb{R}^{d}}$ the Fourier transform $ {\\mathcal{F}}$ and the dilation $ {\\mathcal{D}\_{s}(f)(x)=f(sx)}$ interact according to the rule $ {\\mathcal{F}\\mathcal{D}\_{s}=s^{-d}\\mathcal{D}\_{s^{-1}}\\mathcal{F}.}$ The above expression then equals to  

$ \\displaystyle y^{-\\frac{d-1}{2}}\\int\_{0}^{\\infty}e^{-\\pi yt}e^{-\\pi\\frac{x^{2}}{y}t}t^{\\frac{d+1}{2}}\\thinspace\\frac{dt}{t}=C\_{d}\\frac{y}{(y^{2}+|x|^{2})^{\\frac{d+1}{2}}}, $

here, $ {C\_{d}=\\frac{\\Gamma(\\frac{d+1}{2})}{\\pi^{\\frac{d+1}{2}}}}$, $ {\\Gamma(\\alpha)=\\int\_{0}^{\\infty}e^{s}s^{\\alpha}\\frac{ds}{s}}$ is the Gamma function. There are other ways to arrive at this formula for the Poisson kernel; for example, differentiating the fundamental solution of $ {-\\Delta}$ on $ {\\mathbb{R}\_{+}^{d}}$ along the $ {y}$-direction.  
There are $ {d}$ number of *conjugate Poisson kernels*, namely  

$ \\displaystyle \\mathcal{Q}\_{y}^{j}(x\_{1},\\dots,x\_{d}):=C\_{d}\\frac{x\_{j}}{(y^{2}+|x|^{2})^{\\frac{d+1}{2}}},\\ j=1,\\dots,d. $

And in terms of Fourier multipliers they correspond to  

$ \\displaystyle -i\\frac{\\xi\_{j}}{|\\xi|}e^{-2\\pi y|\\xi|}\\ j=1,\\dots,d. $

Let $ {F\_{j}}$ be the function obtained by convoluting $ {f\_{j}}$ with the $ {j}$-th conjugate Poisson kernel  

$ \\displaystyle F\_{j}(y,x\_{1},\\dots,x\_{d}):=f\_{j}\*\\mathcal{Q}\_{y}^{j}(x\_{1},\\dots,x\_{d}), $

where $ {f\_{j}\\in L^{2}(\\mathbb{R}^{d})}$ is given. It can be thought of as the boundary value of $ {F\_{j}}$, in the sense when $ {y\\rightarrow0^{+}}$, $ {F\_{j}(y,x)\\rightarrow f\_{j}(x)}$ in $ {L^{2}}$ via the Plancherel theorem, since the multipliers converge to the bounded function $ {-i\\frac{\\xi\_{j}}{|\\xi|}}$. The convergence in fact also holds almost everywhere via a *maximal function* argument, which will not be pursued here. These functions are called the *conjugate harmonic functions* of the harmonic function defined by the Poisson integral. Altogether they satisfy the system of generalized Cauchy-Riemann equations.  
Here we are interested in the convolutional operator $ {R\_{j}}$ corresponding to the multiplier $ {-i\\frac{\\xi\_{j}}{|\\xi|}}$, called the *$ {j}$-th Riesz transform*. When $ {d=1}$, the multiplier becomes $ {-i\\text{sign}(\\xi)}$, which is the multiplier of the more familiar Hilbert transform. As is explained the above paragraph, the $ {j}$-th Riesz transform maps the boundary value of the Poisson integral $ {F}$, to the boundary value of the $ {j}$-th conjugate harmonic function of $ {F}$.  

First of all we want to find the expressions of the kernels for the Riesz transforms. We already know that if $ {f\\in L^{2}(\\mathbb{R}^{d})}$,  

$ \\displaystyle f\*\\mathcal{Q}\_{\\epsilon}^{j}\\rightarrow R\_{j}f\\quad\\text{as }\\epsilon\\rightarrow0\\quad\\text{in }L^{2}. $

Now consider the difference  

$ \\displaystyle C\_{d}\\int\_{|y|\\geq\\epsilon}f(x-y)\\frac{y\_{j}}{|y|^{d+1}}dy-f\*\\mathcal{Q}\_{\\epsilon}^{j}(x)=f\*\\Delta\_{\\epsilon} $

where  

$ \\displaystyle \\Delta\_{\\epsilon}(y)=\\begin{cases} C\_{d}\\left(\\frac{y\_{j}}{|y|^{d+1}}-\\frac{y\_{j}}{(\\epsilon^{2}+|y|^{2})^{\\frac{d+1}{2}}}\\right) & \\text{for }|y|\\geq\\epsilon\\\\ C\_{d}\\frac{y\_{j}}{(\\epsilon^{2}+|y|^{2})^{\\frac{d+1}{2}}} & \\text{for }|y|<\\epsilon \\end{cases}. $

(Notice that the estimate here to be done is in great similarity with the one in this previous post, where the difference kernel was paired with a Schwartz function). We make two important observations here:  

-   The family of kernels $ {\\{\\Delta\_{\\epsilon}\\}\_{\\epsilon>0}}$ is invariant under $ {L^{1}}$-dilations. More precisely, one has

    $ \\displaystyle \\Delta\_{\\epsilon}(y)=\\epsilon^{-d}\\Delta\_{1}(\\epsilon^{-1}y). $

    Consequently, when $ {|y|\\geq1}$ one has

    $ \\displaystyle |\\Delta\_{1}(y)|=C\_{d}|\\frac{y\_{j}}{|y|^{d+1}}-\\frac{y\_{j}}{(1+|y|^{2})^{\\frac{d+1}{2}}}|\\sim O(|y|^{-(d+1)}), $

    hence $ {\\int\_{|y|\\geq1}|\\Delta\_{1}(y)|dy=\\int\_{|y|\\geq\\epsilon}|\\Delta\_{\\epsilon}(y)|dy<\\infty}$ for all $ {\\epsilon>0}$. The kernels are also bounded over $ {\\mathbb{R}^{d}}$ and moreover satisfies

    $ \\displaystyle |\\Delta\_{\\epsilon}(y)|\\leq C\\epsilon^{-d}. $

    In particular one can conclude that the kernels are in $ {L^{1}}$.
-   Each of the kernel satisfies the cancellation condition

    $ \\displaystyle \\int\_{\\mathbb{R}^{d}}\\Delta\_{\\epsilon}(y)dy=0, $

    since the kernel is odd: $ {\\Delta\_{\\epsilon}(-y)=-\\Delta\_{\\epsilon}(y)}$.

Due to these observations,  

$ \\displaystyle \\|f\*\\Delta\_{\\epsilon}\\|\_{L^{2}(\\mathbb{R}^{d})}\\leq\\int\_{\\mathbb{R}^{d}}\\|f(x-\\epsilon y)-f(x)\\|\_{L^{2}(\\mathbb{R}^{d})}|\\Delta\_{1}(y)|dy, $

and the RHS goes to zero as $ {\\epsilon\\rightarrow0}$ by dominated convergence. Thus we obtain the kernel of the $ {j}$-th Riesz transform to be  

$ \\displaystyle C\_{d}\\text{p.v.}\\frac{y\_{j}}{|y|^{d+1}}=C\_{d}\\lim\_{\\epsilon\\rightarrow0}\\int\_{|y|\\geq\\epsilon}\\frac{y\_{j}}{|y|^{d+1}}dy. $

Let us note that for each $ {j}$ the multiplier $ {-i\\frac{\\xi\_{j}}{|\\xi|}}$ is homogeneous of degree $ {0}$, while the kernel is homogeneous of degree $ {-d}$, and these kernels are not locally integrable. For this reason the Riesz transforms lie under the name of *singular integral operators*.  
The Riesz transforms is useful in that it can recover the Hessian of a Schwartz function from its Laplacian. To see this, observe that if $ {u\\in\\mathcal{S}(\\mathbb{R}^{d})}$,  

$ \\displaystyle \\begin{array}{rcl} \\widehat{\\partial\_{x\_{j}}\\partial\_{x\_{k}}u} & = & -4\\pi^{2}\\xi\_{j}\\xi\_{k}\\widehat{u}\\\\ & = & -\\frac{\\xi\_{j}}{|\\xi|}\\frac{\\xi\_{k}}{|\\xi|}(4\\pi^{2}|\\xi|^{2}\\widehat{u})\\\\ & = & -\\frac{\\xi\_{j}}{|\\xi|}\\frac{\\xi\_{k}}{|\\xi|}\\widehat{\\Delta u}. \\end{array} $

Then by the inverse Fourier transform  

$ \\displaystyle \\partial\_{x\_{j}}\\partial\_{x\_{k}}u=-R\_{j}R\_{k}(\\Delta u). $

Thus it reduces the question of interior Hessian estimate of the solutions to the *Poisson equation* $ {\\Delta u=f}$, to the corresponding boundedness property of the Riesz transforms.  

**2\. Inverting Constant Coefficient Elliptic Operators**

The basic setting we have in mind is solving the constant coefficient linear PDE of order $ {m}$:  

$ \\displaystyle L(u)=f, $

where $ {L=\\sum\_{|\\alpha|\\leq m}a\_{\\alpha}(\\partial^{\\alpha})}$, $ {a\_{\\alpha}\\in\\mathbb{C}}$ and $ {f\\in\\mathcal{S}(\\mathbb{R}^{d})}$. If a solution $ {u\\in\\mathcal{S}(\\mathbb{R}^{d})}$ exists, then by taking the Fourier transform,  

$ \\displaystyle P(\\xi)\\hat{u}(\\xi)=\\hat{f}(\\xi), $

where $ {P(\\xi)=\\sum\_{|\\alpha|\\leq m}a\_{\\alpha}(2\\pi i\\xi)^{\\alpha}}$ is the characteristic polynomial (symbol) of $ {L}$. It follows that the Fourier transform of the solution should satisfy  

$ \\displaystyle \\hat{u}(\\xi)=\\frac{\\hat{f}(\\xi)}{P(\\xi)}. $

Ignoring the question of covergence, by taking the inverse Fourier transform, $ {u}$ is then obtained by the convolution of $ {f}$ with a kernel whose multiplier is $ {(P(\\xi))^{-1}}$. The kernel is also called a fundamental solution to $ {L}$, which is a distribution $ {F}$ such that  

$ \\displaystyle L(F)=\\delta. $

To find $ {F}$ in general one has to make sense of the inverse Fourier transform of $ {(P(\\xi))^{-1}}$. Complications occur depending on the zeros of of the polynomial $ {P(\\xi)}$. An constant coefficient linear partial differential operator of order $ {m}$ is said to be *elliptic* if its symbol satisfies the inequality  

$ \\displaystyle |P(\\xi)|\\geq c|\\xi|^{m}\\text{ for all }|\\xi|>C. $

Below the fold we shall detour a little to see what distinguishes out the elliptic operators by looking at three fundamental examples.  

> **Example 1** ***Elliptic: The Laplacian on $ {\\mathbb{R}^{d}}$ when $ {d\\geq3}$**. The symbol of $ {-\\Delta}$ is $ {4\\pi^{2}|\\xi|^{2}}$, hence it is elliptic. Note that $ {\\frac{1}{4\\pi^{2}|\\xi|^{2}}}$ is locally integrable on $ {\\mathbb{R}^{d}}$ only if $ {d\\geq3}$. In this locally integrable range it is useful to have the following more general result.*  
> 
> > ***Proposition 1** *Let $ {d\\in\\mathbb{N}}$, $ {-d<\\lambda<0}$, and $ {H\_{\\lambda}}$ be a homogeneous distribution of degree $ {\\lambda}$, i.e.**  
> > 
> > **$ \\displaystyle \\begin{array}{rcl} \\langle s^{-d}\\varphi(s^{-1}x),H\_{\\lambda}(x)\\rangle & = & s^{\\lambda}\\langle\\varphi(x),H\_{\\lambda}(x)\\rangle, \\end{array} $**
> > 
> > **that agrees with $ {|x|^{\\lambda}}$on $ {\\mathbb{R}^{d}\\backslash\\{0\\}}$. Then**  
> > 
> > **$ \\displaystyle (H\_{\\lambda})\\hat{}=C\_{\\lambda,d}H\_{-d-\\lambda} $**
> > 
> > **with $ {C\_{\\lambda,d}=\\frac{\\Gamma(\\frac{d+\\lambda}{2})}{\\Gamma(\\frac{-\\lambda}{2})}\\pi^{-d/2-\\lambda}}$.**
> 
> **Proof:* We use the same trick with the computation for the multiplier $ {e^{-2\\pi y|\\xi|}}$ in the begining. First we note that, for $ {x\\in\\mathbb{R}^{d}}$,  
> *  
> 
> *$ \\displaystyle \\frac{1}{\\pi{}^{\\frac{\\lambda}{2}}\\Gamma(-\\frac{\\lambda}{2})}\\int\_{0}^{\\infty}e^{-\\pi|x|^{2}t}t^{-\\lambda/2}\\frac{dt}{t}=|x|^{\\lambda}. $*
> 
> *Then pairing it with a schwarz function then integrating in $ {x}$, we get*  
> 
> *$ \\displaystyle \\frac{1}{\\pi{}^{\\frac{\\lambda}{2}}\\Gamma(-\\frac{\\lambda}{2})}\\int\_{\\mathbb{R}^{d}}\\int\_{0}^{\\infty}e^{-\\pi|x|^{2}t}t^{-\\lambda/2}\\varphi(x)\\frac{dt}{t}dx=\\int\_{\\mathbb{R}^{d}}|x|^{\\lambda}\\varphi(x)dx. $*
> 
> *On the other hand there is a Fourier transform hidden in the LHS,*  
> 
> *$ \\displaystyle \\begin{array}{rcl} & \\int\_{0}^{\\infty}t^{-\\lambda/2}\\int\_{\\mathbb{R}^{d}}e^{-\\pi|x|^{2}t}\\varphi(x)dx\\frac{dt}{t}\\\\ = & \\int\_{0}^{\\infty}t^{-\\lambda/2}\\int\_{\\mathbb{R}^{d}}e^{-\\pi|x|^{2}t}\\left(\\int\_{\\mathbb{R}^{d}}\\hat{\\varphi}(\\xi)e^{2\\pi i\\langle x,\\xi\\rangle}d\\xi\\right)dx\\frac{dt}{t}\\\\ = & \\int\_{0}^{\\infty}t^{-\\lambda/2}\\int\_{\\mathbb{R}^{d}}\\hat{\\varphi}(\\xi)\\left(\\int\_{\\mathbb{R}^{d}}e^{-\\pi|x|^{2}t}e^{2\\pi i\\langle x,\\xi\\rangle}dx\\right)d\\xi\\frac{dt}{t}\\\\ = & \\int\_{\\mathbb{R}^{d}}\\int\_{0}^{\\infty}e^{-\\pi|\\xi|^{2}/t}t^{-\\lambda/2}t^{-d/2}\\hat{\\varphi}(\\xi)\\frac{dt}{t}d\\xi\\\\ = & \\pi^{-(\\lambda+d)/2}\\Gamma(\\frac{\\lambda+d}{2})\\int\_{\\mathbb{R}^{d}}|\\xi|^{-d-\\lambda}\\hat{\\varphi}(\\xi)d\\xi. \\end{array} $*
> 
> *We thus conclude that*  
> 
> *$ \\displaystyle \\int\_{\\mathbb{R}^{d}}|x|^{\\lambda}\\varphi(x)dx=C\_{\\lambda,d}\\int\_{\\mathbb{R}^{d}}|\\xi|^{-d-\\lambda}\\hat{\\varphi}(\\xi)d\\xi. $*
> 
> *$ \\Box$  
> Thus when $ {d\\geq3}$, i.e. $ {\\frac{1}{4\\pi^{2}|\\xi|^{2}}}$ is locally integrable, by taking $ {\\lambda=-2}$ above we arrive at a fundamental solution to the Laplacian, namely  
> *  
> 
> *$ \\displaystyle 4\\pi^{2}C\_{-2,d}|x|^{-d+2}. $*
> 
> *In the case $ {d=3}$ it is known as the *Newtonian potential*.*

> **Example 2** ***Parabolic: The heat operator $ {\\partial\_{t}-\\Delta\_{x}}$.** It has symbol $ {2\\pi i\\tau+4\\pi^{2}|\\xi|^{2}}$ and so it is not quite elliptic, but $ {\\left(2\\pi i\\tau+4\\pi^{2}|\\xi|^{2}\\right)^{-1}}$ is never singular exept at $ {(\\tau,\\xi)=0}$. Again one can use the same trick. Observe first that*  
> 
> *$ \\displaystyle \\frac{1}{2\\pi i\\tau+4\\pi^{2}|\\xi|^{2}}=\\int\_{0}^{\\infty}e^{-(2\\pi i\\tau+4\\pi^{2}|\\xi|^{2})s}ds. $*
> 
> *Inserting the RHS into the inverse Fourier transform of the LHS, we get*  
> 
> *$ \\displaystyle \\begin{array}{rcl} & \\int\_{\\mathbb{R}^{d+1}}\\left(\\int\_{0}^{\\infty}e^{-(2\\pi i\\tau+4\\pi^{2}|\\xi|^{2})s}ds\\right)e^{2\\pi i\\langle x,\\xi\\rangle}e^{2\\pi it\\tau}d\\xi d\\tau\\\\ = & \\int\_{\\mathbb{R}}\\int\_{0}^{\\infty}e^{-2\\pi i\\tau s}e^{2\\pi it\\tau}\\left(\\int\_{\\mathbb{R}^{d}}e^{-4\\pi^{2}|\\xi|^{2}s}e^{2\\pi i\\langle x,\\xi\\rangle}d\\xi\\right)dsd\\tau\\\\ = & (4\\pi)^{-d/2}\\int\_{0}^{\\infty}s^{-d/2}e^{-\\frac{x^{2}}{4s}}\\left(\\int\_{\\mathbb{R}}e^{-2\\pi i\\tau s}e^{2\\pi it\\tau}d\\tau\\right)ds. \\end{array} $*
> 
> *Now observe that the bracket inside the integral above is in fact $ {\\delta\_{t}(s)}$. Assuming this, the integrand is clearly seen to be the multiplication of $ {s^{-d/2}e^{-\\frac{x^{2}}{4s}}}$ with the delta distribution at $ {t=s}$, except that it is integrated over the positive reals. Hence the integral equals to the heat kernel, extended to negative time by zero*  
> 
> *$ \\displaystyle K(t,x)=\\begin{cases} (4\\pi t)^{-d/2}e^{-\\frac{x^{2}}{4t}} & \\text{if }t>0\\\\ 0 & \\text{if }t\\leq0 \\end{cases}. $*
> 
> *(At time $ {t=0}$ we may define it as zero, or as the delta function in $ {x}$ if one wishes, since the heat kernels form an approximation to the identity.) Finally, we check that if $ {\\varphi\\in\\mathcal{S}(\\mathbb{R})}$, then*  
> 
> *$ \\displaystyle \\int\_{\\mathbb{R}}\\varphi(s)\\int\_{\\mathbb{R}}e^{-2\\pi i\\tau s}e^{2\\pi it\\tau}d\\tau ds=\\varphi(t) $*
> 
> *by Fourier inversion.  
> *

It might be worthwhile to reconcile with what we know about the solution of the Cauchy problem, indexed by $ {s\\in\\mathbb{R}}$  

$ \\displaystyle \\partial\_{t}v\_{s}-\\Delta v\_{s}=0\\quad\\text{with }v\_{s}(0,x)=f\_{s}(x)=f(s,x)\\in\\mathcal{S}(\\mathbb{R}\\times\\mathbb{R}^{d}),x\\in\\mathbb{R}^{d}. $

Recall that the solution at time $ {t>0}$ is given by convolving $ {f}$ with the heat kernel at time $ {t}$. Its relation with the inhomogeneous equation  

$ \\displaystyle \\partial\_{t}u-\\Delta u=f(x,t)\\quad,x\\in\\mathbb{R}^{d}, $

which can be solved by convolving $ {f}$ with our fundamental solution above, is provided by the *Duhamel's principle*.  

> **Example 3** ***Hyperbolic: The wave operator (d'Alembertian) $ {\\square=\\partial\_{t}^{2}-\\Delta\_{x}}$.** It has symbol $ {4\\pi^{2}(-\\tau^{2}+|\\xi|^{2})}$. Note that the symbol has a much larger zero set compared to the previous ones, which is called the *light cones* $ {\\{(t,\\xi):|t|=|\\xi|\\}}$. If we had directly proceeded as before to compute the inverse Fourier transform of $ {\\frac{1}{4\\pi^{2}(-\\tau^{2}+|\\xi|^{2})}}$, we would encounter the trouble of making sense of the integral $ {\\int\_{\\mathbb{R}}e^{4\\pi^{2}\\tau^{2}s}e^{2\\pi it\\tau}d\\tau}$ as a tempered distribution. (This perhaps can be done using ocsillatory integrals, but I will have to look into that further). Instead, we use the standard method of applying only the spatial Fourier transform to the homogeneous equation with Cauchy data, indexed by $ {s\\in\\mathbb{R}}$*  
> 
> *$ \\displaystyle \\square v\_{s}=0\\quad\\text{with }v\_{s}(x,0)=0,\\partial\_{t}v\_{s}(x,0)=g\_{s}(x)=g(s,x)\\in\\mathcal{S}(\\mathbb{R}\\times\\mathbb{R}^{d}). $*
> 
> *We then get the following ODE with initial conditions*  
> 
> *$ \\displaystyle \\partial\_{t}^{2}\\hat{v}\_{s}+4\\pi^{2}|\\xi|^{2}\\hat{v}\_{s}=0\\quad\\text{with }\\hat{v}\_{s}(x,0)=0,\\partial\_{t}\\hat{v}\_{s}(x,0)=\\hat{g}\_{s}(x). $*
> 
> *The solution of the ODE is given by*  
> 
> *$ \\displaystyle \\begin{array}{rcl} \\hat{v}\_{s}(t,\\xi) & = & \\hat{g}\_{s}(\\xi)\\frac{\\sin(2\\pi|\\xi|t)}{2\\pi|\\xi|}\\\\ & := & \\hat{g}\_{s}(\\xi)\\widehat{\\Phi\_{t}}(\\xi). \\end{array} $*
> 
> *From Duhamel's principle, a solution to the inhomogeneous equation*  
> 
> *$ \\displaystyle \\square u=g(t,x) $*
> 
> *is then given by*  
> 
> *$ \\displaystyle \\begin{array}{rcl} u(t,x) & = & \\int\_{-\\infty}^{t}v\_{s}(t-s,x)ds\\\\ & = & \\int\_{-\\infty}^{t}\\int\_{\\mathbb{R}^{d}}\\hat{g}(s,\\xi)\\widehat{\\Phi\_{t-s}}(\\xi)e^{2\\pi i\\langle x,\\xi\\rangle}d\\xi ds\\\\ & = & \\int\_{-\\infty}^{t}g(s,x)\*\\Phi\_{t-s}(x)ds=:g\*\\Phi\_{+}(t,x) \\end{array} $*
> 
> *where*  
> 
> *$ \\displaystyle \\Phi\_{+}=\\begin{cases} \\Phi\_{t} & \\text{if }t\\geq0\\\\ 0 & \\text{if }t<0 \\end{cases} $*
> 
> *which will be a fundamental solution of the wave operator. The work now is to compute the inverse Fourier transform of $ {\\widehat{\\Phi\_{t}}}$, however, it is not in $ {L^{1}}$and requires analytic continuation, and so will not be pursued here.*

As can be seen above, the size of the singularity of the function $ {(P(\\xi))^{-1}}$ plays an important role in its distributional property and thereby the that of its Fourier transform. In the elliptic case then (of order $ {m}$, say), it is essentially comparable the distributional property of homogeneous distribution that agrees with $ {|\\xi|^{-m}}$ away from the origin, which we now turn to.  

Let $ {P(\\xi)}$ be the symbol of an constant coefficient linear elliptic operator $ {L}$ of order $ {m}$, i,e. there is a constant $ {C,c>0}$ such that  

$ \\displaystyle |P(\\xi)|\\geq c|\\xi|^{m}\\text{ for all }|\\xi|>C. $

The idea is to use the \`\`divide and conquer'', namely take a function $ {\\eta(\\xi)}$ supported in $ {|\\xi|>C}$ and equals $ {1}$ for $ {|\\xi|}$ large enough, and decomposite the multiplier into \\frac{1}{P(\\xi)} & = & \\frac{1-\\eta}{P(\\xi)}+\\frac{\\eta}{P(\\xi)}\\nonumber  
& =: & K\_{0}+K\_{1}.[](https://www.blogger.com/null) Now $ {K\_{0}}$ is a distribution of compact support and so whose inverse Fourier transform $ {K\_{0}^{\\vee}}$ is a slowly increasing $ {C^{\\infty}}$ function. For $ {K\_{1}}$, observe from the defining inequality,  

$ \\displaystyle |K\_{1}(\\xi)|\\lesssim|\\xi|^{-m}, $

then  

$ \\displaystyle \\left((-4\\pi^{2}|x|^{2})^{N}K\_{1}^{\\vee}\\right)^{\\wedge}=\\Delta^{N}\\left(K\_{1}\\right)\\lesssim|\\xi|^{-m-2N|} $

and when $ {N}$ is large enough the RHS is integrable, and therefore $ {(-4\\pi^{2}|x|^{2})^{N}K\_{1}^{\\vee}}$ is continuous. A similar argument can show that $ {(-4\\pi^{2}|x|^{2})^{N}\\partial^{\\alpha}\\left(K\_{1}^{\\vee}\\right)}$ is continuous for any multi-index $ {\\alpha}$, and hence $ {K\_{1}^{\\vee}}$ is a $ {C^{\\infty}}$ function away from the origin. For this reason the distribution $ {K\_{1}^{\\vee}}$ is called a *regular parametrix* of $ {L}$, because  

$ \\displaystyle (L(K\_{1}^{\\vee}))^{\\wedge}=\\eta=1+(\\eta-1) $

in the sense of distributions and therefore $ {LK\_{1}^{\\vee}=\\delta+r}$, where $ {r}$ is the inverse Fourier transform of the compactly supported function $ {\\eta-1}$, and thus is Schwartz.  
The existence of a regular parametrix in fact implies some higher regularity of the solutions than the source term $ {f}$ of the corresponding inhomogeneous equation $ {LU=f}$. This phenonmenon is known as the *hypoellipticity*. Quantitative versions of the prevous statement will follow from the study of the boundedness of the multiplier operator $ {T\_{K\_{1}}}$ on various function spaces. The crucial property of the parametrix of an elliptic operator is that it is a multipler $ {m(\\xi)}$ that is a $ {C^{\\infty}}$ function away from the origin, and satisfies the following differential inequality  

$ \\displaystyle |\\partial^{\\alpha}m(\\xi)|\\lesssim|\\xi|^{-|\\alpha|}\\text{ for all multi-index }\\alpha. $

Such multipliers are sometimes named after Hörmander and Mikhlin. Note also that the multipliers of the Riesz transforms satisfy this property. 

**3\. Littlewood-Paley Decomposition**

The use of bump function in ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is a preliminary example of frequency localisation, namely, the low and high frequency parts are separated into $ {K\_{0}}$ and $ {K\_{1}}$ and analysed separately. There is a more systematic way of doing this multiresolution analysis. Take a $ {C^{\\infty}}$ bump function $ {\\psi}$ supported $ {B(0,2)}$ in the frequency space, and equals $ {1}$ in $ {B(0,1)}$; let  

$ \\displaystyle \\varphi\_{0}(\\xi):=\\psi(\\xi)-\\psi(2\\xi). $

Then $ {\\varphi\_{0}}$ is supported in the annulus $ {\\{1/2\\leq|\\xi|\\leq2\\}}$. Let $ {k\\in\\mathbb{N}}$ and  

$ \\displaystyle \\varphi\_{k}(\\xi):=\\varphi\_{0}(2^{-k}\\xi) $

so that $ {\\psi\_{k}}$ is supported in the annulus $ {\\{2^{k-1}\\leq|\\xi|\\leq2^{k+1}\\}}$. The construction yields  

$ \\displaystyle \\psi(\\xi)+\\sum\_{k\\in\\mathbb{N}}\\varphi(\\xi)=1,\\quad\\xi\\in\\mathbb{R}^{d}. $

The *$ {k}$-th Littlewood-Paley projection* of a Schwartz function $ {f}$ is defined as  

$ \\displaystyle P\_{0}f=\\left(\\psi\\hat{f}\\right)^{\\vee},\\quad P\_{k}f=\\left(\\varphi\_{k}\\hat{f}\\right)^{\\vee}\\quad k\\geq1. $

A few observations are to be made about these constructions:  

-   These projections can be written in convolution form, with kernels $ {\\psi^{\\vee}}$ for $ {k=0}$ and $ {\\varphi\_{k}^{\\vee}}$ when $ {k\\geq1}$. They are all Schwartz functions, with the property that

    $ \\displaystyle \\int\_{\\mathbb{R}^{d}}\\psi^{\\vee}(x)dx=\\psi(0)=1\\quad\\text{and }\\int\_{\\mathbb{R}^{d}}\\varphi\_{k}^{\\vee}(x)dx=\\varphi\_{k}(0)=0. $

    Therefore,

    $ \\displaystyle \\int\_{\\mathbb{R}^{d}}P\_{k}f(x)dx=\\widehat{P\_{k}f}(0)=\\begin{cases} \\psi(0)\\hat{f}(0)=\\int\_{\\mathbb{R}^{d}}f(x)dx & \\text{if }k=0\\\\ \\varphi\_{k}(0)\\hat{f}(0)=0 & \\text{if }k\\geq1 \\end{cases}. $

    In addtion, the kernels $ {(\\psi+\\sum\_{k\\leq N}\\varphi\_{k})^{\\vee}}$ , indexed in $ {N}$, form an approximation to the identity.
-   The function

    $ \\displaystyle \\begin{array}{rcl} P\_{\\leq N}f:=\\sum\_{k\\leq N}P\_{k}f(x) & = & \\int\_{\\mathbb{R}^{d}}f(x+2^{-N}y)\\hat{\\psi}(y)dy \\end{array} $

    roughly speaking is an averaged version of the function $ {f}$ at the physical scale $ {2^{-N}}$(zoomed in about $ {N}$ times). Furthermore, if further zoomed in as far as twice or more, the function becomes so smooth that it is essentially constant. To see this, let $ {K\\geq N+2}$, and note that

    $ \\displaystyle \\begin{array}{rcl} \\left(P\_{\\leq K}P\_{\\leq N}f\\right)^{\\wedge}(\\xi) & = & \\psi(2^{-K}\\xi)\\psi(2^{-N}\\xi)\\hat{f}(\\xi)\\\\ & = & \\left(P\_{\\leq N}f\\right)^{\\wedge}(\\xi). \\end{array} $

    Hence

    $ \\displaystyle P\_{\\leq N}f(x)=P\_{\\leq K}P\_{\\leq N}f=\\int\_{\\mathbb{R}^{d}}P\_{\\leq N}f(x+2^{-K}y)\\hat{\\psi}(y)dy $

    which says that the value of $ {P\_{\\leq N}f}$ at $ {x}$ is equal to its own average at a smaller scale. On the other hand, we can check

    $ \\displaystyle \\int\_{\\mathbb{R}^{d}}P\_{\\leq N}f(x+2^{-N+2}y)\\hat{\\psi}(y)dy=0, $

    meaning that the function $ {P\_{\\leq N}}$ oscillates when zoomed out twice or more.

We would like to think of the Littlewood-Paley decomposition of a Schwartz function $ {f}$ as a mapping from $ {\\mathbb{R}^{d}}$ to $ {B=\\ell^{2}(\\{0\\}\\cup\\mathbb{N},\\mathbb{C})}$, namely,  

$ \\displaystyle x\\mapsto Sf(x)=(P\_{0}f(x),P\_{1}f(x),\\dots). $

This then defines a mapping $ {T}$ from the Schwartz class $ {\\mathcal{S}(\\mathbb{R}^{d})}$ to $ {L^{2}(\\mathbb{R}^{d},B)}$, sending $ {f}$ to $ {Sf}$, where the norm of the latter space is given by  

$ \\displaystyle \\||Sf|\\|\_{L^{2}(\\mathbb{R}^{d})}=\\|\\left(\\sum\_{k\\geq0}(P\_{k}f\\,(x))^{2}\\right)^{1/2}\\|\_{L^{2}(\\mathbb{R}^{d})}, $

here $ {|Sf|=\\left(\\sum\_{k\\geq0}(P\_{k}f\\,(x))^{2}\\right)^{1/2}}$ is often called a *square function*. It turns out the $ {L^{p}}$ norm of the square function $ {|Sf|}$ is comparable to the $ {L^{p}}$ norm of $ {f}$, whenever either one of them is defined. This will follows from the study of the boundedness property of the operator $ {T}$ defined above. Note that the multiplier in each slot of $ {Sf}$ is of Hörmander-Mikhlin type.
