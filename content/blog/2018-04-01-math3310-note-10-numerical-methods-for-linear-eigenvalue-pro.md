---
id: 2018-04-01-math3310-note-10-numerical-methods-for-linear-eigenvalue-pro
title: "MATH3310 Note 10: Numerical methods for linear eigenvalue problems"
date: 2018-04-01
tags: ["cuhk.math3310", "linear algebra", "numerical methods", "teaching"]
source: https://sylqiu.blogspot.com/2018/04/math3310-note-10-numerical-methods-for.html
publish: true
---
**1\. The power method: finding the eigenvalues and eigenvectors**

The power method for eigenvalue problem takes the advantage of the discrepancy between the eigenvalues. Strictly speaking, it is the difference in modulus that matters. Suppose an vector $ {{\\bf u}}$ can be written as linear combination of the eigenvectors $ {\\{{\\bf v}\_{i}\\}}$ of a matrix $ {A}$[](https://www.blogger.com/null)  

[$ \\displaystyle {\\bf u}=u\_{1}{\\bf v}\_{1}+u\_{2}{\\bf v}\_{2}+\\cdots+u\_{n}{\\bf v}\_{n},\\quad u\_{i}\\neq0\\ \\forall i. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Then, by linearity  

$ \\displaystyle A^{k}{\\bf u}=\\lambda\_{1}^{k}u\_{1}{\\bf v}\_{1}+\\lambda\_{2}^{k}u\_{2}{\\bf v}\_{2}+\\cdots\\lambda\_{n}^{k}u\_{n}{\\bf v}\_{n}. $

If, say, $ {\\lambda\_{2}}$ is the only largest one in modulus (let's call it dominant), then the component $ {\\lambda\_{2}^{k}u\_{2}{\\bf v}\_{2}}$ should stand out more significantly than any other component as $ {k}$ becomes larger. Note that we have no knowledge about what the eigenvectors or eigenvalues are, except that we assume  

-   the vector $ {{\\bf u}}$ can be written in the form of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)).
-   there exists one and only one largest eigenvalue.

Of course, in general if we simply iterate $ {A^{k}{\\bf u}}$, we don't have convergence in the usual sense (it can blow-up or vanish). We must introduce a *rescaling*, or normalization, namely to divide the vector $ {A^{k}u}$ by a suitable scalar. There are many choices for the scalar, one example is the largest component in absolute value $ {\\|A^{k}u\\|\_{\\infty}}$. In general, it can be any norm of the vector. Then one goes on again multiplying the matrix $ {A}$ and rescaling the vector. This simple algorithm is called the **power iteration**. In the limit we recover that dominant component.  
There are a number of variants of the power iteration, designed to find eigenvalues other than the dominant one, and to accelerate convergence.  

-   The **inverse power iteration**. Here we iterate $ {{\\bf u}^{(k)}=A^{-1}{\\bf u}^{(k-1)}}$ to find the least eigenvalue of $ {A}$ in modulus, of course assuming $ {A}$ is invertible. Instead of find the inverse matrix $ {A^{-1}}$, we solve the equation

    $ \\displaystyle A{\\bf u}^{k}={\\bf u}^{(k-1)}. $

-   Power iteration with **shift**. Here the matrix $ {A}$ is replaced by $ {A-\\mu I}$. By doing this, we see a shift in the eigenvalues of $ {A}$. If we have a good estimation $ {\\mu}$ of the eigenvalue $ {\\lambda\_{i}}$ of interest, then we can simply subtract $ {\\mu}$ on the diagonal to get the matrix $ {A-\\mu I}$, so that the shifted eigenvalue of interest $ {\\lambda\_{i}-\\mu}$ is the least eigenvalue in modulus. And thus we can apply the inverse power iteration to find $ {\\lambda\_{i}-\\mu}$.  
    The shift parameter $ {\\mu}$ does not have to be the same for each iteration step. One way to update it is to use the *Rayleign Quotient*

    $ \\displaystyle \\frac{{\\bf u}^{(k)T}A{\\bf u}^{(k)}}{{\\bf u}^{(k)T}{\\bf u}^{(k)}}. $

    It is a good choice of estimating $ {\\lambda\_{i}}$ when $ {{\\bf u}^{(k)}}$ is a good approximation of the eigenvector corresponding to $ {\\lambda\_{i}}$. Note that Rayleigh Quotient method needs stronger condition than the power iteration: the angle between the iteration vector and the true eigenvector has to be small, not merely containing a non-trivial component. Otherwise it may converge to a different eigenvalue/eigenvector than expected.
-   **Simultaneous iteration.** Here we need the matrix to be *normal*. Instead of interating a single vector $ {{\\bf u}^{(k)}}$, here we iteration several vectors $ {U^{(k)}=\\begin{pmatrix}{\\bf u}\_{1}^{(k)} & {\\bf u}\_{2}^{(k)} & \\cdots & {\\bf u}\_{p}^{(k)}\\end{pmatrix}}$. How can we get different eigenvalues from such an iteration? The answer is to do something like a *Gramm-Schmidt orthogonalization procedure* on the iterated matrix $ {U^{(k)}=Q^{(k)}R^{(k)}}$, and keep only the orthogonal matrix part $ {Q^{(k)}}$, and start iterating again. This scheme in a way can lead to the QR iteration, which we shall see next. Because of the orthogonalization, the iteration is numerically very stable (as the condition number of an orthogonal matrix is $ {1}$, so round off errors cannot amplify). 

**2\. The QR algorithm: finding the eigenvalues and the invariant subspaces**

**2.1. The QR decomposition**. The basic component of the QR iteration is the QR factorisation, which in theory can be achieved by the Gramm-Schmidt orthogonalization. The standard QR decomposition of a matrix $ {A\\in\\mathbb{R}^{m\\times n}}$ has the form  

$ \\displaystyle A=QR,\\quad Q\\in\\mathbb{R}^{m\\times n},R\\in\\mathbb{R}^{n\\times n}, $

where $ {Q}$ has orthonormal columns, and $ {R}$ is a upper triangular matrix. But computing the matrix $ {Q}$ following the Gramm-Schmidt recipe can be numerically unstable (because subtracting away the all components at once can leave us non-orthogonal results due to numerical error). There is a modified Gramm-Schmidt procedure to the rescue, using a one-dimensional procedure each time. However, here we want to talk about something more preferable in practice.  

The idea is to transform the matrix $ {A}$ to some upper triangular matrix $ {\\hat{R}}$ of the same size, using elements in the orthogonal group $ {O(m)}$. In other words, we want to find a finite sequence of orthogonal matrices $ {H\_{1},H\_{2}\\cdots H\_{p}}$ such that  

$ \\displaystyle H\_{p}\\cdots H\_{2}H\_{1}A=\\hat{R}. $

Then we obtain a variant of QR factorisation of $ {A}$ by  

$ \\displaystyle A=H\_{1}^{T}H\_{2}^{T}\\cdots H\_{p}^{T}\\hat{R}=\\hat{Q}\\hat{R}, $

where $ {\\hat{Q}\\in\\mathbb{R}^{m\\times m}}$ and $ {\\hat{R}\\in\\mathbb{R}^{m\\times n}}$. Compared to the original standard QR decomposition, the $ {Q}$ is completed to an orthogonal matrix $ {\\hat{Q}}$, and zeros are attached to the additional rows (if there are any) of $ {R}$. Since the matrices $ {H\_{i}}$ are orthogonal, the procedure is much more stable.  

We haven't spoken about the choice of these matrices. A particularly useful and simple choice is the *Householder reflection*. As the name suggests, it is a reflection in the space $ {\\mathbb{R}^{m}}$, with respect to certain $ {m-1}$ dimensional hyperplane containing the orgin. This hyperplane is defined by a unit normal vector $ {{\\bf u}}$ to it. The Householder reflection associated to the unit vector $ {{\\bf u}}$ is defined to be  

$ \\displaystyle H=I-2{\\bf u}{\\bf u}^{T}. $

As a first check, note that  

$ \\displaystyle H{\\bf u}=-{\\bf u}. $

And if $ {{\\bf x}}$ is such that $ {{\\bf u}^{T}{\\bf x}=0}$, then $ {H{\\bf x}={\\bf x}}$. Hence $ {H}$ is a reflection. Also, $ {H^{T}=H}$.  

> **Exercise 1** *Show directly that the above matrix $ {H}$ is orthogonal.*

Why Householder matrices are useful in our context? Suppose  

$ \\displaystyle A=\\begin{pmatrix}\\\\ {\\bf a}\_{1} & {\\bf a}\_{2} & \\cdots & {\\bf a}\_{n}\\\\ \\\\ \\end{pmatrix}. $

We can tranform the first column of $ {A}$, using a Householder reflection, to $ {\\|{\\bf a}\_{1}\\|{\\bf e}\_{1}}$, namely  

$ \\displaystyle H\_{1}{\\bf a}\_{1}=\\begin{pmatrix}\\|{\\bf a}\_{1}\\|\\\\ 0\\\\ \\vdots\\\\ 0 \\end{pmatrix}={\\bf r}\_{1}. $

The matrix $ {H\_{1}}$ can be found by noting that the vector $ {{\\bf a\_{1}}-{\\bf r}\_{1}}$ should be perpendicular to the hyperplane, and so the defining unit vector of $ {H\_{1}}$ should be  

$ \\displaystyle \\frac{{\\bf a\_{1}}-{\\bf r}\_{1}}{\\|{\\bf a\_{1}}-{\\bf r}\_{1}\\|}. $

> **Exercise 2** Let $ {{\\bf u=}\\frac{{\\bf a\_{1}}-{\\bf r}\_{1}}{\\|{\\bf a\_{1}}-{\\bf r}\_{1}\\|}}$, ${H=I-2{\\bf u}{\\bf u}^{T}}$. Show that  
> 
> $ \\displaystyle H{\\bf a}\_{1}={\\bf r}\_{1}. $

Now, to proceed further, we want to find a matrix $ {H\_{2}}$ such that the second column of $ {H\_{2}H\_{1}A}$ is from a upper triangular matrix. The choice for the normal unit vector is now  

$ \\displaystyle \\frac{{\\bf a}-{\\bf r}}{\\|{\\bf a}-{\\bf r}\\|} $

where  

$ \\displaystyle {\\bf a}^{(2)}=\\begin{pmatrix}0\\\\ H\_{1}{\\bf a}\_{2}(2:end) \\end{pmatrix},\\quad{\\bf r}^{(2)}=\\begin{pmatrix}0\\\\ \\|{\\bf a}^{(2)}\\|\\\\ 0\\\\ \\vdots\\\\ 0 \\end{pmatrix}. $

You should check that the matrix $ {H\_{2}}$ actually does not operate on the first entry in $ {H\_{1}{\\bf a}\_{2}}$. In fact the first dimension remain fixed under the action of $ {H\_{2}}$. And so the first column of $ {H\_{1}{\\bf a}\_{1}}$ is not changed. We can keep going in this manner to define $ {H\_{3},\\dots H\_{m}}$, and obtain the variant of QR decomposition we mentioned earlier  

$ \\displaystyle A=H\_{1}H\_{2}\\cdots H\_{m}\\hat{R}=\\hat{Q}\\hat{R}. $

**2.2. Solving least square problem using the QR decomposition.** The QR decomposition of a "slim matrix'' can be useful for solving the least square problem  

$ \\displaystyle \\min\_{{\\bf x}\\in\\mathbb{R}^{n}}\\|A{\\bf x}-{\\bf b}\\|^{2} $

where $ {A\\in\\mathbb{R}^{m\\times n}}$, $ {m>n}$ and $ {\\|\\cdot\\|}$ is the usual $ {\\ell^{2}}$ norm. This formulation is one way to solve the over-determined system $ {A{\\bf x}={\\bf b}}$.  

Using the standard QR decomposition of $ {A=QR}$, we find  

$ \\displaystyle QR{\\bf x}={\\bf b}. $

Now multiplying two sides by $ {Q^{\*}}$, and noting that $ {Q^{\*}Q=I\_{n\\times n}}$, we get  

$ \\displaystyle R{\\bf x}=Q^{\*}{\\bf b}. $

Hence if $ {A}$ has full rank, so $ {R}$ is invertible and we can obtain a unique solution $ {{\\bf x}^{\*}}$of the above transformed system.  

We claim that  

$ \\displaystyle {\\bf x}^{\*}=\\arg\\min\_{{\\bf x}\\in\\mathbb{R}^{n}}\\|A{\\bf x}-{\\bf b}\\|^{2}. $

It is a quadratic distance problem and we have the Pythagoras theorem at our hand. It amounts to show that the error $ {A{\\bf x}^{\*}-{\\bf b}}$ is orthogonal to the column space $ {\\text{col}(A)}$ of $ {A}$. Now $ {A=QR}$, where colums of $ {Q}$ form an orthonormal basis of $ {\\text{col}(A)}$. So by multiplying $ {Q^{\*}}$ with $ {A{\\bf x}^{\*}-{\\bf b}}$ on the right, we orthogonally project the error to $ {\\text{col}(A)}$, and we get  

$ \\displaystyle Q^{\*}(A{\\bf x}^{\*}-{\\bf b})=R{\\bf x}^{\*}-Q^{\*}{\\bf b}=0 $

by definition of $ {{\\bf x}^{\*}}$. Hence the error is orthogonal to $ {\\text{col}(A)}$ and the claim is thus proved.  

**2.3. The QR algorithm.**  
What does $ {QR}$ decomposition have anything to do with the eignvalues? It is indeed a surprise that a fast and stable method of computing the eigenvalues is based on this decomposition. We describe the algorithm first.  

> Given a square matrix $ {A^{(0)}=A\\in\\mathbb{R}^{n\\times n}}$, the QR iteration does the following: for $ {k=1,2,\\dots}$  
> 
> 1.  Do the QR factorisation $ {A^{(k-1)}=Q^{(k)}R^{(k)}}$.
> 2.  Update $ {A^{(k)}=R^{(k)}Q^{(k)}}$.

Under the certain assumptions, the matrix $ {A^{(k)}}$ should eventually approach a triangular matrix, where on the diagonal there lie the eigenvalues of $ {A}$! The QR iteration actually computes the *Schur decomposition* of $ {A}$:  

$ \\displaystyle A=Q^{(\\infty)\*}A^{(\\infty)}Q^{(\\infty)}, $

where $ {Q^{(\\infty)},A^{(\\infty)}}$ are the limits of the QR algorithm, being orthogonal and upper triangular, respectively. If $ {A}$ is real symmetric, then $ {A^{(\\infty)}}$ is in fact diagonal and $ {Q^{(\\infty)}}$ contains the corresponding eigenvectors.  

We note that each $ {A^{(k)}}$ is actually similar to $ {A}$, since  

$ \\displaystyle Q^{(k)\*}A^{(k-1)}Q^{(k)}=R^{(k)}Q^{(k)}=A^{(k)} $

so inductively  

$ \\displaystyle A^{(k)}=Q^{(k)\*}\\cdots Q^{(1)\*}AQ^{(1)}\\cdots Q^{(k)}. $

So each $ {A^{(k)}}$ has the same eigenvalues with $ {A}$. Furthermore, we have  

$ \\displaystyle A^{2}=Q^{(1)}R^{(1)}Q^{(1)}R^{(1)}=Q^{(1)}Q^{(2)}R^{(2)}R^{(1)}, $

so inductively  

$ \\displaystyle A^{k}=Q^{(1)}\\cdots Q^{(k)}R^{(k)}R^{(k-1)}\\cdots R^{(1)}. $

We now have a QR decomposition of $ {A^{k}}$! Now $ {Q^{(1)}\\cdots Q^{(k)}}$ can be seen to be equivalent to applying the simutaneous iteration to the standard basis $ {I=\\begin{pmatrix}{\\bf e}\_{1} & {\\bf e}\_{2} & \\cdots & {\\bf e}\_{n}\\end{pmatrix}}$. More explanation about its relation to the power iteration and convergence in a special case can be found [here](http://sylqiu.blogspot.hk/2017/01/qr-algorithms-for-eigenvalue-problem.html).  

We make some final remarks about the QR algorithm as stated. It is too inefficient to be effective. There are two refinements that make it more competitive:  

1.  Reduction of the matrix $ {A}$ to *Hessenberg form*.
2.  Use of shift to accelerate convergence.

We won't pursue these topics here.
