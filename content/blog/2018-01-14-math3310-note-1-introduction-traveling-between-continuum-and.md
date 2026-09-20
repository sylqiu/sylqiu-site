---
id: 2018-01-14-math3310-note-1-introduction-traveling-between-continuum-and
title: "MATH3310 Note 1: Introduction: traveling between continuum and discretum"
date: 2018-01-14
tags: ["cuhk.math3310", "teaching"]
source: https://sylqiu.blogspot.com/2018/01/math3310-tutorial-1.html
publish: true
---
**1\. Analogies between continuum and discretum**

It is always a good practice (in my opinion) as an applied maths student to understand the analogies between continuous formulation of a problem/notion and its discrete version, and to appreciate what underlying these analogies is the same idea and principle. Most freqeuntly, from applied maths point of view this analogy is between the two most important subjects in practice  

$ \\displaystyle \\text{Continuous: Calculus }\\leftrightarrow\\text{ Discrete: Linear algebra} $

So my idea in this section is to build up some general picture and mindset, so that you should find yourself more motivated about the maths in and beyond this course. The material is largely based on Gilbert Strang's *Introduction to applied mathematics*, Chapter 3.1 - 3.3, which is a pleasant reading.  

Let's begin by the simpliest differential equation in 1D. Suppose $ {u:\[0,1\]\\rightarrow\\mathbb{R}}$ and for $ {x\\in(0,1)}$, $ {u}$ satisfies[](https://www.blogger.com/null)  

[$ \\displaystyle \\frac{d}{dx}u(x)=f(x). \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)If $ {f}$ is continuous, then the fundamental theorem of calculus tells us there is a differentiable function $ {F:\[0,1\]\\rightarrow\\mathbb{R}}$ such that any function of the form $ {u=F+C}$, where $ {C}$ is a constant, is a solution. Why should there be a constant? Because the space of constant functions is inside the kernel of the *linear operator* $ {\\frac{d}{dx}}$. You have to tell what you want the solution to be at the initial point $ {u(0)}$ to fix this ambiguity. In other words, you need to give a *boundary/initial condition*. Now that the differential equation with boudary condition can be thought of as a linear equation that goes infinite on one side. For example,  

$ \\displaystyle Au=\\frac{1}{2\\Delta x}\\begin{bmatrix}0 & 1\\\\ -1 & 0 & 1\\\\ & -1 & 0 & 1\\\\ & & & & & \\ddots\\\\ & & & & & & \\ddots \\end{bmatrix}\\begin{bmatrix}u\_{1}\\\\ u\_{2}\\\\ u\_{3}\\\\ \\vdots\\\\ \\\\ \\end{bmatrix}=\\begin{bmatrix}f\_{1}\\\\ f\_{2}\\\\ f\_{3}\\\\ \\vdots\\\\ \\\\ \\end{bmatrix}=f. $

Note that the condition $ {u\_{0}=0}$ is built into the matrix $ {A}$! And you can convince yourself that $ {u\_{i}}$ can be solved to arbitrary $ {i\\in\\mathbb{N}}$ provided the $ {f\_{i}}$'s are all given. Here comes our first slogan  

>  **A differential operator comes with boundary conditions.** 

 The next point I want to make is about taking the transpose of a differential operator. In the above case, it is  

$ \\displaystyle -\\frac{d}{dx}=\\left(\\frac{d}{dx}\\right)^{T}=A^{T} $

(the second equality is due to our clever choice of $ {A}$, though the first equality is really the point). So what does $ {\\left(\\frac{d}{dx}\\right)^{T}}$ mean? The transpose, or *adjoint* of a linear operator is defined via the inner product. In our case it is the operatoin of multiplying two functions and then integrate  

$ \\displaystyle \\langle u,\\varphi\\rangle=\\int\_{\[0,1\]}u(x)\\varphi(x)dx, $

where $ {\\varphi}$ here can be arbitrary differentiable functions. Then by integration by parts  

$ \\displaystyle \\int\_{\[0,1\]}\\frac{du(x)}{dx}\\varphi(x)dx=\\int\_{\[0,1\]}u(x)(-\\frac{d\\varphi(x)}{dx})dx+\[u\\varphi\]\_{0}^{1}. $

Notice this boundary term $ {\[u\\varphi\]\_{0}^{1}=u(1)\\varphi(1)-u(0)\\varphi(0)}$. This will capture the boundary conditions of $ {-\\frac{d}{dx}}$ given the boundary condition of $ {\\frac{d}{dx}}$. *Homogeneous* boundary conditions will have this term to be always zero, *inhomogeneous* boundary conditions are also common and important, so we will try to be general about this.  
 To be more concrete, let's say we have $ {u(0)}$ given to the $ {\\frac{du}{dx}}$. Then the boundary condition of $ {-\\frac{d}{dx}}$ is such that the following identity holds  

$ \\displaystyle \\int\_{\[0,1\]}\\frac{du(x)}{dx}\\varphi(x)dx+u(0)\\varphi(0)=\\int\_{\[0,1\]}u(x)(-\\frac{d\\varphi(x)}{dx})dx+u(1)\\varphi(1), $

hence we see that $ {\\varphi(1)}$ should be given to $ {\\frac{-d\\varphi}{dx}}$ (so that equations e.g. $ {-\\frac{d\\varphi}{dx}=g}$ can be solved), and nothing more. So the equality will always hold. Because the adjoint is different, we will say that the differential operator $ {\\frac{d}{dx}}$ with its boundary condition is NOT *self-adjoint*.  

Now let's look at a slightly more complicated differential equation derived in class, the equilibrium equation of an elastic bar[](https://www.blogger.com/null)  

[$ \\displaystyle -\\frac{d}{dx}(c\\frac{du}{dx})=f. \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and so the differential equation can be regarded as the matrix equation  

$ \\displaystyle A^{T}CAu=f $

where $ {C}$ is a diagonal matrix. Now if we are in finite dimension, $ {C=I}$, we have a very nice matrix $ {A^{T}A}$ which is always positive semidefinite. This will be also true for the differential operator provided we give it the right boundary condition.  
 OK, so what boundary conditions can be given to the differential operator, this time $ {-\\frac{d}{dx}(c\\frac{d}{dx})}$? Again, integrating by part gives  

$ \\displaystyle \\begin{array}{rcl} \\int-\\frac{d}{dx}(c\\frac{du}{dx})\\varphi dx & = & \\int c\\frac{du}{dx}\\frac{d\\varphi}{dx}-\[\\frac{du}{dx}\\varphi\]\_{0}^{1}\\\\ & = & -\\int u\\frac{d}{dx}(c\\frac{d\\varphi}{dx})+\[u\\frac{d\\varphi}{dx}\]\_{0}^{1}-\[\\frac{du}{dx}\\varphi\]\_{0}^{1}. \\end{array} $

You see the same differential operator pops out on the other side! For boundary conditions this time we have some freedom. We can specify :  

-   **Dirichlet boundary condition**. The boundary values, i.e. $ {u(0)}$ and $ {u(1)}$. Then the adjoint operator will also have the boundnary condition of the same type, i.e. $ {\\varphi(0)}$ and $ {\\varphi(1)}$.
-   **Neumann boundary condition**. Two first order derivatives, i.e. $ {\\frac{du}{dx}(0)}$ and $ {\\frac{du}{dx}(1)}$. The adjoint operator will be of the same type, i.e. $ {\\frac{d\\varphi}{dx}(0)}$ and $ {\\frac{d\\varphi}{dx}(1)}$.
-   **Mixed boundary condition**. One boundary value and one first order derivative, i.e. $ {u(0)}$ and $ {\\frac{du}{dx}(1)}$. Again the adjoint operator will be of the same type, i.e. $ {\\varphi(0)}$ and $ {\\frac{d\\varphi}{dx}(1)}$.
-   **Robin boundary condition, etc.**

(of course our knowledge about the solvability of these problems is just like the role played the by fundamental theorem of calculus) In all cases the adjoint differential operator is the same with the original one, and in each case will be called *self-adjoint*. Now let us recall two examples in class.  

> **Example 1** *Solve the differential equaitons*  
> 
> *-   $ {-\\frac{d^{2}}{dx^{2}}u=x^{3}}$ subject to $ {u(0)=u(1)=0}$. For this example a full expression of $ {u(x)}$ has to be obtained before $ {\\frac{du}{dx}}$. This is analogous to the case $ {A}$ is not a square matrix, but $ {A^{T}A}$ is and it's invertible. The equation $ {A^{T}Au=f}$ is solved in once.
> -   $ {-\\frac{d^{2}}{dx^{2}}u=x^{2}+1}$ subject to $ {u(0)=0}$, $ {\\frac{du}{dx}(1)=0}$. For this example we obtained $ {\\frac{du}{dx}}$ first and then solve for $ {u}$. This is analogous to the case $ {A}$ is a square matrix, and it's invertible. The equation $ {A^{T}Au=f}$ is solved in two steps: we got $ {g=\\left(A^{T}\\right)^{-1}f}$ first and then $ {u=A^{-1}g}$.*

This analogy is helpful to get a first understanding about certain equations. For example, you will expect that the equation ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is not so different from the Sturm-Liouville equations  

$ \\displaystyle -\\frac{d}{dx}(p\\frac{du}{dx})+qu=f $

because it is similar to the matrix equation $ {(A^{T}A+qI)u=f}$ which is still self-adjoint. Adding a term of first order derivative in $ {u}$ will be another theory, remember that $ {\\frac{d}{dx}}$ is NOT self-adjoint!  

> **Remark 1** *You might have already seen from the above discussion that boundary conditions, integration by parts and adjoint operators should fit into the same framework , which is more general and is called **variational methods.** A preliminary discussion of this is in the next section, although it will NOT be the focus of our course here. And it is Galerkin to utilize these ideas to convert a continuous problem (differential equations) to a finite-dimensional problem (solving system of linear equations). In later part of this course we will focus on how to solve* *system of linear equations**, instead of the continuous ones.*

**2\. Principle of least action; cubic spline**

The name of this principle comes from physics, and goes by other names like \`\`energy minimization'', or the \`\`minimum principle''. The area where this principle is applied is called \`\`calculus of variations''. The Lagrangian mechanics is built upon this idea. But it is also very useful in applied mathematics whenever the task of interest can be formulated as minimizing certain energy.  
Suppose we are given a energy $ {J(u)}$. We saw an example in class which is the total variation energy. In 1D this is  

$ \\displaystyle \\int|\\frac{du}{dx}(x)|dx $

and in 2D it is  

$ \\displaystyle \\int|\\nabla u|dxdy=\\int\\sqrt{\\left(\\frac{du}{dx}\\right)^{2}+\\left(\\frac{du}{dy}\\right)^{2}}dxdy. $

(in class an $ {\\epsilon>0}$ was slicked in this energy to prevent non-differentiability, and is complemented by a *data fidelity* term, which it is important in applications). And we would like to find a $ {u^{\*}}$ such that it minimizes the energy $ {E(u)}$  

$ \\displaystyle u^{\*}=\\arg\\min\_{u}J(u). $

> **Remark 2** *For a mathematician it will be important to ask over which set the minimization is taken. Here we may settle down with the smooth functions, in any case we will be sloppy about this point since a rigorous dicussion will be out of scope.*

But the idea is really simple, if $ {u^{\*}}$ is at minimum, then $ {u^{\*}+v}$ must make the energy larger for any $ {v}$. This means that the *first variation* of the energy $ {J(u)}$ must vanish. More precisely, let  

$ \\displaystyle G\_{v}(t)=J(u+tv) $

and $ {G\_{v}}$ will attain minimum at $ {t=0}$. This leads to the condition  

$ \\displaystyle \\frac{d}{dt}G\_{v}(t)=0\\quad\\forall v $

just as in the case of a function. And this is ture for any $ {v}$, it can be turned into a \`\`infinitesimal'' condition using integration by parts! This condition is a PDE, called the *Euler equation*, subject to certain boundary constraints. Typically the steps to derive this are  

-   Set $ {0=\\frac{d}{dt}G\_{v}(t)}$ and compute its expression, move all derivatives on $ {v}$ to $ {u}$ by inegration by parts;
-   Use $ {v}$ is compactly supported (so that the boundary term drops out) to get the Euler equation
-   Use $ {v}$ supported around the boundary to decide for the boundary condition.

> **Exercise 1** *What is the Euler equation of the energy*  
> 
> *$ \\displaystyle J(u)=\\frac{1}{2}\\int\_{\[0,1\]}c(x)\\left(\\frac{du}{dx}\\right)^{2}dx-\\int\_{\[0,1\]}fu\\:dx $*
> 
> *with the requirement that $ {u(0)=0}$ ? What are the boundary conditions?*

**Application: cubic spline.** Here we want to talk about an important application of this principle, namely the cubic spline. It is a very common interpolation method, which means that given some data points $ {(x\_{i},y\_{i})}$, $ {i=1,\\dots,n}$, you want to draw a smooth curve that goes through these points exactly once, in a prescribed order.  
Let's focus on the building block that interpolate two points. Assume that this curve is a function  

$ \\displaystyle u:\[0,1\]\\rightarrow\\mathbb{R}. $

The energy is  

$ \\displaystyle J(u)=\\int\_{\[0,1\]}\\left(\\frac{d^{2}u}{dx^{2}}\\right)^{2}dx $

> **Exercise 2** *Show that the Euler equation of the above energy is*  
> 
> *$ \\displaystyle \\frac{d^{4}}{dx^{4}}u=0. $*

This is called the 1D *biharmonic equation*. This equation also has a physical interpretation: it describes to the bending of a long, thin beam.  

> **Exercise 3** *With boundary conditions*  
> 
> *$ \\displaystyle u(0)=a,\\frac{du}{dx}(0)=b,u(1)=c,\\frac{du}{dx}(1)=d $*
> 
> *show that the only cubic polynomial satisfies the 1D biharmonic equation is*  
> 
> *$ \\displaystyle u=a(x-1)^{2}(2x+1)+b(x-1)^{2}x+cx^{2}(3-2x)+dx^{2}(x-1), $*
> 
> *called the *Hermite cubic*.*

Now if both the points are given and the slopes at those points are prescribed, then it is natural to use the above piecewise cubic. But what about only points are given? The idea is that we take the slopes as unknowns but require that the curve's second derivative should match up at those points, and at the start and end points the second derivatives should be zero. And we solve for the slopes.  
Notationally, let $ {u\_{0},\\dots,u\_{n}}$ be the y-coordinates of $ {n+1}$ points to be interpolated. These points are assume to have x-coordinate $ {0,1,\\dots,n}$. Denote the interpolation function to be $ {u:\[0,n\]\\rightarrow\\mathbb{R}}$, and its slope at $ {0,\\dots,n}$ to be $ {s\_{0},\\dots,s\_{n}.}$ Recall that $ {u}$ is piecewisely a Hermite cubic.  

> **Exercise 4** *Check that if $ {\\frac{d^{2}u}{dx}(0)=0}$, then*  
> 
> *$ \\displaystyle 2s\_{0}+s\_{1}=3u\_{1}-3u\_{0}. $*
> 
> *And the continuity of second derivative at $ {x=1}$ implies*  
> 
> *$ \\displaystyle s\_{0}+4s\_{1}+s\_{2}=3u\_{2}-3u\_{0}. $*
> 
> *Using this, write down the linear system that relates $ {s\_{0},\\dots,s\_{n}}$ to $ {u\_{0},\\dots,u\_{n}}$,*
