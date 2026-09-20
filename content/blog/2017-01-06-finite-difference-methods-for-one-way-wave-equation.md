---
id: 2017-01-06-finite-difference-methods-for-one-way-wave-equation
title: "Finite Difference Methods for One Way Wave Equation"
date: 2017-01-06
tags: ["Fourier analysis", "numerical methods", "PDE"]
source: https://sylqiu.blogspot.com/2017/01/finite-difference-methods-for-one-way.html
publish: true
---
**1.1. A prototypical example: Euler method for an ODE**

Already in the 18th century, Leonhard Euler had considered the problem of finding an approximation of the *integral curve* associated to an *initial value problem* of an ordinary differential equation. The solution to the initial value problem can be represented as a *parametrised curve* lying in the spatial domain: one can imagine it is a particle going along the curve, the position and velocity at certain time is defined by the differential equation and the initial position and velocity of the particle. More concretely, we may consider the first order ODE with an initial condition  

$ \\displaystyle \\frac{dx}{dt}(t)=f(t,x(t))\\quad x(0)=x\_{0} $

where, say, the solution lies in the plane $ {x(t)\\in\\mathbb{R}^{2}}$ for time interval $ {t\\in(0,1)}$, and $ {f:(0,1)\\times\\mathbb{R}^{2}\\rightarrow\\mathbb{R}^{2}}$. The famous *Picard-Lindel{ö}f theorem* asserts that if $ {f}$ is *uniformly Lipschitz* in the spatial variable $ {x}$ and continuous in the time variable $ {y}$, then there exists a unique solution $ {x(t)}$ to the initial value problem. Of course, we don't expect to get closed form solution for every given right hand side satisfying the theorem. So, as Euler did, we want to try to directly *integrate* the differential equation by discrete approximation. The obvious thing to try is[](https://www.blogger.com/null)  

[$ \\displaystyle x(t\_{i})-x(t\_{i-1})\\approx\\Delta t\\cdot f(t\_{i-1},x(t\_{i-1})), \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where the time interval has been discretized $ {0=t\_{0}<t\_{1}<\\cdots<t\_{n}=1}$ with equal distance $ {\\Delta t}$. Taking approximation  

$ \\displaystyle \\tilde{x}(t\_{i})-\\tilde{x}(t\_{i-1})=\\Delta t\\cdot f(t\_{i-1},\\tilde{x}(t\_{i-1})), $

we can then compute $ {\\tilde{x}(t\_{i})}$ assuming $ {x(t\_{i-1})}$ is known. This is called *Euler method*. Since we are computing $ {\\tilde{x}(t\_{i})}$ in terms of its values at previous times, we say it is an *explicit* method. In Riemann integration terms, we note that here we evaluate the integrand at the left endpoint in each subinterval. If evaluating at the right endpoint we arrive at an *implicit* method, called the *backward Euler method*, because now we have to solve a more difficult equation about $ {\\tilde{x}(t\_{i})}$. It is of most interest to study the error produced by the discrete approximation. Inspecting more closely, we see that ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is actually the first order *Taylor approximation* of $ {x(t\_{i})}$ based at $ {t\_{i-1}}$: if the solution $ {x(t)}$ is twice differentiable, by *Taylor's theorem*, we have an estimate  

$ \\displaystyle x(t\_{i})=x(t\_{i-1})+\\Delta t\\cdot f(t\_{i-1},x(t\_{i-1}))+O(\\Delta t^{2}) $

where $ {O(\\Delta t^{2})}$ is a quantity bounded by $ {C\\cdot\\Delta t^{2}}$ for some constant $ {C}$ and for all $ {\\Delta t}$ small enough. Note that here we are using the true values of the solution. Rearranging and writing $ {t=t\_{i}}$, $ {\\Delta t=h}$, $ {dx/dt=f}$, the above estimate turns to  

$ \\displaystyle \\frac{x(t+h)-x(t)}{h}-\\frac{dx(t)}{dt}=O(h). $

The difference in the LHS is known as the *truncation error* of the method. Since $ {h}$ is in its first power in the RHS $ {O(h)}$, we say that Euler method is of *first order accurate*. The above discussion holds when $ {h}$ is small enough. The behavior of Euler's method can be wild if $ {h}$ is sufficiently large. Indeed, consider the *stiff problem*:  

$ \\displaystyle \\frac{dx}{dt}(t)=-k\\cdot x(t),k>0 $

This equation has solutions of the form $ {x(t)=Ae^{-kt}+C}$. Clearly any particular solution decays to a fixed value as $ {t\\rightarrow\\infty}$, but one can check if the time step $ {h\\gg1/k}$, then the numerical solution will oscillate or even diverge to infinity. In some sense the solution is only *stable* (here, we mean continuous dependence on the initial condition with fixed step size) within a region of choice of $ {h}$, or sometimes a expression in terms of h; we call a *stability region* the subset where the numerical solution for the stiff problem is stable. It turns out that here much of the analysis of a difference method (e.g. Euler's method) to solving the stiff problem is about the associated difference equation, which further breaks down to a linear algebraic problem of analysing eigenvalues of the associated linear system, recalling that the solution of a difference equation can be written as a linear combination of roots of the characteristic polynomial (though the case of multiple roots is slightly more complicated).  

We shall see how these ideas in this case of Euler method correspond to those in the analysis of finite difference methods for hyperbolic PDEs, by examining the prototypical example, that of the one way wave equation with the initial condition[](https://www.blogger.com/null)  

[$ \\displaystyle u\_{t}+au\_{x}=0\\quad u(0,x)=u\_{0}(x),{\\tag{$\\star$}} \\ \\ \\ \\ \\ $](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {u:(0,T)\\times\\mathbb{R}\\rightarrow\\mathbb{R}}$, and $ {a}$ is a constant. We note that if $ {b,f=0}$, the unique solution is given by  

$ \\displaystyle u(t,x)=u\_{0}(x-at), $

as we see that the initial state is propogating at a constant speed in the direction $ {(1,a)}$. The *homogeneous* equations such as $ {(\\star)}$ do not have issues of approximating the RHS. For sake of including a more comprehensive picture, we will also temporarily discuss the inhomogeneous case  

$ \\displaystyle u\_{t}+au\_{x}=f\\quad u(0,x)=u\_{0}(x), $

where $ {f:(0,T)\\times\\mathbb{R}\\rightarrow\\mathbb{R}}$ is allowed to depend on both the time variable and spatial variable, but NOT $ {u}$, otherwise it will be *nonlinear*. The closed form solution can be given by the method of *variation of parameter*:  

$ \\displaystyle u(t,x)=u\_{0}(x-at)+\\int\_{0}^{t}f(s,x-a(t-s))ds. $

We shall work with the initial value problem that is *well-posed*: if for any $ {t\\in(0,T)}$, there is a constant $ {C\_{T}}$ such that any solution $ {u(t,x)}$ will satisfy  

$ \\displaystyle \\int\_{-\\infty}^{\\infty}|u(t,x)|^{2}dx\\leq C\_{T}\\int\_{-\\infty}^{\\infty}|u(0,x)|^{2}dx. $

It is important to note that in this post we don't consider nonlinear PDEs, as the analysis below in general does not apply.  

**1.2. Introduction to finite difference schemes**

To do finite difference, we have to discretize the domain $ {U=(0,T)\\times\\mathbb{R}}$ by defining *gird points* $ {(t\_{n},x\_{m})\\in U}$, such that they form a rectanglular lattice. We denote $ {h,k>0}$ to be the spatial step and time step, respectively. The function $ {u,f}$ will thus be approximated by a function $ {v\_{m}^{n},f\_{m}^{n}}$ defined on the grid points. Since $ {f}$ is given, we may simply take $ {f\_{m}^{n}}$ to be $ {f}$ evaluated at the grid points. Similar is for $ {v\_{m}^{0}}$. We have to find a way to compute $ {v\_{n}^{m}}$ such that it approximates $ {u}$ at the grid points. As before, we will try to *integrate* the PDE $ {(\\star)}$. There are several ways to approximate its partial derivatives. Notably:  
*(Spatial) Forward Differece:*   

$ \\displaystyle \\delta\_{+}v\_{m}=\\frac{v\_{m+1}-v\_{m}}{h} $

*(Spatial) Backward Difference:*  

$ \\displaystyle \\delta\_{-}v\_{m}=\\frac{v\_{m}-v\_{m-1}}{h} $

*(Spatial) Central Difference:*  

$ \\displaystyle \\delta\_{0}v\_{m}=\\frac{v\_{m+1}-v\_{m-1}}{2h} $

Of course, the partial derivative in time variable can be approximated in the same way. Combining these approximations in some certain way that corresponds to the structure of $ {(\\star)}$, we obtain a *finite difference scheme*. For instances, suppose $ {f=0}$:  
*Forward-time Central-space:*  

$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n}}{k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}=0 $

Note that $ {v\_{m}^{n+1}}$ can be written as a linear combination of grid function evaluated at the $ {n}$-th time level. Such a scheme will be called *explicit*, and the grid function is computed level after level.  
*Leap-frog:*  

$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n-1}}{2k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}=0 $

Here we find that we cannot compute $ {v\_{m}^{n+1}}$ without knowing the previous two time levels $ {v\_{m}^{n-1}}$ and $ {v\_{m\\pm1}^{n}}$. Such will be called a *multi-step* scheme, and the initial condition has to specify the values of two time levels, or to get the second time level using some *one-step* scheme first.  
*Lax-Friedrichs:*  

$ \\displaystyle \\frac{v\_{m}^{n+1}-\\frac{1}{2}(v\_{m+1}^{n}+v\_{m-1}^{n})}{k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}=0 $

Rearranging and writing $ {\\lambda=k/h}$, we get  

$ \\displaystyle v\_{m}^{n+1}=\\frac{1-a\\lambda}{2}v\_{m+1}^{n}+\\frac{1+a\\lambda}{2}v\_{m-1}^{n}. $

If $ {|a\\lambda|<1}$ (so that the scheme is *stable*, as an important criterion we will note later), we see that the two coefficients on the RHS are positive, and sum up to $ {1}$. This says that as the time level increase, the grid values are somewhat more avaraged, and in particular the maximum (or minimum) cannot increase (or decrease) with time. Such is called a *monotone scheme*, and we will see that it has a great limitation: it cannot be very *accurate*. We shall pay attention to two historically important schemes. The first one is  
*Lax-Wendroff:*  

$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n}}{k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}-\\frac{a^{2}k}{2}\\cdot\\frac{v\_{m+1}^{n}-2v\_{m}^{n}+v\_{m-1}^{n}}{h^{2}}=0 $

Apparently higher order derivative approximations are included, and as a result we get a higher order of *accuracy*. One can also show that the scheme is stable if and only if $ {|a\\lambda|<1}$. More importantly, this scheme is *dissipative*, meaning that the *higher frequency part* is always dampened more than the *lower frequency part*. The second one is  
*Crank-Nicolson:*  

$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n}}{k}+a\\frac{v\_{m+1}^{n+1}-v\_{m-1}^{n+1}+v\_{m+1}^{n}-v\_{m-1}^{n}}{4h}=0 $

We find that both $ {v\_{m}^{n+1}}$ and $ {v\_{m+1}^{n+1}}$ are included, so that the values at the next time level cannot be immeidately obtained. Such is called an *implicit* scheme. To solve for such a sheme, considering all grid points in the two time levels and grouping them on both sides, we find that  

$ \\displaystyle \\begin{pmatrix}\\\\ & \\ddots & \\ddots & \\ddots\\\\ & & \\frac{a}{4h} & \\frac{1}{k} & -\\frac{a}{4h}\\\\ & & & \\ddots & \\ddots & \\ddots\\\\ \\\\ \\end{pmatrix}\\begin{pmatrix}\\vdots\\\\ v\_{m-1}^{n+1}\\\\ v\_{m}^{n+1}\\\\ v\_{m+1}^{n+1}\\\\ \\vdots \\end{pmatrix}=\\begin{pmatrix}\\vdots\\\\ \\\\ \\frac{a}{4h}v\_{m-1}^{n}+\\frac{1}{k}v\_{m}^{n}-\\frac{a}{4h}v\_{m+1}^{n}\\\\ \\\\ \\vdots \\end{pmatrix}, $

which amounts to solving a *tridiagonal system*. We won't discuss much about how to solve this, but note that it is one of the reasons that Crank-Nicolson is appealing. We shall focus on the stability property of the scheme: in contrast to the previous explicit schemes, Crank-Nicolson scheme is *unconditionally stable*. In fact, as a corollary of *Courant-Friedrichs-Lewy condition*, there are NO explicit, unconditionally stable, consistent finite difference schemes for hyperbolic system of PDEs. $ {\\quad}$  

Now one can already see a large variety of finite difference schemes that at first look are all somewhat plausible for computing the approximate solution. So the job to analyse these schemes, even in the simple case of one way wave equation, is not trivial and can be difficult and cumbersome even with the right tools. Nevertheless, the general problem correspond to the linear PDE $ {Pu=f}$ is of the form  

$ \\displaystyle P\_{k,h}v=R\_{k,h}f $

where $ {P\_{k,h}}$ is a *finite difference operator* and $ {R\_{k,h}}$ is an approximation of the identity operator. The assesment of the finite difference operator will be based on several notions that we will introduce later. Before that, we need the machinary of Fourier transform.  

**1.3. A quick review of $ {L^{2}}$ theory of Fourier series**

At a certain time level, the function $ {v\_{m}}$ is defined on the spatial gird which is isomorphic to $ {h\\mathbb{Z}}$. We will consider the grid functions that are *squared summable*: $ {v\_{m}\\in\\ell^{2}(h\\mathbb{Z})}$. Applying the *Fourier transform* to $ {v\_{m}}$, we get[](https://www.blogger.com/null)  

[$ \\displaystyle \\hat{v}(\\xi)=\\sum\_{m=-\\infty}^{+\\infty}v\_{m}h\\cdot e^{-imh\\xi} \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)for $ {\\xi\\in\[-\\pi/h,\\pi/h\]}$, which can be easily checked to be a function lying in $ {L^{2}\[-\\frac{\\pi}{h},\\frac{\\pi}{h}\]}$. *Parseval's identity* asserts that Fourier transform is a *unitary transform* from $ {\\ell^{2}(h\\mathbb{Z})}$ to $ {L^{2}\[-\\frac{\\pi}{h},\\frac{\\pi}{h}\]}$, namely the norms are preserved  

$ \\displaystyle \\|v\\|\_{h}^{2}=h\\sum\_{m=-\\infty}^{+\\infty}|v\_{m}|^{2}=\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}|\\hat{v}(\\xi)|^{2}d\\xi=\\|\\hat{v}\\|^{2}. $

And the *Fourier inversion formula*[](https://www.blogger.com/null)  

[$ \\displaystyle v\_{m}=\\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}e^{imh\\xi}\\hat{v}(\\xi)d\\xi \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)that recovers the grid function from its Fourier transform. So Fourier transform from $ {\\ell^{2}(h\\mathbb{Z})}$ to $ {L^{2}\[-\\frac{\\pi}{h},\\frac{\\pi}{h}\]}$ is in fact an *isometry*. Because of the above facts, we will in turn study the Fourier transform $ {\\hat{v}(\\xi)}$ of the grid function at certain time level, and how it evolutes with time.  

The first observation to make is that, by ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#3)), $ {v\_{m}}$ is now a *superposition of waves* of frequencies $ {\\xi\\in\[-\\pi/h,\\pi/h\]}$, with ampflitude $ {\\hat{v}(\\xi)}$. The high frequecy component correspond to the more oscillating behavior of the grid function. Thus if the computed solution $ {v\_{m}}$ is non-smooth or oscillating quickly, we would expect a large value of $ {\\hat{v}(\\xi)}$ for $ {|\\xi|}$ large. This corresponds to the fact that the more non-smooth the function get, the slower the decay of its Fourier transform.  

Another notable fact is that Fourier transform turns \`\`differentiation'' into \`\`multiplication''. This also has a (though not perfect) analog in the discrete case (as differentiation is not available). Indeed, differencing ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#3)) under the integral sign, we see that for example $\\frac{v\_{m+1}-v\_{m}}{h}  = \\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}\\frac{1}{h}(e^{i(m+1)h\\xi}-e^{imh\\xi})\\hat{v}(\\xi)d\\xi\\nonumber  
\= \\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}\\left(\\frac{e^{ih\\xi}-1}{h}\\right)e^{imh\\xi}\\hat{v}(\\xi)d\\xi$.[](https://www.blogger.com/null) By this we will be able to obtain certain recurrence relation for the Fourier transfrom $ {\\hat{v}^{n}(\\xi)}$ for different time levels. This is the basis of *von Neumann analysis*.  

**1.4. Convergence; accuracy and stability**

Now we are ready to formalize notion of a \`\`good'' finite difference scheme. Because the solution of a PDE need not be differentiable in general, the following is formulated in terms of *test functions*.  

> **Definition 1** *(Consistency and accuracy) A finite difference scheme $ {P\_{k,h}v=R\_{k,h}f}$ is said to be *consistent* with the PDE $ {Pu=f}$ if for any smooth function $ {\\phi}$*  
> 
> *$ \\displaystyle P\_{k,h}\\phi-R\_{k,h}\\left(P\\phi\\right)=o(1) $*
> 
> *where $ {o(1)}$ is a quantity that goes to zero as $ {k,h\\rightarrow0}$. The scheme is said to be *accurate* of order $ {(p,q)}$ if*  
> 
> *$ \\displaystyle P\_{k,h}\\phi-R\_{k,h}\\left(P\\phi\\right)=O(k^{p}+h^{q}). $*

> **Definition 2** *(Stability for first order homogeneous equations) A finite difference scheme $ {P\_{k,h}v=0}$ for a first order PDE is said to be stable in the stability region $ {\\Lambda}$ if for every $ {k,h\\in\\Lambda}$, the $ {\\ell^{2}}$ norm of the grid function at time level $ {n}$ is basically bounded by, or perhaps sums of, the $ {\\ell^{2}}$ norms of the gird functions at initial times, i.e. there is an integer $ {J>0}$ and constant $ {C\_{T}}$*  
> 
> *$ \\displaystyle \\|v^{n}\\|\_{h}\\leq C\_{T}\\sum\_{j=0}^{J}\\|v^{j}\\|\_{h}. $*

The idea of stability of a scheme is that only reasonable amount of growth of the computed solution is allowed.  

Finally we define convergence, which is slightly more involved, since we have to specify in what sense the discrete solution $ {v\_{m}^{n}}$ should converges to the true solution $ {u}$ as the grid becomes finer and finer. We shall define the convergence in $ {L^{2}}$, but $ {v\_{m}^{n}}$ lies essentially on a different space than $ {u}$. To remedy, we *interpolate* the $ {v\_{m}^{n}}$'s to get a function defined on the domain of $ {u}$, using the Fourier inversion formula. Recall that we have  

$ \\displaystyle v\_{m}=\\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}e^{imh\\xi}\\hat{v}(\\xi)d\\xi. $

Embbeding $ {h\\mathbb{Z}}$ into $ {\\mathbb{R}}$, we define  

$ \\displaystyle \\mathcal{S}v(x)=\\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}e^{ix\\xi}\\hat{v}(\\xi)d\\xi, $

where $ {\\mathcal{S}}$ is called the *cardinal spline* operator. It's easy to see that the Fourier transform of $ {\\mathcal{S}v(x)}$ is such that  

$ \\displaystyle \\widehat{\\mathcal{S}v}(\\xi)=\\begin{cases} \\hat{v}(\\xi) & |\\xi|\\leq\\pi/h\\\\ 0 & \\text{otherwise} \\end{cases}. $

> **Definition 3** *(Convergence for homogeneous initial value problem) A finite difference scheme approximating the initial value problem of a homogeneous equation is said to be convergent if $ {\\mathcal{S}v^{n}}$ converges to $ {u(t\_{n},\\cdot)}$ in $ {L^{2}}$, where $ {t\_{n}=nk}$, for every solution $ {u}$ to the initial value problem, and for every set of solutions to the differential scheme $ {v}$, depending on $ {h}$ and $ {k}$, for which $ {\\mathcal{S}v^{0}}$ converges to $ {u(0,\\cdot)}$ in $ {L^{2}}$ and $ {h,k\\rightarrow0}$ in the stability region.*

Luckily, we don't always need use the definition of convergence to show it, thanks to the following important theorem of Lax and Richtmeyer. So much of the analysis of a scheme reduces to the analysis of its consistency and stability.  

> **Theorem 4** *(Lax-Richtmeyer equivalence theorem) A consistent finite difference scheme for a well-posed initial value problem for a PDE is convergent if and only if it is stable.*

We next begin stability and accuracy analysis.  

**1.5. Von Neumann analysis**

We first illustrate the method with Forward-time Central-space scheme  

$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n}}{k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}=0. $

Rearranging the equation, we find that  

$ \\displaystyle v\_{m}^{n+1}=\\frac{a\\lambda}{2}(v\_{m-1}^{n}-v\_{m+1}^{n})+v\_{m}^{n}. $

Expressing both sides in terms of Fourier inversion, and making use of ideas in ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we get  

$ \\displaystyle \\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}e^{imh\\xi}\\hat{v}^{n+1}(\\xi)d\\xi=\\int\_{-\\frac{\\pi}{h}}^{\\frac{\\pi}{h}}\\left(\\frac{a\\lambda}{2}\\left(e^{i(m-1)h\\xi}\\hat{v}^{n}(\\xi)-e^{i(m+1)h\\xi}\\hat{v}^{n}(\\xi)\\right)+e^{imh\\xi}\\hat{v}^{n}(\\xi)\\right)d\\xi. $

Since Fourier transform is unique, writing $ {\\theta=h\\xi\\in\[-\\pi,\\pi\]}$, we conclude a relation  

$ \\displaystyle \\hat{v}^{n+1}=\\left(\\frac{a\\lambda}{2}\\left(e^{-i\\theta}-e^{i\\theta}\\right)+1\\right)\\hat{v}^{n}=\\left(1-ia\\lambda sin(\\theta)\\right)\\hat{v}^{n}. $

The quantity $ {g}$ such that[](https://www.blogger.com/null)  

[$ \\displaystyle \\hat{v}^{n+1}(\\xi)=g(\\theta)\\hat{v}^{n}(\\xi) \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)is called the *amplification factor* of the scheme. In general, a finite difference scheme $ {P\_{k,h}v=0}$ can be seen as a linear relation with variables at the $ {n+1}$ time level of interest. There may be a number of terms of the same time level but at different spatial positions, making it difficult to analyse. Applying the Fourier transform, the spatial variables are turned into multipliers, so that at the same frequency level, we obtain a simpler relation between the fourier transforms of different time levels. This relation will thus always be a difference equation, so in practice, we often make the substitution  

$ \\displaystyle v\_{m}^{n}=g^{n}e^{im\\theta} $

(here we are doing the eigendecomposition of the linear system!) to directly get to the characteristic polynomials. The roots of the characteristic polynomial thus gives the $ {g(\\theta)}$'s, note that there are multiple amplification factors for multistep schemes! So what do these amplification factors tell us? Recall that the solution of the one way wave equation can be written in terms of Fourier inversion formula  

$ \\displaystyle u(t+x)=\\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\infty}^{\\infty}e^{i\\omega x}e^{-i\\omega at}\\hat{u}\_{0}(\\omega)d\\omega=\\frac{1}{\\sqrt{2\\pi}}\\int\_{-\\infty}^{\\infty}e^{i\\omega x}\\hat{u}(t,\\omega)d\\omega. $

Thus we have a relation similar to ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)):  

$ \\displaystyle \\hat{u}(t+k,\\omega)=e^{-i\\omega ak}\\hat{u}(t,\\omega). $

So ideally, the solution is stable (since $ {|e^{-i\\omega ak}|=1}$), and all frequency components propagate at the same speed $ {a}$ (since $ {e^{-i\\omega a\\Delta t}e^{i\\omega x}=e^{i\\omega(x-a\\Delta t)}}$ so the wave with freqeuncy $ {\\omega}$ is shifted by $ {a\\Delta t}$ for all $ {\\omega}$). We would thus expect $ {g(\\theta)}$ to be an approximation of $ {e^{-i\\omega ak}}$. Taking the polar decomposition, we shall write analogously  

$ \\displaystyle g(\\theta)=|g(\\theta)|e^{-i\\xi\\alpha(\\theta)k} $

for some $ {\\alpha(\\theta):\[-\\pi,\\pi\]\\rightarrow\\mathbb{R}}$, called the *phase speed*. The difference $ {a-\\alpha(\\theta)}$ is called the *phase error*, and the phenomenon of waves of different frequencies propagating at different speeds is called *dispersion*. One way to measure dispersion is to use  

$ \\displaystyle \\tan(\\theta\\alpha(\\theta)\\lambda)=-\\frac{\\text{Im}g(\\theta)}{\\text{Re}g(\\theta)}. $

The modulus of $ {g}$ tells us the amplification of the solution in each frequency. To get the stability of the scheme, it suffices to have $ {|g|}$ reasonably bounded. An application of Parseval's identity shows:  

> **Theorem 5** *If the characteristic polynomial $ {\\Phi(g,\\theta)}$ is independent of $ {h,k}$, then the finite diffrence scheme is stable if and only of all its roots $ {g\_{\\nu}(\\theta)}$ satisfy:*  
> 
> *-   $ {|g\_{\\nu}(\\theta)|\\leq1}$,
> -   $ {|g\_{\\nu}(\\theta)|=1}$ implies $ {g\_{\\nu}(\\theta)}$ is a simple root.*

Immediately, we see that the Backward-time Central-space scheme is not stable, since  

$ \\displaystyle |g(\\theta)|^{2}=1+\\left(a\\lambda\\sin(\\theta)\\right)^{2}>1 $

except when $ {\\theta=0}$. In fact, this is a result of consistency of the scheme.  

> **Example 1** *(Lax-Wendroff scheme) Recall that the scheme is*  
> 
> *$ \\displaystyle \\frac{v\_{m}^{n+1}-v\_{m}^{n}}{k}+a\\frac{v\_{m+1}^{n}-v\_{m-1}^{n}}{2h}-\\frac{a^{2}k}{2}\\cdot\\frac{v\_{m+1}^{n}-2v\_{m}^{n}+v\_{m-1}^{n}}{h^{2}}=0 $*
> 
> *By substituting $ {v\_{m}^{n}=g^{n}e^{im\\theta}}$, we find that*  
> 
> *$ \\displaystyle g(\\theta)=1-2a^{2}\\lambda^{2}\\sin^{2}(\\frac{\\theta}{2})-ia\\lambda\\sin(\\theta). $*
> 
> *Thus $ {|g(\\theta)|^{2}=1-4a^{2}\\lambda^{2}(1-a^{2}\\lambda^{2})\\sin^{4}(\\frac{\\theta}{2})}$. Because of the exponent $ {4}$ in the $ {\\sin(\\frac{\\theta}{2})}$ term, we say the scheme is *dissipative of order 4*. And the scheme is stable if and only if $ {|a\\lambda|\\leq1}$.*

There is a more complicated version for which $ {\\Phi}$ depends on $ {h}$ and $ {k}$, the spirit is similar and we omit the details here. We shall however sketch how to find the condition for a polynomial's roots lie in the closed unit disk $ {\\overline{D}}$.  

We call $ {\\varphi}$ *Schur* if all its roots lie in the open unit disk $ {D}$, *von Neumann polynomial* if all roots lie in $ {\\overline{D}}$, *simple von Neumann* if it is von Neuamnn and all roots on $ {\\partial D=S^{1}}$ are simple.  

We know that $ {\\varphi\_{d}(z)=a\_{d}z^{d}+\\cdots a\_{1}z+a\_{0}}$, $ {a\_{d}\\neq0}$ has $ {n}$ roots in the complex plane - there is a big open disk that contain all its zeros. By scaling the variable $ {z}$, we can make them to be lying in the unit disk - or even not very different from $ {a\_{d}z^{d}}$! This suggest if the polynomial is Schur, its leading coeffcient should be large. Indeed, we have the following inductive way of checking this property. Define the *reciprocal polynomial* of $ {\\varphi}$ by  

$ \\displaystyle \\varphi^{\*}(z)=z^{d}\\overline{\\varphi(\\bar{z}^{-1})}, $

which has roots that are inverse conjugate of those of $ {\\varphi}$. A $ {d-1}$ degree polynomial can be obtained by  

$ \\displaystyle \\varphi\_{d-1}(z)=\\frac{\\varphi^{\*}(0)\\varphi(z)-\\varphi^{\*}(z)\\varphi(0)}{z}. $

> **Theorem 6** *$ {\\varphi\_{d}}$ is Schur if and only if $ {\\varphi\_{d-1}}$ is of degree $ {d-1}$ and Schur, and $ {|\\varphi(0)|<|\\varphi^{\*}(0)|}$, i.e. $ {|a\_{d}|>|a\_{0}|}$.*

This follows from a result of Rouché saying that the number of roots in $ {D}$ remains stable if the polynomial is not purturbed too much, and the condition is given on the polynomials' values on the boundary, but the modulus of the values of $ {\\varphi}$, $ {\\varphi^{\*}}$on the boundary are the same!  

By noticing that a von Neumann polynomial can be written as a product of a Schur polynomial and a polynomial with roots on $ {S^{1}}$, and that roots on $ {S^{1}}$ are fixed under taking the reciprocal, one can show  

> **Theorem 7** *$ {\\varphi\_{d}}$ is a simple von Neumann if and only if either*  
> 
> *-   $ {|\\varphi\_{d}(0)|<|\\varphi\_{d}^{\*}(0)|}$ and $ {\\varphi\_{d-1}}$ is simple von Neumann, or
> -   $ {\\varphi\_{d-1}}$ is zero and $ {\\varphi'\_{d}}$ is Schur.*

That there are multiple amplication factors gives rise to some issues that need to be cautioned. For example, in Leap frog scheme, there are two amplification factors, one such that $ {g\_{+}(0)=1}$ and the other one $ {g\_{-}(0)=-1}$. The second one is inconsistent with the PDE, and is the subject to *parasitic modes*, namely some high freqeuncy component travels in the wrong direction. To remedy, it is desirable to add dissipation to the scheme.  

We now turn to analysis of accuracy of the scheme. Of course, one could directly use the definition, with the error analysis based on Taylor expansion. For example, the forward difference operator is fisrt order accurate, as we saw in the discussion of Euler's method in the beginning.  

One can derive higher order accurate schemes by performing formal manipulation of various operators - known as *difference calculus*. For example, by Taylor expansion, we find the central difference operator has the estimate  

$ \\displaystyle \\delta\_{0}u=\\frac{du}{dx}+\\frac{h^{2}}{6}\\frac{d^{3}u}{dx^{3}}+O(h^{4})=\\left(1+\\frac{h^{2}}{6}\\frac{d^{2}u}{dx^{2}}\\right)\\frac{du}{dx}+O(h^{4}) $

and the central second difference operator $ {\\delta^{2}=\\delta\_{+}\\delta\_{-}}$ formally has the estimate  

$ \\displaystyle \\delta^{2}u=\\frac{d^{2}u}{dx^{2}}+O(h^{4}). $

We may check the estimate  

$ \\displaystyle \\delta\_{0}u=(1+\\frac{h^{2}}{6}\\delta^{2})\\frac{du}{dx}+O(h^{4}) $

holds. So formally, we may write  

$ \\displaystyle \\frac{du}{dx}=(1+\\frac{h^{2}}{6}\\delta^{2})^{-1}\\delta\_{0}u+O(h^{4}) $

where then $ {{\\displaystyle (1+\\frac{h^{2}}{6}\\delta^{2})^{-1}\\delta\_{0}}}$ as an operator has order of accuracy $ {4}$! Though it need to be interpreted as acting on the RHS, namely  

$ \\displaystyle (1+\\frac{h^{2}}{6}\\delta^{2})^{-1}\\delta\_{0}v\_{m}=f\_{m}\\iff\\delta\_{0}v\_{m}=(1+\\frac{h^{2}}{6}\\delta^{2})f\_{m}. $

Sometimes to check the accuracy, instead of expanding $ {\\phi}$ into (if not too many) cumbersome terms, one can also simplify the analysis by only focusing on the *eigenfunctions*, thanks to the theory of Fourier transform.  

> **Definition 8** *(Symbols) The *symbol* $ {p\_{k,h}(s,\\xi)}$ of the difference operator $ {P\_{k,h}}$ is defined by*  
> 
> *$ \\displaystyle P\_{k,h}(e^{skn}e^{imh\\xi})=p\_{k,h}(s,\\xi)e^{skn}e^{imh\\xi}. $*
> 
> *The *symbol* of the differential operator $ {P}$ is defined by*  
> 
> *$ \\displaystyle P(e^{st}e^{i\\xi x})=p(s,\\xi)e^{skn}e^{i\\xi x}. $*

> **Theorem 9** *(Accuracy) A scheme $ {P\_{k,h}v=R\_{k,h}f}$ is accurate of order $ {(p,q)}$ if and only if for all $ {s,\\xi}$,*  
> 
> *$ \\displaystyle p\_{k,h}(s,\\xi)-r\_{k,h}(s,\\xi)p(s,\\xi)=O(k^{p}+h^{q}). $*
> 
> *If the scheme is for homogeneous equations, then it is accurate of order $ {(p,q)}$ if*  
> 
> *$ \\displaystyle p\_{k,h}(s,\\xi)\\equiv O(k^{p}+h^{q})\\mod p(s,\\xi). $*
