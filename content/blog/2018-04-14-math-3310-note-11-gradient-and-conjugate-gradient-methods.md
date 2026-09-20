---
id: 2018-04-14-math-3310-note-11-gradient-and-conjugate-gradient-methods
title: "MATH 3310 Note 11: Gradient and conjugate gradient methods"
date: 2018-04-14
tags: ["cuhk.math3310", "linear algebra", "numerical methods", "optimization", "teaching"]
source: https://sylqiu.blogspot.com/2018/04/math-3310-note-11-gradient-and.html
publish: true
---
**1\. The steepest descent**

Solving a linear system  

$ \\displaystyle B{\\bf x}={\\bf c} $

can be recast as a optimization problem[](https://www.blogger.com/null)  

[$ \\displaystyle \\min\_{{\\bf x}\\in\\mathbb{R}^{n}}f({\\bf x})=\\|B{\\bf x}-{\\bf c}\\|^{2}. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)One easily sees that a necessary condition for the optimum is  

$ \\displaystyle B^{T}B{\\bf x}=B^{T}{\\bf c}. $

This is a *normal equation*, and is equivalent to the original equation if $ {B}$ is square and invertible (although the condition number of $ {B^{T}B}$ becomes worse, and it requires twice the time to compute the matrix vector product). It is also possible for $ {B}$ to only have linear independent columns (so there are more rows than columns), giving the least square solution we have seen.  
So we are interested in linear systems of the form  

$ \\displaystyle A{\\bf x}={\\bf b} $

where $ {A\\in\\mathbb{R}^{n\\times n}}$ is symmetric positive definite (SPD).  
One simple way to optimize ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) is a greedy algorithm. Suppose we are at $ {{\\bf x}^{(k)}}$. We want to go for the best direction $ {{\\bf p}^{(k)}}$ using only the *local information* of the objective function $ {f}$. This will require some smoothness assumption on $ {f}$, so that for small fixed step sizes $ {\\alpha}$, the choice $ {{\\bf p}^{(k)}}$ always win over all other directions (unless we are already at the optimum). Fortunately, this direction is quite easy to find.  

> **Exercise 1** *(Steepest descent direction) Suppose ${f:\\mathbb{R}^{n}\\rightarrow\\mathbb{R}}$ is differentiable and let $ {\\varphi(t)=f({\\bf x}+t{\\bf y})}$. Show that*  
> 
> *$ \\displaystyle -\\nabla f(x)=\\arg\\min\_{\\underset{\\|y\\|=1}{{\\bf y}\\in\\mathbb{R}^{n}}}\\varphi'(0)=\\nabla f(x)^{T}{\\bf {\\bf y}}. $*

We are thus led to the update formula  

$ \\displaystyle {\\bf x}^{(k+1)}={\\bf x}^{(k)}+\\alpha{\\bf p}^{(k)},\\quad\\alpha>0\\text{ small} $

This is known as the **gradient descent** algorithm. The step size requires a choice, and it is natural to find $ {\\alpha^{\*}}$ that gives the best result. This is a one dimensional problem, and when the objective function is in simple form such as ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), we have a closed form formula. Otherwise, it is find by a search algorithm.  

> **Exercise 2** *(Optimal step size) Show that*  
> 
> *$ \\displaystyle \\alpha\_{k}^{\*}=-\\frac{(A{\\bf x}^{(k)}-{\\bf b})^{T}{\\bf p}\_{k}}{{\\bf p}^{(k)T}A{\\bf p}^{(k)}} $*
> 
> *where*  
> 
> *$ \\displaystyle \\alpha\_{k}^{\*}=\\arg\\min\_{\\alpha>0}f({\\bf x}^{(k)}+\\alpha{\\bf p}^{(k)}). $*

Gradient descent and its variants can be applied to quite general objective functions (even differentiablity can be somewhat relaxed), and is thus widely used in practice. But when the objective function is quadratic as in ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)), there is a lot of room for improvement. We shall next turn to the most widely used method for solving SPD linear system.  

**2\. The conjugate gradient algorithm**

The conjugate gradient method for a positive definite quadratic optimization problem (equivalently solving normal equations) is very special -- it hits the *exact solution* in at most $ {n}$ steps! (Only in theory, though, in practice there is the devil of round-off errors). This dramatically distinguishes itself from other iterative schemes for linear system, which almost never give the exact solution but very good approximation of it. Conjugate gradient is a *semi-direct* method, in that it is almost a direct method like Gaussian elimination which yields the exact solution in finite number of steps, but more importantly one can also stop earlier and get an approximated solution as well.  

Let's go to an example to motivate the ideas, where things are quite direct. We restrict our attention on the SPD tridiagonal system first  

$ \\displaystyle T{\\bf y}={\\bf f} $

where  

$ \\displaystyle T=\\begin{pmatrix}d\_{1} & u\_{1}\\\\ u\_{1} & d\_{2} & u\_{2}\\\\ & \\ddots & \\ddots & \\ddots\\\\ & & u\_{n-2} & d\_{n-1} & u\_{n-1}\\\\ & & & u\_{n-1} & d\_{n} \\end{pmatrix},\\quad{\\bf f}=\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0\\\\ \\vdots\\\\ \\\\ 0 \\end{pmatrix}. $

The choice of $ {{\\bf f}}$ is not important.  
We could solve for the $ {{\\bf y}}$ directly, but that misses the point of conjugate gradient. The idea now is that in each step, we only use a principle submatrix of $ {T}$ to solve for the iterate $ {{\\bf y}^{(k)}}$. In the first step, we have  

$ \\displaystyle d\_{1}y\_{1}^{(1)}=\\|{\\bf b}\\|,\\quad{\\bf y}^{(1)}=\\begin{pmatrix}y\_{1}^{(1)}\\\\ 0\\\\ \\vdots\\\\ 0 \\end{pmatrix} $

in the second step,  

$ \\displaystyle \\begin{pmatrix}d\_{1} & u\_{1}\\\\ u\_{1} & d\_{2} \\end{pmatrix}\\begin{pmatrix}y\_{1}^{(2)}\\\\ y\_{2}^{(2)} \\end{pmatrix}=\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0 \\end{pmatrix},\\quad{\\bf y}^{(2)}=\\begin{pmatrix}y\_{1}^{(2)}\\\\ y\_{2}^{(2)}\\\\ 0\\\\ \\vdots\\\\ 0 \\end{pmatrix} $

and in the third step,  

$ \\displaystyle \\begin{pmatrix}d\_{1} & u\_{1} & 0\\\\ u\_{1} & d\_{2} & u\_{2}\\\\ 0 & u\_{2} & d\_{3} \\end{pmatrix}\\begin{pmatrix}y\_{1}^{(3)}\\\\ y\_{2}^{(3)}\\\\ y\_{3}^{(3)} \\end{pmatrix}=\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0\\\\ 0 \\end{pmatrix},\\quad{\\bf y}^{(3)}=\\begin{pmatrix}y\_{1}^{(3)}\\\\ y\_{2}^{(3)}\\\\ y\_{3}^{(3)}\\\\ 0\\\\ \\vdots\\\\ 0 \\end{pmatrix} $

and so on. We would like to relate $ {{\\bf y}^{(k+1)}}$ to the previous $ {{\\bf y}^{(k)}}$, and it is the basic step of the conjugate gradient method.  

> **Remark 1** *Several remarks are in order.*  
> 
> *-   By definition, the exact solution $ {{\\bf y}={\\bf y}^{(n)}}$ is reached in at most $ {n}$ steps.
> -   Each $ {{\\bf y}^{(k)}}$ is the "least square'' choice among all vectors whose last $ {n-k}$ components are zero. In other words,
>     
>     $ \\displaystyle {\\bf y}^{(k)}=\\arg\\min\_{\\underset{y\_{i}=0\\,\\forall i>k}{{\\bf y}\\in\\mathbb{R}^{n}}}\\frac{1}{2}{\\bf y}^{T}T{\\bf y}-{\\bf f}^{T}{\\bf y}. $
>     
> -   The direction of change $ {{\\bf y}^{(k+1)}-{\\bf y}^{(k)}}$ is "$ {T}$-conjugate'' to all previous and later directions:
>     
>     $ \\displaystyle ({\\bf y}^{(k+1)}-{\\bf y}^{(k)})^{T}T({\\bf y}^{(j+1)}-{\\bf y}^{(j)})=0\\quad j\\neq k. $
>     
> -   The residuals $ {{\\bf r}^{(k)}=T{\\bf y}^{(k)}-{\\bf f}}$ from each step are orthogonal to each other
>     
>     $ \\displaystyle {\\bf r}^{(k)T}{\\bf r}^{(j)}=0\\quad j\\neq k. $
>     *

The third remark is not trivial and requires a proof. By symmetry of $ {T}$, it suffices to prove the statement for $ {j>k}$. We compare the entries of the vectors $ {{\\bf y}^{(k+1)}-{\\bf y}^{(k)}}$ and $ {T({\\bf y}^{(j+1)}-{\\bf y}^{(j)})}$. The vector $ {{\\bf y}^{(k+1)}-{\\bf y}^{(k)}}$ is nonzero only at the first $ {k+1}$ entries. As for the other vector, we observe that  

$ \\displaystyle T{\\bf y}^{(j)}=\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0\\\\ \\vdots\\\\ 0\\\\ f\_{j+1}^{(j)}\\\\ 0\\\\ \\vdots \\end{pmatrix}, $

and so  

$ \\displaystyle T({\\bf y}^{(j+1)}-{\\bf y}^{(j)})=\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0\\\\ \\vdots\\\\ 0\\\\ 0\\\\ f\_{j+2}^{(j+1)}\\\\ \\vdots \\end{pmatrix}-\\begin{pmatrix}\\|{\\bf b}\\|\\\\ 0\\\\ \\vdots\\\\ 0\\\\ f\_{j+1}^{(j)}\\\\ 0\\\\ \\vdots \\end{pmatrix}=\\begin{pmatrix}0\\\\ 0\\\\ \\vdots\\\\ 0\\\\\* \\\\\* \\\\ 0\\\\ \\vdots \\end{pmatrix} $

is nonzero only at the $ {(j+1)}$ and $ {(j+2)}$-th entries. We see that the nonzero entries of the two vectors don't overlap, hence the remark is proved. By the way, we also see that the nonzero entries of $ {T{\\bf y}^{(k)}-{\\bf f}}$ and $ {T{\\bf y}^{(j)}-{\\bf f}}$ does not overlap, so they are orthogonal as well, proving the last remark.  
It turns out the above method can be extended to all SPD matrices as well, by *tridiagonalizing* the SPD matrices. There is a general technique that applies to all such matrices. We won't need to go into the full theory here. But the point is that the technique involves orthogonalizing the set of vectors produced by the matrix powers  

$ \\displaystyle \\begin{pmatrix}{\\bf b} & A{\\bf b} & A^{2}{\\bf b} & \\cdots & A^{n-1}{\\bf b}\\end{pmatrix}. $

This leads us to the *Krylov subspace method*.  

> **Definition 1** A sequence of nested subspaces ${\\mathcal{K}\_{0}\\subset\\mathcal{K}\_{1}\\subset\\cdots}$ is called the *Krylov subspaces* associated to the equation $ {A{\\bf x}={\\bf b}}$ if  
> 
> $ \\displaystyle \\mathcal{K}\_{0}=\\{0\\},\\quad\\mathcal{K}\_{k}=\\text{span}\\{b,Ab,\\dots A^{k-1}b\\}. $
> 
> Note that if $ {\\mathcal{K}\_{k+1}=\\mathcal{K}\_{k}}$ for some ${k}$, then $ {\\mathcal{K}\_{j}=\\mathcal{K}\_{k}}$ for all $ {j>k}$. The sequence of vectors  
> 
> $ \\displaystyle {\\bf x}^{(k)}=\\arg\\min\_{{\\bf x}\\in\\mathcal{K}\_{k}}\\frac{1}{2}{\\bf x}^{T}A{\\bf x}-{\\bf b}^{T}{\\bf x} $
> 
> is called a *Krylov sequence*.

Conjugate gradient is a recursive method for computing the Krylov sequence. One should recognize that the vectors $ {{\\bf y}^{(k)}}$ in the earlier example is a Krylov sequence for the tridiagonal system $ {T{\\bf y}={\\bf f}}$, which follows from the second remark above. The corresponding properties still hold true for a general Krylov sequence. We summerise it here.  

> **Proposition 2** *Using the same notation from above, the following statements hold*  
> 
> *-   The residual $ {{\\bf r}^{(k)}}$ is such that $ {{\\bf r}^{(k)}\\in\\mathcal{K}\_{k}^{\\perp}}$ and $ {{\\bf r}^{(k)}\\in\\mathcal{K}\_{k+1}}$. Hence the residuals form an orthogonal basis of the corresponding Krylov subspaces.
> -   The steps $ {{\\bf d}^{(k)}={\\bf x}^{(k)}-{\\bf x}^{(k-1)}}$ are "$ {A}$-conjugate'' to each other
>     
>     $ \\displaystyle {\\bf d}^{(k)T}A{\\bf d}^{(j)}=0,\\quad j\\neq k. $
>     
>     Hence the steps form an "$ {A}$-conjugate'' basis for the corresponding Krylov subspaces.
> -   We have
>     
>     $ \\displaystyle {\\bf d}^{(k)T}A{\\bf d}^{(k)}={\\bf d}^{(k)T}{\\bf r}^{(k-1)},\\quad\\forall k. $
>     *

From the first and second statements above, we can see that $ {{\\bf d}^{(k)}}$ can be expressed in terms of $ {{\\bf d}^{(1)},\\dots,{\\bf d}^{(k-1)}}$ and $ {{\\bf r}^{(k-1)}}$, since  

$ \\displaystyle {\\bf d}^{(k)}\\in\\mathcal{K}\_{k}=\\text{span}\\{{\\bf d}^{(1)},\\dots,{\\bf d}^{(k-1)},{\\bf r}^{(k-1)}\\}. $

In fact, if we write  

$ \\displaystyle {\\bf p}^{(k)}=\\frac{{\\bf r}^{(k-1)T}{\\bf r}^{(k-1)}}{{\\bf d}^{(k)T}{\\bf r}^{(k-1)}}{\\bf d}^{(k)}, $

then  

$ \\displaystyle {\\bf p}^{(k)}=-{\\bf r}^{(k-1)}-\\frac{{\\bf p}^{(k-1)T}A{\\bf r}^{(k-1)}}{{\\bf p}^{(k-1)T}A{\\bf p}^{(k-1)}}{\\bf p}^{(k-1)}, $

which is the most important step of updating the direction in the conjugate gradient algorithm.  
As a final remark, we mention that conjugate gradient converges fast if the matrix is well-conditioned, that means the eigenvalues of $ {A}$ cluster in the small region. In particular, repeated eigenvalues leads to exact solution in less than $ {n}$ steps. Hence it is often the case in practice that the matrix $ {A}$ has to be preconditioned. For more about this, you can refer to the notes by Prof. Vandenbergh [here](http://www.seas.ucla.edu/~vandenbe/236C/lectures/cg.pdf).
