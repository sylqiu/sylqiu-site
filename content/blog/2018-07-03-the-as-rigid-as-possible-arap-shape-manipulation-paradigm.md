---
id: 2018-07-03-the-as-rigid-as-possible-arap-shape-manipulation-paradigm
title: "The as-rigid-as-possible (ARAP) shape manipulation paradigm"
date: 2018-07-03
tags: ["computer graphics", "discrete conformal geometry"]
source: https://sylqiu.blogspot.com/2018/07/the-as-rigid-as-possible-arap-shape.html
publish: true
---
In an Euclidean space $ {\mathbb{R}^{d}}$, rigid motions are simply translations and rotations, which can be identified with the action of the groups $ {\mathbb{R}^{d}}$ and $ {SO(d)}$. The transformation applied to each point of the space (or object) is the same. The rigid motions in low dimensions $ {d=2,3}$, especially rotations, have been widely used in various daily computer graphics applications with the help of complex numbers and quaternions.  

But deformations of surfaces common to our experience, such as bending of a thin metal sheet, waving of a flag, or winkling of a cloth, are not as simple as rotations. From a geometric point of view, the deformations are only *locally rigid*. A course in differential geometry would tell us such a deformation is an isometry, i.e. it should preserve the geodesic distance of two arbitrary points, so no *stretching nor shearing* is allowed. Denote the bijective mapping by $ {f:M\rightarrow\tilde{M}}$. This (intrinsic) isometric property can be expressed as an differential equation plus an orientation constraint \\begin{align\*} & df^{T}df=Id\_{2}\\,&\\,\\det(df)>0  
\\iff & df\\in SO(2). \\end{align\*} And so we see that at the tangent space level, the mapping is a rotation.  

In dimension $ {d=2}$, conformal geometry naturally enters the picture via the following. First, we relax the differential equation to  

$ \displaystyle df^{T}df=\varphi\cdot Id_{2} $

for a positive scalar valued function $ {\varphi>0}$. This means we allow the mapping to also exibit the scaling effect, while the angles are still preserved. Taking determinants of both sides, we see that $ {\varphi=\det(df)}$. Multiplying $ {(df)^{-1}}$ on the right, we obtain the *Cauchy-Riemann equations*. In case $ {\tilde{M}\subset\mathbb{R}^{2}}$ of *conformal flattening* it simplifies to  

$ \displaystyle \nabla u=\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}\nabla v $

where we denote $ {f=(u,v)}$. We will often use $ {\nabla}$ and $ {d}$ to distinguish the extrinsic coordinate expressions and intrinsic expressions.  

So far we have not mentioned the curvature properties of the deformation. If the surface deformation is a genuine isometry, then the intrinsic geometric quantities such as Gaussian curvature are of course preserved. But we cannot yet talk about the extrinsic quantities such as mean curvature property of the mapping using the above intrinsic description since the mean curvature is determined by how the surface is embedded in the ambient space. These extrinsic properties, however, do appear in the three dimensional ARAP surface deformation model, which will be clear once we see it.  

The above simple discussion should provide a basic geometric concept of the rigid deformation modeling, as we next explain in detail.  

> **Problem 1** *Find a deformation of a $ {d}$-dimensional ($ {d=2,3}$) manifold possibly with boundary, satisfying selected point position constraints, so that the deformation is visually physically plausible (e.g. length preserving, volume repserving, smooth etc.).*

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczeQhsDiyyDXGBWF5eFbvNalfU_Zqdp5IZu5ehoaKLPPjHzA6nYJ5WtVK5l6yTuUTS8OZyHT1OxbR_ZRpgt8JkzZozSnD8Z01h-uj6cw27qhkSncF7n0koQxU5OKja_PfywyZWn2RgOs/s400/fig1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjczeQhsDiyyDXGBWF5eFbvNalfU_Zqdp5IZu5ehoaKLPPjHzA6nYJ5WtVK5l6yTuUTS8OZyHT1OxbR_ZRpgt8JkzZozSnD8Z01h-uj6cw27qhkSncF7n0koQxU5OKja_PfywyZWn2RgOs/s1600/fig1.png)

Figure taken from Alexa and Sorkine's paper.

**1.1. Takeo's ARAP ($ {d=2}$)**

In a 2005 paper, Takeo Iragashi et al. proposed a planar triangulated shape manipulation method. The algorithm consists of two steps with closed-form solutions, which are a "free-scale initialisation'' and a "scale adjustment'' step. The first step can be seen as a harmonic mapping trying to minimise the Dirichlet energy satisfying the point position constraints. For this reason, it is related to the Laplacian mesh editing method of Sorkine et al. in 2004, and to the earlier least square conformal flattening algorithms of Levy, Desbrun and so on around 2002. In my opinion, other as-rigid-as-possible ideas, to some extent, are modifications and extensions to the methodology here, although important details differ.  

The first step boils down to a simple observation about the triangle. Let us take any triangle and normalise the coordinate so that its vertices are $ {v_{0}=(0,0)}$, $ {v_{1}=(1,0)}$, $ {v_{2}=(x,y)}$. Then for example, the third vertex can be written as  

$ \displaystyle \begin{array}{rcl} v_{2} & = & v_{0}+x\cdot(v_{1}-v_{0})+y\cdot\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}(v_{1}-v_{0})\\ & = & v_{0}+\begin{pmatrix}x & -y\\ y & x \end{pmatrix}(v_{1}-v_{0}). \end{array} $

In this case $ {x,y}$ are also the *relative coordinate* in this triangle $ {T=[v_{1},v_{2},v_{3}]}$. Each vertex of the oriented triangle has a relative coordinate. It turns out that these relative coordinates can encode the trangular mesh up to translation, rotation and scaling. The reason is quite simple. Suppose the relative coordinate of $ {v_{i}(T)}$ is $ {(a_{i}(T),b_{i}(T))}$. We can define an "as-similar-as-possible'' energy  

$ \displaystyle E^{ASAP}(v_{1},\dots,v_{|V|})=\sum_{T\in\mathcal{T}}\sum_{v_{i}(T)}\|v_{2+i}-v_{i}-\begin{pmatrix}a_{i} & -b_{i}\\ b_{i} & a_{i} \end{pmatrix}(v_{1+i}-v_{i})\|^{2}, $

where indices modulo $ {3}$ as appropriate, and note that different triangles $ {T,T'}$ can share a same vertex, in which case the variable $ {v_{i}(T)=v_{j}(T')}$ is taken to be the same.If the relative coordinates indeed arise from a valid triangular mesh, then the energy has a unique minimum $ {E^{ASAP}=0}$. In any case, the energy is quadratic in $ {v_{i}}$ and positive semi-definite, its critical point equation is a linear system.  

We remark here the relation with the least square conformal mapping (LSCM). For this we have to first review about the discretisation of the Laplace-Beltrami operator on a mesh. We consider the mapping to be linear over each triangle. In finite element terminolgy this means we choose the basis function to be piecewise-linear. There are $ {|V|}$ number of such basis functions, each peaked at the associated vertex with value $ {1}$ and vanishes at all others. The discretised Laplace-Beltrami operator $ {\Delta_{M}}$ with zero boundary condition satisfies  

$ \displaystyle \sum_{T\in\mathcal{T}}\langle\nabla\varphi(T),\nabla\phi(T)\rangle_{T}=-\sum_{v\in V}\varphi(v)\cdot\Delta_{M}\phi(v), $

where $ {\nabla}$ is the gradient operator, $ {\langle\cdot,\cdot\rangle_{T}}$ is the Euclidean inner product scaled by the area of the triangle $ {T}$. On an oriented triangle $ {T=[v_{0},v_{1},v_{2}]}$, since the functions being considered are linear, the gradient of a function $ {\varphi=(\varphi_{0},\varphi_{1},\varphi_{2})}$ on this triangle is the vector  

$ \displaystyle \nabla\varphi=\frac{1}{2\text{Area}(T)}\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}\sum_{i=0,1,2}\varphi_{i}(v_{2+i}-v_{1+i}). $

The area term in the denominator as well as the matrix $\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}$ comes from matrix inversion. Therefore,  

$ \displaystyle \begin{array}{rcl} \langle\nabla\varphi(T),\nabla\phi(T)\rangle_{T} & = & -\frac{1}{4\text{Area}(T)}\sum_{i,j}\varphi_{i}\phi_{j}(v_{2+i}-v_{1+i})^{T}(v_{2+j}-v_{1+j})\\ & = & -\sum_{i,j}\omega_{ij}(T)\varphi_{i}\phi_{j} \end{array} $

where  

$ \displaystyle \omega_{ij}(T)=\begin{cases} -\frac{1}{2}\cot\theta_{k},\,k\neq i,j & \text{if }i\neq j\\ \frac{1}{2}(\cot\theta_{i+1}+\cot\theta_{i+2}) & \text{if }i=j \end{cases}      (1)$

where $ {\theta_{k}}$ is the angle of the triangle at $ {v_{k}}$. (Note that we have used the $ {\omega_{ij}(T)}$ to differentiate itself from the common notation of $ {\omega_{ij}}$, which is the accumulated weight). This is called the *cotangent weight*. The corresponding assembled matrix $ {\mathcal{L}}$ approximating the Laplace-Beltrami operator will be called the *cotangent matrix*. Now, the LSCM minimises the quadratic discrepancy of the Cauchy-Riemann  

$ \displaystyle \begin{array}{rcl} & \int_{M}\|\nabla u-\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}\nabla v\|^{2}d\text{Vol}\\ \leftrightarrow & \sum_{T\in\mathcal{T}}\|\nabla u\|_{T}^{2}+2\langle\nabla u,\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}\nabla v\rangle_{T}+\|\nabla v\|_{T}^{2}. \end{array} $

Thus the cotangent matrix naturally comes out from the Dirichlet energy terms. Moreover, there is a cross term $ {\sum_{T\in\mathcal{T}}\langle\nabla u,\begin{pmatrix}0 & -1\\ 1 & 0 \end{pmatrix}\nabla v\rangle_{T}}$, which is in fact the area of the mapping, and plays the role of coupling boundary condition of $ {u}$ and $ {v}$. Some straightforward algebra will show that the "element matrix'' of each triangle of LSCM in fact defers from that of $ {E^{ASAP}}$ by a multiplicative factor depending on the triangle. I would say LSCM formulation is more preferable in general.

In effect, the first step can be regarded as an "integration'' step that integrates the relative coordinates into a mapping that satisfies the position constraints. There are other methods of "integration'', notably via minimizing quadratic energy of the form $ {\int_{M}\|\nabla f-w\|^{2}d\text{Vol}}$, for some desirable estimate $ {w}$ of $ {\nabla f}$, which amounts to solving a Poisson equation. The "scale adjustment'' step is also one of this flavor. The estimatation $ {w}$ is more interesting in Alexa and Sorkine's formulation, discussed next.  

**1.2. Alexa and Sorkine's ARAP ($ {d\geq2}$)**

Assume we have already some initial but possibly not desirable deformation $ {f}$, and the question is how to improve it in the sense of Problem [1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#defFind-a-deformation)? The intuitive idea is look at how far the action of differential $ {df}$ is different from the action of a rotation. This motivates the energy formulation  

$ \displaystyle E^{ARAP}(v'_{i},R_{T};1\leq i\leq|V|,T\in\mathcal{T})=\sum_{T\in\mathcal{T}}\sum_{i=0,1,2}\omega_{i,i+1}(T)\|(v'_{i+1}-v'_{i})-R_{T}(v_{i+1}-v_{i})\|^{2}, $

where $ {R_{T}}$ is a rotation in dimension $ {d=2}$ or $ {3}$, constant on each triangle. Let's fix $ {d=3}$ for generality. Notice the quadratic term in $ {v'}$ here. Rearranging, we see that a lot of terms cancel out  

$ \displaystyle \begin{array}{rcl} & \sum_{i=0,1,2}\omega_{i,i+1}(T)\cdot(v'_{i+1}-v_{i}')^{T}(v'_{i+1}-v'_{i})\\ = & \sum_{i=0,1,2}\omega_{i,i+1}(T)\cdot(v_{i+1}^{'T}v'_{i+1}-2v_{i+1}^{'T}v'_{i}+v_{i}^{'T}v'_{i})\\ = & -\sum_{i=0,1,2}\big(\omega_{i+1,i+1}(T)\cdot v_{i+1}^{'T}v'_{i+1}+\omega_{i+1,i+2}(T)\cdot v_{i+1}^{'T}v'_{i+1}+\\ & 2\cdot\omega_{i+1,1}(T)\cdot v_{i+1}^{'T}v'_{i}+\\ & \omega_{i,i}(T)\cdot v_{i}^{'T}v'_{i}+\omega_{i,i+2}(T)\cdot v_{i}^{'T}v'_{i}\big)\\ = & -\sum_{i,j}\omega_{ij}(T)\cdot v_{i}^{'T}v'_{j} \end{array} $

where we have made use of the relation in ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)). Thus this term is actually $ {\int_{M}\|\nabla f\|^{2}d\text{Vol}=\int_{M}\|\nabla u\|^{2}+\|\nabla v\|^{2}+\|\nabla w\|^{2}d\text{Vol}}$ if we write $ {f=(u,v,w)}$. Similarly, we see that the cross term writes  

$ \displaystyle -\sum_{i,j}\omega_{ij}(T)\cdot v_{i}'^{T}(R_{T}v_{j}')\leftrightarrow\int_{M}\langle\nabla f,R\rangle_{F}d\text{Vol} $

where $ {R}$ is regarded as a $ {SO(3)}$-valued vector field, and $ {\langle\cdot,\cdot\rangle_{F}}$ is the Frobenius inner product for matrices. We see that the energy has a continuous analog  

$ \displaystyle \int_{M}\|\nabla f-R\|_{F}^{2}d\text{Vol}. $

To minimize the energy, which depends on both $ {f}$ and $ {R}$, a simple block coordinate descent (alternating minimisation) shows to be effective. This means an iteration that 1) fixes $ {f}$ and find the best rotation field $ {R}$, and 2) fixes $ {R}$ and find the best $ {f}$. The first subproblem clearly concerns with the singular value of $ {\nabla f}$ because of the Frobenius norm. In fact, the best choice comes from the singular value decompostion of $ {\nabla f=U\Sigma V^{T}}$. The best rotation is then given by $ {R^{*}=UV^{T}}$ with possible change of sign of a column of $ {V^{T}}$ to ensure positive determinant. Then in the second subproblem $ {f}$ is integrated back by solving a Poisson equation.

Now it is very tempting to suggest a relaxed model based on the observation about the singular value decomposition and the best fitting rotation. We could be less stringent on the rigidity of the deformation. One way is to bound the condition number of the mapping differential. In dimension $ {d=2}$ this leads to the class of *quasiconformal mappings*.
