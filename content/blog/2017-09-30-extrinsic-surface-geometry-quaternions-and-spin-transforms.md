---
id: 2017-09-30-extrinsic-surface-geometry-quaternions-and-spin-transforms
title: "Extrinsic surface geometry, Quaternions and Spin transforms"
date: 2017-09-30
tags: ["algebraic topology", "differential geometry"]
source: https://sylqiu.blogspot.com/2017/09/extrinsic-surface-geometry-quaternions.html
publish: true
---
In this post we discuss some elements of the theory of surface conformal immersions in the language of quaternions. The principal motivation for this is from Keenan Crane's 2011 paper. The goal is to make myself more comfortable with this machinery, and to make sense of the principal result Theorem [3](https://www.blogger.com/blogger.g?blogID=4046755691971152965#thmTwo-immersions-into) in Kamberov et al.  

**1\. The quaternions**

The quaternions $ {\\mathbb{H}}$ (H for its discoverer, William Hamilton), in Nathan Reed's own word, is like "complex numbers having eaten a super mushroom''. Formally, it is an associative division algebra over $ {\\mathbb{R}}$, with the following relation on the four basis vectors  

$ \\displaystyle i^{2}=j^{2}=k^{2}=ijk=-1. $

Observe that the quaternionic multiplication is not commutative. We also see that a copy of complex numbers sits inside of it. The $ {i,j,k}$ part of a quaternion is called the imaginary part, and the space of imaginary part is denoted $ {\\text{Im}\\mathbb{H}}$. The conjugate $ {\\bar{q}}$ of a quaternion $ {q}$ has the negative of the imaginary part. The modulus $ {|q|}$ of a quaternion $ {q}$ is equal to $ {\\sqrt{\\bar{q}q}}$.  

It has been a long time since computer graphics people using quaternions, because of their close relation with the 3D rotations. Multiplying by a unit quaternion, either on the left or on the right, is a simultaneous rotation of two independent planes (2D subspaces), by the same angle. The difference of left and right multiplicatoin by the same quaternion is that one of the planes rotates in the opposite direction:  

$ \\displaystyle \\begin{array}{rcl} (i)(w+ix+jy+kz) & = & -x+iw-jz+ky,\\\\ (w+ix+jy+kz)(i) & = & -x+iw+jz-ky. \\end{array} $

Using this fact and the associativity, we can check the conjugation by quaternions results in a rotation that happens only for one plane:  

$ \\displaystyle (i)(w+ix+jy+kz)(i^{-1})=(i)(w+ix+jy+kz)(-i)=w+ix-jy-kz, $

here $ {wx}$ rotation is canceled out and the $ {yz}$ rotation is done twice. In general,  

> **Proposition 1** *Conjugation by quaternions leave the imaginary subspace $ {\\text{Im}\\mathbb{H}\\cong\\mathbb{R}^{3}}$ invariant.*

*Proof:* It is enough to see that if $ {c\\in\\mathbb{R}}$, $ {qc\\bar{q}=c|q|^{2}}$ for all $ {q\\in\\mathbb{H}}$. $ \\Box$  

This should be a first hint why quaternions are so intimatly related to 3D rotations, and in order to get , say a $ {\\theta}$-angled 3D rotaton that fixes some plane, a$ {\\theta}$-angled quaternion has to be applied twice (i.e. conjugation). We turn to these points next.  

**2\. The group $ {SO(3)}$; Spin representation**

The discussion here roughly follows the exposition of Qiaochu. First, note that$ {\\det(\\cdot)=1}$ on $ {SO(3)}$ implies that any 3D rotation has an axis of rotation. Concretely, This means every element of $ {SO(3)}$ is conjugate to a matrix of the form  

$ \\displaystyle {\\displaystyle \\left\[\\begin{array}{ccc} 1 & 0 & 0\\\\ 0 & \\cos\\theta & -\\sin\\theta\\\\ 0 & \\sin\\theta & \\cos\\theta \\end{array}\\right\].} $

In this way we see that $ {SO(3)}$ is homeomorphic to the unit tangent bundle $ {UT(S^{2})}$ of the sphere. Since the sphere is simply connected, any closed path in $ {UT(S^{2})}$, that is, a closed curve on $ {S^{2}}$ plus a unit tangent vector continuously assigned to each point of the curve, can be deformed into a trivial curve (a point) with the unit tangent goes around in the circle $ {S^{1}}$. Hence $ {\\pi\_{1}(UT(S^{2}))}$ sits inside $ {\\pi\_{1}(S^{1})}$ as a subgroup, namely $ {\\mathbb{Z}/n\\mathbb{Z}}$ for some $ {n\\in\\mathbb{Z}}$.  

We will see that $ {n=2}$ . This means there exists a closed path in $ {UT(S^{2})}$ such that the unit tangent goes around twice the circle and yet the path is homotopically trivial. Imagine we walk counterclockwisely along a closed path on the sphere, with our hand pointing to some tangential direction is a continuous way. This path, together with our hand direction, can be thought of as an annulus in the sphere and it is shown below.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFANYd8i5sDuRHdl9qZP7ios1md-nede0Zt36M27fp2_aY31_1gNbEPfYPmgiolWOLoTVLbA38UmAQT5yp3XS_TmyjGSDXAz4JGsIEXH8dA3s0J542UXoheFvyZ1NRp0lzhqNyHTUHRbE/s1600/twotwist.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFANYd8i5sDuRHdl9qZP7ios1md-nede0Zt36M27fp2_aY31_1gNbEPfYPmgiolWOLoTVLbA38UmAQT5yp3XS_TmyjGSDXAz4JGsIEXH8dA3s0J542UXoheFvyZ1NRp0lzhqNyHTUHRbE/s1600/twotwist.jpg)

 First, there is a way to point our hand so that it runs three times around the some axis, as follows.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWJ3q_aDa_yfMzyLe1IvKP-yIR4v3KPAAn9NcEDZhw7VPqs9s2S_rlzA0u9C3gkAG9E5F7UhYjHUAZXd0JY9fbnfLU01MmPn2nHNDzJdsn5oJr-CS1qD2YpdXRaKF0Shyphenhyphenm6SHu1wS5oCo/s1600/twotwist2.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWJ3q_aDa_yfMzyLe1IvKP-yIR4v3KPAAn9NcEDZhw7VPqs9s2S_rlzA0u9C3gkAG9E5F7UhYjHUAZXd0JY9fbnfLU01MmPn2nHNDzJdsn5oJr-CS1qD2YpdXRaKF0Shyphenhyphenm6SHu1wS5oCo/s1600/twotwist2.jpg)

 But we can deform this annulus, without tearing or shrinking to lines, to a usual annulus!  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYnPnIUmcojJBBoDPJWiiJ0hP-P8xwsbWc5m0DbXiMQgPxc0NtaoIw19NnN0_nEfxHf2s1653U2k4rtbdFGnifIsdxOXa-nUK9vcq4JT-gkE770EEPqwFoCQD13hyrzaujwMJ383uVaYI/s1600/twotwist3.jpg)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYnPnIUmcojJBBoDPJWiiJ0hP-P8xwsbWc5m0DbXiMQgPxc0NtaoIw19NnN0_nEfxHf2s1653U2k4rtbdFGnifIsdxOXa-nUK9vcq4JT-gkE770EEPqwFoCQD13hyrzaujwMJ383uVaYI/s1600/twotwist3.jpg)

To see this, imagine in the above picture pulling the part behind the "twists'' to the front (there is nothing wrong if the annulus penetrates through itself while deforming). The usual annulus represents the situation that our hand runs around an axis only once. Hence we see that the group $ {SO(3)}$ has fundamental group $ {\\mathbb{Z}\_{2}}$, and so it has a universal cover (which is a double covering), called $ {Spin(3)\\cong SU(2)}$, which is then isomorphic to the unit quaternions (we won't prove these statements here, these can be found e.g. in Qiaochu's post). The converging map is just the conjugation operation by unit quaternions we have seen in the last section  

$ \\displaystyle \\begin{array}{rcl} \\pi:SU(2) & \\rightarrow & SO(3)\\\\ q & \\mapsto & q(\\cdot)\\bar{q}. \\end{array} $

This is also called the adjoint representation of $ {SU(2)}$, or spin representation.  

From this we can easily see that quaternions admit representations as complex $ {2\\times2}$ matrices of the form  

$ \\displaystyle \\begin{bmatrix}\\alpha & -\\bar{\\beta}\\\\ \\beta & \\bar{\\alpha} \\end{bmatrix} $

and the algebraic basis are given by  

$ \\displaystyle 1=\\begin{bmatrix}1 & 0\\\\ 0 & 1 \\end{bmatrix},i=\\begin{bmatrix}0 & 1\\\\ -1 & 0 \\end{bmatrix},j=\\begin{bmatrix}i & 0\\\\ 0 & -i \\end{bmatrix},k=\\begin{bmatrix}0 & i\\\\ i & 0 \\end{bmatrix}. $

We shall complement this section with a useful formula for imaginary quaternions. For $ {a,b\\in\\text{Im}\\mathbb{H}}$:  

$ \\displaystyle ab=-\\langle a,b\\rangle+a\\times b $

Thus quaternion multiplication intertwines scalar product and inner product in $ {\\mathbb{R}^{3}}$. Two immediate consequences follow:  

-   Two vectors in $ {\\mathbb{R}^{3}}$ are colinear $ {\\iff}$ quaternionically commute;
-   Two vectors are orthogonal $ {\\iff}$ quaternionically anti-commute;

**3\. Extrinsic Surface geoemtry in a new language**

Since quaternions allow 3D rotations and uniform scaling to be represented as quaternionic conjugation, it is to be envisaged that they play an important part in the theory of conformal immersion of Riemann surfaces. From here we follow Kamberov et al.  

Let $ {f:M\\rightarrow\\text{Im}\\mathbb{H}\\cong\\mathbb{R}^{3}}$ be an $ {C^{1}}$ immersion of a differentiable surface. If we start with the Euclidean structure of $ {\\mathbb{R}^{3}}$, then it naturally induces a complex structure $ {J:TM\\rightarrow TM}$, where $ {J^{2}=-I}$, on $ {M}$, making it a Riemann surface. Automatically, $ {f}$ is conformal. One can also work the other way around. Given $ {J}$ on $ {M}$, the conformality of an immersion $ {f:M\\rightarrow\\text{Im}\\mathbb{H}}$ has a simple infinitesimal criterion: the existence of a map $ {N:M\\rightarrow\\mathbb{H}}$ such that  

$ \\displaystyle \*df=Ndf, $

where $ {df\\in\\Gamma(T^{\*}M\\otimes f\_{\*}TM)}$ is the differential of the immersion,$ {\*df:=df\\circ J}$ is minus the Hodge star operator. This is the Cauchy-Riemann equations for the immersion. $ {N}$ is the called Gauss map of the immersion, and we can check in fact $ {N}$ is a unit imaginary quaternion and  

$ \\displaystyle N\\:df=-df\\:N $

i.e. $ {N}$ is orthogonal to $ {f\_{\*}TM}$ in $ {\\mathbb{R}^{3}}$.  
Given a conformal immersion $ {f}$, one can also talk about the conformality of any quaternionic valued 1-form (elements of $ {\\Gamma(T^{\*}M\\otimes\\mathbb{H})}$). In fact, there is a splitting  

$ \\displaystyle \\alpha=\\alpha\_{+}+\\alpha\_{-} $

where $ {\\alpha\_{\\pm}=\\frac{1}{2}(\\alpha\\mp N\*\\alpha)}$, so  

$ \\displaystyle \*\\alpha\_{\\pm}=\\pm N\\alpha\_{\\pm}. $

There is a natural identification of the $ {\\text{Im}\\mathbb{H}}$ valued anti-conformal one forms with the space of symmetric trace-free covariant 2-tensors. Due to this fact, we have an important geometric formula  

$ \\displaystyle dN\_{+}=-Hdf, $

where $ {H}$ is the mean curvature of the immersion, which is an extrinsic geometric quantity.  
The anti-conformal part of the shape operator $ {\\omega=dN\_{-}}$ is called the Hopf form of the immersion. From this we can get the important Codazzi equation  

$ \\displaystyle d\\omega=2N(dH)\_{-}df. $

In the case of constant mean curvature immersion it has intimate connection to the Hopf differential, aka holomorphic quadratic differentials. More precisely, a quadratic differential is a section of the symmetric square $ {K\\otimes\_{\\mathbb{C}}K}$ of the canonical line bundle of the Riemann surface. In local coordinate, it has representation  

$ \\displaystyle Q=\\alpha dz^{2} $

where $ {\\alpha}$ is a complex valued function. It is the $ {(2,0)}$ component of the tensor $ {T\_{Q}=\\frac{1}{2}(Q+\\bar{Q})}$. And it is called holomorphic if $ {\\alpha}$ is holomorphic.  

> **Theorem 2** *The following are equivalent*  
> 
> *-   $ {f}$ has constant mean curvature;
> -   $ {\\omega}$ is closed;
> -   The associated quadratic differential is holomorphic.*

**4\. Regular homotopy and spin transform**

So far we only have local descriptions of a conformal immersion. To get a global theory we consider the results on the regular homotopy classes. Two immersions into $ {\\mathbb{R}^{3}}$ of a given abstract surface is called regular homotopic if they can be connected by a continuous family of immersions. A regular homotopy class is denoted by $ {\[f\]}$. Given a $ {\\mathbb{R}^{3}}$ valued 1-form $ {\\tau}$, it is always possible to find a positive matrix valued function $ {A\_{\\tau}}$ such that the frame induced by $ {\\tau}$ after compositing with $ {A\_{\\tau}}$ becomes the canonical frame on the immersed surface. Hirsch's theorem says that any continuous $ {\\mathbb{R}^{3}}$ valued 1-form with rank two is homotopic to the differential $ {df}$, thus the mapping $ {\\tau\\mapsto A\_{\\tau}}$ descends to a bijection $ {\[f\]\\mapsto\[A\_{\\tau}\]\\in\[M,SO(3)\]}$, where the latter denotes the homotopy classes of $ {SO(3)}$ valued functions on $ {M}$. By spin representation, the $ {SO(3)}$ valued function $ {A\_{\\tau}}$ on any loop can be lifted into the unit quaternions. One can then find a homotopy invariant with values in $ {\\{\\pm1\\}\\cong\\mathbb{Z}\_{2}}$ for $ {SO(3)}$ valued functions on $ {M}$, that is a bijection  

$ \\displaystyle \[A\_{\\tau}\]\\mapsto\\mathbb{Z}\_{2} $

called the "twist''. This in turn descends to a group homomorphism between first homology group and $ {\\mathbb{Z}\_{2}}$, i.e. the first cohomology group with $ {\\mathbb{Z}\_{2}}$ coefficient $ {H^{1}(M,\\mathbb{Z}\_{2})}$. Thus the regular homotopy classes are in bijection with $ {H^{1}(M,\\mathbb{Z}\_{2})}$. Having this settled, we can apply it to the differentials of two immersions. We are interested in the case that these two immersions induce the same conformal structure on $ {M}$, that means  

$ \\displaystyle d\\tilde{f}=\\bar{\\lambda}df\\lambda, $

called the spin transform.  

> **Theorem 3** *[](https://www.blogger.com/null)Two immersions into $ {\\mathbb{R}^{3}}$ of an oriented surface are spin equivalent if and only if they induce the same conformal structure on $ {M}$ and are regular homotopic.*

**5\. A Dirac operator**

Simply by enforcing the integrability constraint for $ {d\\tilde{f}}$, that is, $ {dd\\tilde{f}=0}$, we get the following integrability equation of $ {\\lambda}$ of Dirac type  

$ \\displaystyle D\\lambda:=-\\frac{df\\wedge d\\lambda}{|df|^{2}}=\\rho\\lambda, $

here $ {|df|^{2}}$ can be identified with the induced area 2-form of the immersion. Here the function $ {\\rho}$ is actually real valued, in fact there is the following relation between $ {\\rho}$ and mean curvature of the two immersions  

$ \\displaystyle \\tilde{H}|d\\tilde{f}|=(H-\\rho)|df| $

where $ {|df|}$ is identified with the induced metric tensor. Note that there may or may not exist a solution to the Dirac equation given any $ {\\rho}$.
