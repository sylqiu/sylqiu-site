---
id: 2017-01-10-qr-algorithm-for-eigenvalue-problem
title: "QR-Algorithm for Eigenvalue Problem"
date: 2017-01-10
tags: ["linear algebra", "numerical methods"]
source: https://sylqiu.blogspot.com/2017/01/qr-algorithms-for-eigenvalue-problem.html
publish: true
---
I still remember Prof. Gilbert Strang in his linear algebra course once commented (which I learned from YouTube) that the Jordan canonical form of a matrix (see also my discussion [here](http://sylqiu.blogspot.hk/2016/08/notes-on-structure-theorem-for-finitely.html) in a more general context) was once the culminating point in a linear algebra course long ago (50 years ago, perhaps). Indeed, the Jordan Canonical form $ {J}$ of a square matrix $ {A:V\\rightarrow V}$ (non-sqaure matrix can be complete to sqaure matrix by adding zeros) gives us the precise information of its *invariant subspaces*, that is a linear subspace $ {W\\subset V}$ satisfying  

$ \\displaystyle A\\downharpoonright\_{W}:W\\rightarrow W. $

Abusing the notation, if we also write $ {W\\in\\mathbb{C}^{n\\times r}}$ as a column arrangement of a basis of the subspace $ {W}$, then that the space $ {W}$ is invariant is characterized by  

$ \\displaystyle AW=W\\Lambda $

for some $ {\\Lambda\\in\\mathbb{C}^{r\\times r}}$. Moreover, the Jordan block form tells us exactly how $ {A}$ acts on these invariant spaces, and once we know the actions on invariant subspaces, then the matrix is determined up to similarity transformations. One method to find the Jordan blocks is as follows: determine the eigenspaces and their bases (generalized eigenvectors), then put the basis vectors in columns in a particular order to form matrix $ {P}$ so that  

$ \\displaystyle P^{-1}AP=J. $

The theory side is clean. However, numerically to find such a decomposition is likely to be erraneous. After all, for matrices of very large size usually one cannot even evaluate the characteristic polynomial and obtain the eigenvectors directly. To remedy, there is a clever and primitve numerical method to obtain the eigenvectors, i.e. the *power method*, by iterating the sequence  

$ \\displaystyle x^{(m+1)}=Ax^{(m)}, $

where $ {A\\in\\mathbb{C}^{n\\times n}}$ is our matrix and $ {x^{(m)}\\in\\mathbb{C}^{n}}$. With carefully chosen initial $ {x^{(0)}}$ and renormalization at each step, one can hope $ {x^{(m)}}$ will converge to an eigenvector that corresponds to the largest eigenvalue of $ {A}$. To do better, one can upgrage to  

$ \\displaystyle X^{(m+1)}=AX^{(m)}, $

where $ {X^{(m)}\\in\\mathbb{C}^{n\\times r}}$ for some $ {1\\leq r\\leq n}$, and hope that after renormalization at each step, it should converge to a basis of a invariant subspace. So one can use this iterative method to approximate $ {P}$, in the form  

$ \\displaystyle \\hat{P}^{-1}A\\hat{P}=P\_{k}^{-1}\\cdots P\_{1}^{-1}AP\_{1}\\cdots P\_{k}. $

But the column vectors of $ {\\hat{P}}$ may be \`\`too close'' to each other, and thus becomes \`\`numerically dependent''. This motivates us to *re-orthonormalize* $ {X^{(\\cdot)}}$ at each iteration, using Gramm-Schmidt orthogonalization procedure. This has another cute name, called the *QR factorization* :  

$ \\displaystyle X^{(m)}=Q^{(m)}R^{(m)}, $

where $ {Q^{(m)}}$ is an isometric matrix (or unitary matrix if the numbers are complex), and $ {R^{(m)}}$ is upper triangular. Replacing $ {X^{(m)}}$ by $ {Q^{(m)}R^{(m)}}$, we get  

$ \\displaystyle X^{(m+1)}=AQ^{(m)}R^{(m)} $

Then taking the QR-factorization of $ {AQ^{(m)}=Q^{(m+1)}\\hat{R}^{(m+1)}}$, we automatically get a QR factorization of $ {X^{(m+1)}=Q^{(m+1)}\\hat{R}^{(m+1)}R^{(m)}=Q^{(m+1)}R^{(m+1)}}$. So the $ {R^{(m)}}$ term in fact becomes redundant in the iteration. Hence instead we can do  

$ \\displaystyle Y^{(m+1)} = AQ^{(m)}, Y^{(m+1)} = Q^{(m+1)}\\hat{R}^{(m+1)}. (\\star) $

The iteration should eventually take $ {Q^{(\\cdot)}}$ to an orthonormal basis of its invariant subspace. In case $ {r=n}$ (i.e. $ {X^{(\\cdot)}}$'s are $ {n\\times n}$), this means there is an ismometric $ {Q}$ and upper triangular $ {\\Lambda}$ such that  

$ \\displaystyle AQ=Q\\Lambda. $

Multiplying $ {Q^{\*}}$ from the right, we obtain the so-called *Schur decomposition*:  

$ \\displaystyle A=Q\\Lambda Q^{\*}. $

And since $ {\\Lambda}$ is upper triangular, we get a nested sequence of invariant subspaces  

$ \\displaystyle V\_{1}\\subset V\_{2}\\subset\\cdots V\_{n}=\\mathbb{C}^{n} $

and the 1st, 2nd, ..., and the $ {j}$-th columns spans the space $ {V\_{j}}$, for each $ {j}$. Therefore, the iteration ($ {\\star}$) can be considered as of getting an approximation of the Schur decomposition of $ {A}$ when $ {r=n}$. More precisely, we can take  

$ \\displaystyle A^{(m)}=Q^{(m)\*}AQ^{(m)} $

to be an approximation of $ {\\Lambda}$. So substituting this back into ($ {\\star}$), we get  

$ \\displaystyle Q^{(m)\*}Y^{(m+1)}=Q^{(m)\*}Q^{(m+1)}\\hat{R}^{(m+1)}=Q^{(m)\*}AQ^{(m)}=A^{(m)}. $

Letting  

$ \\displaystyle Q^{(m)\*}Q^{(m+1)}=\\hat{Q}^{(m+1)}, $

we automatically get a QR-factorization of  

$ \\displaystyle A^{(m)}=\\hat{Q}^{(m+1)}\\hat{R}^{(m+1)}. $

Now, suppose we have found $ {A^{(m+1)}=Q^{(m+1)\*}AQ^{(m+1)}}$. Then substituting $ {Q^{(m+1)}}$ by $ {Q^{(m)}\\hat{Q}^{(m+1)}}$, we find  

$ \\displaystyle \\begin{array}{rcl} A^{(m+1)} & = & \\left(Q^{(m)}\\hat{Q}^{(m+1)}\\right)^{\*}AQ^{(m)}\\hat{Q}^{(m+1)}\\\\ & = & \\hat{Q}^{(m+1)\*}Q^{(m)\*}AQ^{(m)}\\hat{Q}^{(m+1)}\\\\ & = & \\hat{Q}^{(m+1)\*}A^{(m)}\\hat{Q}^{(m+1)}\\\\ & = & \\hat{Q}^{(m+1)\*}\\hat{Q}^{(m+1)}\\hat{R}^{(m+1)}\\hat{Q}^{(m+1)}=\\hat{R}^{(m+1)}\\hat{Q}^{(m+1)}. \\end{array} $

Summerising, we obtained  

$ \\displaystyle \\begin{array}{rcl} A^{(m)} & = & \\hat{Q}^{(m+1)}\\hat{R}^{(m+1)}\\\\ A^{(m+1)} & = & \\hat{R}^{(m+1)}\\hat{Q}^{(m+1)}. (\\star \\star) \\end{array} $

This cute little algorithm is called *QR iteration*, standing at its elegance that the next iteration $ {A^{(m+1)}}$ is obtained by simply swapping the matrix multiplication.  

**1.1. Convergence analysis of the algorithm**

In the previous discussion we have only given a heuristic justification for the QR-algorithm. Here we do some rigorous analysis in the particular simple case where $ {A}$ is assumed to be *normal*, meaning that the Schur decomposition of $ {A=Q\\Lambda Q^{\*}}$ is in fact a diagonalization.  
First, we justify the power iteration of a single vector. Suppose we have a dominant eigenvalue $ {|\\lambda\_{1}|>|\\lambda\_{2}|\\geq\\cdots\\geq|\\lambda\_{n}|}$, and we have arranged the Schur decomposition such that  

$ \\displaystyle Q\\delta\_{i}=e\_{i}, $

where $ {e\_{i}}$ is a unit eigenvector associated to $ {\\lambda\_{i}}$. We can write $ {x^{(m)}=\\sum\_{i=1}^{n}x\_{i}^{(m)}e\_{i}}$. Then after one iteration each $ {e\_{i}}$ term will be amplified by $ {\\lambda\_{i}}$, leading to  

$ \\displaystyle x^{(m+1)}=\\sum\_{i=1}^{n}\\lambda\_{i}x\_{i}^{(m)}e\_{i}. $

Substituting $ {Q\\delta\_{i}=e\_{i}}$, and write $ {\\hat{x}^{(m)}=Q^{\*}x^{(m)}}$, we have  

$ \\displaystyle \\hat{x}^{(m+1)}=\\sum\_{i=1}^{n}\\lambda\_{i}x\_{i}^{(m)}\\delta\_{i}. $

This will be particularly easy to manipulate.  

> **Proposition 1** *Following the above setting, if $ {x^{(0)}}$ is not orthogonal to $ {e\_{1}}$, then the sequence $ {\\{x^{(m)}\\}}$ given by the power iteration is such that*  
> 
> *$ \\displaystyle \\tan(x^{(m+1)},e\_{1})\\leq\\frac{|\\lambda\_{2}|}{|\\lambda\_{1}|}\\tan(x^{(m)},e\_{1}). $*

In other words, the convergence rate of $ {x^{(m)}}$ to $ {e\_{1}}$ is at least $ {|\\lambda\_{2}|/|\\lambda\_{1}|<1}$.  
*Proof:*  

$ \\displaystyle \\begin{array}{rcl} \\tan^{2}(x^{(m+1)},e\_{1}) & = & \\frac{1-\\cos^{2}(x^{(m+1)},e\_{1})}{\\cos^{2}(x^{(m+1)},e\_{1})}\\\\ & = & \\frac{1-\\cos^{2}(\\hat{x}^{(m+1)},\\delta\_{1})}{\\cos^{2}(\\hat{x}^{(m+1)},\\delta\_{1})}\\\\ & = & \\frac{\\sum\_{j=2}^{n}|\\hat{x}\_{j}^{(m+1)}|^{2}}{|\\hat{x}\_{1}^{(m+1)}|^{2}}=\\frac{\\sum\_{j=2}^{n}|\\lambda\_{j}\\hat{x}\_{j}^{(m)}|^{2}}{|\\lambda\_{1}\\hat{x}\_{1}^{(m+1)}|^{2}}\\leq\\frac{|\\lambda\_{2}|^{2}}{|\\lambda\_{1}|^{2}}\\tan^{2}(x^{(m)},e\_{1}). \\end{array} $

$ \\Box$  
Suppose instead we have now  

$ \\displaystyle |\\lambda\_{1}|\\geq\\cdots\\geq|\\lambda\_{k}|>|\\lambda\_{k+1}|\\geq\\cdots\\geq|\\lambda\_{n}|. $

We may think of these equalities of the first $ {k}$ eigenvalues hold, otherwise just reduce to that case. Anyway it is one of the cases considered here. So it is possible that we don't land on a eigenvector, but rather some vector in the eigenspace. Since the matrix $ {A=Q\\Lambda Q^{\*}}$, the projection to the invariant subspace $ {\\mathcal{E}\_{k}}$ of the first $ {k}$ eigenvalues takes the simple form  

$ \\displaystyle P=Q\\hat{P}Q^{\*}=Q\\begin{pmatrix}I\_{k}\\\\ & 0 \\end{pmatrix}Q^{\*}. $

Just as Proposition 1, we can similarly obtain the bound  

$ \\displaystyle \\tan(x^{(m+1)},Px^{(m+1)})\\leq\\frac{|\\lambda\_{k+1}|}{|\\lambda\_{k}|}\\tan(x^{(m)},Px^{(m)}). $

Under the same assumption on eigenvalues we now upgrade the result to iterations on matrices. Recall that we have used QR-factorisation at each iteration of ($ {\\star}$). The thing we have in mind is that the the $ {n\\times k}$ matrix $ {Q^{(\\cdot)}}$ should converge an orthonormal basis of the invariant subspace $ {\\mathcal{E}\_{k}}$. This means that there is a $ {k\\times k}$ matrix $ {\\Lambda^{(m)}}$ such that  

$ \\displaystyle Q^{(m)}\\Lambda^{(m)}-AQ^{(m)}\\text{ is small when }m\\text{ is large.} $

Notice that $ {Q^{(m)\*}Q^{(m)}=I\_{k}}$. Hence we may take  

$ \\displaystyle \\Lambda^{(m)}:=Q^{(m)\*}AQ^{(m)}, $

and define residual matrix  

$ \\displaystyle \\begin{array}{rcl} R^{(m)}: & = & Q^{(m)}\\Lambda^{(m)}-AQ^{(m)}. \\end{array} $

It is nonzero unless the range of $ {Q^{(m)}}$ is invariant under $ {A}$. We would like the $ {L^{2}}$-operator norm of $ {R^{(m)}}$ to be small so that $ {Q^{(m)}}$ is close to an orthonormal basis of $ {\\mathcal{E}\_{k}}$. The estimate is given by  

> **Proposition 2** *Following the above setting, we have*  
> 
> *$ \\displaystyle \\|R^{(m)}\\|\\leq C\_{0}\\left(\\frac{|\\lambda\_{k+1}|}{|\\lambda\_{k}|}\\right)^{m}, $*
> 
> *where $ {C\_{0}=\\sup\_{0\\neq y\\in\\mathbb{C}^{n}}\\frac{\\|(AX^{(0)}-X^{(0)}\\Lambda)y\\|}{\\|PX^{(0)}y\\|}}$.*

In order to prove it, we first make several observations. To estimate the operator norm of $ {AQ^{(m)}-Q^{(m)}\\Lambda^{(m)}}$, we first notice that there is certain optimal property with the matrix $ {\\Lambda^{(m)}}$ chosen, namely, for each $ {z\\in\\mathbb{C}^{k}}$  

$ \\displaystyle \\begin{array}{rcl} \\|\\left(AQ^{(m)}-Q^{(m)}\\Lambda^{(m)}\\right)z\\| & = & \\|AQ^{(m)}z-Q^{(m)}Q^{(m)\*}AQ^{(m)}z\\| \\end{array} $

where the matrix $ {Q^{(m)}Q^{(m)\*}}$ is an orthogonal projection to the range of $ {Q^{(m)}}$. Thus if $ {w}$ lies in the range of $ {Q^{(m)}}$, we will have  

$ \\displaystyle \\|\\left(AQ^{(m)}-Q^{(m)}\\Lambda^{(m)}\\right)z\\|\\leq\\|AQ^{(m)}z-w\\|. $

Second, recall that $ {Q^{(m)}}$ results from the QR-factorisation of $ {X^{(m)}}$:  

$ \\displaystyle X^{(m)}=Q^{(m)}R^{(m)}. $

If $ {X^{(m)}}$ has linearly independent columns, then the diagonal entries of $ {R}$ are non-zero, thus $ {R^{(m)}}$ is invertible. Then for each $ {k\\times k}$ matrix $ {\\Lambda}$, we have  

$ \\displaystyle \\begin{array}{rcl} AX^{(m)}-X^{(m)}\\Lambda & = & AQ^{(m)}R^{(m)}-Q^{(m)}R^{(m)}\\Lambda\\\\ & = & AQ^{(m)}R^{(m)}-Q^{(m)}R^{(m)}\\Lambda\\left(R^{(m)}\\right)^{-1}R^{(m)}\\\\ & = & \\left(AQ^{(m)}-Q^{(m)}\\tilde{\\Lambda}^{(m)}\\right)R^{(m)} \\end{array} $

where $ {\\tilde{\\Lambda}^{(m)}=R^{(m)}\\Lambda\\left(R^{(m)}\\right)^{-1}}$. In particular, $ {Q^{(m)}\\tilde{\\Lambda}^{(m)}z}$ lies in the range of $ {Q^{(m)}}$, so we have  

$ \\displaystyle \\begin{array}{rcl} \\|\\left(AQ^{(m)}-Q^{(m)}\\Lambda^{(m)}\\right)z\\| & \\leq & \\|AQ^{(m)}z-Q^{(m)}\\tilde{\\Lambda}^{(m)}z\\|. \\end{array} $

On the other hand, since $ {\\|z\\|\\geq\\|PQ^{(m)}z\\|}$, taking $ {y}$ such that $ {z=R^{(m)}y}$, we have  

$ \\displaystyle \\begin{array}{rcl} \\frac{\\|\\left(AQ^{(m)}-Q^{(m)}\\tilde{\\Lambda}^{(m)}\\right)z\\|}{\\|z\\|} & \\leq & \\frac{\\|\\left(AQ^{(m)}-Q^{(m)}\\tilde{\\Lambda}^{(m)}\\right)z\\|}{\\|PQ^{(m)}z\\|}\\\\ & = & \\frac{\\|\\left(AQ^{(m)}-Q^{(m)}\\tilde{\\Lambda}^{(m)}\\right)R^{(m)}y\\|}{\\|PQ^{(m)}R^{(m)}y\\|}\\\\ & = & \\frac{\\|\\left(AX^{(m)}-X^{(m)}\\Lambda\\right)y\\|}{\\|PX^{(m)}y\\|}. \\end{array} $

This suggest we estimate the last term.  

> **Lemma 3** *Following the above setting. Let $ {X^{(0)}\\in\\mathbb{C}^{n\\times k}}$ be such that $ {PX^{(0)}}$ is injective. Then there is a matrix $ {\\Lambda}$ such that for all $ {m\\geq1}$,*  
> 
> *$ \\displaystyle \\frac{\\|\\left(AX^{(m)}-X^{(m)}\\Lambda\\right)y\\|}{\\|PX^{(m)}y\\|}\\leq\\left(\\frac{|\\lambda\_{k+1}|}{|\\lambda\_{k}|}\\right)^{m}\\frac{\\|\\left(AX^{(0)}-X^{(0)}\\Lambda\\right)y\\|}{\\|PX^{(0)}y\\|} $*
> 
> *for all $ {y\\in\\mathbb{C}^{k}}$, $ {y\\neq0}$.*

*Proof:* Since we assumed $ {A}$ is orthogonally diagonalizable, by multiplying a unitary matrix we may assume $ {A=D=\\text{diag}(\\lambda\_{i})}$ is diagonal. We will bound the numerator and denominator separately.  
For the denominaor it is easy  

$ \\displaystyle \\|PX^{(m)}y\\|=\\|PD^{m}X^{(0)}y\\|=\\|D\_{k}^{m}X\_{k}^{(0)}y\\|\\geq|\\lambda\_{k}|^{m}\\|X\_{k}^{(0)}y\\|. $

For the numerator, Then for any $ {k\\times k}$ matrix $ {\\Lambda}$  

$ \\displaystyle \\begin{array}{rcl} DX^{(m)}-X^{(m)}\\Lambda & = & D^{m+1}X^{(0)}-D^{m}X^{(0)}\\Lambda\\\\ & = & \\begin{pmatrix}D\_{k}^{m+1}X\_{k}^{(0)}-D\_{k}^{m}X\_{k}^{(0)}\\Lambda\\\\ D\_{\\perp}^{m+1}X\_{\\perp}^{(0)}-D\_{\\perp}^{m}X\_{\\perp}^{(0)}\\Lambda \\end{pmatrix} \\end{array} $

where $ {D=\\begin{pmatrix}D\_{k}\\\\ & D\_{\\perp} \\end{pmatrix}}$ and $ {X^{(\\cdot)}=\\begin{pmatrix}X\_{k}^{(\\cdot)}\\\\ X\_{\\perp}^{(\\cdot)} \\end{pmatrix}}$. Since $ {X\_{k}^{(0)}}$ is invertible, we choose $ {\\Lambda=\\left(X\_{k}^{(0)}\\right)^{-1}D\_{k}\\left(X\_{k}^{(0)}\\right)}$ so that the upper block $ {DX^{(m)}-X^{(m)}\\Lambda}$ is killed. Then  

$ \\displaystyle \\begin{array}{rcl} \\|\\left(DX^{(m)}-X^{(m)}\\Lambda\\right)y\\| & = & \\|\\begin{pmatrix}0\\\\ D\_{\\perp}^{m}(D\_{\\perp}X^{(0)}-X^{(0)}\\Lambda)y \\end{pmatrix}\\|\\\\ & \\leq & \\|D\_{\\perp}^{m}\\|\\|(D\_{\\perp}X^{(0)}-X^{(0)}\\Lambda)y\\|\\\\ & \\leq & \\|\\lambda\_{k+1}\\|^{m}\\|(D\_{\\perp}X^{(0)}-X^{(0)}\\Lambda)y\\|. \\end{array} $

This concludes the bound for the numerator. $ \\Box$  

 Combining the discussion above, we find that for any $ {z}$,  

$ \\displaystyle \\begin{array}{rcl} \\|\\left(AQ^{(m)}-Q^{(m)}\\Lambda^{(m)}\\right)z\\|/\\|z\\| & \\leq & \\|\\left(AX^{(m)}-X^{(m)}\\Lambda\\right)y\\|/\\|y\\|\\\\ & \\leq & \\frac{\\|\\left(AX^{(m)}-X^{(m)}\\Lambda\\right)y\\|}{\\|PX^{(m)}y\\|}\\\\ & \\leq & \\left(\\frac{|\\lambda\_{k+1}|}{|\\lambda\_{k}|}\\right)^{m}\\frac{\\|\\left(AX^{(0)}-X^{(0)}\\Lambda\\right)y\\|}{\\|PX^{(0)}y\\|}. \\end{array} $

This finishes the proof of Proposition 2. The estimate in Proposition 2 is one of the special benefits we get from the general approach where we iterate matrices $ {X^{(m)}\\in\\mathbb{C}^{n\\times k}}$ rather than a square matrix. The estimate then implies that if we take an orthonormal basis $ {X^{(0)}\\in\\mathbb{C}^{n\\times n}}$, then our QR-iteration will approximate the Schur decomposition, since we can rearrange the matrix $ {A}$ so that its block form  

$ \\displaystyle A=\\begin{pmatrix}A\_{11} & A\_{12}\\\\ A\_{21} & A\_{22} \\end{pmatrix} $

is such that each after diagonalization the eigenvalues in the lower right block is strictly smaller than the upper left block. Then one can show that the lower left block in  

$ \\displaystyle A^{(m)}=Q^{(m)\*}AQ^{(m)} $

can always be controled by the estimate, that is, the matrix $ {A^{(m)}}$ approaches block-triangularl form. So then we may in turn transform the blocks $ {A\_{11}}$ and $ {A\_{22}}$ into block-triangular forms, with the same procedure - this strategy is known as *deflation*. Deflation will only iterate for finite number of times, and thus the matrix will tend to the Schur decomposition of $ {A}$.  

**1.2. Implementing QR-iteration**

The crucial step in ($ {\\star \\star}$) is the QR-factorisation. If one directly apply Gramm-Schimdt, the computing time is of order $ {\\sim n^{3}}$. However, if the matrix is *Hessenberg*, then the computing time can be reduced to $ {\\sim n^{2}}$ (this is a procedure for QR iteration for general matrices; if we consider normal matrices, then it is Hessenberg implies it is *tridiagonal*). So the common way is to first transform the matrix into Hessenberg form by conjugating unitary matrices.  
The *Householder reflection* is suited for transforming a matrix into Hessenberg form by conjugation. Such is a linear transformation that maps a given vector $ {q}$ to a scalar multiple of the first canonical unit vector. The matrix is given by  

$ \\displaystyle P=I-2\\frac{ww^{\*}}{\\|w\\|^{2}}, $

where $ {w=q+\\text{sgn}(q\_{1})\\|q\\|\\delta\_{1}}$. It has the required property of being unitary, and  

$ \\displaystyle Pq=-\\text{sgn}(q\_{1})\\|q\\|\\delta\_{1}. $

By reducing the dimension of the Householder reflection after each conjugation, one can find that the natural candidate of the reflection works to transform the matrix into Hessenberg form. It is best to illustrate this with schematic examples. After transforming the matrix $ {A^{(0)}=AQ^{(0)}}$ into Hessenberg form $ {H^{(0)}}$, i.e. we are only left with the entries that are one slot below the diagonal. Now we use a sequence of *Givens rotations*, an analog of Householder reflection in dimension two to get a upper triangular matrix:  

$ \\displaystyle G\_{n-1}\\cdots G\_{1}H^{(0)}=\\hat{R}^{(0)}. $

So now $ {\\hat{Q}^{(0)}}$ is given by $ {\\left(G\_{n-1}\\cdots G\_{1}\\right)^{\*}}$. Multiplying it on the right, we obtain the matrix $ {H^{(1)}}$ at the next iteration  

$ \\displaystyle \\begin{array}{rcl} H^{(1)} & = & G\_{n-1}\\cdots G\_{1}H^{(0)}\\left(G\_{n-1}\\cdots G\_{1}\\right)^{\*}\\\\ & = & Q^{(0)\*}H^{(0)}Q^{(0)}. \\end{array} $
