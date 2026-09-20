---
id: 2018-05-01-high-dimensional-filtering-with-permutohedral-lattice
title: "High-dimensional filtering with permutohedral lattice"
date: 2018-05-01
tags: ["computer vision", "imaging", "numerical methods"]
source: https://sylqiu.blogspot.com/2018/05/high-dimensional-filtering-with.html
publish: true
---
High-dimensional filtering refers to convolution with kernel depending on more than the spatial variable. Examples include the *bilateral filtering*,  

$ \\displaystyle I'\_{i}=\\sum\_{j=1}^{N}k(f\_{i}-f\_{j})I\_{j}, $

where the kernel $ {k(\\cdot)}$ depends on a featrure variable including both the position and the image intensity  

$ \\displaystyle f\_{i}=(p\_{i},I\_{i}); $

with a similar form there is also the more complicated *non-local mean* filtering. In [a 2009 paper](https://graphics.stanford.edu/papers/permutohedral/) (referred to as the paper below), Adams, Baek and Davis proposed a fast, novel algorithm based on *[permutohedral](https://en.wikipedia.org/wiki/Permutohedron) lattice*, whose memory usage also scales well with dimension. This was later utilized in the mean field inference of the fully connected conditional random field model of Krähenbühl and Koltun. In this post I wish to describe some details of the permutohedral lattice approach.  

Generally speaking, there are two type of filters:  

-   High pass filters, which keep the high frequency information;
-   Low pass filters, which keep the low frequency information.

The filter is usually locally supported in a window of fixed size, after applying which it calculates the local weighted average in that window. Conventional convolutions on a equally spaced rectangular grid can be represented as (block-)circulant matrices, where the weight is the same in each window thanks to the fact that filter only depends on the spatial variable as well as the regular grid structure. This is no longer true for high-dimensional filtering, or an unstructured grid that is the case for a geometric domain. Since filters now depends on additional variables other than the spatial variable. In bilateral filtering the filter depends on the intensities of the pixels inside the window. In a naive implementation filters need to be re-computed for each new window, yielding quadratic complexity in filter's radius. The situation is similar for an unstructured grid.  

The approach here is to embed the features into a high-dimensional space (feature space) and interpolate the input signals to the regular grid point in the high-dimensional space. Efficient local averaging can then be done on the grid. And finally the values of the filtering are interpolated back to the original input feature position. These procedures are usually described vividly as *splatting - blurring - slicing*.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqxU98ALVmWgXVMfRJHX-fP8yr6yIlpYxIrO4J9ivjHAB8Qy2Ie3T3Cvvd9CJQD1jA5SBHxfxA5S7f5RESg8h4yCRT3rEajiCIhvwUvuSr4dAKd-_uiEXJUEYz8cf478iRathLGDcGHnk/s640/algo.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqxU98ALVmWgXVMfRJHX-fP8yr6yIlpYxIrO4J9ivjHAB8Qy2Ie3T3Cvvd9CJQD1jA5SBHxfxA5S7f5RESg8h4yCRT3rEajiCIhvwUvuSr4dAKd-_uiEXJUEYz8cf478iRathLGDcGHnk/s1600/algo.png)

High-dimension filter with permutohedral lattice. Figure taken from the paper.

The choice of the regular grid affects the efficiency of this approach. If the standard grid $ {\\mathbb{Z}^{d}}$ is chosen, say $ {d}$ is the dimension of the feature, then each input signal needs to be "splatted'' onto $ {2^{d}}$ nearby grid points. This is exponential complexity in dimension. In contrast, for the permutohedral lattice a input signal is "splatted'' onto only $ {d+1}$ nearby grid points, thus reducing the complexity to linear. Note that $ {d+1}$ is the number of vertices in a $ {d}$-dimensional simplex, meaning that this number cannot be improved further.  

In the following we shall introduce the permutohedral lattice and layout some properties that will be useful for understanding the algorithm.  

**1\. The permutohedral lattice**

A standard $ {d}$-dimensional permutohedron is a convex polyhedron in $ {\\mathbb{R}^{d+1}}$, whose vertices are all possible permutations of the vector $ {(1,2,\\dots,d+1)\\in\\mathbb{R}^{d+1}}$. Thus there are $ {(d+1)!}$ number of vertices for dimension $ {d}$. For example, when $ {d=2}$, there are six vertices, where they lie on the same plane and their convex hull forms a hexagon. In general, the $ {(d+1)!}$ vertices lie on the same codimension one hyperplane. This can be seen by observing that the matrix whose columns are the vertex coordinates is of rank at most $ {d+1}$, but then each column sums to $ {(d+2)(d+1)/2}$.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSHTTl9T-rgGy6alJvBUQ-WdP45LGg8DYPyRIDpe81IKUVxzNm8Ls2oOTfW7YAFYBUrRTM8O-QRBPRuD3GS2geUalAECEVVs8iJRSZyWqVleLsQR2dDZsNkRDoh4JaA_QopeN4uUxTErw/s320/content_permutohedron-3_0.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhSHTTl9T-rgGy6alJvBUQ-WdP45LGg8DYPyRIDpe81IKUVxzNm8Ls2oOTfW7YAFYBUrRTM8O-QRBPRuD3GS2geUalAECEVVs8iJRSZyWqVleLsQR2dDZsNkRDoh4JaA_QopeN4uUxTErw/s1600/content_permutohedron-3_0.png)

The hexagon in a cube is the permutohedron in dimension 2. Figure taken from Wikipedia.

The permutohedron can be translated and henceforth *tessellates* the hyperplane that contains it. This hyperplane will be our feature space. The centers of each permutohedron in the tessellation form the *permutohedral lattice* in that hyperplane. In the language of lattice theory, the permutohedron is the *Voronoi cell* of its center.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtieviP1IIO3bxLnaN9XF4KRjoqS25QhoRyg1-c1QwofE4rQFW6VimtrvOc7N_O_NVobXRT5B4pp0iy9ZDgVzI7In2KKIeGtNNsvk1ZP_wb0jCuQcqYqbxHpyFw6VDURa1aqxcyJz1cJE/s1600/truncated-octahedra-tiling.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtieviP1IIO3bxLnaN9XF4KRjoqS25QhoRyg1-c1QwofE4rQFW6VimtrvOc7N_O_NVobXRT5B4pp0iy9ZDgVzI7In2KKIeGtNNsvk1ZP_wb0jCuQcqYqbxHpyFw6VDURa1aqxcyJz1cJE/s1600/truncated-octahedra-tiling.png)

Permutohedra tessellation in dimension 3. Figure taken from Hexnet.

Since there are $ {d}$ permutations of $ {(1,2,\\dots,d+1)}$ that are closest to a given vertex of the permutohedron, it follows that each vertex is common to $ {d}$ faces. So in the tessellation each vertex is shared by $ {d+1}$ copies of permutohedra. The convex hull of the centers of these $ {d+1}$ permutohedra is a Delaunay cell of the lattice. It is therefore a simplex. The "splatting'' step is then implemented for each Delaunay simplex that contains the feature vectors corresponding to the input signals.  

It will be convenient for us to work with the following definition of the permutohedral lattice, which has integral coordinates in the feature hyperplane.  

> **Definition 1** *Let $ {T:\\mathbb{R}^{d+1}\\rightarrow H\_{d}}$ be the orthogonal projection onto the feature hyperplane defined by $ {H\_{d}=\\{x:\\,x\\cdot\\vec{1}=0\\}}$, namely*  
> 
> *$ \\displaystyle T(x)=x-\\left(\\frac{x\\cdot\\vec{1}}{\\vec{1}\\cdot\\vec{1}}\\right)\\vec{1}. $*
> 
> *The permutohedral lattice $ {A\_{d}^{\*}}$ is defined to be*  
> 
> *$ \\displaystyle A\_{d}^{\*}:=\\{T(x):\\,x\\in(d+1)\\mathbb{Z}^{d+1}\\}. $*

Under this choice of lattice, we may write down explicitly the vertices of the Delaunay simplices containing the origin. To do this, we look at the the projection of the cube $ {\[0,d+1\]^{d+1}}$. Its vertices are columns of the matrix  

$ \\displaystyle \\begin{array}{rcl} & & T\\begin{bmatrix}0 & d+1 & 0 & d+1 & 0 & & d+1 & d+1\\\\ 0 & 0 & d+1 & d+1 & 0 & & d+1 & d+1\\\\ \\vdots & \\vdots & 0 & 0 & d+1 & & \\vdots & \\vdots\\\\ & & \\vdots & \\vdots & 0 & \\cdots\\\\ & & & & \\vdots & & d+1\\\\ 0 & 0 & 0 & 0 & 0 & & 0 & d+1 \\end{bmatrix}\\\\ & = & \\begin{bmatrix}0 & d & -1 & d-1 & -1 & & 1 & 0\\\\ 0 & -1 & d & d-1 & -1 & & 1 & 0\\\\ \\vdots & -1 & -1 & -2 & d & & \\vdots & \\vdots\\\\ & \\vdots & \\vdots & -2 & -1 & \\cdots\\\\ & & & \\vdots & \\vdots & & 1\\\\ 0 & -1 & -1 & -2 & -1 & & -d & 0 \\end{bmatrix} \\end{array} $

We shall make several useful observations:  

-   The vertices of the cube can be grouped by the number of non-zero entries in the coordinate. There are $ {\\binom{d+1}{r}}$ vertices for each $ {0\\leq r\\leq d+1}$ number of non-zero entries, summing up to $ {2^{n}}$ vertices. After the projection, the nonzero entries are replaced by $ {d-r}$ and the rest are replaced by $ {-r}$.
-   Before the projection, the edges of the Delaunay simplex is a geodesic of the graph of the $ {(d+1)}$-cube from $ {\\vec{0}}$ to $ {\\vec{1}}$. After the projection, two vertices on the main diagonal $ {\\vec{0}-\\vec{1}}$ are identified. There are therefore in total $ {(d+1)!}$ number of Delaunay simplices associated to the origin. This is of course the same with the number of vertices of the permutohedron. Before the projection, we call the simplex represented by the geodesic

    $ \\displaystyle \\begin{bmatrix}0\\\\ 0\\\\ \\vdots\\\\ \\\\ 0 \\end{bmatrix}\\rightarrow\\begin{bmatrix}d+1\\\\ 0\\\\ \\vdots\\\\ \\\\ 0 \\end{bmatrix}\\rightarrow\\begin{bmatrix}d+1\\\\ d+1\\\\ \\vdots\\\\ \\\\ 0 \\end{bmatrix}\\rightarrow\\cdots\\rightarrow\\begin{bmatrix}d+1\\\\ d+1\\\\ \\vdots\\\\ d+1\\\\ 0 \\end{bmatrix}\\rightarrow\\begin{bmatrix}d+1\\\\ d+1\\\\ \\vdots\\\\ d+1\\\\ d+1 \\end{bmatrix} $

    the *canonical simplex*. It follows that the coordinates of $ {d+1}$ vertices of the canonical simplex are

    $ \\displaystyle \\begin{bmatrix}0\\\\ 0\\\\ \\vdots\\\\ \\\\ 0 \\end{bmatrix},\\begin{bmatrix}d\\\\ -1\\\\ \\vdots\\\\ -1\\\\ -1 \\end{bmatrix},\\begin{bmatrix}d-1\\\\ d-1\\\\ -2\\\\ \\vdots\\\\ -2 \\end{bmatrix},\\cdots,\\begin{bmatrix}1\\\\ 1\\\\ \\vdots\\\\ 1\\\\ -d \\end{bmatrix}. $

    Note that the coordinates are all in decreasing order. So the points inside the simplex also has coordinates of decreasing order. The other Delaunay simplices can be obtained by a simultaenous permutation of the coordinates of the canonical simplex.
-   Call a lattice point to be *of remainder* $ {k}$ if the coordinates of its pre-image modulo $ {d+1}$ in the cube has $ {k}$ number of zero entries modulo $ {d+1}$. For example, the point

    $ \\displaystyle \\begin{bmatrix}d-1\\\\ d-1\\\\ -2\\\\ \\vdots\\\\ -2 \\end{bmatrix} $

    is a remainder $ {d-1}$ point. So a Delaunay simplex has exactly $ {d+1}$ vertices of all possible $ {d+1}$ remainders.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy5e1fJU_KWiTt2WJh9sG6kA05p4orvzH6iLvZ2l4JgxwOU2aDZgtXpqc91oSLoaTDc5rc0VG-byZxJd8Gdb9qOXOB-hqOHhYcuUJEea0z9hgjd_DwDXCIU2peHwneArJxhqJ3ODeE3AA/s320/permutohedral_remainder.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgy5e1fJU_KWiTt2WJh9sG6kA05p4orvzH6iLvZ2l4JgxwOU2aDZgtXpqc91oSLoaTDc5rc0VG-byZxJd8Gdb9qOXOB-hqOHhYcuUJEea0z9hgjd_DwDXCIU2peHwneArJxhqJ3ODeE3AA/s1600/permutohedral_remainder.png)

Delaunay simplices in the permutohedral lattice of dimension 2. Figure taken from the paper.

The above observations yield an algorithm for finding the Delaunay simplex containing a given feature vector.  

> **Theorem 2** *Given $ {x\\in H\_{d}}$, the Delaunay containing it can be found by the following procedure.*  
> 
> *-   Find the nearest remainder $ {0}$ point $ {y}$ of $ {x}$;
> -   Shift the point $ {x}$ by $ {y}$: $ {\\Delta=x-y}$;
> -   Sort $ {\\Delta}$ in decreasing order: $ {\\rho(\\Delta)}$, $ {\\rho\\in S\_{d+1}}$;
> -   The nearest remainder $ {k}$ point of $ {x}$ is given by $ {\\rho^{-1}(v\_{k})+y}$, where $ {v\_{k}}$ is the remainder $ {k}$ point in the canonical simplex.*

With this way of identifying the Delaunay simplex that contains a given feature vector $ {f\_{i}}$, we can then spread the value assoicated $ {I\_{i}}$ to that feature to the vertices of the simplex according to the barycentric weight of $ {f\_{i}}$. The slicing step is basically the same, except we gather the values from the lattice to the original input feature positions.  

We must remark that the splatting or the slicing operation can be itself regarded as a blurring operation. This means that the feature vectors must be properly scaled before the splatting step.
