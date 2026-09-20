---
id: 2017-08-17-rep-res-mobiles-de-cartan
title: "Repères Mobiles de Cartan"
date: 2017-08-17
tags: ["differential geometry"]
source: https://sylqiu.blogspot.com/2017/08/reperes-mobiles-de-cartan.html
publish: true
---
In this article we present the basic methods of Cartan's moving frame method, and we apply it to classical theory of surfaces. Of importance is the use of exterior differential applied to systems of equations.  

  **1\. Frames and co-frames in a tangent space**

An *frame* at a point $ {p\\in\\mathbb{R}^{3}}$ is a choice of a basis in the *tangent space* $ {T\_{p}\\mathbb{R}^{3}\\cong\\mathbb{R}^{3}}$. The frame is called orthonormal if the basis is orthonormal. We would like to think of a frame $ {E}$ as a row of basis vectors, that is[](https://www.blogger.com/null)  

[$ \\displaystyle E=\\begin{pmatrix}E\_{1} & E\_{2} & E\_{3}\\end{pmatrix},\\quad E\_{i}\\in T\_{p}\\mathbb{R}^{3} \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and if $ {E^{i}}$'s are consistently represented as column vectors in $ {\\mathbb{R}^{3}}$, we can then identify $ {E}$ with an element in the general linear group $ {GL(3,\\mathbb{R})}$, or in the case of an orthonormal frame, the orthogonal group $ {O(3,\\mathbb{R})}$. We shall almost always deal with orthonormal frames, so frames mentioned below the fold are always othonormal, if not specified.  

For another frame $ {F}$, we have the transformation rule[](https://www.blogger.com/null)  

[$ \\displaystyle F=EA^{T},\\quad A\\in O(3). \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)That $ {A}$ \`\`acts on the right hand side'' is to represent the fact that basis vectors of $ {F}$ is obtained from linear combination of basis vectors of $ {E}$, and clearly this is due to the convention that we represent $ {E}$ in the way of ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)).  

At the same time we can consider the *co-frame* $ {\\theta}$ of a frame $ {E}$. This is a set of *1-forms*, or dual basis vectors of those of $ {E}$, namely they should satisfy the real-linear duality[](https://www.blogger.com/null)  

[$ \\displaystyle \\theta^{i}(E\_{j})=\\langle E\_{j},\\theta^{i}\\rangle=\\delta\_{j}^{i}=\\begin{cases} 1 & \\text{if }i=j\\\\ 0 & \\text{othewise} \\end{cases}, \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)and for all $ {a,b\\in\\mathbb{R}}$  

$ \\displaystyle \\begin{array}{rcl} \\langle E\_{k},a\\theta^{i}+b\\theta^{j}\\rangle & = & a\\langle E^{k},\\theta\_{i}\\rangle+b\\langle E^{k},\\theta\_{j}\\rangle,\\\\ \\langle aE\_{i}+bE\_{j},\\theta^{k}\\rangle & = & a\\langle E\_{i},\\theta^{k}\\rangle+b\\langle E\_{j},\\theta^{k}\\rangle. \\end{array} $

Both $ {\\theta^{i}(E\_{j})}$ and $ {\\langle E\_{j},\\theta^{i}\\rangle}$ will be used to denote the linear duality pairing, whenever which is more notationally convenient.  

We would like to think of $ {\\theta}$ as a column of forms, that is  

$ \\displaystyle \\theta=\\begin{pmatrix}\\theta^{1}\\\\ \\theta^{2}\\\\ \\theta^{3} \\end{pmatrix}, $

and if $ {\\theta^{i}}$'s are consistently represented as row vectors in $ {\\mathbb{R}^{3}}$, we can again identify $ {\\theta}$ with an element in the orthogonal group $ {O(3,\\mathbb{R})}$. Now of course, the transformation rule has to be deduced from ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq1)) and ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq3)): Let $ {\\xi}$ be the co-frame of $ {F}$. If $ {E}$ is transformed to $ {F}$ according to ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq2)), the corresponding transformation rule for $ {\\theta}$ is then  

$ \\displaystyle \\xi=(A^{T})^{-1}\\theta=A\\theta. $

To see this, we can check by writing the $ {(i,j)}$-th entry of $ {A}$ to be $ {A\_{j}^{i}}$, and compute, for example  

$ \\displaystyle \\xi^{1}(F\_{1})=\\langle(A^{T})\_{1}^{i}E\_{i},A{}\_{i}^{1}\\theta^{i}\\rangle=\\sum\_{i=1}^{3}A\_{i}^{1}A\_{i}^{1}=1, $

here repeated indices appearing both in upper and lower slots but without summation sign is a short hand for summation on that index, namely  

$ \\displaystyle A\_{i}^{1}\\theta^{i}:=A\_{1}^{1}\\theta^{1}+A\_{2}^{1}\\theta^{2}+A\_{3}^{1}\\theta^{3}. $

We shall be using this convention throughout this article.  

Why should we be using forms? One of the reasons is that they are objects that can be *pulled back* by corresponding morphisms from the space they lie in. More precisely, suppose $ {T:V\\rightarrow W}$ is a linear map between vector spaces, and $ {\\theta^{1}}$ is a 1-form on $ {W}$. Then there is a form $ {T^{\*}\\theta^{1}}$ defined naturally on $ {V}$, via  

$ \\displaystyle \\langle E\_{i},T^{\*}(\\theta^{1})\\rangle=\\langle T(E^{i}),\\theta\_{1}\\rangle. $

Vectors and forms can all be ecapsulated in the unified concept of *tensors*. This concept is already implicit in the above, in the form of a row of vectors $ {E}$, or of a column of 1-forms $ {\\theta}$, or of a linear map $ {A}$. In fact, they are all tensors of type $ {(1,1)}$. More generally, multilinear maps are also tensors. But we won't need to use tensors in its full power so it suffices to settle down with the above concepts for now.  

**2\. Differentiating a frame field in $ {\\mathbb{R}^{3}}$**

Let $ {t\\mapsto\\gamma(t)}$ a smooth curve in $ {\\mathbb{R}^{3}}$, with $ {\\gamma(0)=p}$, $ {\\gamma'(0)=v}$, called a directional vector at $ {p}$. We can consider a smoothly varying 1-parameter family of frames $ {t\\mapsto E\_{\\gamma(t)}}$, called a *frame field* along $ {\\gamma}$. With the *identification* of all tangent spaces $ {T\_{\\gamma(t)}\\mathbb{R}^{3}}$ by translations, $ {E(p)}$ can be extend to every tangent space $ {T\_{\\gamma(t)}\\mathbb{R}^{3}}$. Thus the framefield can be parametrised as  

$ \\displaystyle E=E(\\gamma(t))=E(p)A(t)^T $

where $ {A(0)=i.d.}$, $ {A(t)\\in O(3,\\mathbb{R})}$ for each $ {t}$ and is smooth in $ {t}$. Differentiating in $ {t}$ and evaluating at $ {t=0}$, we then get another three vectors, which we denote by  

$ \\displaystyle \\nabla\_{v}E=\\begin{pmatrix}\\nabla\_{v}E\_{1} & \\nabla\_{v}E\_{2} & \\nabla\_{v}E\_{3}\\end{pmatrix}. $

Since we are in the Euclidean space, by using the Cartesian coordinate of an open neighborhood $ {U}$ of $ {p}$, we can also consider a frame field in $ {U}$, and again with the *identification* of all tangent spaces $ {T\_{x}\\mathbb{R}^{3}}$ by translations, we have the equation[](https://www.blogger.com/null)  

[$ \\displaystyle E(x)=E(p)A(x)^T,\\quad x\\in U. \\ \\ \\ \\ \\ (4)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Now let us make two important observations:  

-   For a fixed $ {v,x}$, the mapping $ {E(x)\\mapsto\\nabla\_{v}E(x)}$ is linear;
-   For a fixed smooth frame field $ {E}$ in $ {U}$, the mapping $ {v\\mapsto\\nabla\_{v}E}$ is well defined ($ {\\nabla\_{v}E}$ depends only on the vector $ {v}$, not anything else, in particular how it varies in that neighborhood), and is linear in $ {v}$.

From these observations we call $ {\\nabla\_{v}E}$ a *covariant derivative* of $ {E}$ with direction $ {v}$ at $ {p}$, and we can express the mapping $ {(v,E)\\mapsto\\nabla\_{v}E}$ as $ \\nabla\_{v}E  =  E(x)\\omega^{T}(v)  
\=  \\langle v,(\\omega^{T})\_{i}^{j}\\rangle E\_{j}(x)$,[](https://www.blogger.com/null) where $ {\\omega^{T}}$ is the transpose of a matrix of 1-forms $ {\\omega}$. Equivalently, the value of $ {\\omega\_{j}^{i}}$ is given by the Euclidean inner product of $ {\\nabla\_{v}E\_{i}}$ and $ {E\_{j}}$  

$ \\displaystyle \\omega\_{j}^{i}(v)=\\nabla\_{v}E\_{i}\\cdot E\_{j}. $

We thus make the following definition:  

> **Definition 1** *(Connection form) The matrix-valued 1-form $ {\\omega}$ defined as above is called the *connection form* in the Euclidean space. The quantities*  
> 
> *$ \\displaystyle \\Gamma\_{\\phantom{k}ij}^{k}:=\\langle E\_{i},(\\omega^{T})\_{j}^{k}\\rangle=\\nabla\_{E\_{i}}E\_{j}\\cdot E\_{k} $*
> 
> *are called the *Christoffel symbols* of this connection. Note that Christoffel symbols depend on the choice of the frame.*

From the equality $ {0=\\nabla\_{v}(E^{i}\\cdot E^{j})=\\nabla\_{v}(E^{i})\\cdot E^{j}+\\nabla\_{v}(E^{i})\\cdot E^{j}}$ for all $ {v}$, we immediately obtain  

> **Proposition 2** *The connection form $ {\\omega}$ is skew-symmetric, i.e.*  
> 
> *$ \\displaystyle \\omega\_{i}^{j}+\\omega\_{j}^{i}=0. $*

Now let us find a more explicit relation between $ {\\omega}$ and $ {A}$. Applying the exterior differential operator $ {d}$ to the $ {3\\times3}$ system of equations of functions ([4](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq4)), we get another $ {3\\times3}$ system of differential equations  

$ \\displaystyle dE(x)=E(p)dA^{T}=E(x)AdA^{T} $

since $(A^{T})^{-1} =A$. The exterior differentials are characterised by how they act on tangent vectors, and this was given by ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq5)), so  

$ \\displaystyle dE(x)=E(x)\\omega^{T}=E(x)AdA^{T}, $

and therefore  

$ \\displaystyle \\omega=(dA)A^{T}. $

We can also compute for the co-frame field $ {\\theta(x)=A\\theta(p)}$. As before, $ {\\theta(p)}$ can be extend to every tangent space $ {T\_{x}\\mathbb{R}^{3}}$ by the identification with $ {T\_{p}\\mathbb{R}^{3}}$ via translation. This gives rise to a co-frame field, whose each component's exterior derivative is zero. For this reason which we shall denote it by  

$ \\displaystyle dx=\\begin{pmatrix}dx^{1}\\\\ dx^{2}\\\\ dx^{3} \\end{pmatrix}. $

Then applying the exterior differential operator $ {d}$, this time on the $ {3\\times1}$ system of equations of 1-forms $ {\\theta(x)=Adx}$, we get  

> **Theorem 3** *(Cartan's first structural equations, with Euclidean connection)*  
> 
> *$ \\displaystyle \\begin{array}{rcl} d\\theta(x) & = & dA\\wedge dx\\\\ & = & (dA)(A^{T}A)\\wedge dx\\\\ & = & (dA)A^{T}\\wedge Adx=\\omega\\wedge\\theta. \\end{array} $*

Here the rule for wedge product is the same with the matrix product (as can be checked by writing out the system), and hence \`\`commutes'' with multiplication by matrices of functions (cf. *tensoriality*, e.g. $ {fdx\\wedge dy=dx\\wedge fdy}$).  

Applying the exterior differential operator to the connection form, we get  

> **Theorem 4** *(Cartan's second structural equations, with Euclidean connection)*  
> 
> *$ \\displaystyle \\begin{array}{rcl} d\\omega & = & d(dA)A^{T}\\\\ & = & -dA\\wedge dA^{T}\\\\ & = & -(dA)A^{T}\\wedge AdA^{T}=-\\omega\\wedge\\omega^{T} \\end{array} $*

We next turn to the geometric meaning of these equations.  

**3\. Moving frames on surfaces, and consequences of Cartan's structural equations**

Let $ {M}$ be an oriented surface isometrically immersed in $ {\\mathbb{R}^{3}}$. We consider a frame field *adapted* to the surface $ {M}$, that is, $ {E=\\begin{pmatrix}E\_{1} & E\_{2} & E\_{3}\\end{pmatrix}}$ is such that at every $ {p\\in M}$, $ {E\_{1},E\_{2}}$ form an orthonormal basis at $ {T\_{p}M}$, and $ {E\_{3}}$ is the *outward unit normal* to the surface at $ {p}$. Let the corresponding co-frame field be $ {\\theta=\\begin{pmatrix}\\theta^{1}\\\\ \\theta^{2}\\\\ \\theta^{3} \\end{pmatrix}}$.  

Cartan's first structural equation writes  

$ \\displaystyle \\begin{array}{rcl} \\begin{pmatrix}d\\theta^{1}\\\\ d\\theta^{2}\\\\ d\\theta^{3} \\end{pmatrix} & = & \\begin{pmatrix}0 & \\omega\_{2}^{1} & \\omega\_{3}^{1}\\\\ -\\omega\_{2}^{1} & 0 & \\omega\_{3}^{2}\\\\ -\\omega\_{3}^{1} & -\\omega\_{3}^{2} & 0 \\end{pmatrix}\\wedge\\begin{pmatrix}\\theta^{1}\\\\ \\theta^{2}\\\\ \\theta^{3} \\end{pmatrix}\\\\ & = & \\begin{pmatrix}\\omega\_{2}^{1}\\wedge\\theta^{2}+\\omega\_{1}^{3}\\wedge\\theta^{3}\\\\ -\\omega\_{2}^{1}\\wedge\\theta^{1}+\\omega\_{3}^{2}\\wedge\\theta^{3}\\\\ -\\omega\_{3}^{1}\\wedge\\theta^{1}-\\omega\_{3}^{2}\\wedge\\theta^{2} \\end{pmatrix}. \\end{array} $

We want to restrict these forms onto the tangent bundle $ {TM}$ (this can be done by pre-composite the form with the orthogonal projection $ {\\pi:T\\mathbb{R}^{3}\\rightarrow TM}$), and it's clear that $ {\\theta\_{3}}$ restricts to zero, hence on the cotangent bundle $ {T^{\*}M}$ we have the following three equations  

$ \\displaystyle \\begin{pmatrix}d\\theta^{1}\\\\ d\\theta^{2}\\\\ 0 \\end{pmatrix}=\\begin{pmatrix}-\\omega\_{1}^{2}\\wedge\\theta^{2}\\\\ -\\omega\_{2}^{1}\\wedge\\theta^{1}\\\\ -\\omega\_{3}^{1}\\wedge\\theta^{1}-\\omega\_{3}^{2}\\wedge\\theta^{2} \\end{pmatrix}. $

Pick any two vector fields $ {X,Y\\in TM}$. We can write them in terms of a local frame  

$ \\displaystyle X=X^{1}E\_{1}+X^{2}E\_{2},\\quad Y=Y^{1}E\_{1}+Y^{2}E\_{2} $

and calculate, for example  

$ \\displaystyle \\begin{array}{rcl} & \\omega\_{3}^{1}\\wedge\\theta^{1}(X,Y)\\\\ = & Y^{1}\\omega\_{3}^{1}(X)-X^{1}\\omega\_{3}^{1}(Y)\\\\ = & Y^{1}\\nabla\_{X}E\_{1}\\cdot E\_{3}-X^{1}\\nabla\_{Y}E\_{1}\\cdot E\_{3}\\\\ = & (\\nabla\_{X}(Y^{1}E\_{1})-X(Y^{1}E\_{1})\\cdot E\_{3}-\\\\ & \\quad(\\nabla\_{Y}(X^{1}E\_{1})-Y(X^{1}E\_{1})\\cdot E\_{3}\\\\ = & (\\nabla\_{X}(Y^{1}E\_{1})-(\\nabla\_{Y}(X^{1}E\_{1}))\\cdot E\_{3} \\end{array} $

here $ {X(f)}$ means the directional derivative of the function $ {f}$ in the direction of $ {X}$; also  

$ \\displaystyle \\begin{array}{rcl} d\\theta^{i}(X,Y) & = & X(Y^{i})-Y(X^{i})-\\theta^{i}(\[X,Y\]),\\\\ & = & X^{j}Y^{k}\\theta^{i}(\[E\_{j},E\_{k}\]) \\end{array} $

where $ {\[X,Y\]}$ is a vector field on $ {M}$, acting on functions by  

$ \\displaystyle \[X,Y\](f)=X(Y(f))-Y(X(f)), $

known as the *Lie derivative* of $ {Y}$ in the direction of $ {X}$, or *Lie bracket* of $ {X}$ and $ {Y}$. After similar calculuation for the other terms, we get again three equations  

$ \\displaystyle \\begin{cases} (\\nabla\_{X}(Y^{2}E\_{2})-\\nabla\_{Y}(X^{2}E\_{2}))\\cdot E\_{1}=-X^{j}Y^{k}\\theta^{1}(\[E\_{j},E\_{k}\])\\\\ (\\nabla\_{X}(Y^{1}E\_{1})-\\nabla\_{Y}(X^{1}E\_{1}))\\cdot E\_{2}=-X^{j}Y^{k}\\theta^{2}(\[E\_{j},E\_{k}\])\\\\ (\\nabla\_{X}Y-\\nabla\_{Y}X)\\cdot E\_{3}=0 \\end{cases}. $

Together with the fact that  

$ \\displaystyle \\begin{cases} (\\nabla\_{X}(Y^{2}E\_{2})-\\nabla\_{Y}(X^{2}E\_{2}))\\cdot E\_{2}=X(Y^{2})-Y(X^{2})\\\\ (\\nabla\_{X}(Y^{1}E\_{1})-\\nabla\_{Y}(X^{1}E\_{1}))\\cdot E\_{1}=X(Y^{1})-Y(X^{1}) \\end{cases} $

it follows the field $ {\\nabla\_{X}Y-\\nabla\_{Y}X}$ can be expressed as  

$ \\displaystyle \\theta^{1}(\[X,Y\])E\_{1}+\\theta^{2}(\[X,Y\])E\_{2}. $

In other words,  

> **Theorem 5** *The Euclidean covariant derivative satisfies*  
> 
> *$ \\displaystyle \\nabla\_{X}Y-\\nabla\_{Y}X=\[X,Y\]. $*
> 
> *We say such a covariant derivative is **torsion free**.*

What is more striking is that the torsion free property in effect characterises the connection form $ {\\omega\_{2}^{1}}$.  

> **Theorem 6** *(Levi-Civita, Euclidean case) There is a unique linear differential form $ {\\omega\_{12}}$ that satisfies the Cartan's first structural equations*  
> 
> *$ \\displaystyle \\begin{pmatrix}d\\theta^{1}\\\\ d\\theta^{2} \\end{pmatrix}=\\begin{pmatrix}-\\omega\_{1}^{2}\\wedge\\theta^{2}\\\\ -\\omega\_{2}^{1}\\wedge\\theta^{1} \\end{pmatrix}, $*
> 
> *where $ {\\theta^{1},\\theta^{2}}$ is an orthonormal co-frame field on $ {M}$.*

Now we move to Cartan's second structural equation. It writes  

$ \\displaystyle \\begin{array}{rcl} \\begin{pmatrix}0 & d\\omega\_{2}^{1} & d\\omega\_{3}^{1}\\\\ -d\\omega\_{2}^{1} & 0 & d\\omega\_{3}^{2}\\\\ -d\\omega\_{3}^{1} & -d\\omega\_{3}^{2} & 0 \\end{pmatrix} & = & \\begin{pmatrix}0 & \\omega\_{2}^{1} & \\omega\_{3}^{1}\\\\ -\\omega\_{2}^{1} & 0 & \\omega\_{3}^{2}\\\\ -\\omega\_{3}^{1} & -\\omega\_{3}^{2} & 0 \\end{pmatrix}\\wedge\\begin{pmatrix}0 & \\omega\_{2}^{1} & \\omega\_{3}^{1}\\\\ -\\omega\_{2}^{1} & 0 & \\omega\_{3}^{2}\\\\ -\\omega\_{3}^{1} & -\\omega\_{3}^{2} & 0 \\end{pmatrix}\\\\ & = & \\begin{pmatrix}0 & -\\omega\_{3}^{1}\\wedge\\omega\_{3}^{2} & \\omega\_{2}^{1}\\wedge\\omega\_{3}^{2}\\\\ \\omega\_{3}^{1}\\wedge\\omega\_{3}^{2} & 0 & -\\omega\_{2}^{1}\\wedge\\omega\_{3}^{1}\\\\ -\\omega\_{2}^{1}\\wedge\\omega\_{3}^{2} & \\omega\_{2}^{1}\\wedge\\omega\_{3}^{1} & 0 \\end{pmatrix} \\end{array} $

This summarises into three equations  

> **Theorem 7** *The Euclidean connection form $ {\\omega}$ satisfies **the Gauss equation***  
> 
> *$ \\displaystyle d\\omega\_{2}^{1}=-\\omega\_{3}^{1}\\wedge\\omega\_{3}^{2}, $*
> 
> *and **the Codazzi equations***  
> 
> *$ \\displaystyle \\begin{array}{rcl} d\\omega\_{3}^{1} & = & \\omega\_{2}^{1}\\wedge\\omega\_{3}^{2}\\\\ d\\omega\_{3}^{2} & = & -\\omega\_{2}^{1}\\wedge\\omega\_{3}^{1}. \\end{array} $*

These equations baiscally determine how the surface $ {M}$ is isometrically immersed in $ {\\mathbb{R}^{3}}$.  

> **Theorem 8** *(Bonnet) Suppose there is a connection form $ {\\omega}$ associated to a two-dimensional manifold $ {M}$, satisfying the Gauss and Codazzi equations. Then the neighborhood of every point of $ {M}$ can be isometrically emedded in $ {\\mathbb{R}^{3}}$ with that connection form realised in the way we described in Section 2.*

Let's plug in $ {E\_{1},E\_{2}}$ in the RHS of the Gauss equation, and recall that they are an orthonormal frame on $ {M}$, and $ {E\_{3}}$ is the unit outer normal,[](https://www.blogger.com/null)  

[$ \\displaystyle \\begin{array}{rcl} \\omega\_{2}^{3}\\wedge\\omega\_{1}^{3}(E\_{1},E\_{2}) & = & \\omega\_{2}^{3}(E\_{1})\\omega\_{1}^{3}(E\_{2})-\\omega\_{2}^{3}(E\_{2})\\omega\_{1}^{3}(E\_{1})\\nonumber \\\\ & = & (\\nabla\_{E\_{1}}E\_{3}\\cdot E\_{2})(\\nabla\_{E\_{2}}E\_{3}\\cdot E\_{1})-\\nonumber \\\\ & & \\quad(\\nabla\_{E\_{2}}E\_{3}\\cdot E\_{2})(\\nabla\_{E\_{1}}E\_{3}\\cdot E\_{1})\\\\ & := & -K,\\nonumber \\end{array} $](https://www.blogger.com/null)

[](https://www.blogger.com/null)where the quantity $ {K}$ is called the *Gaussian curvature* of the surface $ {M}$. This is clearly related to the mapping $ {N:p\\mapsto E\_{3}}$, called the *Gauss map* of the surface $ {M}$. The differential of this mapping  

$ \\displaystyle dN:TM\\rightarrow TS^{2} $

can be represented, after we identify the tangent spaces $ {T\_{p}M\\cong T\_{N(p)}S^{2}}$ for each $ {p}$ (since these two tangent space have the same outer unit normal),  

$ \\displaystyle dN(v)=\\nabla\_{v}E\_{3}=\\omega\_{1}^{3}(v)E\_{1}+\\omega\_{2}^{3}(v)E\_{2}, $

and so in the local frame $ {E}$, $ {dN}$ has the matrix representation  

$ \\displaystyle \\begin{pmatrix}\\nabla\_{E\_{1}}E\_{3}\\cdot E\_{1} & \\nabla\_{E\_{2}}E\_{3}\\cdot E\_{1}\\\\ \\nabla\_{E\_{1}}E\_{3}\\cdot E\_{2} & \\nabla\_{E\_{2}}E\_{3}\\cdot E\_{2} \\end{pmatrix}, $

with determinant $ {K}$. After identifying the cotangent spaces $ {T\_{p}^{\*}M\\cong T\_{N(p)}^{\*}S^{2}}$ for each $ {p}$, the area form $ {d\\sigma}$ of the unit sphere induced by the Euclidean metric is pulled back by the Gauss map $ {N}$ as  

$ \\displaystyle N^{\*}(d\\sigma)=K\\tau, $

where $ {\\tau}$ is the area form on $ {M}$ induced by the Euclidean metric.  
From ([3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#eq6)) we also obtained the equality  

$ \\displaystyle d\\omega\_{2}^{1}=-K\\theta^{1}\\wedge\\theta^{2} $

as can be seen by testing it against all vector fields. Since $ {\\theta^{1},\\theta^{2}}$ form an orthonormal frame on $ {M}$, and by Levi-Civita, $ {\\omega\_{2}^{1}}$ is determined by this frame via the first Cartan structural equations, we thus arrive at  

> **Theorem 9** *(Gauss's theorema eugregium) The Gaussian curvature $ {K}$ of $ {M}$ is an intrinsic geometric quantity, namely, it does not depend on the Gauss map, and hence also how it is (isometrically) immersed in $ {\\mathbb{R}^{3}}$.*
