---
id: 2017-02-08-a-brief-introduction-to-the-beltrami-equation-and-its-fem-di
title: "A brief introduction to the Beltrami equation and its FEM discretization"
date: 2017-02-08
tags: ["complex analysis", "discrete conformal geometry", "numerical methods"]
source: https://sylqiu.blogspot.com/2017/02/linear-beltrami-solver.html
publish: true
---
This post is an exposition to some of the background material and details of the linear Beltrami solver, which is an indispensable tool for my group of research. Interested readers can find relevant codes on [Lui's computational geometry lab](http://www.math.cuhk.edu.hk/~lmlui/gpp/). 

The references for this post are:

*Elliptic Partial Differential Equations and Quasiconformal Mappings in the Plane (PMS-48)*. Kari Astala, Tadeusz Iwaniec & Gaven Martin.

*Teichmuller mapping (T-map) and its applications to landmark matching registration.* Lui Lok Ming, Lam Ka Chun, Yau Shing-Tung & Gu Xianfeng.   

The method can be used to compute the surface quasiconformal homeomorphism such as [this](http://www.math.cuhk.edu.hk/~lmlui/TMapMC.html):

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDyVkkhGaoFXGTm2lwVopLDDOyBIwHYcqFLFDHd3TcA5wKa2INkXge-HdELtJ5NSTFD2e0a5D8jKdd1wCIAaJKf_DnoZjyp-K7Qw01p-LpxwLr4exkp6tZgX4wsi5mPPbiQc4OoxZyLt4/s320/faceparametrization.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgDyVkkhGaoFXGTm2lwVopLDDOyBIwHYcqFLFDHd3TcA5wKa2INkXge-HdELtJ5NSTFD2e0a5D8jKdd1wCIAaJKf_DnoZjyp-K7Qw01p-LpxwLr4exkp6tZgX4wsi5mPPbiQc4OoxZyLt4/s1600/faceparametrization.png)

**1.1. Measurable conformal structure**

In one complex variable, holomorphicity is one of the most fundamental notions: suppose for simplicity we have a $ {\\mathcal{C}^{1}}$ function $ {f=u+iv}$ defined on an open connected subset $ {\\Omega}$ of $ {\\mathbb{C}}$ (such is often called a *domain*). $ {f}$ is said to be holomorphic if its gradient satisfies the *Cauchy-Riemann equations*:  

$ \\displaystyle \\begin{array}{rcl} Df(z)=\\begin{bmatrix}u\_{x} & u\_{y}\\\\ v\_{x} & v\_{y} \\end{bmatrix} & = & \\begin{bmatrix}u\_{x} & -v\_{x}\\\\ v\_{x} & u\_{x} \\end{bmatrix} \\end{array} $

where we have identified $ {\\mathbb{C}}$ with $ {\\mathbb{R}^{2}}$ in the usual manner. Note that the Jacobian $ {J(f)=u\_{x}^{2}+v\_{x}^{2}\\geq0}$ and by Sard's lemma the set of vanishing Jacobian is of measure zero. Thus as a mapping between planar domains, $ {f}$ is orientation preserving almost everywhere. Let's verify that $ {f}$ in fact preserve oriented angles on the infinitesimal level, where we define the action of $ {f}$ at a point $ {z\_{0}\\in\\Omega}$ to be multiplication by the complex derivative  

$ \\displaystyle f'(z\_{0})=\\frac{\\partial}{\\partial z}f\\big|\_{z\_{0}}=\\frac{1}{2}\\left(u\_{x}+v\_{y}\\right)+\\frac{i}{2}\\left(u\_{y}-v\_{x}\\right)=u\_{x}-iv\_{x}. $

Recall that any complex number $ {a+ib}$ can be represented as  

$ \\displaystyle \\begin{pmatrix}a & -b\\\\ b & a \\end{pmatrix}. $

(We used parenthese deliberately to distinguish representation of complex numbers from linear systems we consider). So this action is in effect applying the differential $ {df=\\left(u\_{x}+iv\_{x}\\right)dx+\\left(u\_{y}+iv\_{y}\\right)dy}$ to the vectors in the tangent plane at $ {z\_{0}}$. Then that the action preserves angles follows immediately since the columns of the matrix are orthogonal, in the sense of Euclidean inner product. We can generalise the Euclidean inner product to other Riemannian metrics on $ {\\Omega}$. Let $ {S(2)}$ denote the space of real-valued, symmetric, positive definite matrices with determinant one. Then a Riemannian metric on $ {\\Omega}$ is defined as a mappping  

$ \\displaystyle A:\\Omega\\rightarrow\\mathbb{R}\_{>0}\\cdot S(2). $

$ \\displaystyle A(z)=\\begin{bmatrix}a & b\\\\ b & c \\end{bmatrix} $

This is the same as saying $ {A}$ is a symmetric positive definite $ {2}$-tensor field. On each tangent space at $ {z\\in\\Omega}$, the metric then defines an inner product  

$ \\displaystyle \\langle\\cdot,\\cdot\\rangle\_{A}=\\langle\\cdot,A(z)\\cdot\\rangle. $

We also say the Riemannian metric gives $ {\\Omega}$ a *Riemannian structure*.  

> **Remark 1** *Typically, one talks about a Riemannian structure on a *(real) smooth manifold*, which is given by a *smooth section* of the $ {2}$-tensor bundle that is symmetric and positive definite, which is usually defined using *charts*. So strictly speaking, a Riemannian structure should come as an equivalence class of the metrics defined on these charts, which agree with each other whenerver the charts overlap. But here since $ {\\Omega\\subset\\mathbb{C}}$ has a global chart, there is seldom confusion.*

It is clear from the definition of the metric $ {A}$ that it is *conformally equivalent* to another metric  

$ \\displaystyle G:\\Omega\\rightarrow S(2), $

namely, $ {G=\\left(\\det A\\right)^{-1/2}A}$. We say that $ {G}$ is *bounded* if the set $ {\\{G(z):z\\in\\Omega\\}}$ is bounded in $ {\\mathbb{R}^{4}}$, and *measurable* if individual slots in the matrix are mesurable functions from $ {\\Omega}$ to $ {\\mathbb{R}}$.  

> **Definition 1** *(Mesurable conformal structure) If $ {G:\\Omega\\rightarrow S(2)}$ is bounded and measurable, we call $ {G}$ a *measurable conformal structure* on $ {\\Omega}$. If $ {H:\\Omega'\\rightarrow S(2)}$ is a measurable conformal strucrture on $ {\\Omega'}$, a homeomorphism $ {f:\\Omega\\rightarrow\\Omega'}$ is said to be conformal from $ {\\left(\\Omega,G\\right)}$ to $ {\\left(\\Omega',H\\right)}$ if $ {f}$ preserves angles, i.e. for each $ {z\\in\\Omega}$, and vectors $ {\\xi,\\zeta}$ in the tangent plane at $ {z}$,[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\langle f\_{\*}\\xi,f\_{\*}\\zeta\\rangle\_{H}=\\phi\\langle\\xi,\\zeta\\rangle\_{G} \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)for some positive measurable function $ {\\phi}$.*

The conformal equivalence relation ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) can be translated to be a differential equation  

$ \\displaystyle D^{T}f(z)H(f(z))Df(z)=\\phi(z)G(z), $

where the derivative is interpreted in the weak sense. Note that taking determinants of both sides, we get $ {\\phi(z)=J(z,f)}$, resulting the so-called *Beltrami system*[](https://www.blogger.com/null)  

[$ \\displaystyle D^{T}f(z)H(f(z))Df(z)=J(z,f)G(z). \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)  

> **Remark 2** *If we take both $ {G=H=I}$, then we recover the usual conformal structure induced by the Euclidean metric. If $ {f=(u,v)}$ is conformal and differentiable, the equation ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) then reads*  
> 
> *$ \\displaystyle \\begin{bmatrix}u\_{x} & u\_{y}\\\\ v\_{x} & v\_{y} \\end{bmatrix}^{T}\\begin{bmatrix}1 & 0\\\\ 0 & 1 \\end{bmatrix}\\begin{bmatrix}u\_{x} & u\_{y}\\\\ v\_{x} & v\_{y} \\end{bmatrix}=\\left(u\_{x}v\_{y}-u\_{y}v\_{x}\\right). $*
> 
> *When the Jacobian is non-singular, then after multiplying the inverse of $ {D^{T}f(z)}$ on both sides, we obtain the Cauchy-Riemann equation.*

The solution to the equation ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) is of importance. For example, if $ {\\Omega=\\Omega'=\\mathbb{D}}$, then the existence of the solution then implies all Riemannian metrics on $ {\\mathbb{D}}$ are conformlly equivalent. This is in fact part of the uniformization theorem. Of course, for general different domains the solution may or may not exist, as can be seen from various \`\`conformal invariants'' for these domains. But for the moment we shall work only formally, to illustrate the ideas.  

**1.2. The linear distortion**

Given a homeomorphism $ {f:\\Omega\\rightarrow\\Omega'}$, we ask how far it deviates from a conformal map between standard conformal structures. The geometric observation is that conformal mappings map circles to circles, so we define  

> **Definition 2** *The linear distortion of $ {f}$ is*  
> 
> *$ \\displaystyle D(z,f)=\\limsup\_{r\\rightarrow0}\\frac{\\max\_{|\\zeta|=r}|f(z+\\zeta)-f(z)|}{\\min\_{|\\zeta|=r}|f(z+\\zeta)-f(z)|}. $*

First, we see that $ {f}$ is conformal at $ {z}$ if and only if $ {D(z,f)=1}$. If $ {f}$ is differentiable at $ {z}$, we can write the differential $ {df=f\_{z}dz+f\_{\\bar{z}}d\\bar{z}}$, where  

$ \\displaystyle \\frac{\\partial}{\\partial z}f=\\frac{1}{2}\\left(u\_{x}+v\_{y}\\right)+\\frac{i}{2}\\left(u\_{y}-v\_{x}\\right);\\quad\\frac{\\partial}{\\partial\\bar{z}}f=\\frac{1}{2}\\left(u\_{x}-v\_{y}\\right)+\\frac{i}{2}\\left(u\_{y}+v\_{x}\\right). $

At the tangent space level, by triangle inequality we have  

$ \\displaystyle \\left(|f\_{z}|-|f\_{\\bar{z}}|\\right)|dz|\\leq|df|\\leq\\left(|f\_{z}|+|f\_{\\bar{z}}|\\right)|dz| $

where both equalities can be obtained. So in this case we have  

$ \\displaystyle D(z,f)=\\frac{|f\_{z}|+|f\_{\\bar{z}}|}{|f\_{z}|-|f\_{\\bar{z}}|}=\\left(J(z,f)\\right)^{-1}\\left(|f\_{z}|+|f\_{\\bar{z}}|\\right)^{2}, $

since $ {J(z,f)=|f\_{z}|^{2}-|f\_{\\bar{z}}|^{2}}$. Thus if we take conformal structure on $ {\\Omega'}$ to be the standard one $ {H=I}$, the Beltrami system ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)) then reads  

$ \\displaystyle G\_{f}(z)=\\left(J(z,f)\\right)^{-1}D^{T}f(z)Df(z) $

whenever $ {J(z,f)>0}$. We call $ {G\_{f}(z)}$ the distortion tensor of the mapping $ {f}$. Note that the operator norm of $ {G\_{f}}$ is nothing but  

$ \\displaystyle \\|G\_{f}\\|=D(z,f)=\\left(J(z,f)\\right)^{-1}\\left(|f\_{z}|+|f\_{\\bar{z}}|\\right)^{2} $

Assume the set of degeneracy Jacobian is of measure zero, we then have  

$ \\displaystyle G\_{f}(z):\\Omega\\rightarrow S(2) $

define a conformal structure on the domain $ {\\Omega}$, where $ {f}$ is a conformal mapping from $ {(\\Omega,G\_{f})}$ to $ {(\\Omega',I)}$.  

**1.3. Quasiconformal mappings and the Beltrami equation**

Having only uniform control on the linear distortion does not guarantee the regularity of the mapping. This forces us to consider mappings in Sobolev spaces.  

> **Definition 3** *(Quasiconformal mapping) A homeomorphism $ {f:\\Omega\\rightarrow\\Omega'}$ is called $ {K}$-quasiconformal if it is orientation-preserving, and $ {f\\in W\_{loc}^{1,2}(\\Omega)}$, and the directional derivatives[](https://www.blogger.com/null)*  
> 
> *[$ \\displaystyle \\max\_{\\alpha}|\\partial\_{\\alpha}f(z)|\\leq K\\min\_{\\alpha}|\\partial\_{\\alpha}f(z)| \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)*
> 
> *[](https://www.blogger.com/null)for almost every $ {z\\in\\Omega}$.*

> **Remark 3** *Being merely a Sobolev function is not enough for a.e. differentiability, but only differentiable on lines a.e.. For this reason, in the above definition we had set*  
> 
> *$ \\displaystyle \\partial\_{\\alpha}f(z)=\\cos(\\alpha)f\_{x}(z)+\\sin(\\alpha)f\_{y}(z) $*
> 
> *for $ {\\alpha\\in\[0,2\\pi\]}$. However, it is a theorem that if $ {f}$ is homeomorphic, then its derivative in in fact exists a.e.. So there is no trouble in the end.*

The inequality ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)) can be also formulated as  

$ \\displaystyle D(z,f)=\\frac{|f\_{z}|+|f\_{\\bar{z}}|}{|f\_{z}|-|f\_{\\bar{z}}|}\\leq K $

for almost every $ {z\\in\\Omega}$. This means quasiconformal mappings map infinitesimal circles to ellipses. Rearranging the above inquality, we get  

$ \\displaystyle |f\_{\\bar{z}}(z)|\\leq\\frac{K-1}{K+1}|f\_{z}(z)|. $

Writing $ {\\mu\_{f}(z)=f\_{\\bar{z}}(z)/f\_{z}(z)}$ when $ {f\_{z}(z)\\neq0}$ (which only happens on a measure zero set), we get $ {|\\mu\_{f}(z)|\\leq\\frac{K-1}{K+1}<1}$. Working backwards, we see that the equation[](https://www.blogger.com/null)  

[$ \\displaystyle \\frac{\\partial f}{\\partial\\bar{z}}=\\mu(z)\\frac{\\partial f}{\\partial z} \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)called the *Beltrami euqation*, where the *Beltrami coeffiecient* satisfies $ {\\|\\mu\\|\_{\\infty}<1}$, is equivalent to the inequality ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)). The existence of the solution (as a $ {K}$-quasiconformal homeomorphism) to the equation ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) when $ {\\|\\mu\\|\_{\\infty}<1}$ is known as the *measurable Riemann mapping theorem*, and up to precomposition of comformal mappings is uniquely determined by $ {\\mu:\\Omega\\rightarrow\\Omega'}$. Let's convert ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)) into matrix form. Write $ {\\mu=\\rho+i\\tau}$. Separating the real and imaginary parts, we have  

$ \\displaystyle \\begin{bmatrix}\\rho-1 & \\tau\\\\ \\tau & -(\\rho+1) \\end{bmatrix}\\begin{bmatrix}u\_{x}\\\\ u\_{y} \\end{bmatrix}=\\begin{bmatrix}\\rho+1 & \\tau\\\\ \\tau & 1-\\rho \\end{bmatrix}\\begin{bmatrix}-v\_{y}\\\\ v\_{x} \\end{bmatrix}. $

Since $ {\\|\\mu\\|\_{\\infty}<1}$ , $ {\\det\\begin{bmatrix}\\rho+1 & \\tau\\\\ \\tau & 1-\\rho \\end{bmatrix}=1-\\rho^{2}-\\tau^{2}>0}$ for amoslt every $ {z\\in\\Omega}$. Hence we see that  

$ \\displaystyle \\begin{array}{rcl} \\begin{bmatrix}-v\_{y}\\\\ v\_{x} \\end{bmatrix} & = & \\frac{1}{1-\\rho^{2}-\\tau^{2}}\\begin{bmatrix}1-\\rho & -\\tau\\\\ -\\tau & \\rho+1 \\end{bmatrix}\\begin{bmatrix}\\rho-1 & \\tau\\\\ \\tau & -(\\rho+1) \\end{bmatrix}\\begin{bmatrix}u\_{x}\\\\ u\_{y} \\end{bmatrix}. \\end{array} $

Denote $ {C=\\begin{bmatrix}\\rho-1 & \\tau\\\\ \\tau & -(\\rho+1) \\end{bmatrix}}$ and observe that it is symmetric. Then the above is  

$ \\displaystyle \\begin{bmatrix}-v\_{y}\\\\ v\_{x} \\end{bmatrix}=\\frac{1}{1-\\rho^{2}-\\tau^{2}}C^{T}C\\begin{bmatrix}u\_{x}\\\\ u\_{y} \\end{bmatrix}. $

Finally, denote $ {-A=\\frac{-1}{1-\\rho^{2}-\\tau^{2}}C^{T}C=\\frac{-1}{1-\\rho^{2}-\\tau^{2}}\\begin{bmatrix}-(1-\\rho)^{2}-\\tau^{2} & 2\\tau\\\\ 2\\tau & -\\tau^{2}-(\\rho+1)^{2} \\end{bmatrix}}$ and it is easy to see that $ {A}$ is positive definite. Using the relation $ {v\_{xy}=v\_{yx}}$, we obtain a second order elliptic equation in divergence form:[](https://www.blogger.com/null)  

[$ \\displaystyle -\\nabla\\cdot(A\\nabla u)=0, \\ \\ \\ \\ \\ (5)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where $ {\\nabla\\cdot(A\\nabla)}$ is called the *generalized Laplacian operator*.  

> **Remark 4** *A solution $ {u}$ to the equation ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)) can be used to determine $ {v}$ via the formula*  
> 
> *$ \\displaystyle \\begin{bmatrix}-v\_{y}\\\\ v\_{x} \\end{bmatrix}=-A \\begin{bmatrix}u\_{x}\\\\ u\_{y} \\end{bmatrix}. $*
> 
> *And the function $ {f=u+iv}$ will thus be well defined, thanks to the *integrable vector field condition* $ {v\_{xy}=v\_{yx}}$.*

Below the fold, we shall describe in details the discretisation of the Boundary value problem associated with the equation ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)).  

**1.4. Discretisation and implementation**

To simplify matters (and thus avoid discussion about impacts of \`\`conformal invaraints'') we assume $ {\\Omega}$ is topologically a disk, and it is approximated by *mesh*, denoted $ {\\mathcal{M}}$, with the following data structure called the *indexed face set*. Each vertex is indexed by a unique integer, and a face $ {F}$ of the mesh is stored as a triple $ {\[i\_{F\_{1}},i\_{F\_{2}},i\_{F\_{3}}\]}$ of the indices of its vertices. We shall also assmue $ {\[i\_{F\_{1}},i\_{F\_{2}},i\_{F\_{3}}\]}$ is oriented counterclockwisely. The data should look like those in the following table. In practice, the number of faces is about twice the number of vertices.  

 Vertex coordinates

Triangles

 $ {(g\_{1},h\_{1})}$

$ {\[i\_{1},i\_{2},i\_{3}\]}$

 $ {\\cdots}$

$ {\\cdots}$

 $ {(g\_{V},h\_{V})}$

$ {\\cdots}$

$ {\\cdots}$

$ {\\cdots}$

$ {\[i\_{F\_{1}},i\_{F\_{2}},i\_{F\_{3}}\]}$ 

In this discrete formulation, we shall compute the resulting mesh $ {\\mathcal{M}'}$ after applying the discretized version of the generalized Laplacian. It suffices to know where the vertices go, that is a map between vertices  

$ \\displaystyle \\begin{array}{rcl} v\_{n}=(g\_{n},h\_{n}) & \\mapsto & w\_{n}=(s\_{n},t\_{n}). \\end{array} $

We extend on each face $ {T=\[i\_{T\_{1}},i\_{T\_{2}},i\_{T\_{3}}\]}$ linearly to get a simplicial mapping  

$ \\displaystyle f\\big|\_{T}(x,y)=\\begin{bmatrix}u\\big|\_{T}(x,y)\\\\ v\\big|\_{T}(x,y) \\end{bmatrix}=\\begin{bmatrix}a\_{T}x+b\_{T}y+r\_{T}\\\\ c\_{T}x+d\_{T}y+s\_{T} \\end{bmatrix}. $

Then on each face we have the following approximation:  

$ \\displaystyle u\_{x}\\big|\_{T}=a\_{T};\\quad u\_{y}\\big|\_{T}=b\_{T};\\quad v\_{x}\\big|\_{T}=c\_{T};\\quad v\_{y}\\big|\_{T}=d\_{T}. $

Let's now calculate these from coordinates of the vertices of the faces $ {T}$ and $ {f(T)}$. It suffices to consider two edges of the triangle. Suppose $ {T}$ and $ {f(T)}$ have vertices $ {\[v\_{i},v\_{j},v\_{k}\]}$ and $ {\[w\_{i},w\_{j},w\_{k}\]}$ respectively. We consider the oriented edges $ {v\_{j}-v\_{i}}$ and $ {v\_{k}-v\_{i}}$ coinsident at $ {v\_{i}}$. The simplicial mapping should map these edges to the corresponding oriented edges $ {w\_{j}-w\_{i}}$ and $ {w\_{k}-w\_{i}}$, i.e.  

$ \\displaystyle \\begin{bmatrix}a\_{T} & b\_{T}\\\\ c\_{T} & d\_{T} \\end{bmatrix}\\begin{bmatrix}g\_{j}-g\_{i} & g\_{k}-g\_{i}\\\\ h\_{j}-h\_{i} & h\_{k}-h\_{i} \\end{bmatrix}=\\begin{bmatrix}s\_{j}-s\_{i} & s\_{k}-s\_{i}\\\\ t\_{j}-t\_{i} & t\_{k}-t\_{i} \\end{bmatrix} $

The determinant of $ {\\begin{bmatrix}g\_{j}-g\_{i} & g\_{k}-g\_{i}\\\\ h\_{j}-h\_{i} & h\_{k}-h\_{i} \\end{bmatrix}}$is just the signed area of the parallelogram, which is $ {2\\cdot Area(T)}$. Note that we have chosen the same orientation for every $ {T}$ so the determinants calculated for each face are positive. Thus,  

[$\\displaystyle \\begin{eqnarray} \\begin{bmatrix}a\_{T} & b\_{T}\\\\ c\_{T} & d\_{T}\\end{bmatrix} & = & \\frac{1}{2\\cdot Area(T)} \\begin{bmatrix}s\_{j}-s\_{i} & s\_{k}-s\_{i}\\\\ t\_{j}-t\_{i} & t\_{k}-t\_{i}\\end{bmatrix} \\begin{bmatrix}h\_{k}-h\_{i} & g\_{i}-g\_{k}\\\\ h\_{i}-h\_{j} & g\_{j}-g\_{i} \\end{bmatrix} \\\\ & = & \\begin{bmatrix}A\_{T}^{i}s\_{i}+A\_{T}^{j}s\_{j}+A\_{T}^{k}s\_{k} & B\_{T}^{i}s\_{i}+B\_{T}^{j}s\_{j}+B\_{T}^{k}s\_{k}\\\\ A\_{T}^{i}t\_{i}+A\_{T}^{j}t\_{j}+A\_{T}^{k}t\_{k} & B\_{T}^{i}t\_{i}+B\_{T}^{j}t\_{j}+B\_{T}^{k}t\_{k} \\end{bmatrix}.\\end{eqnarray} \\ \\ \\ \\ \\ (6)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)where  

$ \\displaystyle A\_{T}^{i}=\\left(h\_{j}-h\_{k}\\right)/2\\cdot Area(T);\\quad A\_{T}^{j}=\\left(h\_{k}-h\_{i}\\right)/2\\cdot Area(T);\\quad A\_{T}^{k}=\\left(h\_{i}-h\_{j}\\right)/2\\cdot Area(T); $

$ \\displaystyle B\_{T}^{i}=\\left(g\_{k}-g\_{j}\\right)/2\\cdot Area(T);\\quad B\_{T}^{j}=\\left(g\_{i}-g\_{k}\\right)/2\\cdot Area(T);\\quad B\_{T}^{k}=\\left(g\_{j}-g\_{i}\\right)/2\\cdot Area(T). $

The above gives in effect the discretisation of the gradient operator. The discretisation of the divergence operator is slightly more complicated. Here we want to take the diverence of a vector field defined on the faces, namely $ {(-d,c)\_{T}}$, and the divergence is then a function of the vertices (roughly speaking, while gradient is applied on the *graph*, the divergence is applied on the *dual graph*). Since divergence measures the net flux across the boundary normalized by area, we define the divergence of any vector field $ {(X\_{1},X\_{2})\_{T}}$ on faces to be  

$ \\displaystyle \\text{Div}(X\_{1},X\_{2})(v\_{i})=\\sum\_{T\\in N\_{i}}Area(T) \\cdot A\_{T}^{i}X\_{1}(T)+Area(T) \\cdot B\_{T}^{i}X\_{2}(T). $

Here $N\_{i}$ denote the set of faces which contain the vertex indexed with $i$. This is a right definition, since it is easy to check using ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)) for each $ {v\_{i}}$  

$ \\displaystyle \\begin{array}{rcl} \\text{Div}(-d,c)(v\_{i}) & = & \\sum\_{T\\in N\_{i}}-Area(T) \\cdot A\_{T}^{i}d\_{T}+Area(T) \\cdot B\_{T}^{i}c\_{T}\\\\ & = & \\sum\_{T\\in N\_{1}}- Area(T) \\cdot A\_{T}^{i}\\left( B\_{T}^{i}t\_{i}+ B\_{T}^{j}t\_{j}+B\_{T}^{k}t\_{k}\\right)+\\\\ & & \\quad\\quad Area(T) \\cdot B\_{T}^{i}\\left(A\_{T}^{i}t\_{i}+ A\_{T}^{j}t\_{j}+A\_{T}^{k}t\_{k}\\right)\\\\ & = & 0. \\end{array} $

And similarly $ {\\text{Div}(-b,a)(v\_{i})=0}$. Finally, according to the equation ([5](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), we have its discrete analog  

$ \\displaystyle \\text{Div}\\left\\{ A \\begin{bmatrix}B\_{T}^{i}s\_{i}+B\_{T}^{j}s\_{j}+B\_{T}^{k}s\_{k}\\\\ B\_{T}^{i}t\_{i}+B\_{T}^{j}t\_{j}+B\_{T}^{k}t\_{k} \\end{bmatrix}\\right\\} =0 $

as a linear system in $ {s\_{n}}$'s ready to solve (often in the least square sense).
