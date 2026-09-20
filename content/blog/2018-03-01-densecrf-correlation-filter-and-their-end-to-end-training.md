---
id: 2018-03-01-densecrf-correlation-filter-and-their-end-to-end-training
title: "DenseCRF, Correlation Filter and Their End-to-End Training"
date: 2018-03-01
tags: ["computer vision", "imaging", "numerical methods"]
source: https://sylqiu.blogspot.com/2018/03/topics-in-computer-vision-densecrf.html
publish: true
---
In this post we will review two classical techniques in computer vision. They are  

-   Conditional random field in semantic segmentation;
-   Correlation filter in object tracking. 

And we will review some recent advances in this field, where they are integrated into a convolutional neural network model. As we shall see, a network model need NOT be deep to achieve state of the art performance, as is the case in the object tracking. 

As is the trend today, one would like to have a *universal model* for different computer vision tasks. Neural network models seems to have the potential of being such, although understanding such models remains still challenging.

**1\. Basics of CRF in semantic segmentation**  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3iOTjS6o4NQCqU79KueK4Ss48mYWxXYgrDwNDEbHF8U6RfudGGCsMq558zRacgT5cQmVjEvnxz-FjeLsrCTrnRPd8T5GsHhRHIiP7vxbDeW_slxO8nifGMPsj2IXkAfX4FvntXpjp1iY/s640/gCRF1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3iOTjS6o4NQCqU79KueK4Ss48mYWxXYgrDwNDEbHF8U6RfudGGCsMq558zRacgT5cQmVjEvnxz-FjeLsrCTrnRPd8T5GsHhRHIiP7vxbDeW_slxO8nifGMPsj2IXkAfX4FvntXpjp1iY/s1600/gCRF1.png)

Figure taken from \[1\].

Let $ {{\\bf I}}$ be an image of size $ {N}$. We want to segment it into $ {\\mathcal{L}=\\{l\_{1},\\cdots l\_{k}\\}}$ semantic classes. That is, each spatial pixel $ {p\_{j}}$ is assigned with a label $ {X\_{j}\\in\\mathcal{L}}$. The entire labeling of the image $ {{\\bf I}}$ is denoted $ {{\\bf X}=(X\_{j})\_{j}}$. The problem is to find a good way to assign $ {{\\bf X}}$ to $ {{\\bf I}}$.  

From a statistical point of view, $ {{\\bf X}}$ can be modeled as a *conditional random field (CRF)* defined on the image pixels, where the conditioning is on the image $ {{\\bf I}}$. In the paper of Krähenbühl & Koltun (2013) it is defined by a Gibbs distribution  

$ \\displaystyle P({\\bf X}|{\\bf I})=\\frac{1}{Z({\\bf I})}\\exp(-E({\\bf X},{\\bf I})) $

where  

-   $ {E({\\bf X},{\\bf I})=\\sum\_{c\\in\\mathcal{C}\_{\\mathcal{G}}}\\phi\_{c}({\\bf X}\\,|\\,{\\bf I})}$ is called the Gibbs energy.
-   $ {\\mathcal{G}=(V,E)}$ is a fully connected graph, where vertex set $ {V}$ is the set of pixels of $ {{\\bf I}}$. In orther words, for every two different pixels there is an edge connecting them.
-   $ {\\mathcal{C}\_{\\mathcal{G}}}$ is a subset of $ {V\\cup E}$, the elements of which are called *cliques*.
-   $ {\\phi\_{c}}$ is called the potential/cost function associated to the clique $ {c}$.
-   $ {Z({\\bf I})}$ is a normalization constant, $ {Z({\\bf I})=\\sum\_{x\\in\\mathcal{L}^{N}}\\exp(-E(x,{\\bf I})}$.

Once the probability distribution is set, the optimal labeling of the image $ {{\\bf I}}$ is obtained by MAP estimation  

$ \\displaystyle x^{\*}=\\arg\\max\_{x\\in\\mathcal{L}^{N}}P(x|{\\bf I}) $

In the case $ {\\mathcal{C}\_{\\mathcal{G}}=V\\cup E}$, the model is called a *fully connected CRF, or dense CRF*. And  

-   if $ {c=u\\in V}$, $ {\\phi\_{u}}$ is called a unary potential;
-   if $ {c=p\\in E}$, $ {\\phi\_{p}}$ is called an edge/pairwise potential.

In their model, the unary potentials are given by an extended version of TextonBoost. Future work replaces it by output of CNNs.  

The edge potentials have the form  

$ \\displaystyle \\begin{array}{rcl} & & \\phi\_{p}(x\_{i},x\_{j}\\,|\\,{\\bf I})\\\\ & = & \\frac{1}{2}\\mu(x\_{i},x\_{j})\\left(w^{(1)}\\exp\\left(-\\frac{|p\_{i}-p\_{j}|^{2}}{2\\theta\_{\\alpha}^{2}}-\\frac{|I\_{i}-I\_{j}|^{2}}{2\\theta\_{\\beta}^{2}}\\right)+w^{(2)}\\exp\\left(-\\frac{|p\_{i}-p\_{j}|^{2}}{2\\theta\_{\\gamma}^{2}}\\right)\\right)\\\\ & =: & \\frac{1}{2}\\mu(x\_{i},x\_{j})\\sum\_{m=1}^{2}w^{(m)}k(f\_{i},f\_{j}) \\end{array} $

where  

-   $ {x\_{i}}$ is the label given to the pixel $ {p\_{i}}$;
-   $ {I\_{i}}$ is the color vector of the pixel $ {p\_{i}}$;
-   $ {\\mu(\\cdot,\\cdot)}$ is a symmetric label compatibility function, the weights $ {w^{(1)}}$, $ {w^{(2)}}$, and $ {\\theta\_{\\alpha},\\theta\_{\\beta},\\theta\_{\\gamma}}$ are learnable parameter; $ {f\_{i}}$ is the feature vector which in this case consists of $ {p\_{i}}$ and $ {I\_{i}}$.

Commonly $ {\\mu(\\cdot,\\cdot)}$ is chosen to be the Potts model, which is $ {0}$ when the pixel $ {p\_{i}}$ and $ {p\_{j}}$ have the same label, otherwise $ {1}$. It is also possible to make it learnable and non-symmetric. This model thus penalises pixels assigned with the different labels but have similar features.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizZWuhE7pkI1p5KndGHGIR-vqWne0xlSYiOEFoZsFQH_5wppm8zKQx-bFpACjn0Fxlf1i1oT8y2GkLZnjCs6MJopgOryMBDtfxlCy6xXqRhL-1WzS9FfGUZ2aOQlJBA3zRurJU9N4njAA/s640/gCRF3.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEizZWuhE7pkI1p5KndGHGIR-vqWne0xlSYiOEFoZsFQH_5wppm8zKQx-bFpACjn0Fxlf1i1oT8y2GkLZnjCs6MJopgOryMBDtfxlCy6xXqRhL-1WzS9FfGUZ2aOQlJBA3zRurJU9N4njAA/s1600/gCRF3.png)

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8V5EkUmNvJfweGx7UMU9usbPLhh62aKLx0eKulAMCf_frRnRVjac5tpj86F2oTJ674hqKjdECux02ZiAO3HTZviGFdaBQTp-cV-V9LRbY2Mc6_RYbdCbTQWOPFjcl5sAKm1OZwvLNLD8/s640/gCRF4.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8V5EkUmNvJfweGx7UMU9usbPLhh62aKLx0eKulAMCf_frRnRVjac5tpj86F2oTJ674hqKjdECux02ZiAO3HTZviGFdaBQTp-cV-V9LRbY2Mc6_RYbdCbTQWOPFjcl5sAKm1OZwvLNLD8/s1600/gCRF4.png)

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvK8qx8Eu9yJ5-ZppcYXJmotNbl-iM7axJmviQ1vgS8MxHwepqBp-uUYtqM9MXzpp1QEBQ5ROg9TvFK9162ykg6oaA4xuty2tVVtrWEV2ExW8ePTs0crVYG35p2UUX-AA3ukN3EdZK58w/s640/gCRF5.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvK8qx8Eu9yJ5-ZppcYXJmotNbl-iM7axJmviQ1vgS8MxHwepqBp-uUYtqM9MXzpp1QEBQ5ROg9TvFK9162ykg6oaA4xuty2tVVtrWEV2ExW8ePTs0crVYG35p2UUX-AA3ukN3EdZK58w/s1600/gCRF5.png)

Figures taken from \[1\].

However, the distribution $ {P}$ is computationally infeasible.  

**1.1. Mean field approximation**

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikf7aAZvUqOEsRQrYmI0ey3Jfl3pM41cvrL9zRRvxM2zeGNxOsD7I6JImvuFzlcvPfK76rHf2CJur07yLIzZ8KhkbqGVZqq59iSViOBefqLc0y7_92zvLd2yHk_y_OdOVWjdxVO1Cn170/s640/gCRF2.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikf7aAZvUqOEsRQrYmI0ey3Jfl3pM41cvrL9zRRvxM2zeGNxOsD7I6JImvuFzlcvPfK76rHf2CJur07yLIzZ8KhkbqGVZqq59iSViOBefqLc0y7_92zvLd2yHk_y_OdOVWjdxVO1Cn170/s1600/gCRF2.png)

Figure taken from \[1\].

The mean field approximation computes a distribution $ {Q}$ of the form $ {Q({\\bf X})=\\prod\_{i}Q\_{i}(X\_{i})}$ that minimises the KL-divergence  

$ \\displaystyle \\begin{array}{rcl} Div(Q\\|P) & = & \\sum\_{x\\in\\mathcal{L}^{N}}Q(x)\\log\\left(\\frac{Q(x)}{P(x)}\\right)\\\\ & = & -\\mathbb{E}\_{{\\bf U}\\sim Q}\\left\[\\log P({\\bf U})\\right\]+\\mathbb{E}\_{{\\bf U}\\sim Q}\\left\[\\log Q({\\bf U})\\right\]\\\\ & = & \\mathbb{E}\_{{\\bf U}\\sim Q}\\left\[E({\\bf U},{\\bf I})\\right\]+\\log Z({\\bf I})+\\sum\_{i=1}^{N}\\mathbb{E}\_{U\_{i}\\sim Q\_{i}}\\left\[\\log Q\_{i}(U\_{i})\\right\]. \\end{array} $

To minimize the above expression, mean field approximation takes the update  

$ \\displaystyle \\begin{array}{rcl} Q\_{i}(x\_{i}) & = & \\frac{1}{Z\_{i}}\\exp\\left(-\\phi\_{u}(x\_{i}\\,|\\,{\\bf I})-2\\sum\_{j\\neq i}\\mathbb{E}\_{U\_{j}\\sim Q\_{j}}\\left\[\\phi\_{p}(x\_{i},U\_{j}\\,|\\,{\\bf I})\\right\]\\right) \\end{array} $

where  

$ \\displaystyle \\begin{array}{rcl} \\mathbb{E}\_{U\_{j}\\sim Q\_{j}}\\left\[\\phi\_{p}(x\_{i},U\_{j}\\,|\\,{\\bf I})\\right\] & = & \\sum\_{x\\in\\mathcal{L}^{N}}Q\_{j}(x)\\phi\_{p}(x\_{i},x\\,|\\,{\\bf I}). \\end{array} $

This update can be broken into smaller substeps:  

-   Message passing step: $ {\\tilde{Q}\_{i}^{(m)}(l)\\leftarrow\\sum\_{j\\neq i}k^{(m)}(f\_{i},f\_{j})Q\_{j}(l)}$, $ {m=1,2}$.
-   Filter weighting: $ {\\bar{Q}\_{i}(l)=\\sum\_{m=1}^{2}w^{(m)}\\tilde{Q}\_{i}^{(m)}(l)}$.
-   Compatibility transform: $ {\\hat{Q}\_{i}(x\_{i})\\leftarrow\\sum\_{l\\in\\mathcal{L}}\\mu(x\_{i},l)\\bar{Q}\_{i}(l)}$.
-   Local update: $ {Q\_{i}(x\_{i})\\leftarrow\\exp\\left(-\\phi\_{u}(x\_{i}\\,|\\,{\\bf I})-\\hat{Q}\_{i}(x\_{i})\\right)}$.
-   Normalization: $ {Q\_{i}(x\_{i})\\leftarrow Q\_{i}(x\_{i})/\\sum\_{x\\in\\mathcal{L}^{N}}Q\_{i}(x)}$

The computation cost concentrates at the message passing step. One of the main contributions of the paper is to note that this step can be efficiently computed using high dimensional filtering techniques.  
More precisely,  

$ \\displaystyle \\begin{array}{rcl} \\tilde{Q}\_{i}^{(m)}(l) & = & G\_{\\Theta^{(m)}}\*Q\\,(l)-G\_{\\Lambda^{(m)}}(0)Q\_{i}(l)\\\\ & = & G\_{\\Theta^{(m)}}\*Q\\,(l)-Q\_{i}(l), \\end{array} $

where  

$ \\displaystyle \\begin{array}{rcl} G\_{\\Theta^{(1)}}(f\_{i}-f\_{j}) & = & w^{(1)}\\exp\\left(-\\frac{|p\_{i}-p\_{j}|^{2}}{2\\theta\_{\\alpha}^{2}}-\\frac{|I\_{i}-I\_{j}|^{2}}{2\\theta\_{\\beta}^{2}}\\right)\\\\ G\_{\\Theta^{(2)}}(f\_{i}-f\_{j}) & = & w^{(2)}\\exp\\left(-\\frac{|p\_{i}-p\_{j}|^{2}}{2\\theta\_{\\gamma}^{2}}\\right) \\end{array} $

There are very efficient ways to do high dimensional filtering, which will not be our focus here.  

**Higher order CRF.** It is possible to include more terms in the Gibbs energy, such as energy term based on super-pixels, object detections, etc. An end-to-end training approach with CNN is proposed by Arnab et al. Below the fold we shall look at how end-to-end training is achieved.  

**2\. End to end network training with a CRF module**

The architechture of a semantic segmentation purposed network is often derived from the some popular image classification nets, such as AlexNet, VGG and ResNet. The current approaches involving CRF can be devided into two categories:  

-   The network and the CRF module is trained separately and the CRF is used as post processing. Examples include the DeepLab.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdqEHpc3NaXf3iT9ifum2TN1XGLkqjHlff5GM1qI8b3F3CYqOXO9ZkuU3PjIAmqCFXJmp90OwteCb4uH3gOTIhbHgeTUqh3Fh0kTDF0WG5D_oL99Gf5X0ZC2novU3m7AR8I79K97B4tX0/s400/deeplab4.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdqEHpc3NaXf3iT9ifum2TN1XGLkqjHlff5GM1qI8b3F3CYqOXO9ZkuU3PjIAmqCFXJmp90OwteCb4uH3gOTIhbHgeTUqh3Fh0kTDF0WG5D_oL99Gf5X0ZC2novU3m7AR8I79K97B4tX0/s1600/deeplab4.png)

Figure taken from \[3\]

-   The CRF module is explicitly contained as a part of the network, whose parameters are trained together in a separate stage. Examples include the CRF-as-RNN.

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWeGGfjuw-uv2qUVd8xFgYom8fggGpAnOFGjtGCEb77crbx7LQNDm-t1ddD4jxTq9FUEYnw_A1BHfAstITOMfm-5mHkZx_o-PlkQ0CabCPJ3o4cklYk8BZtah8ck6KWu2DiepyP4azsMQ/s640/cRNN2.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiWeGGfjuw-uv2qUVd8xFgYom8fggGpAnOFGjtGCEb77crbx7LQNDm-t1ddD4jxTq9FUEYnw_A1BHfAstITOMfm-5mHkZx_o-PlkQ0CabCPJ3o4cklYk8BZtah8ck6KWu2DiepyP4azsMQ/s1600/cRNN2.png)

Figure taken from \[4\]

Note that the CRF module in some sense has not been fully integrated into the network. The current approaches above always train a network that outputs a good unary potential, then the CRF module is included and trained either jointly or separately.  

**2.1. Some empirical fine-feature extraction techniques with CNNs**

These techniques are baiscally extensions and modifications upon the \`\`fully convolutional network'' of J. Long, E. Shelhamer, and T. Darrell, which, when converting a classification purposed CNN, replaces the fully connected layer with several upsampling layers with learnable filters. The output of this approach are subject to blobby noisy regions.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiONbWGPnqChzzo4f1z4xZemm8gGgQnyb-8ebpa0iKmWVfvqWUZD1vhX3Xsw81izo5ptf8-6H1cME01Kkt2v2mixbZEuAhyphenhyphenQR5Um2P96Tq7gYCW0XX5ex6_LGJaoLjuZtRb0o6xTWYSURo/s640/FCN5.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiONbWGPnqChzzo4f1z4xZemm8gGgQnyb-8ebpa0iKmWVfvqWUZD1vhX3Xsw81izo5ptf8-6H1cME01Kkt2v2mixbZEuAhyphenhyphenQR5Um2P96Tq7gYCW0XX5ex6_LGJaoLjuZtRb0o6xTWYSURo/s1600/FCN5.png)

Figure taken from \[2\]

To produce a good unary potential, the network must be able to find the structure of the image at multiple scales, and express it (as a score map) at a certain level of detail. There are two basic challenges that one must face:  

-   Objects of the same class can appear in multiple scales within and across images;
-   There are many max-pooling and down-sampling stages, which after upsampling back to the input image, destroy the finity of the output; meanwhile, there are memory limit of storing large filters.

Therefore, some common features of the current approaches include:  

-   The max-pooling and downsampling operations are removed in the last few layers.
-   Apply spatial pyramid pooling at several grid scales, or several parallel atrous (sometimes also called dilated) convolution with different rates: R-CNN, PSPnet, Deeplabv2.
-   Enlarge the field of view of kernels by using special kernels: separable kernels or filter rarefication (as atrous convolution), meanwhile avoiding memory overflowing and also easier to train: Large-kernel-matters, Deeplab. Note that CRF can also be regarded as a filter with receptive field spanding the whole image.
-   Auto-encoder structure possibly with skip connections: FCN, Deeplabv3, StackedDNN.

We now turn to some of the above techiniques in more details.  

**2.1.1. Upsampling layers and auto-encoder structures.**  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvnAFPuMhP3iUzvvObxzrlc0HUUyaOhfg-goayf0AknuGN3SFwuOObm0raBKSEamj0lm2-2ZbdAL1KHkgTdOZCRASzUaqBeGtxnvxwpHgmKIZJ8wvb_RaSYjOBPOzzS6KsvKsKa8fuBKY/s400/FCN1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvnAFPuMhP3iUzvvObxzrlc0HUUyaOhfg-goayf0AknuGN3SFwuOObm0raBKSEamj0lm2-2ZbdAL1KHkgTdOZCRASzUaqBeGtxnvxwpHgmKIZJ8wvb_RaSYjOBPOzzS6KsvKsKa8fuBKY/s1600/FCN1.png)

Figure taken from \[2\]

Fully connected layers in a classification purposed convnet can be thought of as convolution with kernels that cover the entire input regions (with a large stride). Therefore, it is easy to replace the last few layers with conventional convolution, resulting in a spatially two dimensional output.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisyGKtKTUTT8OcNNoTltVmV6R2nQlvUxwO97Y_PppZzZ3uv_LPT2jDVW7HDRDcALdeW4P180qckQG8gTnWXWDoJ2GQ7CrfIYAfC7qZoXTu03IOdSzt-gEy9f03AF5BD9GnVL1f4l7JYQg/s400/FCN2.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisyGKtKTUTT8OcNNoTltVmV6R2nQlvUxwO97Y_PppZzZ3uv_LPT2jDVW7HDRDcALdeW4P180qckQG8gTnWXWDoJ2GQ7CrfIYAfC7qZoXTu03IOdSzt-gEy9f03AF5BD9GnVL1f4l7JYQg/s1600/FCN2.png)

Figure taken from \[2\]

The above network so far has very coarse output. For example, a 500$ {\\times}$500 input image will be transformed into $ {N}$ number of $ {10\\times10}$ output images, where $ {N}$ is the number of class. Each pixel intensity in the $ {k}$-th $ {10\\times10}$ output images is a probability of that pixel belonging the the $ {k}$-th class. To obtain pixel-wise labeling of the input image, one needs to *upsample* this output image to the input size.  

A trivial way is to do e.g. a bilinear interpolation. But a more clever way is use the *transposed convolution*, also known as *backwards convolution* or *deconvolution*. Thus upsampling can be performed in-network for end-to-end learning by backpropagation from the pixelwise loss.  

This way of upsampling can be seen to be the same with the one used in the auto-encoder architechtures.  

**2.1.2. Multi-scale feature extraction, atrous convolution and spatial pryamid pooling module.**  

In \[2\] a preliminary version of multi-scale feature extraction is proposed. The basic idea is to use skip connections.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtMBLqaxCkU-Cd-Gg-lw__b7GuCP8O4YKlBEjVxDrvMy0tfYK7vs_H1ZPDXXXz599Uam9b1TpZSQe1xbQAEeI2uvMhDsz6nG82Ysip_k5LEnyWhGPNksBBWeY7SBWx6WLdpnNEl9vCFqo/s640/FCN3.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtMBLqaxCkU-Cd-Gg-lw__b7GuCP8O4YKlBEjVxDrvMy0tfYK7vs_H1ZPDXXXz599Uam9b1TpZSQe1xbQAEeI2uvMhDsz6nG82Ysip_k5LEnyWhGPNksBBWeY7SBWx6WLdpnNEl9vCFqo/s1600/FCN3.png)

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkr1WXwvG3Pf0TKyEtD3XbEq5ooVSOD_SUWTHQ7Z_dJTvCfNx1XPkVKkj9jrpaysPPIQy_V25YASdfH3aWibMaXS0AO_P_9qjja0xdWc2MwSWwVSbYAag5G-NLyG7OQL4CAh6kGdF54XQ/s400/FCN4.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkr1WXwvG3Pf0TKyEtD3XbEq5ooVSOD_SUWTHQ7Z_dJTvCfNx1XPkVKkj9jrpaysPPIQy_V25YASdfH3aWibMaXS0AO_P_9qjja0xdWc2MwSWwVSbYAag5G-NLyG7OQL4CAh6kGdF54XQ/s1600/FCN4.png)

Figures taken from \[2\]

The atrous convolution is originated in the efficient computation of the undecimated wavelet transform in the "algorithme á trous" . It is also known as the *dilated convolution*. Essentially, what it does is to use an enlarged filter when doing convolution. This filter is enlarged by inserting zeros in appropriate places.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ7usnn0sS_VMPaiGu8G5pYAqGyNCJGBM8AjOrM1khP5KyEAialezX1Z63yV5My_E4BlecicAzhtpeMyTKKtZ-yKkxqPi7VbRwKJZDuFY96jUvJE-DYwwzJT1lihgpmYD999GJUFOWD8k/s320/deeplab1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ7usnn0sS_VMPaiGu8G5pYAqGyNCJGBM8AjOrM1khP5KyEAialezX1Z63yV5My_E4BlecicAzhtpeMyTKKtZ-yKkxqPi7VbRwKJZDuFY96jUvJE-DYwwzJT1lihgpmYD999GJUFOWD8k/s1600/deeplab1.png)

Figure taken from \[3\]

When the filter is enlarged this way, it has a larger receptive field. Equivalently, it is the same filter applied to an approriately downsampled input image. But inserting zeros is easier to implement.  

To capture the multi-scale features of the image, atrous convolution can be used: zeros are inserted in a filter in a certain layer at different rates, and these enlarged filters are then applied in parellel to the output from the last layer (so there are separate branches in the network to accomplish this).  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjH5letiExxA3WAWfn8KxI4zI6uq3PYMTn0NeNnn5lHm4zd2TQ4yjJjLvJDyeSAYw8d3Vk_J-X7-UEqU7lAqf9B5yi2PhtM51PeXVylqijxom53-jgUCOruvSN_3BVnycUnVl8RhhUPvQQ/s320/deeplab5.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjH5letiExxA3WAWfn8KxI4zI6uq3PYMTn0NeNnn5lHm4zd2TQ4yjJjLvJDyeSAYw8d3Vk_J-X7-UEqU7lAqf9B5yi2PhtM51PeXVylqijxom53-jgUCOruvSN_3BVnycUnVl8RhhUPvQQ/s1600/deeplab5.png)

Figure taken from \[3\]

The results from different branches are then upsampled and fused as the final output. This is essentially a spatial pryamid pooling method.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1cxPbiLBNzYzijp_JNVNTCmcYEu0uztyyrCclNGyKTTW0D9WXPacdN_fqzYLtRVECmWlFQ1qHyqNIH6JOFGjyrJ_FFB1wMEn1RW0ewG5RIiKK-4qDKsEXK-yjZjW9a8zu5PnRwVCMOfQ/s320/deeplab3.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1cxPbiLBNzYzijp_JNVNTCmcYEu0uztyyrCclNGyKTTW0D9WXPacdN_fqzYLtRVECmWlFQ1qHyqNIH6JOFGjyrJ_FFB1wMEn1RW0ewG5RIiKK-4qDKsEXK-yjZjW9a8zu5PnRwVCMOfQ/s1600/deeplab3.png)

Figure taken from \[3\]

**2.2. Differentiable programing with a CRF module**

Now we come back to the mean field approximation iteration outlined in Section 1. The mean contribution of the paper CRF-as-RNN is to note that these steps can be implemented within convnets and trained end-to-end. Different from the conventional concolution, where the filters are static after the training, in CRF the filter's coefficients depend on the input. We now look at each substeps more closely.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7X7rbYHSlhP-3_SQBpmHraes18DgXCyna-aKaKOYaMp7HQ9SpTrYNjfmzl9V72N2nD28Tmgtu6cF5K1CcOB4hs4Yigklj_qIrce8khe10kUIT-6Vvapeil46BOYJO4jozlwJOgQGJfjw/s640/cRNN1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7X7rbYHSlhP-3_SQBpmHraes18DgXCyna-aKaKOYaMp7HQ9SpTrYNjfmzl9V72N2nD28Tmgtu6cF5K1CcOB4hs4Yigklj_qIrce8khe10kUIT-6Vvapeil46BOYJO4jozlwJOgQGJfjw/s1600/cRNN1.png)

Figure taken from \[4\]

**Message passing step.** The following operation is performed  

$ \\displaystyle \\tilde{Q}\_{i}^{(m)}(l)\\leftarrow\\sum\_{j\\neq i}k^{(m)}(f\_{i},f\_{j})Q\_{j}(l) $

which as explained before, can be seen as a high-dimensional filtering. In matrix notations, it can be written as  

$ \\displaystyle \\tilde{Q}^{(m)}(l)=K(\\Theta^{(m)})Q(l). $

The differential with respect to parameters of this equation is  

$ \\displaystyle d\\tilde{Q}\_{i}^{(m)}(l)=Q(l)^{T}dK\_{i}^{T}(\\Theta^{(m)}),\\quad i=1,\\dots,N $

where we think of $ {d\\tilde{Q}\_{i}^{(m)}(l)}$ as a row vector. The backpropagation algorithm, utilizing the computational graph of the permutohedral lattice algorithm, is used to compute these matrices $ {d\\tilde{Q}^{(m)}(l)}$ implicitly.  

**Filter weighting.**  

$ \\displaystyle \\bar{Q}\_{i}(l)=\\sum\_{m=1}^{2}w^{(m)}\\tilde{Q}\_{i}^{(m)}(l). $

For each label $ {l}$, we can think of it as a layer where input has two channels, which are convolved with filters of size $ {1\\times1}$ respectively and summed together. It is also possible to increase the number of learnable parameters, by giving different labels different weights.  

**Compatibility transform.**  

$ \\displaystyle \\hat{Q}\_{i}(x\_{i})\\leftarrow\\sum\_{l\\in\\mathcal{L}}\\mu(x\_{i},l)\\bar{Q}\_{i}(l). $

We can think of it as a layer with $ {k}$ input channels, where each chanel represents a label. Each channel is convolved with a filter of size $ {1\\times1}$ respectively and summed together. It is also possible to increase the number of learnable parameters, by giving different pairs $ {(x\_{i},l)}$ different compatibility function values.  

**Local update and normalization.** These are standard operations which do not involve parameters.  

**Whole network training of CRF-as-RNN.** Unary potential part is first trained. The CRF module performs a fixed number of mean field iteration, which resembles a recurrent neural network structure. Backpropagation in time is then used for training this module.  

**3\. Another example of End-to-end training: siamese network with correlation filter in object detection**

The basic idea of a siamese network is that it transforms the two input images in such a way that the similarity among patches becomes more apparent.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrfkAdwunMTksym9iC6Wka-g_FViyHqaSRykjmlvQUGbukwLCO4Hyh6oHdYKHHAM0VytWWcbcbfbRh4_mXc5KdKscdvdMfE9JhyYRpyaP9ZFij1YjNGJd6_xb4Osng4ZNI8bzLJ6EAv2w/s400/SiameseTrack1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrfkAdwunMTksym9iC6Wka-g_FViyHqaSRykjmlvQUGbukwLCO4Hyh6oHdYKHHAM0VytWWcbcbfbRh4_mXc5KdKscdvdMfE9JhyYRpyaP9ZFij1YjNGJd6_xb4Osng4ZNI8bzLJ6EAv2w/s1600/SiameseTrack1.png)

Figure taken from \[5\]

Here we consider the fully convolutional siamese network proposed by J. Valmadre and L. Bertinetto. Let us denote the feature map by  

$ \\displaystyle f\_{\\theta}:(x',z')\\mapsto(f\_{\\theta}(x'),f\_{\\theta}(z')) $

where $ {x'}$ is the reference object image, and $ {z'}$ is the image containing objects to be detected. Cross correlation is used to find the the patch position of similarity  

$ \\displaystyle g\_{\\theta}(f\_{\\theta}(x'),f\_{\\theta}(z'))=f\_{\\theta}(x')\*f\_{\\theta}(z')+b. $

Here, $ {g\_{\\theta}}$ effectively output a score map that tells where possibly the object lies in $ {z'}$.  
An interesting extension of this work is to include a correlation filter module and trained end-to-end, which enables a much more light-weight network and fast processing.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2nYuyrXxz1-RA_Xp49e8Bq3zA6qky0RrnPB6J4oTsO8yuY8navLbQ0LHlVOz9K5K7rtoRw1ufrFpJU7-9RteRIB2uEnNiGeZo-_tm0ioYSaeqQqqXI2sgG1B9KS63CHsGeGFmcnaYod4/s640/CFnet1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2nYuyrXxz1-RA_Xp49e8Bq3zA6qky0RrnPB6J4oTsO8yuY8navLbQ0LHlVOz9K5K7rtoRw1ufrFpJU7-9RteRIB2uEnNiGeZo-_tm0ioYSaeqQqqXI2sgG1B9KS63CHsGeGFmcnaYod4/s1600/CFnet1.png)

Figure taken from \[6\]

Let us describe the correlation filter in some detail below.  

**3.1. Correlation filters**

Roughly speaking, this technique aims to design a filter, after applying which, we get a repsonse as desired as possible. In practice, this response is fixed to be a Gaussian response. In a sense, the correlation filter is a linear classifier.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgc0O5oQX2fHS1Pl5UHWw8pngYsxM_1ABHSRUWKB4yOFYyfqQyF4B6SleHyRxnp4q5g_Yi8fy3LhJ9Z_8O2pSLbMKXqz2o_D9QFUHbFg2Scbx_VVqhB6wEPsCaj3Ev2-nrTe2sMylGzQSo/s640/CF1.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgc0O5oQX2fHS1Pl5UHWw8pngYsxM_1ABHSRUWKB4yOFYyfqQyF4B6SleHyRxnp4q5g_Yi8fy3LhJ9Z_8O2pSLbMKXqz2o_D9QFUHbFg2Scbx_VVqhB6wEPsCaj3Ev2-nrTe2sMylGzQSo/s1600/CF1.png)

Figure taken from \[7\]

One simple formulation of the correlation filter suitable for online object tracking is the following  

$ \\displaystyle w^{\*}=\\arg\\min\_{w}\\frac{1}{N}\\|w\*x-y\\|^{2}+\\frac{\\lambda}{2}\\|w\\|^{2} $

where $ {w^{\*}}$ is the desired correlation filter, $ {x}$ is the input image and $ {N}$ is its size, and $ {y}$ is the desired response.  

This type of optimization problem is known as a *ridge regression*. In this case, simple closed form solution can be obtained. We will stress here the computational graph of this solution, where we backpropagate the gradient.  

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSMVmW1cP5H0g4HOfkDEv-hB0GjXOoyZRPl8WjZRMgdZYTpH-ddQ6YrdByBClFlSkC18AXLL4Daw4LkrdHDTJZZEcpGDxirYvNfXi6zMRNx_eLWXsydD9pfq6eUyXGYeM9Pf7ARju-Y6M/s400/CFnet2.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSMVmW1cP5H0g4HOfkDEv-hB0GjXOoyZRPl8WjZRMgdZYTpH-ddQ6YrdByBClFlSkC18AXLL4Daw4LkrdHDTJZZEcpGDxirYvNfXi6zMRNx_eLWXsydD9pfq6eUyXGYeM9Pf7ARju-Y6M/s1600/CFnet2.png)

Figure taken from \[6\]

It involves two additional variables, $ {k}$ and $ {\\alpha}$(Lagrange multiplier). Together with $ {x,y,w}$, they satisfy the system of equations  

$ \\displaystyle \\begin{cases} k=\\frac{1}{N}(x\*x)+\\lambda\\delta\\\\ k\*\\alpha=\\frac{1}{N}y\\\\ w=\\alpha\*x \\end{cases}. $

With FFT, in the freqeuncy domain the above computations are extremely efficient  

$ \\displaystyle \\begin{cases} \\hat{k}=\\frac{1}{N}(\\hat{x}\\odot\\hat{x})+\\lambda\\mathbb{1}\\\\ \\hat{\\alpha}=\\frac{1}{N}\\hat{k}^{-1}\\odot\\hat{y}\\\\ \\hat{w}=\\hat{\\alpha}\\odot\\hat{x} \\end{cases}, $

where $ {\\odot}$ means element-wise multiplication. And the following backpropagation rule can easily be derived  

$ \\displaystyle \\begin{cases} \\widehat{\\nabla\_{\\alpha}\\ell}=\\hat{x}\\odot\\overline{\\widehat{\\nabla\_{w}\\ell}}\\\\ \\widehat{\\nabla\_{y}\\ell}=\\frac{1}{N}\\overline{\\hat{k}^{-1}}\\odot\\widehat{\\nabla\_{\\alpha}\\ell}\\\\ \\widehat{\\nabla\_{k}\\ell}=-\\overline{\\hat{k}^{-1}}\\odot\\overline{\\widehat{\\alpha}}\\odot\\widehat{\\nabla\_{\\alpha}\\ell}\\\\ \\widehat{\\nabla\_{k}\\ell}=\\widehat{\\alpha}\\odot\\widehat{\\nabla\_{w}\\ell}+\\frac{2}{N}\\hat{x}\\odot\\text{Re}(\\widehat{\\nabla\_{k}\\ell}) \\end{cases}. $

**3.2. Some more discussion on the results of CF-net**

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg13is1ZD9pmF_UH0P9sYi-G0_MALiHzWDUOVj9Ou8K6qIa2yb2kWcS8h_TtXeCo5LN5ebcFqNBrFWWhLlIyU2Ij2y6AKAu0Ry-Jr90dkg60jeu6V9g3CgZerTrFCBH3fPpNjjI3UvGdTo/s400/CFnet3.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg13is1ZD9pmF_UH0P9sYi-G0_MALiHzWDUOVj9Ou8K6qIa2yb2kWcS8h_TtXeCo5LN5ebcFqNBrFWWhLlIyU2Ij2y6AKAu0Ry-Jr90dkg60jeu6V9g3CgZerTrFCBH3fPpNjjI3UvGdTo/s1600/CFnet3.png)

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQDeOBrN-Eig2hfNWqTiMllafo3fCY9zBN4DOPOgJGYDb_jAS1rvX4sW2FcE6vP_uaZnwMmxhuOQnhQd8NNnVzCGwUtc91BgYYkzURsQpVNStdsKSx0uIoODvAxn3_grOFXXEdmg1SN2E/s400/CFnet4.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQDeOBrN-Eig2hfNWqTiMllafo3fCY9zBN4DOPOgJGYDb_jAS1rvX4sW2FcE6vP_uaZnwMmxhuOQnhQd8NNnVzCGwUtc91BgYYkzURsQpVNStdsKSx0uIoODvAxn3_grOFXXEdmg1SN2E/s1600/CFnet4.png)

[![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEVPj0uEKJrxXdluBZYPGA82m8nIhukv-JQXwCYIpxkvDKAGk3XzL0Pkiy1jRyXOJeyHWKdHIs-Rh_ZmnrMH3PZUOrvx8YG1FGvxc4GOA1KV0jIc0BFA_p-VbowNemvoLSigWqFO5Gm1I/s400/CFnet5.png)](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEVPj0uEKJrxXdluBZYPGA82m8nIhukv-JQXwCYIpxkvDKAGk3XzL0Pkiy1jRyXOJeyHWKdHIs-Rh_ZmnrMH3PZUOrvx8YG1FGvxc4GOA1KV0jIc0BFA_p-VbowNemvoLSigWqFO5Gm1I/s1600/CFnet5.png)

Figures taken from \[6\]

**Reference**  
\[1\] Krähenbühl, Philipp, and Vladlen Koltun. "Efficient inference in fully connected crfs with gaussian edge potentials." Advances in neural information processing systems. 2011.  
\[2\] Long, Jonathan, Evan Shelhamer, and Trevor Darrell. "Fully convolutional networks for semantic segmentation." Proceedings of the IEEE conference on computer vision and pattern recognition. 2015.  
\[3\] Chen, Liang-Chieh, et al. "Deeplab: Semantic image segmentation with deep convolutional nets, atrous convolution, and fully connected crfs." arXiv preprint arXiv:1606.00915 (2016).  
\[4\] Arnab, Anurag, et al. "Conditional Random Fields Meet Deep Neural Networks for Semantic Segmentation: Combining Probabilistic Graphical Models with Deep Learning for Structured Prediction." IEEE Signal Processing Magazine 35.1 (2018): 37-52.  
\[5\] Bertinetto, Luca, et al. "Fully-convolutional siamese networks for object tracking." European conference on computer vision. Springer, Cham, 2016.  
\[6\] Valmadre, Jack, et al. "End-to-end representation learning for correlation filter based tracking." Computer Vision and Pattern Recognition (CVPR), 2017 IEEE Conference on. IEEE, 2017. \[7\] Chen, Zhe, Zhibin Hong, and Dacheng Tao. "An experimental survey on correlation filter-based tracking." arXiv preprint arXiv:1509.05520 (2015).
