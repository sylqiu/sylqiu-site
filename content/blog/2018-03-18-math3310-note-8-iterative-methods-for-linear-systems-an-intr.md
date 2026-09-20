---
id: 2018-03-18-math3310-note-8-iterative-methods-for-linear-systems-an-intr
title: "MATH3310 Note 8: Iterative methods for linear systems, an introduction"
date: 2018-03-18
tags: ["cuhk.math3310", "linear algebra", "numerical methods", "teaching"]
source: https://sylqiu.blogspot.com/2018/03/math3310-note-8-iterative-methods-for.html
publish: true
---
The main problem of interest here is to solve a square linear system, which in matrix form reads  

$ \\displaystyle Ax=b,\\quad A\\in\\mathbb{R}^{N\\times N}. $

The type of algorithm that operating directly on the matrix $ {A}$ belongs to the family of *direct methods*. The simple Gaussian elimination (LU decomposition) is one of this kind, and can be used to solve such a system in $ {O(N^{3})}$ time, yielding an *exact solution*. But that is not always preferable, because it is typically time and power consuming when the matrix $ {A}$ is too large and no structural information of $ {A}$ is used in the algorithm. Various improvements of computation complexity in direct methods are possible, but will be a research topic. Here, we will take a look at some simple *indirect methods, or iterative methods*, which try to avoid computation with $ {A}$ as much as possible.  

Generally speaking, one instead deals with the equivalent system  

$ \\displaystyle Mx=(M-A)x+b $

where $ {M}$ has to be designed based on $ {A}$. This can be seen as a *splitting* of $ {A}$  

$ \\displaystyle A=M+(A-M). $

And then we will take the *fixed point iteration*  

$ \\displaystyle Mx^{k+1}=(M-A)x^{k}+b $

since if $ {x^{\*}=A^{-1}b}$, it is a fixed point of the above iteration  

$ \\displaystyle Mx^{\*}=(M-A)x^{\*}+b. $

Whether this iteration converges or not needs to be analysed. To do this, we consider the discrepancy of $ {x^{\*}}$ from the $ {k}$-th iteration  

$ \\displaystyle \\begin{array}{rcl} e^{k+1} & = & x^{\*}-x^{k+1}\\\\ & = & M^{-1}(M-A)(x^{\*}-x^{k})\\\\ & = & M^{-1}(M-A)e^{k}\\\\ & =: & Be^{k}. \\end{array} $

This means the convergence is controled by the powers of the error matrix $ {B}$, and the iteration converges if and only if  

$ \\displaystyle B^{n}\\rightarrow0\\text{ as }n\\rightarrow\\infty. $

> **Exercise 1** [](https://www.blogger.com/null)Show that $ {B^{n}\\rightarrow0}$ if and only if every eigenvalue $ {\\lambda\_{i}}$ of ${B}$ has modulus strictly less than one, i.e.  
> 
> *$ \\displaystyle |\\lambda\_{i}|<1\\quad\\forall i. $*
> 
> (Hint: use the Jordan normal form of $ {B}$.) The largest eigenvalue in modulus governs the rate of convergence, which is called the ***spectral radius,** or **$L^2$ operator norm*** of the matrix $ {B}$.

There are several criteria on what a "good'' $ {M}$ should be:  

-   $ {M}$ is easy to invert.
-   $ {M-A}$ is easy to compute.
-   The matrix $ {B:=M^{-1}(M-A)}$ has spectral radius stricly less than one.

Below the fold let us look at some simple concrete choices of $ {M}$. For this purpose we write  

$ \\displaystyle A=L+D+U $

where $ {L,D,U}$ are the strict lower triangular part, diagonal part and strict upper triangular part of $ {A}$ respectively.  

**1.1. The Jacobi iteration**

This unfortunately is a rather uninformative name. We take  

$ \\displaystyle M=D. $

Hence in order for $ {M}$ to be invertible, the diagonal part of $ {A}$ must be non-zero. We will see that a sufficient condition for the iteration to converge is a condition on the diagonal part of $ {A}$.  

Let us take a small concrete example to see what is going on. Take  

$ \\displaystyle A=\\begin{bmatrix}2 & -1\\\\ -1 & 2 \\end{bmatrix}. $

One Jacobi iteration looks like the following  

$ \\displaystyle \\begin{bmatrix}2\\\\ & 2 \\end{bmatrix}\\begin{bmatrix}x\_{0}^{1}\\\\ x\_{1}^{1} \\end{bmatrix}=\\begin{bmatrix} & 1\\\\ 1 \\end{bmatrix}\\begin{bmatrix}x\_{0}^{0}\\\\ x\_{1}^{0} \\end{bmatrix}+b. $

Note that one has to store the entire $ {x^{0}}$ in order to compute $ {x^{1}}$. This is what happens in general, since $ {M-A}$ is usually not triangular.  

The error matrix is  

$ \\displaystyle B=D^{-1}(D-A), $

where we recognize $ {D-A}$ is the negative non-diagonal part of $ {A}$. So $ {B}$ is the negative non-diagonal part of $ {A}$, with each row divided by the corresponding diagonal entry, which was assumed to be non-zero. The larger the diagonal entries are, the closer to zero $ {B}$ becomes. To make this condition precise, we need the following useful fact.  

> **Exercise 2** (Gershgorin disk) Let $ {A=(a\_{ij})\\in\\mathbb{R}^{N\\times N}}$. Then each eigenvalue of $ {A}$ (which can be complex) lies within at least one of the closed disks $ {\\{z:|z-a\_{ii}|\\leq R\_{i}\\}}$ in $ {\\mathbb{C}}$, where the radius $ {R\_{i}}$ is defined by  
> 
> *$ \\displaystyle R\_{i}=\\sum\_{j\\neq i}|a\_{ij}|. $*

> **Exercise 3** What are the Gershgorin disks of the matrix $ {B}$ in the Jacobi iteration? Hence show that Jacobi iteration is convergent if the matrix $ {A}$ is *strictly diagonal dominant (SDD)*, i.e.  
> 
> *$ \\displaystyle |a\_{ii}|>\\sum\_{j\\neq i}|a\_{ij}|. $*

> **Exercise 4** *[](https://www.blogger.com/null)Show that a SDD matrix is invertible.*

**1.2. The Gauss-Seidel iteration**

Again unfortunately this name is rather uninformative. I would rather call it **method of successive displacement**, for reason to be clear in a moment. We take  

$ \\displaystyle M=D+U\\:\\text{ or }\\:M=D+L. $

Now since $ {M}$ is triangular, its eigenvalues lie on the diagonal. Hence in order for $ {M}$ to be invertible, the diagonal of $ {A}$ must be nonzero. The same SDD condition is also sufficient for the Gauss-Seidel to converge.  

We take the same example to illustrate what is going on. With  

$ \\displaystyle A=\\begin{bmatrix}2 & -1\\\\ -1 & 2 \\end{bmatrix},\\quad M=\\begin{bmatrix}2\\\\ -1 & 2 \\end{bmatrix} $

one Gauss-Seidel iteration looks like the following  

$ \\displaystyle \\begin{bmatrix}2\\\\ -1 & 2 \\end{bmatrix}\\begin{bmatrix}x\_{0}^{1}\\\\ x\_{1}^{1} \\end{bmatrix}=\\begin{bmatrix} & 1\\\\ \\ \\end{bmatrix}\\begin{bmatrix}x\_{0}^{0}\\\\ x\_{1}^{0} \\end{bmatrix}+b. $

Note that to obtain $ {x\_{1}^{1}}$, one needs $ {x\_{0}^{1}}$ and $ {x\_{1}^{0}}$ but not $ {x\_{0}^{0}}$, due to our choice that $ {M}$ is the lower triangular part of $ {A}$, and cpnsequently $ {M-A}$ is strictly upper triangular. So, instead of storing the entire $ {x^{0}}$ before $ {x^{1}}$ is obtained, one can replace the entry $ {x\_{0}^{0}}$ with the computed $ {x\_{0}^{1}}$ immediately, hence saving half of the storage.  

> **Exercise 5** *Check the case $ {M=D+U}$ using the above $ {2\\times2}$ example.*

The SDD condition still guarantees the convergence here. Assume $ {M}$ is taken to be the lower triangular part (the other case is similar). Now consider the eigenvlaues $ {\\lambda}$ of  

$ \\displaystyle B=M^{-1}(M-A)=-M^{-1}U. $

We have  

$ \\displaystyle \\ker(-M^{-1}U-\\lambda I)\\neq\\{0\\}. $

Since $ {M}$ is invertible, this implies  

$ \\displaystyle \\ker(U+\\lambda M)\\neq\\{0\\}. $

Note that $ {U+\\lambda M=U+\\lambda D+\\lambda L}$. If $ {A}$ is SDD, then $ {U+\\lambda D+\\lambda L}$ is SDD only if $ {|\\lambda|\\geq1}$. But if $ {|\\lambda|\\geq1}$, $ {U+\\lambda D+\\lambda L}$ is invertible, by Exercise [4](<https://www.blogger.com/blogger.g?blogID=4046755691971152965#exerSDD invert>). This shows that eigenvalues of $ {B}$ in modulus cannot be greater than $ {1}$ if $ {A}$ is SDD. This guarantees the convergence by Exercise [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exerconv).  

**Another sufficient condition for convergence.** Besides the SDD conditions, we also have  

> **Theorem 1**
> 
> *-   The Gauss-Seidel iteration converges if $ {A}$ is symmetric and positive definite.
> -   The Jacobi iteration converges if both $ {A}$ and $ {2D-A}$ are symmetric positive definite.*

These are immediate consequences of  

> **Theorem 2** *(Householder-John) If $ {A,B\\in\\mathbb{R}^{N\\times N}}$ and both $ {A}$ and $ {A-B-B^{T}}$ are symmetric positive definite, then the spectral radius of $ {(A-B)^{-1}B}$ is stricly less than one.*

*Proof:* Let $ {\\lambda}$,$ {v\\neq0}$ be an eigenvalue-eigenvector pair of $ {-(A-B)^{-1}B}$, which may well be complex. Then  

$ \\displaystyle -Bv=\\lambda(A-B)v. $

Hence $ {\\lambda\\neq1}$ since $ {A}$ is invertible. Multiplying both sides by $ {\\bar{v}^{T}}$, we obtain  

$ \\displaystyle -\\bar{v}^{T}Bv=\\lambda\\bar{v}^{T}Av+\\lambda\\bar{v}^{T}Bv. $

Thus  

$ \\displaystyle \\bar{v}^{T}Bv=\\frac{\\lambda}{\\lambda-1}\\bar{v}^{T}Av. $

Now one easily check that the symmetric positive definiteness of a matrix $ {M}$ implies  

$ \\displaystyle \\bar{x}^{T}Mx>0\\quad,\\forall x\\in\\mathbb{C}^{N}. $

Also,  

$ \\displaystyle \\bar{v}^{T}B^{T}v=\\left(\\bar{v}^{T}Bv\\right)^{\*}=\\frac{\\bar{\\lambda}}{\\bar{\\lambda}-1}\\bar{v}^{T}A^{\*}v=\\frac{\\bar{\\lambda}}{\\bar{\\lambda}-1}\\bar{v}^{T}Av. $

Apply the above observations to $ {M=A-B-B^{T}}$ and $ {M=A}$, with $ {x=v}$, we get  

$ \\displaystyle \\begin{array}{rcl} 0 & < & \\bar{v}^{T}(A-B-B^{T})v\\\\ & = & \\bar{v}^{T}Av-\\frac{\\lambda}{\\lambda-1}\\bar{v}^{T}Av-\\frac{\\bar{\\lambda}}{\\bar{\\lambda}-1}\\bar{v}^{T}Av\\\\ & = & \\frac{1-|\\lambda|^{2}}{|1-\\lambda|^{2}}\\bar{v}^{T}Av \\end{array} $

and  

$ \\displaystyle 0<\\bar{v}^{T}Av. $

We deduce that $ {|\\lambda|<1}$. $ \\Box$
