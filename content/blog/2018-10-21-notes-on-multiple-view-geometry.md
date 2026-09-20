---
id: 2018-10-21-notes-on-multiple-view-geometry
title: "Notes on multiple view geometry"
date: 2018-10-21
tags: ["computer vision"]
source: https://sylqiu.blogspot.com/2018/10/notes-on-multiple-view-geometry.html
publish: true
---
In this short note I introduce some elements of projective geometry for cameras, based on my understanding of the materials in *Multiple View Geometry* by Hartley and Zisserman \[1\]. This is important to understand the geometric setting of camera calibration, stereo matching, visual SLAM, SfM, etc. The algorithmic aspect is not discussed here. In \[1\] one can find the subject from more perspectives and in more details.  

**1\. A simple camera model**

The geometric principle of a pinhole camera's imaging is based on that light rays coming from the scene focus at one point, called the *camera center*, or *optical center*. Usually we only have limited view angle and the image $ {I}$ is obtained in a finite rectangle, lying in the *image plane*, or the *focal plane*. We may define a *principal axis*, which is a ray eminating from the camera center that should intersect perpendicularly with the image plane, the intersection being called the *principal point*. The distance $ {f}$ between the image plane and the camera center is called the *focal length*. These will be geometric objects that can be defined independent of coordinates.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmkZBxC2_t5Atdch-_vPqOaVLVJbLzDYNPnY83JNf5YfRgKA16bWGxJkPvcZ_4bAUBV1yts44_AR-ezxy6nPNe1ASwtOcalm7KhEls-twVQl-nrByTITHiNCf89dCAi61cnX1BT8MY33g/s640/pinhole.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmkZBxC2_t5Atdch-_vPqOaVLVJbLzDYNPnY83JNf5YfRgKA16bWGxJkPvcZ_4bAUBV1yts44_AR-ezxy6nPNe1ASwtOcalm7KhEls-twVQl-nrByTITHiNCf89dCAi61cnX1BT8MY33g/s1600/pinhole.png)

Figure taken from \[1\]

In a linear model, a point $ {\\mathbf{x}\\in\\mathbb{R}^{3}}$ will have its position $ {P\\mathbf{x}}$ in $ {I}$ if the straight line connecting the camera center with $ {\\mathbf{x}}$ intersects with the image plane. If we take a coordinate system of $ {\\mathbb{R}^{3}}$ and a image coordinate as in the figure above (where the two coincide) , we find that  

$ \\displaystyle \\mathbf{P}\\mathbf{x}=(fx/z,fy/z,f)^{T} $

where $ {\\mathbf{x}=(x,y,z)^{T}}$. Note that $ {(fx/z,fy/z)}$ is where we find the point $ {\\mathbf{x}}$ in the image, and the third coordinate is always constant and therefore not important. So, it will be convienient to take the 2D homogeneous coordinate of $ {\\mathbf{x}}$  

$ \\displaystyle \[\\mathbf{x}\]=(x/z,y/z,1), $

rescale the image $ {z}$-coordinate to $ {1}$, and write the camera model as  

$ \\displaystyle \[\\mathbf{P}\\mathbf{x}\]=\\begin{pmatrix}f\\\\ & f\\\\ & & 1 \\end{pmatrix}\\begin{pmatrix}x/z\\\\ y/z\\\\ 1 \\end{pmatrix}. $

The advantage of using 2D homogeneous coordinate is that it allows us to incorporate translation via multiplication, as we shall see below.  

The coordinate systems of $ {\\mathbb{R}^{3}}$ and the image may not always be chosen as above, in particular multiple cameras are present. We describe the situation begining from the simpliest variation. First of all, image coordinates may have slightly different scales in the horizontal and vertical direction. If so then  

$ \\displaystyle \\mathbf{P}=\\begin{pmatrix}f\_{x}\\\\ & f\_{y}\\\\ & & 1 \\end{pmatrix}. $

If furthermore the image coordinate origin taken but the principal point is shifted to $ {(c\_{x},c\_{y},1)}$ in $ {\\mathbb{R}^{3}}$, then  

$ \\displaystyle \[\\mathbf{P}\\mathbf{x}\]=(fx/z+c\_{x},fy/z+c\_{y},1)^{T}, $

so  

$ \\displaystyle \\mathbf{P}=\\begin{pmatrix}f\_{x} & & c\_{x}\\\\ & f\_{y} & c\_{y}\\\\ & & 1 \\end{pmatrix}. $

If furthermore the origin of $ {\\mathbb{R}^{3}}$ is chosen differently from the camera center, say which is at $ {\\mathbf{t}=(t\_{x},t\_{y},t\_{z})}$, while the image plane is still parallel to the $ {xy}$-plane, then a point $ {\\mathbf{x}=(x,y,z)}$ under this new coordinate has image coordinate  

$ \\displaystyle (f\\frac{x-t\_{x}}{z-t\_{z}}+c\_{x},f\\frac{y-t\_{y}}{z-t\_{z}}+c\_{y},1)^{T}. $

This translation in 3D $ {(x,y,z)\\mapsto(x-t\_{x},y-t\_{y},z-t\_{z})}$ maybe expressed as matrix multiplication in 3D homogeneous coordinates  

$ \\displaystyle \\begin{pmatrix}1 & & & -t\_{x}\\\\ & 1 & & -t\_{y}\\\\ & & 1 & -t\_{z} \\end{pmatrix}\\begin{pmatrix}x\\\\ y\\\\ z\\\\ 1 \\end{pmatrix}. $

It follows that the camera model is a composition of two matrices  

$ \\displaystyle \\mathbf{P}=\\begin{pmatrix}f\_{x} & & c\_{x}\\\\ & f\_{y} & c\_{y}\\\\ & & 1 \\end{pmatrix}\\begin{pmatrix}1 & & & -t\_{x}\\\\ & 1 & & -t\_{y}\\\\ & & 1 & -t\_{z} \\end{pmatrix}=:\\mathbf{K}(\\mathbf{I\\,}|\\,-\\mathbf{t}) $

and the imaged point will thus be $ {\[\\mathbf{P}(\\mathbf{x};1)\]}$ in matlab notation. More generally, one may need to transform the coordinates of $ {\\mathbb{R}^{3}}$ by a rigid motion (a rotation and a translation) before applying the matrix $ {K}$, resulting in the camera matrix  

$ \\displaystyle \\mathbf{P}=\\mathbf{K}(\\mathbf{R}\\,|\\,-\\mathbf{t}). $

We call $ {\\mathbf{K}}$ the internel parameters, which gives the image coordinate, and remaining $ {\\mathbf{R},\\mathbf{t}}$ external parameters, which gives the ambient scene coordinate. One sees that there are in total 10 degrees of freedom for the above camera model.

**2\. Single-view geometry**

We now return to the geometric objects defined in the previous section. In the model, light rays coming from the scene focus at the camera center, forming a light cone with vertex being the camera center. The geometry of its imaging is projective: points on the same ray are equivalent, and an image is obtained by slicing the cone with the image plane. Two images obtained from two different image planes (or if with coordinates, cameras) but with the same camera center are related to each other by a 2D *projective transform*, also called *homography*. They form the isomorphism group of the projective space (a homography transform a projective space into another projective space). For example, "radial translation'' of the image plane is a zoom with amplication factor being the ratio of their focal lengths.

General projective transfroms are linear transforms defined up to scales, and the scale ambiguity can be fixed when one normalize the image coordinate for a particular choice of image plane. To see it concretely, suppose two cameras share the same camera center, one with camera matrix $ {\\mathbf{P}\_{1}=\\mathbf{K}\_{1}(\\mathbf{I}\\,|\\,\\mathbf{0})}$ and the other $ {\\mathbf{P}\_{2}=\\mathbf{K}\_{2}(\\mathbf{R}\\,|\\,\\mathbf{0})}$. And suppose the ray between $ {\\mathbf{x}}$ and camera center $ {\\mathbf{0}}$ intersect the image planes at $ {\[\\mathbf{P}\_{1}(\\mathbf{x};1)\]}$ and $ {\[\\mathbf{P}\_{2}({\\bf x};1)\]}$. The mapping that transforms $ {\\mathbf{P}\_{1}(\\mathbf{x};1)}$ to $ {\\mathbf{P}\_{2}(\\mathbf{x};1)}$ is given by the invertible $ {3\\times3}$ matrix  

$ \\displaystyle \\mathbf{K}\_{2}\\mathbf{R}\\mathbf{K}\_{1}^{-1} $

and the scale is determined by rescaling the third coordinate to $ {1}$.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiC0O_O9l8ij3hIZrxdugrf0liHriCDQmhKaLge7dgcdROKTycG96G4H1-rF4B5P3RBmIkvNSMBIT0ywGTPo4JunUFxE0Hx-1kdpr7scFg1Zj5rHP9K6gCmtP3EsoardaD_oDsUMKCn1UI/s640/singview.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiC0O_O9l8ij3hIZrxdugrf0liHriCDQmhKaLge7dgcdROKTycG96G4H1-rF4B5P3RBmIkvNSMBIT0ywGTPo4JunUFxE0Hx-1kdpr7scFg1Zj5rHP9K6gCmtP3EsoardaD_oDsUMKCn1UI/s1600/singview.png)

Figure taken from \[1\]

Projective transform also arises when two cameras are imaging a plane in $ {\\mathbb{R}^{3}}$. But otherwise two views from different camera centers are not related by a projective transform. We shall explain the reason in the next section.  

To better understand projective geometry and facilitate discussion later, we elaborate some facts below.  
**Lines (planes) and points in 2D (3D) projective space are dual objects.** Taking 2D projective space $ {\\mathbb{P}^{2}}$ as an example, a line in $ {\\mathbb{R}^{2}}$ descends to a line in $ {\\mathbb{P}^{2}}$ by ignoring the common scale. Defined in homogeneous coordinate, a line has the form  

$ \\displaystyle \\{\[(x,y,z)^{T}\]:ax+by+cz=0\\} $

where $ {a,b,c}$ not simutaneously all zeros. Thus the triple $ {(a,b,c)}$ can be used to represent a line in $ {\\mathbb{P}^{2}}$. Here we represent a line using row vector and a point by column vector, emphasising the duality between the two. A point on this line must satisfy  

$ \\displaystyle \\begin{pmatrix}a & b & c\\end{pmatrix}\\begin{pmatrix}x\\\\ y\\\\ z \\end{pmatrix}=0. $

Two lines $ {{\\bf l}\_{1}=(a,b,c)}$ and $ {{\\bf l}\_{2}=(d,e,f)}$ meet at $ {{\\bf x}=(x,y,z)^{T}}$ if  

$ \\displaystyle \\begin{pmatrix}a & b & c\\\\ d & e & f \\end{pmatrix}\\begin{pmatrix}x\\\\ y\\\\ z \\end{pmatrix}=0. $

This means when viewing these vectors in $ {\\mathbb{R}^{3}}$, $ {{\\bf x}}$ is orthogonal to both $ {\\mathbf{l}\_{1}}$ and $ {\\mathbf{l}\_{2}}$. In this case $ {{\\bf x}}$ can be calculated up to a scale by  

$ \\displaystyle \\mathbf{l}\_{1}\\wedge\\mathbf{l}\_{2}:=\\begin{pmatrix} & -c & b\\\\ c & & -a\\\\ -b & a \\end{pmatrix}\\begin{pmatrix}d\\\\ e\\\\ f \\end{pmatrix}. $

On the dual side, we see that the line $ {\\mathbf{l}}$ going through $ {\\mathbf{x}\_{1}}$ and $ {\\mathbf{x}\_{2}}$ is calculated up to a scale by  

$ \\displaystyle \\mathbf{l}=\\mathbf{x}\_{1}\\wedge\\mathbf{x}\_{2}. $

**Euclidean parallel lines intersect at infinity in projective space.** Points at infinity, or *ideal points*, are represented in homogeneous coordinate with the last coordinate zero. The set of points at inifity form a codimension-1 projective space. It is easy to check using the above intersection formula that the last coordinate is zero for the intersection of two parallel lines.  

**3\. Two-view geometry**

Here we consider two cameras with distinct camera centers. The fundamental difference is that points on a ray that are not distinguishable in Camera 1 (since they lie on the same ray through the camera center 1 and are imaged as **$ {\[\\mathbf{y}\]}$**), become distinguishable in Camera 2. That ray will have its image in Camera 2, called the *epipolar line* **$ {\\mathbf{l}\_{\[\\mathbf{y}\]}'}$**. Here we will always use primed notations to denote quantities in Camera 2. Further inspection shows that all epipolar lines intersect at one point in the image plane (which may be at infinity), this point is called the *epipole* $ {\[\\mathbf{e}'\]}$. It is also the point of intersection of the line connecting two camera centers and the image plane of Camera 2. In a word, the epipolar lines in Camera 2 are the image of the imaging of Camera 1.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXTrkwCqzC9zZehJWTHEEOIqcExNnVzzh_2F4L9H-VlgQlF3umfb19JhXdM8ClQ9T3DK6jc2_MnS-HPBMdO-0oc-e0AWzRQM_aXBP-p3URrQtvPeCahqAXt8sxOEKdTbU-vfzh7GNowcE/s640/epipolar1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXTrkwCqzC9zZehJWTHEEOIqcExNnVzzh_2F4L9H-VlgQlF3umfb19JhXdM8ClQ9T3DK6jc2_MnS-HPBMdO-0oc-e0AWzRQM_aXBP-p3URrQtvPeCahqAXt8sxOEKdTbU-vfzh7GNowcE/s1600/epipolar1.png)

Figure taken from \[1\]

**The fundamental matrix.** We are interested in the mapping, defined up to scale  

$ \\displaystyle \\mathbf{F}:\[\\mathbf{y}\]\\mapsto\\mathbf{l}\_{\[\\mathbf{y}\]}'^{T} $

that maps a imaged point $ {\[\\mathbf{y}\]}$ in Camera 1 to the epipolar line $ {\\mathbf{l}\_{\[\\mathbf{y}\]}}$ in Camera 2. The mapping is in fact linear. Knowledge of this mapping will reduce significantly the search space of corresponding points $ {\[\\mathbf{y}\]\\leftrightarrow\[\\mathbf{y}'\]}$ in two cameras. First of all, since $ {\[\\mathbf{y}'\]}$ is on the line $ {\\mathbf{l}\_{\[\\mathbf{y}\]}'}$, we have  

$ \\displaystyle \[\\mathbf{y}'\]^{T}\\mathbf{l}\_{\[\\mathbf{y}\]}'^{T}=\[\\mathbf{y}'\]^{T}\\mathbf{F}\[\\mathbf{y}\]=0. $

This maybe taken as the defining property of the *fundamental matrix* $ {\\mathbf{F}}$. In particular, since the epipole is on every epipolar lines, we deduce  

$ \\displaystyle \[\\mathbf{F}\\mathbf{y}\]=\[\\mathbf{e}'\\wedge\\mathbf{y}'\],\\;\\forall\[\\mathbf{y}\]\\leftrightarrow\[\\mathbf{y}'\]. $

This may be used to compute an expression for $ {\\mathbf{F}}$ together with a homography that transform the image of a scene plane from Camera 1 to Camera 2. We describe this approach shortly. Now let us be more concrete. Denote the two camera matrices by  

$ \\displaystyle \\mathbf{P}=\\mathbf{K}(\\mathbf{I}\\,|\\,\\mathbf{0}),\\;\\mathbf{P}'=\\mathbf{K}'(\\mathbf{R}\\,|\\,\\mathbf{t}). $

Our goal is to find the map that maps an imaged point to the corresponding epipolar line. First we find the epipole $ {\\mathbf{e}'}$. It is given by  

$ \\displaystyle \\mathbf{e}'=\\mathbf{P}'(\\mathbf{0};1)=\\mathbf{K}'\\mathbf{t}. $

Next we find a point in the back-projected ray. We choose  

$ \\displaystyle \\mathbf{P}^{+}\[\\mathbf{y}\] $

where $ {\\mathbf{P}^{+}=((\\mathbf{K}^{-1})^{T}|\\,\\mathbf{0})^{T}}$ is the pseudo-inverse of $ {\\mathbf{P}}$. Its image under Camera 2 is  

$ \\displaystyle \\mathbf{P}'\\mathbf{P}^{+}\[\\mathbf{y}\] $

and therefore the epipolar line is given by  

$ \\displaystyle \[\\mathbf{K}'\\mathbf{t}\\wedge\\mathbf{P}'\\mathbf{P}^{+}\\mathbf{y}\]. $

In this way we find the fundamental matrix up to scale  

$ \\displaystyle \\mathbf{K}'\\mathbf{t}\\wedge\\mathbf{P}'\\mathbf{P}^{+}=\\mathbf{K}'\\mathbf{t}\\wedge\\mathbf{K}'\\mathbf{R}\\mathbf{K}^{-1}. $

We now go to the derivation using planar homography. Let us choose the plane at infinity $ {\\mathbf{\\pi}\_{\\infty}}$. The transformation for points $ {(\\mathbf{d};0}$) in $ {\\pi\_{\\infty}}$ between two cameras does not depend on the camera center but only the internal paramters and relative pose. It is given by  

$ \\displaystyle \\mathbf{H}\_{\\infty}=\\mathbf{K}'\\mathbf{R}\\mathbf{K}^{-1}. $

Using this, we find the fundamental matrix to be  

$ \\displaystyle \\mathbf{K}'\\mathbf{t}\\wedge\\mathbf{K}'\\mathbf{R}\\mathbf{K}^{-1} $

which is a happy reuion.

  We close the discussion by a formula that relates two corresponding points $ {\[\\mathbf{y}\]\\leftrightarrow\[\\mathbf{y}'\]}$. Suppose they are images of the point $ {\\mathbf{x}=(x,y,z)^{T}}$, then  

$ \\displaystyle \\begin{array}{rcl} \[\\mathbf{y}\] & = & \[\\mathbf{P}(\\mathbf{x};1)\]=\[\\mathbf{K}\\mathbf{x}\]\\\\{} \[\\mathbf{y}'\] & = & \[\\mathbf{P}'(\\mathbf{x};1)\]=\[\\mathbf{K}'(\\mathbf{R}\\mathbf{x}+\\mathbf{t})\] \\end{array} $

Suppose $ {\[\\mathbf{y}\]}$ is normalised so that the last coordinate is $ {1}$, and by abuse of notation, using $ {\\mathbf{y}}$ to denote this normalised coordinate. Then  

$ \\displaystyle \\mathbf{x}=z\\mathbf{K}^{-1}\\mathbf{y}. $

So,  

$ \\displaystyle \[\\mathbf{y}'\]=\[\\mathbf{K}'\\mathbf{R}\\mathbf{K}^{-1}\\mathbf{y}+\\mathbf{K}'\\mathbf{t}/z\]. $

We see that, in general, points in correspondence of two cameras does not differ by only a homography, but also an additive term depending on the depth $ {z}$. It reduces to the homography case if the other two coordinates varies linearly with depth, such is the case if and only if the scene is a plane.
