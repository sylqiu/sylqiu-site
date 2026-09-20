---
id: 2019-06-16-notes-on-light-transport-in-graphics-and-vision
title: "Notes on Light Transport in Graphics and Vision"
date: 2019-06-16
tags: ["computer graphics", "computer vision"]
source: https://sylqiu.blogspot.com/2019/06/notes-on-light-transport-in-graphics.html
publish: true
---
In this note I will approach light transport in two directions. The first is from the perspective of simulation and modeling, the other is from the perspective of vision and inference. We will see different forms of the *light transport equation* that connect these two aspects. I hope this note will help those who want to quickly grasp the ideas about light transport in a mostly high-level fashion. A lot of important implementation details (where the hard work really is!) are therefore omitted.  

**Prologue: A conceptual tour in physically based rendering**

To some extent, creating photo-realistic renderings means understanding our visual perceptions, which are evolving as our knowledge advances, and accordingly we will make improvements to the corresponding rendering models. Today, physically accurate reconstruction of an image about a scene requires a good understanding of the interactions between the scene geometry, scene materials and the light sources. Although the underlying physical principles of these interactions can be very complicated and computation unfriendly, it turns out fine to abstract away many physical properties, for the purpose of producing renderings that are photo-realistic to us.

In most cases, we can simplify the model by abstracting away the wave-ish properties of light, and thus our model cannot directly produce e.g. polarization, chromatic dispersion, diffraction etc., but these properties can be taken into consideration afterwards via the *principle of superposition*. (Here we need to assume linear optics, while it can be false if e.g. the light propagates in a media that can interact with the electron-magnetic field of light, or under extreme gravity.) In this way, we "modulize" the simulation of light-scene interaction.  
At the top level abstraction, we can think of light as "photons" with their frequency unspecified. The image we render represents the spatial distribution of photon density at the very moment we record it. In other words, we record, at each visible scene point and at a particular instant, how many photons are sent out towards our perspective.

Since light travels so fast compared to ordinary camera exposure time or our perception, any real image taken, or the vision as we perceive should represent an equilibrium state of the photon transport within the scene (of course, this does not apply to scenes at astronomy scale, or cameras that can capture transient states of light). This equilibrium is characterized nicely by the *light transport equation*, a.k.a. *rendering equation*, proposed by Kajiya in 1986.

To dive into the details, we will need to find appropriate differential radiometric quantities around a scene point $p$. First let us consider:

-   *Irradiance*: The number of photons arriving at $p$ per unit area per unit time.
-   *Radiant exitant*: The number of photons leaving from $p$ per unit area per unit time. 

These two quantities describe the incoming and outgoing photon density with respect to area and time. However, these quantities are irrespective to the directions of light. Imagine a device that can receive and count the number of photons emitted from $p$ per receiving area per unit time. If we use this device to measure the radiant exitant around $p$, we will get different results if the normal vector of our device's receiving plane is facing towards different directions than to $p$. This is formally known as *Lambert's Law*: we will have a cosine term multiplied to the meansured density to compensate the the inverse cosine term multiplied to the receiving area, so as to keep the number of photons constant. And because the measuring density is decreased, we will perceive a darkening effect, even though only the viewing direction is changed.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQblnEwc-LU-b5uF3fIz3l1QecrcHpLmTpcBF7EjhkxeR22ogDEws3B8kVGncfSm-_IAUVfFMRv35avghJk1Kn4XEwfWPRAtMBBL3mz_QeITDna98tTqpHC0H1vUHzxo0DZUAJcfLSEmE/s320/lambert_law.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQblnEwc-LU-b5uF3fIz3l1QecrcHpLmTpcBF7EjhkxeR22ogDEws3B8kVGncfSm-_IAUVfFMRv35avghJk1Kn4XEwfWPRAtMBBL3mz_QeITDna98tTqpHC0H1vUHzxo0DZUAJcfLSEmE/s1600/lambert_law.png)

Fig.1 Lambert's Law. Figure taken from the **pbrt** book \[1\]

Thus, we will consider finer differential radiometric quantities that take directions into account.  

-   *Incident radiance*: The number of photons arriving at $p$ per solid angle (i.e. standard measure on the unit sphere $\\mathbf{S}^2$) per unit time.
-   *Exitant radiance*: The number of photons leaving from $p$ per solid angle per unit time.

These two quantities are closely related to the irradiance and radiant exitant. If we integrate incident radiance (or exitant radiance) over a unit sphere centered at $p$, we will get the irradiance (or resp. radiant exitant). In particular, if no light can pass through $p$ because of its material property, then it is equivalent to integrate over the unit half-sphere $\\mathbf{H}^2$ above the tangent plane at $p$.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ7OHBpA3bKHWX_thYkmIIahxGrn9ByqCn1Ii2ki8z0RyEqTEvRNTIl_F6qjgmbNztb_hC14ZVqsQhR8RKv8v5JjXmXLb-pfQPzidvsy4bh-ynT18l7I4sOyRgstv6dZ-2mPKLlpcRmcc/s320/radiance_def.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhQ7OHBpA3bKHWX_thYkmIIahxGrn9ByqCn1Ii2ki8z0RyEqTEvRNTIl_F6qjgmbNztb_hC14ZVqsQhR8RKv8v5JjXmXLb-pfQPzidvsy4bh-ynT18l7I4sOyRgstv6dZ-2mPKLlpcRmcc/s1600/radiance_def.png)

Fig.2 Incident radiance and exitant radiance. Figure taken from the **pbrt** book \[1\]

The relation between incident radiance and exitant radiance at $p$ is dictated by the material property at $p$. Imagine a beam of light coming from direction $\\omega\_i \\in \\mathbf{S}^2$ arriving at $p$, in other words, a incident radiance $L\_{i}(p, \\omega\_{i})$. The outgoing light from $p$ due to this light beam is a distribution of exitant radiance over the unit sphere centered at $p$. Denote the exitant radiance in direction $\\omega\_o$ as $L\_{o}(p, \\omega\_{o})$. For simplicity, we assume a certain ratio of $L\_{i}(p, \\omega\_{i})$ is reflected or transmitted in the form of $L\_{o}(p, \\omega\_{o})$. Because of Lambert's Law, we also expect a uniform decrease in this ratio if the angle between $\\omega\_i$ and the surface normal at $p$ is large. We can thus normalize this effect out, which leads us to the *bidirectional scattering distribution function (BSDF)*$$  
f(p, \\omega\_o, \\omega\_i) = \\frac{L\_{o}(p, \\omega\_{o})}{L\_{i}(p, \\omega\_{i})|\\cos(\\theta\_i)|},  
$$where $\\theta\_i$ is the angle between $\\omega\_i$ and the surface normal $\\mathbf{n}$. We will assume this quantity depends only on the material. For examples,  

-   For perfect specular reflection, the photons from $\\omega\_i$ are simply copied to its mirrored direction $\\omega\_o$, and so $f$ is a delta distribution for fixed $\\omega\_i$.
-   For glossy reflection, $f$ is more spread-out within a cone of directions than a perfect specular reflection.
-   For perfect Lambertian reflection, $f$ is a uniform distribution over the half sphere $\\mathbf{H}^2$.
-   For a *black body*, $f$ is simply zero.

Now we are ready to derive the light transport equation. For a scene point $p$, we must have conservatoin of energy. This means the difference in the radiant exitant and irradiance must equate the amount of photons emitted minus the amount absorbed per unit time. Moving the irradiance to the right hand side, and reformulate this equality in terms of incident radiance $L\_i(p, \\omega\_i)$, exitant radiance $L\_o(p, \\omega\_o)$, emitted radiance $L\_e(p, \\omega\_o)$ in direction $\\omega\_o$ and the BSDF, we have  

$\\displaystyle L\_o(p, \\omega\_o) = L\_e(p, \\omega\_o) + \\int\_{\\mathbf{S}^2}  
                f(p, \\omega\_o, \\omega\_i)L\_i(p, \\omega\_i)|\\cos(\\theta\_i)| \\, d\\omega\_i \\ \\ \\ \\ (1) $

This light transport equation will be the central theme. We will next turn to the evaluation of the solution of this integral equation given scene geometry, materials (in terms of BSDFs), and light sources through Monte-Carlo integration.  

 **1\. Monte-Carlo path tracing**

Consider a non-light-source point $p$. The point's exitant radiance in direction $\\omega\_o$ is a result from the incident radiance at $p$, which in turn can possibly come from all other scene points. We can already sense a recursive process going on: most points are first lit by light sources, and then all the points lit each other, and then all the points lit each other again, and it goes on like this literally infinite number of times. The result after the first "light bounce" is called *direct illumination*, and the result afterwards is called indirect illumination. Indirect illumination accounts a great deal in the realism of a rendered image.  

Thus the final rendered image is a superposition of first bounce image, second bounce image, third bounce image, etc. In practice we may terminate before a prescribed maximum level of bounces (per path tracing), since the contribution of each bounce is diminishing.  

The idea is clearer if we consider the path integral formulation of light transport. We denote exitant radiance sent from $p'$ to $p$ by $L(p' \\to p)$. The BSDF term as $f(p''\\to p' \\to p)$. Here we no longer integrate over $\\mathbf{S}^2$ but the *scene surface*, denoted hereafter by $A$. Due to this reason, we will need to change the cosine term to a "geometry term". To change the integration domain to the entire scene, we use the change of variable formula in integration.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoi09315_7nrkkshz2n_4N_57I8_wTkPQoGrfy1BYRpYcTi1mMJsAwUpVfWdBmFmKuvDLJnQJL195wgrCJqIjx4BXyl4LcFnxhQrgkNXKrFCTco4doETk0Up3OwNwzrsAlVVvTKJ6k-4Q/s320/integration_domain.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoi09315_7nrkkshz2n_4N_57I8_wTkPQoGrfy1BYRpYcTi1mMJsAwUpVfWdBmFmKuvDLJnQJL195wgrCJqIjx4BXyl4LcFnxhQrgkNXKrFCTco4doETk0Up3OwNwzrsAlVVvTKJ6k-4Q/s1600/integration_domain.png)

Fig.3 Change of variable from the unit sphere measureto the scene surface measure. Figure taken from the **pbrt** book \[1\]

The Jacobian of this change of variable is $|\\cos(\\theta'')|/\\|p'' - p\\|^2$, where $\\theta''$ is the angle between the ray $p\\to p''$ and the normal vector at $p''$. The geometry term becomes

$ \\displaystyle G(p', p'') = V(p', p'')\\frac{|\\cos(\\theta')||\\cos(\\theta'')|}{\\|p'' - p'\\|^2} $

where $V(p', p'')$ is $1$ if $p''$ is visible from $p'$ and $0$ otherwise. Then the light transport equation write 

$ \\displaystyle L(p'\\to p) = L\_e(p'\\to p) + \\int\_A f(p''\\to p' \\to p) L(p'' \\to p') G(p', p'') dA(p'') \\ \\ \\ (2) $

Note that if we consider all pairs of $(p, p')$ and record the radiance in an "array" as $L$, the integration term above can be seen as a linear operator on $L$. Hence, in operator form (2) is  

$ \\displaystyle L = L\_e + \\mathcal{A}L $

 where $L\_e$ is the *first bounce radiance*, and the operator $\\mathcal{A}$ is called the light transportat matrix. Given $L\_e$, we can solve for the final radiance by inverting the operator $(I - \\mathcal{A})$, which has a *Neumann series* expansion  

$ \\displaystyle \\begin{array} {rcl} L & = & (I-\\mathcal{A})^{-1}L\_e \\\\ & = & L\_e + \\mathcal{A}L\_e + \\mathcal{A}^2L\_e + \\mathcal{A}^3L\_e + \\cdots \\end{array} $

which agrees well with our discussion about the first bounce, second bounce, etc. images.  

We now go on to describe the Monte-Carlo integration for the first bounce image, and then describe the procedure to compute the result for a many-bounce image.  

**1.1. Rendering direct illumination**

Assume a simple pinhole camera model. To render the image as taken by this camera, we need to connect pixels on the image plane to each scene point and record the incident radiance on the image plane, i.e. a camera ray. Suppose the pixel is in the direction $\\omega\_o$ at a scene point $p$. The main job is to compute

$\\displaystyle L\_o(p, \\omega\_o) = \\int\_{\\mathbf{S}^2} f(p, \\omega\_o, \\omega\_i) L\_d(p, \\omega\_i) |\\cos(\\theta\_i)|d\\omega\_i $

where $L\_d$ is the incident radiance directly from the light sources. $L\_d$ in path integral framework is  

$\\displaystyle  V(p',p)\\frac{|\\cos(\\theta')|}{\\|p'-p\\|^2} L(p'\\to p) $

where $p'$ is a point from the light source in the $\\omega\_i(p)$ direction, $\\theta'$ is the angle between the ray $p'p$ and the surface normal of the light source at $p'$, and $L(p'\\to p)$ is the simply number of photons emitted at $p'$ towards $p$ per solid angle per unit time (i.e. the exitant radiance at $p'$). Note that we should integrate this quantity over the entire light source surface $A\_L$.  

Monte-Carlo integration evaluates the integral by taking random samples $p' \\in A\_L$ with probability $P(p')$, evaluating the integrand, and applying harmonic average:  

$ \\displaystyle \\widehat{L\_o}(p, \\omega\_o) = \\sum\_{p'} \\frac{1}{P(p')}f(p'\\to p \\to \\text{cam}) V(p',p)\\frac{|\\cos(\\theta\_i)||\\cos(\\theta')|}{\\|p'-p\\|^2}L(p'\\to p)$

where $\\theta\_i$ is the angle between the light ray $p'p$ and the surface normal at $p$, and $P(p') = P(\\omega\_i(p)) \\frac{|\\cos(\\theta')|}{\\|p'-p\\|^2}$ is the transformed probability. Hence in fact the above equation can be simplified to  

$\\displaystyle \\widehat{L\_o}(p, \\omega\_o) = \\sum\_{i} \\frac{1}{P(\\omega\_i)} f(p, \\omega\_o, \\omega\_i) V(p',p)|\\cos(\\theta\_i)|L(p'\\to p). \\ \\ \\ (3)$

Note that this simplification can be made only if there is no "delta distribution" in the integrand. These deltas, such as point light source or specular component in BSDF, must be handled separately.  

One can verify that this estimation is unbiased:  

$ \\displaystyle L\_d(p, \\omega\_i) = \\mathbb{E}\\big (\\widehat{L\_d}(p, \\omega\_i) \\big) $

The question is then how to make this estimate converge faster, or equivalently how to make the variance of this estimate smaller. A course in statistical computing tells us that the variance is smaller if the probability distribution $P$ resembles the integrand.  Since we can cheaply evaluate the integrand, and it's too expensive to compute a joint probability distribution of light and BSDF out of it, we have to cleverly choose a probability distribution so that it is large when the integrand is large. In this regard, **pbrt** \[1\] uses a power heuristic for multiple importance sampling and stratefied sampling.  

**1.2. The path tracing algorithm**

To illustrate the idea we show how to compute the second bounce image.  
We now want to trace a ray from a scene point $p$ to another general scene point $p'$, and compute the incident radiance of the ray from $p'$ to $p$, given the exitant radiance distribution at $p'$ due to direct lighting. The latter can be Monte-Carlo-ly esitmated by re-tracing a ray from $p'$ to a point from the light sources.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLmPkQa0BaEQIv_w1mOkJ4fD-x2wMF7XM6JrHYkSGg7IL9EHyUNiDZCQjRxI-ikJT-KzTHl4KMUThePadCKXhyphenhyphenmkWtUo4DSAOPvwq_5dfrKBL6_r-Bv8e1v1SxbknX6OeoXxEdXJ2QhCQ/s400/path_tracing.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLmPkQa0BaEQIv_w1mOkJ4fD-x2wMF7XM6JrHYkSGg7IL9EHyUNiDZCQjRxI-ikJT-KzTHl4KMUThePadCKXhyphenhyphenmkWtUo4DSAOPvwq_5dfrKBL6_r-Bv8e1v1SxbknX6OeoXxEdXJ2QhCQ/s1600/path_tracing.png)

Figure 4. A path of 2 bounces.

The overall process is very similar to that of the first bounce. We sample a direction $\\omega\_i(p)\\in\\mathbf{S}^2$ at $p$ with probability $P(\\omega\_i(p))$. We then find a closest interection point in the $\\omega\_i(p)$ direction, namely $p'$, that will give a exitant radiance direction $\\omega\_o(p')$ at $p'$. Suppose at $p'$ the exitant radiance is computed as $L(p'\\to p) = L\_o(p', \\omega\_o)$, and suppose the camera ray to $p$ is in direction $\\omega\_o(p)$. It follows that the exitant radiance at $p$  due to $L\_o(p', \\omega\_o)$ is  

$\\displaystyle \\begin{array}{lcl} L\_o(p, \\omega\_o(p)) & = & \\int\_{\\mathbf{S}^2} f(p, \\omega\_o(p), \\omega\_i(p))L\_i(p, \\omega\_i(p))|\\cos(\\theta\_i(p))| d\\omega\_i   \\\\  
& = & \\int\_{\\mathbf{S}^2} f(p, \\omega\_o(p), \\omega\_i(p)) |\\cos(\\theta\_i(p))|\\times \\\\ & & ~~~~~~~~ \\int\_{A\_{L}}f(p''\\to p' \\to p))L(p''\\to p)G(p'', p') ~d\\omega\_i(p) dA\_{L}(p'') \\\\ &\\approx &  \\sum\_{j, p''} \\frac{1}{P(\\omega\_j(p))} f(p, \\omega\_o(p), \\omega\_j(p)) |\\cos(\\theta\_j(p))|\\times \\\\ & & ~~~~~~~~~~~~~\\frac{1}{P(A\_L(p''))}f(p''\\to p' \\to p))L(p''\\to p)G(p'', p').  
\\end{array}  
$

Two things should be noted. First, since we assumed $p''$ is the closest intersection in direction $\\omega\_i(p)$, the visibility term is simply $1$. Second, the probability term $P(A\_L(p''))$ actually cancels a lot of terms in the denominator, as is with Equation (3).  

In practice, paths are often constructed in an incremental manner. We sample the first segment from the camera to the scene, and calculate the first bounce image. We then sample the second segment according to the point's BSDF (though which might be inaccurate to sample from since we do not know the other factor $L\_i$), calculate the second bounce image and add it to the first bounce image, we then continue the path until the path is lost in void, or has reached the prescribed maximum depth, or terminated by *Russian Roulette*.  
The path so generated has a probability associated, and as before the harmonic average is done to obtain the Monte-Carlo estimate.  

**1.3. Bidirectional methods**

Suppose we have traced a path of bounce $n$. The contribution of this path to the $n$-bounce image depends on how probable the light can be well-sampled.  
This very last step of light sampling depends on the previously sampled path vertices, which may well be sub-optimal and conribute little to the $n$-bounce image. Consequently, in tricky lighting conditions, such as a light source hidden behind a cover, or for materials that refract light, conventional path-tracing will take enormous time to converge to a acceptable result.  

We briefly describe two approaches that take advantage of the fact that light paths can be reversed, in other words, it is the paths, not directions of the propagation, that matters in the stationary light transport simulation. Path tracing is done in a way that reverses the direction of light. These methods are thus called called *bidirectional*.

-   *Bidirectional path tracing*  traces paths from the camera and from the light, and connect these paths at intermediate vertices. Paths can be reused and one needs to take into account the many posibility of connecting the paths and use multiple importance sampling. Furhter improvement in sampling strategy leads to the class of methods based on *Metropolis-Hasting light transport*.
-   *Photon mapping* assumes raidiance is smooth and traces rays from the light sources and deposits them at sparse locations in the scene, and paths from the camera are traced and the contribution to the final image is interpolated and calculated from these sparsely cached radiance.

Further details and references can be found in \[1\].  

**3\. Image space stationary light transport** 

Leaving from the world of graphics to computer vision, we go in the reverse direction: given one or multiple images, how do they contribute to our knowledge of stationary light transport of the scene being imaged?  

From what we know about the linearity of light transport, we have a decomposition of the image $I$ into a sum of images $I\_{L\_i}$ that are obtained from light sources $L\_i$ indexed in $i$. Think of $I$ as a column vector, then we can write this as  

$\\displaystyle I = Tl ~~~~~~~~~~~~~~~~~~~~~~~~ (4)$

where $l$ is a coefficient vector representing weighted combination of different lights, and $T$ is called the *light transport matrix* for the image $I$. The collection of light sources is assumed to be fixed. We are interested in the structure of the matrix $T$. Columns of $T$ have a very clear meaning: they are simply the images $I\_{L\_i}$. It is a more entertaining exercise to think about the meaning of the rows of $T$, and in particular, reversibility of light paths. We will come to this point soon.

**3.1. Nyström light transport** 

If we have a good number of light sources, then we expect nearby light sources in space to produce similar effects. In terms of the matrix $T$, this property is translated to "nonlinear coherence" between columns or rows of $T$. Thus finding the most "incoherent" portion of the $T$ will help us understand $T$ more than others.  

To be more precise, suppose we know $r$ rows $\\begin{bmatrix} A & R \\end{bmatrix}$ and $c$ columns $\\begin{bmatrix} A \\\\ C \\end{bmatrix}$ out of $T$. They carry the most information of $T$ if the $r\\times c$ submatrix $A$ has the same rank with $T$. If so, the remaining portion of $T$ can be reconstructed:  

$\\displaystyle T = \\begin{bmatrix} A & R \\\\ C & CA^{\\dagger}R  \\end{bmatrix}$

where $A^{\\dagger}$ denotes the Moore-Penrose pseudoinverse of $A$. If the ranks are not exactly the same, the above is still the best approximation in the sense of Frobenius norm for matrices. Note that the implicit assumption here is that the matrix $T$ is approximately *low-rank*. This property can be enhanced using, such as the *kernel trick* \[2\], or neural networks \[3,4\]. Once $T$ is reconstructed, the scene can be re-lit under arbitrary lighting coeffcient $l$ from Equation (4).  

We must mention how one can actually sample the columns and more importantly rows of the transport matrix $T$. The figure below shows the setting of \[2\]. Here two pairs of camera-projector are used for principled sampling of columns and rows.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDgp4Gwt3KVNlzDZa0hkii890Dpcr9mCyQeTrYW72OlEy32Gvb6X9HuUNYmHFlmRxBUNwdIFb9KjSinBDUrpwEHYrfWQ8V7hM498zJjpMZUr1BwgXdIio5X_JOdyadQVg4LO8tLhy7FEo/s640/sampling_rl.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDgp4Gwt3KVNlzDZa0hkii890Dpcr9mCyQeTrYW72OlEy32Gvb6X9HuUNYmHFlmRxBUNwdIFb9KjSinBDUrpwEHYrfWQ8V7hM498zJjpMZUr1BwgXdIio5X_JOdyadQVg4LO8tLhy7FEo/s1600/sampling_rl.png)

Fig.5 Sampling columns and rows of the light transport matrix. (a) Photograph of the scene in column sampling. (b, c) Two column sampling images. (d) Photograph of the scene in row sampling. (e, f) Two row sampling images. The corresponding pixels are marked in (c). The figure is taken from the paper of Wang *et al*., Siggraph2009 \[2\].

**3.2. Light transport probing** 

It is possible to gain more insight into the light transport matrix, if not only do we have control over the light sources, for example using a beam projector, but also *control over how light sensing is made*. The technique, developed by O'Toole *et al*. (Siggraph 2012) called *primal-dual transport probing*, is capable of separating direct and indirect illumination. This is one of the major differences from Nystöm relighting technique described previously. 

To probe the light transport matrix means to get a new image $I'$ via a probing matrix $\\Pi$  

$\\displaystyle I' = \\Pi \\odot T \\mathbf{1}$

where $\\odot$ means element-wise multiplication and $\\mathbf{1}$ means a vector of all ones. This formulation certainly includes Equaiton (4) as a special case. Intuitively, we can think of it as masking-out certain pixels for each light source and finally add-up them together.  

Of course, there's price to pay: in order to know what to probe in the light transport matrix, one needs to know the meaning of each entry in it, that is, which light contributes to which pixel. This is often achieved by restricting the spatial relation between the projector and the camera, as shown in Figure 5.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_U3oTAlTCXroXPBvLd1NXN-Z7w_HgeXFTExkZEn5LkL6a6oIfgnP66AG1cuIL1CyRAO4dnJ-Uv2JCMOBO2-c_YVmt4TNg1TRN-p5qgj0n_ntfgT-cxYcGaz06-tHugK73gIctHxhXPv4/s640/proj_cam_arr.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_U3oTAlTCXroXPBvLd1NXN-Z7w_HgeXFTExkZEn5LkL6a6oIfgnP66AG1cuIL1CyRAO4dnJ-Uv2JCMOBO2-c_YVmt4TNg1TRN-p5qgj0n_ntfgT-cxYcGaz06-tHugK73gIctHxhXPv4/s1600/proj_cam_arr.png)

Fig.6 Projector-camera spatial setup. The **coaxial** arrangement (a) in O'Toole \_et al\_. essentially aligned each point light source with each pixel. In **non-coaxial** stereo arrangement (b), the light-pixel relation can be trickier, which need resolving to multi-view geometry. Under the coaxial arrangement, types of light paths shown in (c, d) are easier to identify. This figure is taken from the paper of O'Toole *et al*., Siggraph2012 \[5\].

Under coaxial arrangement, the entries of the light transport matrix can be classified into corresponding light path types. For simplicity, we consider the light transport situation of a one-dimentional slice of the image. For 2D images the light transport operator is better illustrated as a 3D tensor.  

Entries in  MATH0  MATH2 

Type of light path

Diagonal

Direct and back-scattering paths

All off-diagonal

All indirect light paths

Far off-diagonal

Long-range indirect

Near off-diagonal

Short-range indirect (mainly) 

Distributional properties within the matrix $T$ also tells us about the distribution of light paths. For example, diffusive reflections should result in non-zero entries distributed over many entries, while glossy and specular reflections should result in more concentration in smaller amount of entries.  

To probe the transport matrix, not only do we need to precisely control the point light sources, but also precisely control pixel response to light. In principle one could record pixelwise response to each point light source, but that would be too expensive to do, especially when we only want the resulting image for a particular probing. More generally, one can illuminate the scene with a specific light pattern $l$, and record the image with specific pixel masked, with mask $m$. The obtained image $I\_{m,l}$ can be mathematically expressed as  

$\\displaystyle I\_{m,l} = M T l =  (m ~l^T) \\odot T ~\\mathbf{1}$

where the $i$-th row of $M$ is $M\_i = (m^{T})$. Thus we can probe the light transport with matrix $\\Pi$ by decomposing $\\Pi$ into a sum of \_rank one\_ matrices:  

$\\displaystyle \\Pi = \\sum\_k m\_k ~l^{T}\_{k}$

that is, a sequence of light patterns and masks.  

In the paper \[5\]., they used a *stochastic* estimation, which is an amusing technique in itself developed by Hutchinson (1990) \[8\] and Bekas *et al.* (2007) \[9\] to estimate entries in a matrix. In short, instead of recording one image for each light source with masked pixels, the camera will record the desired image over a single exposure period, during which random *Rademacher light* $\\mathbf{i}\_k$ are projected to the scene and corresponding pixels on the sensor are masked according to $\\Pi~\\mathbf{i}\_k$. Within the exposure period, we have $k=1, ... K$ different light patterns together with masks integrated. The result will converge as $K \\to \\infty$. Below is a very illustrative example of what their approach is capable of:  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOV6BD8fKGMG5bJZHX0hCmBOtIlA03gejaKVjKIZjA79DYPXCQCQlFmcZrqf0MAue52KsAOoDhjPPPSs0T6m3_03uLXZeF89ewfe3RZoo7FFIHjipxziLNn7o6aEBdHZosuiz1btwImCc/s640/primal_dual_probing.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOV6BD8fKGMG5bJZHX0hCmBOtIlA03gejaKVjKIZjA79DYPXCQCQlFmcZrqf0MAue52KsAOoDhjPPPSs0T6m3_03uLXZeF89ewfe3RZoo7FFIHjipxziLNn7o6aEBdHZosuiz1btwImCc/s1600/primal_dual_probing.png)

Fig.7 Light transport probing. (d,f) also uses the method of Nayar (2006) to futher decompose the indirect component. This figure is taken from the paper of O'Toole *et al*., Siggraph2012.

Of course, if not at all necessary, stochastic estimation is not really that desirable. In a 2014 SIGGRAH paper \[6\], O'Toole *et al.* proposed a new method based on matrix factorization, by optimizing the efficiency of light patterns and masks.  

**3.3. Transient light transport**

So far we have only considered light transportat in stationary state, meaning that the transport has reached equilibrium, as per the rendering equaiton (1). We can add in an extra time dimension and to render light in *transient* state, and thus the *transient rendering*. The idea is clearer in the path integral framework, we can simply look at the length of each light path, group them according to length and accordingly, time of flight of a specific photon.  

Reversely, if we know the time of flight, we then know the length of the corresponding light path. The fact that in most cases, direct illumination contributes most in the image formation, explains the use of *time-of-flight (ToF) depth sensing*. The effect from indirect illumination on depth sensing is called *multi-path interference*.  

The image space light transport (4) can also unfold along the time dimension. Now it reads  

$\\displaystyle I(\\delta t) = T(\\delta t)~l $

where $\\delta t$ denotes the time interval starting from the instant when a *temporal impulse* of light with spatial pattern $l$ happens.  

Suppose we have a temporally varing light $l(\\tau)$. Because of translational symmetry in time dimesion, we have the resulting cummulative image at pixel $p$ up to time $t$ as a superposition of above images with different $\\delta t$:  

$\\displaystyle I(t,p) = \\int\_{-\\infty}^{\\infty} \\sum\_{q} T(\\tau, p, q)~l(t-\\tau, q) d\\tau \\ \\ \\ \\ \\ \\ (5)$

Taking Fourier transform on both sides, we have  

$ \\displaystyle I^{\\omega}(p) = \\sum\_{q} \\widehat{T}(\\omega, p, q)~ l^{\\omega}(q) \\ \\ \\ \\ \\ \\ (6) $

where $\\widehat{T}(\\omega, \\cdot, \\cdot)$ denotes the time-dimension Fourier transform of $T(\\tau, \\cdot, \\cdot)$. Note that Equation (6) is in the same form with Equation (4). We now have a familiar form of image space single frequency light transport.  

$\\displaystyle I^{\\omega} = T^{\\omega} ~l^{\\omega}. $

O'Toole *et al.* take advantage of this obsevation in their another Siggraph 2014 paper \[7\], using the same technique in O'Toole *et al.* \[5, 6\] described in the previous section to deal with transient light transport. It is worth mentioning that the depth sensing by probing the direct and retro-reflection component is a very clever way of reducing multi-path interference in optical domain. Further development of this approach include *eipolar ToF imaging*, by Apreeth *et al*. in Siggraph 2017 \[10\].  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwN__DppeFkM2sQn-ovsjG2Y2jNz9KwxdGBM47riac6-VgEEV_NukZcdQAGijquEQXbgj3C7Uwxt3i6JG7g2v80hb74GxK7h_jlkLUV6QYyj1-v8rzr6mRzMYOIuK82fE5yGbR2imQovE/s640/ToF_probe.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwN__DppeFkM2sQn-ovsjG2Y2jNz9KwxdGBM47riac6-VgEEV_NukZcdQAGijquEQXbgj3C7Uwxt3i6JG7g2v80hb74GxK7h_jlkLUV6QYyj1-v8rzr6mRzMYOIuK82fE5yGbR2imQovE/s1600/ToF_probe.png)

Fig.8 (a) The phase of conventionally-acquired PMD photos. (b) The phase of direct/retro-reflective PMD photos returned by Algorithm 3. (c-d) Views of the 3D meshes computed from (a) and (b), respectively. (e) Plots of the x- and z-coordinates for a slice of each scene, computed from the conventional (blue) and the direct/retro-reflective (red) phases. Observe that the base of the conventionally-acquired bowl protrudes through the back wall by about 5 cm; the pages of the conventionally-acquired book appear curved; the corner of the room in the conventionally-acquired David scene is rounded, and the caustic paths illuminating the room’s right wall produce a 2 to 3 cm offset in depth values. None of these artifacts appear in (b) or (d). This figure is taken from the paper of O'Toole *et al*., Siggraph2014.

**Reference**  
\[1\] Pharr, Matt, Wenzel Jakob, and Greg Humphreys. Physically based rendering: From theory to implementation. Morgan Kaufmann, 2016.  
\[2\] Wang, Jiaping, et al. "Kernel Nyström method for light transport." ACM Transactions on Graphics (TOG) 28.3 (2009): 29.  
\[3\] Ren, Peiran, et al. "Image based relighting using neural networks." ACM Transactions on Graphics (TOG) 34.4 (2015): 111.  
\[4\] Xu, Zexiang, et al. "Deep image-based relighting from optimal sparse samples." ACM Transactions on Graphics (TOG) 37.4 (2018): 126.  
\[5\] O'Toole, Matthew, Ramesh Raskar, and Kiriakos N. Kutulakos. "Primal-dual coding to probe light transport." ACM Trans. Graph. 31.4 (2012): 39-1.  
\[6\] O'Toole, Matthew, et al. "Homogeneous codes for energy-efficient illumination and imaging." ACM Transactions on Graphics (ToG) 34.4 (2015): 35.  
\[7\] O'Toole, Matthew, et al. "Temporal frequency probing for 5D transient analysis of global light transport." ACM Transactions on Graphics (ToG) 33.4 (2014): 87.  
\[8\] Hutchinson, Michael F. "A stochastic estimator of the trace of the influence matrix for laplacian smoothing splines." Communications in Statistics-Simulation and Computation 19.2 (1990): 433-450.  
\[9\] Bekas, Costas, Effrosyni Kokiopoulou, and Yousef Saad. "An estimator for the diagonal of a matrix." Applied numerical mathematics 57.11-12 (2007): 1214-1229.  
\[10\] Achar, Supreeth, et al. "Epipolar time-of-flight imaging." ACM Transactions on Graphics (ToG) 36.4 (2017): 37.
