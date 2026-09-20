---
id: 2018-02-10-math3310-note-5-1d-heat-equation-on-the-interval
title: "MATH3310 Note 5: 1D heat equation on the interval $[0,2\\pi]$"
date: 2018-02-10
tags: ["cuhk.math3310", "Fourier analysis", "PDE", "teaching"]
source: https://sylqiu.blogspot.com/2018/02/math3310-note-5-1d-heat-equation-on.html
publish: true
---
In this note we recap and clarify on what we learned about using spectral (Fourier series) method to solve a fundamental constant coefficient linear differential equation with simple initial/boundary conditions:  

-   1D heat equation on $ {\[0,2\\pi\]}$;

In particular, we will stress the role played by the initial/boundary conditions in these problems, a point alluded way back in Note 1. And we shall discuss the connections to the Fourier series. This is an important topic that will appear in midterm so you are suggested to read this note in details and solve all the exercises.  

The equation is  

$ \\displaystyle \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0\\quad(t,x)\\in(0,\\infty)\\times(0,2\\pi). $

Now the differential operator $ {\\frac{\\partial}{\\partial t}-\\frac{\\partial^{2}}{\\partial x^{2}}}$ should come with a boundary condition on  

$ \\displaystyle \\left(\[0,\\infty)\\times\\{0\\}\\right)\\cup\\left(\\{0\\}\\times(0,2\\pi)\\right)\\cup\\left(\[0,\\infty)\\times\\{2\\pi\\}\\right) $

which I would like to call a *parabolic boundary*. First let us consider the **homogeneous Dirichlet initial/boundary value problem**.  

$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0 & (t,x)\\in(0,\\infty)\\times(0,2\\pi)\\\\ u(0,x)=u\_{0}(x) & x\\in(0,2\\pi)\\quad\\text{initial condition}\\\\ u(t,0)=u(t,2\\pi)=0 & t\\in\[0,\\infty)\\quad\\text{boundary condition} \\end{cases} $

You can think of the initial condition is given to the differential operator $ {\\frac{\\partial}{\\partial t}}$ and the boundary condition is given to $ {-\\frac{\\partial^{2}}{\\partial x^{2}}}$.  
Before everything, let us recall the method of **separation of variables**. It is a genius idea to try for the solution which has the form  

$ \\displaystyle u(t,x)=X(x)T(t). $

We shall have a good sense of why this strategy should work later on. To begin we will make some computations.  

> **Exercise 1** *Show that if $ {\\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0}$, and $ {u(t,x)=X(x)T(t)}$, then we can decouple the PDE into two *eigenvalue problems**  
> 
> *$ \\displaystyle \\begin{cases} \\frac{dT}{dt}=\\lambda T\\\\ \\frac{d^{2}X}{dx^{2}}=\\lambda X \\end{cases} $*
> 
> *where $ {\\lambda\\in\\mathbb{C}}$ is a constant.*

We first look at the second order ODE above.  

> **Exercise 2** *Consider the equation*  
> 
> *$ \\displaystyle \\frac{d^{2}X}{dx^{2}}=\\lambda X $*
> 
> *with boundary condition*  
> 
> *$ \\displaystyle X(0)=X(2\\pi)=0. $*
> 
> *Show that*  
> 
> *-   $ {\\lambda\\in\\mathbb{R}}$. (Hint: the differential operator is self-adjoint).
> -   if $ {\\lambda>0}$, then the only solution satisfies the boundary condition is the trivial solution $ {X(x)=0}$.
> -   if $ {\\lambda=0}$, then the only solution satisfies the boundary condition is the trivial solution $ {X(x)=0}$.
> -   if $ {\\lambda<0}$, then the solution is of the form $ {C\\cdot\\sin(\\sqrt{-\\lambda}x)}$ for some constant $ {C}$, where $ {2\\sqrt{-\\lambda}=n}$ must be a positive integer.*

Now let us turn to the other differential equation. From the above exercise we know that $ {\\lambda=-\\frac{n^{2}}{4}}$ for some non-negative integer $ {n}$. It is a simple exercise to show that the solution is  

$ \\displaystyle T(t)=C'e^{-n^{2}t/4}, $

for some constant $ {C'}$ depending on the initial condition. Hence we get  

$ \\displaystyle u(t,x)=Ae^{-n^{2}t/4}\\sin(\\frac{nx}{2}) $

which corresponds to the initial condition $ {u\_{0}=A\\cdot\\sin(\\frac{nx}{2})}$.  

> **Exercise 3** *(Principle of superposition) Verify that if $ {n,m\\in\\mathbb{Z}}$ and $ {n,m>0}$, and*  
> 
> *$ \\displaystyle \\begin{array}{rcl} u\_{n}(t,x) & = & A\_{1}e^{-n^{2}t/4}\\sin(\\frac{nx}{2})\\\\ u\_{m}(t,x) & = & A\_{2}e^{-m^{2}t/4}\\sin(\\frac{mx}{2}) \\end{array} $*
> 
> *then $ {u=u\_{n}+u\_{m}}$ also satisfy $ {\\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0}$, $ {u(0)=u(2\\pi)=0}$.*

We are now led to the ansatz that the general solution to the PDE $ {\\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0}$ with the homogeneous Dirichlet boundary condition is of the form[](https://www.blogger.com/null)  

[$ \\displaystyle \\sum\_{n=1}^{\\infty}A\_{n}e^{-n^{2}t/4}\\sin(\\frac{nx}{2}) \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where the constants $ {\\{A\_{n}\\}\_{n=1}^{\\infty}}$ will be determined from the initial condition $ {u(0,x)=u\_{0}(x)}$. More precisely, we have  

> **Exercise 4** *[](https://www.blogger.com/null)Following the above notation, show that*  
> 
> *$ \\displaystyle A\_{n}=\\frac{1}{\\pi}\\int\_{\[0,2\\pi\]}u\_{0}(x)\\sin(\\frac{nx}{2})dx. $*
> 
> *(Hint: use the orthogonality of the family of functions $ {\\{\\sin(\\frac{nx}{2})\\}\_{n=1}^{\\infty}}$.)*

Using what is developed above, you can quickly solve the following more concrete problem.  

> **Exercise 5** *Solve the following initial/boundary value problem*  
> 
> *$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0 & (t,x)\\in(0,\\infty)\\times(0,2\\pi)\\\\ u(0,x)=20 & x\\in(0,2\\pi)\\quad\\text{initial condition}\\\\ u(t,0)=u(t,2\\pi)=0 & t\\in\[0,\\infty)\\quad\\text{boundary condition} \\end{cases} $*

I plotted an approximate solution of the above problem from time $t=0$ to time $t=10$ below  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHM99AllMUbeGQXqLwhbeNcbW27mndA7MoTJznzdJrpxn7NdoIMzcvqiF9u8PLWlCc3-sOgL2eG5ZfjNKm1pr3C3-uRxWpi9ZaCFFts-Mx5QkA1xs2xOhfLDCPz6dpGjf3robJN2lIG80/s320/heat_soln.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHM99AllMUbeGQXqLwhbeNcbW27mndA7MoTJznzdJrpxn7NdoIMzcvqiF9u8PLWlCc3-sOgL2eG5ZfjNKm1pr3C3-uRxWpi9ZaCFFts-Mx5QkA1xs2xOhfLDCPz6dpGjf3robJN2lIG80/s1600/heat_soln.jpg)

Notice that the above solution tends to zero when time goes to infinity. You can explore more on your own, I provide my Matlab code below.

```
A = linspace(0,2*pi,100);
figure; hold on;
T = linspace(0,10,50);
for i = 1:1000
    t = T(i);
    fA = heatsol(A,t);
    plot(A,fA);
    drawnow; pause(0.01);
end

function fA = heatsol(A,t)
f = @(x) 0;
for n = 1:2000
   f = @(x) f(x) + (40*(1-(-1)^n)/(n*pi))*sin(n*x/2)*exp((-n^2/4)*t);
end
fA = f(A);
end
```

Now let me make some explanation about the ansatz ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) we made.  

-   The family of functions $ {\\{\\sin(\\frac{nx}{2})\\}\_{n=1}^{\\infty}}$ is the set of (nontrivial) eigenfunctions of the differential operator $ {-\\frac{\\partial^{2}}{\\partial x^{2}}}$ and the homogeneous boundary condition $ {u(0)=u(2\\pi)=0}$, each corresponds to the eigenvalue $ {\\frac{n^{2}}{4}}$. That $ {-\\frac{\\partial^{2}}{\\partial x^{2}}}$ is linear, self-adjoint and positive semi-definite under the Hermite inner product implies that the eigenfunctions are orthogonal, with nonnegative eigenvalues;
-   The family of functions $ {\\{\\sin(\\frac{nx}{2})\\}\_{n=1}^{\\infty}}$ in fact can be considered as a basis of the vector space

    $ \\displaystyle \\{f\\;|\\;f:\[0,2\\pi\]\\rightarrow\\mathbb{C}\\text{ is square-integrable, with }f(0)=f(2\\pi)=0\\} $

    so that in some appropriate sense,[

    $ \\displaystyle u\_{0}(x)=\\sum\_{n=1}^{\\infty}A\_{n}\\sin(\\frac{nx}{2}) \\ \\ \\ \\ \\ (2)$

    ](https://www.blogger.com/null)with $ {A\_{n}}$ given in Exercise [4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exerAn).
-   Having the above expression for $ {u\_{0}(x)}$ under the eigen-basis $ {\\{\\sin(\\frac{nx}{2})\\}\_{n=1}^{\\infty}}$, we can then study the evolution of each independent orthogonal component under the heat equation. This leads back to the technique of separation of variables.

How do we make a connection of the above problem to the Fourier series? It might be a little confusing about the formula ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) since the Fourier series of  

$ \\displaystyle u\_{0}(x)=\\begin{cases} 20 & 0<x<2\\pi\\\\ 0 & x=0,2\\pi \\end{cases} $

should be just $ {20}$, with no other terms. Indeed, modifying the function on a finite number of points does not affect the computation of Fourier coefficient. The key point is that the Fourier series can NOT be applied to the above problem directly, because of the boundary condition. We shall see below that Fourier series can only take care of **periodic boundary conditions**. But there is actually some relation to the Fourier series! To understand this we must make a connection of the above homogenous boundary condition to the periodic boundary condition. Looking at the formula ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), and recall that the Fourier series contains only sine terms if and only if the function is odd. This inspires us to look at the *odd extension* of the function $ {u\_{0}}$ into $ {\[-2\\pi,2\\pi\]}$  

$ \\displaystyle \\tilde{u}\_{0}(x)=\\begin{cases} u\_{0}(x) & x\\in(0,2\\pi\]\\\\ 0 & x=0\\\\ -u\_{0}(-x) & x\\in\[-2\\pi,0) \\end{cases} $

So in some sense the homogeneous Dirichlet boundary value problem on $ {\[0,2\\pi\]}$ is one half of the periodic boundary value problem on $ {\[-2\\pi,2\\pi\]}$ (or equivalently the problem on a circle with radius $ {2}$). Finally, we give corresponding exercises on the homogeneous Neumann initial/boundary value problem and periodic boundary value problem.  

> **Exercise 6** *Consider the problem*  
> 
> *$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0 & (t,x)\\in(0,\\infty)\\times(0,2\\pi)\\\\ u(0,x)=u\_{0}(x) & x\\in(0,2\\pi)\\quad\\text{initial condition}\\\\ \\frac{\\partial u}{\\partial x}(t,0)=\\frac{\\partial u}{\\partial x}(t,2\\pi)=0 & t\\in\[0,\\infty)\\quad\\text{boundary condition} \\end{cases}. $*
> 
> *Using separation of variables, and mimic the argument for the Dirichlet boundary condition, show that the solution of the problem takes the form*  
> 
> *$ \\displaystyle \\sum\_{n=0}^{\\infty}B\_{n}e^{-n^{2}t/4}\\cos(\\frac{nx}{2}) $*
> 
> *where*  
> 
> *$ \\displaystyle B\_{n}=\\begin{cases} \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)dx & n=0\\\\ \\frac{1}{\\pi}\\int\_{\[0,2\\pi\]}f(x)\\cos(\\frac{nx}{2})dx & n=1,2,3\\dots \\end{cases} $*

> **Exercise 7** *Consider the problem*  
> 
> *$ \\displaystyle \\begin{cases} \\frac{\\partial u}{\\partial t}-\\frac{\\partial^{2}u}{\\partial x^{2}}=0 & (t,x)\\in(0,\\infty)\\times(0,2\\pi)\\\\ u(0,x)=u\_{0}(x) & x\\in(0,2\\pi)\\quad\\text{initial condition}\\\\ \\frac{\\partial u}{\\partial x}(t,0)=\\frac{\\partial u}{\\partial x}(t,2\\pi),\\text{ and }u(t,0)=u(t,2\\pi) & t\\in\[0,\\infty)\\quad\\text{boundary condition} \\end{cases}. $*
> 
> *Using separation of variables, and mimic the argument for the Dirichlet boundary condition, show that the solution of the problem takes the form*  
> 
> *$ \\displaystyle B\_{0}+\\sum\_{n=1}^{\\infty}A\_{n}e^{-n^{2}t}\\sin(nx)+\\sum\_{n=1}^{\\infty}B\_{n}e^{-n^{2}t}\\cos(nx) $*
> 
> *where*  
> 
> *$ \\displaystyle A\_{n}=\\frac{1}{\\pi}\\int\_{\[0,2\\pi\]}u\_{0}(x)\\sin(nx)dx, $*
> 
> *and*  
> 
> *$ \\displaystyle B\_{n}=\\begin{cases} \\frac{1}{2\\pi}\\int\_{\[0,2\\pi\]}f(x)dx & n=0\\\\ \\frac{1}{\\pi}\\int\_{\[0,2\\pi\]}f(x)\\cos(nx)dx & n=1,2,3\\dots \\end{cases} $*
