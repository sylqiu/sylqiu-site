---
id: 2018-03-03-math3310-note-7-the-discrete-fourier-transform-fft
title: "MATH3310 Note 7: The discrete Fourier transform; FFT"
date: 2018-03-03
tags: ["cuhk.math3310", "numerical methods"]
source: https://sylqiu.blogspot.com/2018/03/math3310-note-7-discrete-fourier.html
publish: true
---
**1\. The discrete Fourier transform**

Perhaps the most useful way to introduce the discrete Fourier transform is to look at what properties make it so important in practice. Long story short, discrete Fourier transform diagonalizes an important class of matrices, namely the discrete convolutions. Below we will see why it is so.  

First, we identify the set of functions on $ {\\mathbb{Z}\_{N}=\\{0,1,\\dots,N-1\\}}$ with the vector space $ {\\mathbb{C}^{N}}$.  

On the vector space $ {\\mathbb{C}^{N}}$, let us define a left-shift operation $ {T\_{L}}$ on $ {\\mathbb{C}^{N}}$, which maps any vector in $ {\\mathbb{C}^{N}}$  

$ \\displaystyle {\\bf a}=\\begin{pmatrix}a\_{0} & a\_{1} & \\cdots & a\_{N-1}\\end{pmatrix}^{T}\\mapsto T\_{L}({\\bf a}):=\\begin{pmatrix}a\_{1} & a\_{2} & \\cdots & a\_{0}\\end{pmatrix}^{T}. $

It is easy to check that this left-shift operation $ {T\_{L}}$ is a linear transformation on $ {\\mathbb{C}^{N}}$, which can be written as a matrix  

$ \\displaystyle T\_{L}=\\begin{pmatrix} & 1\\\\ & & 1\\\\ & & & \\ddots\\\\ & & & & 1\\\\ 1 \\end{pmatrix} $

multiplying on the left of the vector $ {{\\bf a}}$. The right-shift operation is defined as $ {T\_{R}:=T\_{L}^{-1}}$. We are interested in the eigenvectors of this matrix $ {T\_{L}}$.  

> **Exercise 1** *Check that a set of eigenvectors $ {\\{{\\bf e}^{k}\\}\_{k=0}^{N-1}\\subset\\mathbb{C}^{N}}$ of the matrix $ {T\_{L}}$ are*  
> 
> *$ \\displaystyle {\\bf e}^{k}=\\begin{pmatrix}1 & e^{2\\pi ik/N} & e^{2\\cdot2\\pi ik/N} & \\cdots & e^{(N-1)2\\pi ik/N}\\end{pmatrix}^{T}. $*

Writing it more systematically, we denote the $ {N\\times N}$ matrix  

$ \\displaystyle F=\\begin{pmatrix}{\\bf e}{}^{0} & {\\bf e}{}^{1} & \\cdots & {\\bf e}^{N-1}\\end{pmatrix} $

and we see that  

$ \\displaystyle T\_{L}F=F\\Lambda:=F\\begin{pmatrix}1 & & & 0\\\\ & e^{2\\pi ik/N}\\\\ & & \\ddots\\\\ 0 & & & e^{(N-1)2\\pi ik/N} \\end{pmatrix}. $

> **Exercise 2** *Show that $ {F^{-1}=\\frac{1}{N}F^{\*}}$, where $ {F^{\*}}$ is the Hermittian transpose of $ {F}$. Therefore, the above can be written as*  
> 
> *$ \\displaystyle \\frac{1}{N}F^{\*}T\_{L}F=\\Lambda. $*

Now we employ a crucial result from linear algebra.  

> **Exercise 3** *[](https://www.blogger.com/null)Let $ {A,B}$ be matrices with entries in $ {\\mathbb{C}}$. Suppose that two matrices commute, that is*  
> 
> *$ \\displaystyle AB=BA. $*
> 
> *And suppose further that the matrix $ {B}$ has $ {N}$ distinct eigenvalues. Then every eigenvector of $ {B}$ is also an eigenvector of $ {A}$. Consequently, $ {A}$ can diagonalized by the same matrices that diagonalize $ {B}$.*

This result leads us to consider what matrices commute with $ {T\_{L}}$. It is quite easy to find these matrices: they are circulant matrices, which are of the form  

$ \\displaystyle T\_{{\\bf a}}:=\\begin{pmatrix}a\_{0} & a\_{N-1} & \\cdots & a\_{1}\\\\ a\_{1} & a\_{0} & \\cdots & a\_{2}\\\\ \\vdots & & & \\ddots\\\\ a\_{N-1} & a\_{N-2} & \\cdots & a\_{0} \\end{pmatrix},\\quad{\\bf a}=\\begin{pmatrix}a\_{0}\\\\ a\_{1}\\\\ \\vdots\\\\ a\_{N-1} \\end{pmatrix}\\in\\mathbb{C}^{N}. $

The linear transformations on $ {\\mathbb{C}^{N}}$ associated to these circulant matrices are called **discrete convolutions**.  

> **Exercise 4** *Let $ {{\\bf a},{\\bf b}\\in\\mathbb{C}^{N}}$. The discrete convolution of $ {{\\bf a}}$ and $ {{\\bf b}}$ is denoted as $ {{\\bf a}\*{\\bf b}:=T\_{{\\bf a}}{\\bf b}}$. Show that*  
> 
> *$ \\displaystyle ({\\bf a}\*{\\bf b})\_{i}=(T\_{{\\bf a}}{\\bf b})\_{i}=\\sum\_{k=0}^{N-1}a\_{i-k}b\_{k},\\quad i=0,\\dots,N-1 $*
> 
> *where indices are modulo $ {N}$ as appropriate.*

As a consequence of Exercise [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#exer3), we see that circulant matrices $ {T\_{{\\bf a}}}$ are diagonalized by the matrix $ {F}$  

$ \\displaystyle \\frac{1}{N}F^{\*}T\_{{\\bf a}}F=\\Lambda\_{T\_{{\\bf a}}}. $

And we will refer the linear transformation $ {F^{-1}}$ as the **discrete Fourier transform**.  
Now let's look at some examples.  

> **Example 1** *The central difference scheme of the second derivative with periodic boundary condition uses the following matrix*  
> 
> *$ \\displaystyle \\begin{pmatrix}-2 & 1 & & & 1\\\\ 1 & -2 & 1\\\\ & 1 & -2 & 1\\\\ & & & \\ddots\\\\ 1 & & & 1 & -2 \\end{pmatrix} $*
> 
> *can be diagonalized by the discrete Fourier transform.*

> **Exercise 5** *Let $ {p\_{1}^{(0)},\\dots,p\_{n}^{(0)}}$ be $ {n}$ points in $ {\\mathbb{R}^{N}}$, given in such an order. Assume further that their mass is centered at the origin*  
> 
> *$ \\displaystyle \\frac{1}{n}\\sum\_{i=1}^{n}p\_{i}^{(0)}=0. $*
> 
> *Each time we compute the midpoint of the two neighboring points,*  
> 
> *$ \\displaystyle p\_{i}^{(k)}=\\frac{1}{2}\\left(p\_{i}^{(k-1)}+p\_{i+1}^{(k-1)}\\right) $*
> 
> *and we consider $ {p\_{1}^{(k)}}$ and $ {p\_{n}^{(k)}}$ to be also neighboring points. Show that these $ {n}$ points converge to the origin.*

> **Exercise 6** *What is the matrix for the central difference scheme with homogeneous Dirichlet boundary condition? Can you still diagonalize it with discrete Fourier transform?*

> **Exercise 7** *What is the matrix for the central difference scheme with homogeneous Neumann boundary condition? Can you still diagonalize it with discrete Fourier transform?*

> **Example 2** *The previous JPEG standards uses **discrete cosine transform (DCT)**. It can be regarded as a special case of the discrete Fourier transform. In one-dimension, it amounts to extend the image on $ {\\mathbb{Z}\_{N}}$ evenly on $ {\\mathbb{Z}\_{2N}}$. Of course these is also a discrete sine transform. The current JPEG-2000 standard uses wavelet transforms, which is beyond the scope here.*

> **Exercise 8** *The **auto-correlation** of a vector $ {{\\bf v}\\in\\mathbb{C}^{N}}$ is defined to be*  
> 
> *$ \\displaystyle {\\bf r}=T\_{\\overline{{\\bf v}}}{\\bf v} $*
> 
> *where $ {T\_{\\overline{{\\bf v}}}}$ is defined as before, $ {\\bar{{\\bf v}}}$ is the entry-wise complex conjugation of $ {{\\bf v}}$. What are the discrete Fourier coefficients of $ {{\\bf r}}$?*

**2\. The fast Fourier transform: FFT**

Let us denote the discrete Fourier transform matrix on $ {\\mathbb{C}^{N}}$ to be $ {F\_{N}}$. For example,  

$ \\displaystyle F\_{2}=\\begin{pmatrix}1 & 1\\\\ 1 & -1 \\end{pmatrix} $

and  

$ \\displaystyle F\_{4}=\\begin{pmatrix}1 & 1 & 1 & 1\\\\ 1 & i & -1 & -i\\\\ 1 & -1 & 1 & -1\\\\ 1 & -i & -1 & i \\end{pmatrix}. $

The whole thing of FFT is the observation that $ {F\_{N}}$ and $ {F\_{N/2}}$ is related. So that when $ {N=2^{n}}$, an extremely efficent algorithm can be designed, implicitly computing the matrix multiplication $ {{\\bf y}=F\_{N}{\\bf x}}$.  
What is the relation between $ {F\_{N}}$ and $ {F\_{N/2}}$? Recall that  

$ \\displaystyle (F\_{N})\_{j,k}=e^{2\\pi ijk/N}. $

So  

$ \\displaystyle (F\_{N/2})\_{m,l}=(F\_{N})\_{2m,l}=(F\_{N})\_{m,2l}. $

There are remaining entries in $ {F\_{N}}$ that are not in $ {F\_{N/2}}$. But these entries are those with double odd indices, each of which differs from its nearby even-index entries in the same row by a power of $ {e^{2\\pi i/N}}$, depending which row it lies. We are thus inspired to separate the input according to its indice's parity.  
Take $ {N=4}$ for an example. Let $ {{\\bf x}=\\begin{pmatrix}x\_{0} & x\_{1} & x\_{2} & x\_{3}\\end{pmatrix}^{T}}$. We write  

$ \\displaystyle \\begin{array}{rcl} {\\bf x}' & = & \\begin{pmatrix}x\_{0} & x\_{2}\\end{pmatrix}^{T}\\\\ {\\bf x}'' & = & \\begin{pmatrix}x\_{1} & x\_{3}\\end{pmatrix}^{T}. \\end{array} $

And suppose $ {F\_{2}}$ is known. So here we can compute  

$ \\displaystyle \\begin{array}{rcl} {\\bf y}' & = & F\_{2}{\\bf x}'\\\\ {\\bf y}'' & = & F\_{2}{\\bf x}'' \\end{array} $

How do we get $ {F\_{4}{\\bf x}}$ from $ {{\\bf y'}}$ and $ {{\\bf y}''}$? Inspecting closely the matrix $ {F\_{4}}$, we see that  

$ \\displaystyle \\begin{array}{rcl} & F\_{4}{\\bf x}\\\\ & = & \\begin{pmatrix}1\\\\ & 1\\\\ 1\\\\ & 1 & & \\, \\end{pmatrix}\\begin{pmatrix}1 & 1\\\\ 1 & -1\\\\ \\\\ & & & \\, \\end{pmatrix}\\begin{pmatrix}x\_{0}\\\\ x\_{2}\\\\ \\\\ \\, \\end{pmatrix}+\\begin{pmatrix} & & 1\\\\ & & & i\\\\ & & -1\\\\ & & & -i \\end{pmatrix}\\begin{pmatrix}\\,\\\\ \\\\ & & 1 & 1\\\\ & & 1 & -1 \\end{pmatrix}\\begin{pmatrix}\\,\\\\ \\\\ x\_{1}\\\\ x\_{3} \\end{pmatrix}\\\\ & = & \\begin{pmatrix}1 & & 1\\\\ & 1 & & i\\\\ 1 & & -1\\\\ & 1 & & -i \\end{pmatrix}\\begin{pmatrix}1 & 1\\\\ 1 & -1\\\\ \\\\ & & & \\, \\end{pmatrix}\\begin{pmatrix}x\_{0}\\\\ x\_{2}\\\\ \\\\ \\, \\end{pmatrix}+\\begin{pmatrix}1 & & 1\\\\ & 1 & & i\\\\ 1 & & -1\\\\ & 1 & & -i \\end{pmatrix}\\begin{pmatrix}\\,\\\\ \\\\ & & 1 & 1\\\\ & & 1 & -1 \\end{pmatrix}\\begin{pmatrix}\\,\\\\ \\\\ x\_{1}\\\\ x\_{3} \\end{pmatrix}\\\\ & = & \\begin{pmatrix}1 & & 1\\\\ & 1 & & i\\\\ 1 & & -1\\\\ & 1 & & -i \\end{pmatrix}\\begin{pmatrix}1 & 1\\\\ 1 & -1\\\\ & & 1 & 1\\\\ & & 1 & -1 \\end{pmatrix}\\begin{pmatrix}1\\\\ & & 1\\\\ & 1\\\\ & & & 1 \\end{pmatrix}\\begin{pmatrix}x\_{0}\\\\ x\_{1}\\\\ x\_{2}\\\\ x\_{3} \\end{pmatrix} \\end{array} $

And factorising the $ {F\_{4}}$ into three matrices is essentially what FFT is doing. Notice that in the factorization of $ {F\_{4}}$, each matrix has a lot more zeros (each row has no more that two nonzero terms). This is essentially why FFT is fast.  
In general, the idea is the same. We have  

$ \\displaystyle y\_{j}=y\_{j}'+e^{j\\cdot2\\pi i/N}y''\_{j},\\quad j=0,\\dots,N/2-1 $

$ \\displaystyle y\_{j+N/2}=y\_{j}'-e^{j\\cdot2\\pi i/N}y''\_{j},\\quad j=0,\\dots,N/2-1 $

What is the computational cost of FFT? We can preorder the input using the binaries. So the permutations can be ignored. Then to go from the one level to the next, we need only perform $ {O(N)}$ additions and multiplications, there are $ {n=\\log\_{2}N}$ levels, so the total computational cost is $ {O(N\\log N)}$.
