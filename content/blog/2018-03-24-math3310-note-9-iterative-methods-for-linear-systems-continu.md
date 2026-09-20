---
id: 2018-03-24-math3310-note-9-iterative-methods-for-linear-systems-continu
title: "MATH3310 Note 9: Iterative methods for linear systems, continued"
date: 2018-03-24
tags: ["cuhk.math3310", "linear algebra", "numerical methods", "teaching"]
source: https://sylqiu.blogspot.com/2018/03/math3310-note-9-iterative-methods-for.html
publish: true
---
**1\. Successive over-relaxation**

When the classical methods of Jacobi and Gauss-Seidel converge, they converge monotonically. It is thus natural to go beyond a little in the descending direction, a method known as *over-relaxation*. One can introduce this technique to a iterative scheme of the following general form  

$ \\displaystyle Mx^{k+1}=(M-A)x^{k}+b $

as follows. First, define an auxilary sequence $ {\\hat{x}^{k}}$ by  

$ \\displaystyle M\\hat{x}^{k+1}=(M-A)x^{k}+b. $

And then update $ {x^{k+1}}$ according to  

$ \\displaystyle x^{k+1}=x^{k}+\\omega(\\hat{x}^{k+1}-x^{k}),\\quad\\omega>0 $

When $ {\\omega=1}$, this iteration is the same with the original one. And the idea of the term $ {\\omega(\\hat{x}^{k+1}-x^{k})}$ is to adjust the correction given by the auxilary iteration. One usually refers to the case $ {\\omega>1}$ as over-relaxation, since one enlarges the correction compared to the original iteration.  

The successive over-relaxation (SOR) method is a modification of the Gauss-Seidel iteration along this line. Recall the notation  

$ \\displaystyle A=L+D+U $

where $ {L,D,U}$ are the strict lower triangular, diagonal and strict upper triangular part of $ {A}$, respectively. Then, following the above, we have  

$ \\displaystyle (D+L)\\hat{x}^{k+1}=-Ux^{k}+b $

and  

$ \\displaystyle x^{k+1}=x^{k}+\\omega(\\hat{x}^{k+1}-x^{k}). $

> **Exercise 1** *Show that the above scheme can be simplified to*  
> 
> *$ \\displaystyle (D+\\omega L)x^{k+1}=(-\\omega U+(1-\\omega)D)x^{k}+\\omega b. $*
> 
> *This means we have a splitting of $ {A=M+(A-M)}$ where*  
> 
> *$ \\displaystyle M=L+\\frac{1}{\\omega}D. $*

The benefit of such a scheme is that in the right situation, the convergence rate can be significantly faster. Let's look at an example.  

$ \\displaystyle A=\\begin{bmatrix}2 & -1\\\\ -1 & 2 \\end{bmatrix},\\quad M=\\begin{bmatrix}2/\\omega & 0\\\\ -1 & 2/\\omega \\end{bmatrix} $

The iteration matrix is  

$ \\displaystyle B=\\begin{bmatrix}1-\\omega & 1/2\\omega\\\\ \\omega(1-\\omega)/2 & 1-\\omega+\\omega^{2}/4 \\end{bmatrix}. $

We can optimize the eigenvalues in $ {\\omega}$, it turns out that the optimal choice is when the two eigenvalues equal to $ {1-\\omega^{\*}}$, where  

$ \\displaystyle \\omega^{\*}=4(2-\\sqrt{3})\\approx1.07. $

In other words the spectral radius of the matrix $ {B}$ is around $ {\\rho(B)=0.07}$. Compare this to the case of Jacobi iteration ($ {\\rho(B)=\\frac{1}{2}}$) and Gauss-Seidel $ {(\\rho(B)=\\frac{1}{4}}$). A rule of thumb is that the convergence is fast when all the eigenvalues of the iteration matrix stays about the same level.  

**Block relaxation scheme.** It is easy to extend the previously described iterations to handle linear system in *blocks*. For example, the block Jacobi iteration for the block matrix $ {A=(A\_{ij})\_{1\\leq i,j\\leq p}}$ will be as follows. Define  

$ \\displaystyle D=\\begin{bmatrix}A\_{11}\\\\ & A\_{22}\\\\ & & \\ddots\\\\ & & & A\_{pp} \\end{bmatrix},\\quad L=\\begin{bmatrix}0\\\\ A\_{21}\\\\ \\vdots & \\ddots\\\\ A\_{p1} & \\cdots & A\_{p,p-1} & 0 \\end{bmatrix}, $

and  

$ \\displaystyle L=\\begin{bmatrix}0 & A\_{12} & \\cdots & A\_{1,p}\\\\ & & \\ddots & \\vdots\\\\ & & & A\_{p-1,p}\\\\ & & & 0 \\end{bmatrix}. $

The block Jacobi iteration is of the same form  

$ \\displaystyle Dx^{k+1}=-(L+U)x^{k}+b. $

Such a scheme can be preferable for a parallel computer. There are more general techniques , dealing with e.g. overlapping blocks, which belong to the family of *domain decomposition methods*.  

**Iterative method as preconditioning.** A preconditioner for a square linear system $ {Ax=b}$ is a matrix $ {P}$, of the same size with $ {A}$, which is used to produce a equivalent system $ {PAx=Pb}$, with (hopefully) $ {PA}$ having smaller condition number (usually defined as the ratio between the modulus of the largest and smallest eigenvalue). The preconditioned system can be preferable in terms of stability and convergence rate.  

We can view the Jacobi, Gauss-Seidel and SOR as fixed point iteration on a precondtioned system[](https://www.blogger.com/null)  

[$ \\displaystyle M^{-1}A=M^{-1}b, \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {M}$ is same notation in $ {A=M+(A-M)}$ as before. To see this, recall that the general scheme is of the form  

$ \\displaystyle x^{k+1}=(I-M^{-1}A)x^{k}+M^{-1}b $

which is the fixed point iteration of  

$ \\displaystyle (I-I+M^{-1}A)x=M^{-1}b $

which is equivalent to ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)). These are particular simple cases of the *preconditioned iterative methods*.  

**2\. Consistenly ordered matrices**

In class, we called a matrix $ {A}$ to be consistently ordered if eigenvalues of the matrices  

$ \\displaystyle \\alpha L+\\frac{1}{\\alpha}U,\\quad\\alpha\\neq0 $

are independent of $ {\\alpha}$. We are interested in this property because the convergence analysis of SOR scheme for such matrices are particularly simple. Here, we would like to find a special class of matrices that satisfy this property.  
We have in mind the *tridiagonal matrices*, which are of the form  

$ \\displaystyle A=\\begin{bmatrix}d\_{1} & t\_{12}\\\\ t\_{21} & d\_{2} & t\_{23}\\\\ & t\_{32} & d\_{3} & t\_{34}\\\\ & & \\ddots & \\ddots & \\ddots\\\\ & & & t\_{N,N-1} & d\_{N} \\end{bmatrix}. $

Examples include the central difference matrix for $ {\\frac{d^{2}}{dx^{2}}}$ with Dirichlet or Neumann boundary condition. We note that, the matrices  

$ \\displaystyle L+U=\\begin{bmatrix}0 & t\_{12}\\\\ t\_{21} & 0 & t\_{23}\\\\ & t\_{32} & 0 & t\_{34}\\\\ & & \\ddots & \\ddots & \\ddots\\\\ & & & t\_{N,N-1} & 0 \\end{bmatrix} $

and  

$ \\displaystyle \\alpha L+\\frac{1}{\\alpha}U=\\begin{bmatrix}0 & \\frac{1}{\\alpha}t\_{12}\\\\ \\alpha t\_{21} & 0 & \\frac{1}{\\alpha}t\_{23}\\\\ & \\alpha t\_{32} & 0 & \\frac{1}{\\alpha}t\_{34}\\\\ & & \\ddots & \\ddots & \\ddots\\\\ & & & \\alpha t\_{N,N-1} & 0 \\end{bmatrix} $

are related by a similarity transform:  

$ \\displaystyle L+U=X^{-1}\\left(\\alpha L+\\frac{1}{\\alpha}U\\right)X $

where  

$ \\displaystyle X=\\begin{bmatrix}1\\\\ & \\alpha\\\\ & & \\alpha^{2}\\\\ & & & \\ddots\\\\ & & & & \\alpha^{N} \\end{bmatrix}. $

It then follows that the eigenvalues of $ {\\alpha L+\\frac{1}{\\alpha}U}$ is the same with those of $ {L+U}$.  

It turns out that this argument can be extended to *block tridiagonal* matrices whose diagonal blocks are diagonal matrices. Matrices with this property is called *T-matricex*, and can be further extended to similarity transforms of such matrices.  

Now we recall the result we proved in class.  

> **Theorem 1** *Let $ {A}$ be given. Suppose  
> 
> 1.  $ {0<\\omega<2}$.
> 2.  The Jacobi iteration converges, i.e. $ {\\rho(D^{-1}(L+U))<1}$ and the matrix $D^{-1}(L+U)$ has real eigenvalues.
> 3.  A is consistenly ordered.
> 
> Then the SOR method converges. The optimal $ {\\omega}$ is given by  
> 
> $ \\displaystyle \\omega^{\*}=\\frac{2}{1+\\sqrt{1-\\rho(D^{-1}(L+U))^{2}}}. $
> 
> *

So we have a very useful corollary.  

> **Corollary 2** *Let $ {A}$ be a tridiagonal matrix, such that $ {\\rho(D^{-1}(L+U))<1}$ and $D^{-1}(L+U)$ has real eigenvalues. Then the SOR iteration converges if and only if $ {0<\\omega<2}$.*
