---
id: 2017-07-31-some-discussion-on-energy-landscapes-stochastic-gradient-des
title: "Some discussion on energy landscapes, stochastic gradient descent and its continuous time dynamics"
date: 2017-07-31
tags: ["archive", "machine learning", "optimization", "statistical physics"]
source: https://sylqiu.blogspot.com/2017/07/some-discussion-on-energy-landscapes.html
publish: true
---
In supervised learning, where we have a training set, namely an input-output correspondence $ {(x,y)}$ for a sample of the input data, the "empirical loss function'' of a deep learning model (a particular neural network) $ {f}$, is of the form  

$ \\displaystyle J(\\theta) = \\mathbb{E}\_{(x,y)\\sim \\hat{p}} L(f(x,\\theta),y), $

where $ {\\theta \\in\\mathbb{R}^{n}}$ is the parameter vector, or *weights* of $ {f}$. This is only evaluated on the training set and the validation set. Hence it seems to me that the geometric properties of this loss function is related to the training data feed to the model.  

This function is a non-convex function defined on a high-dimensional space ($ {n}$ is, say, of the order $ {10^{7}}$). Our task is to find an optimal weight  

$ \\displaystyle x^{\*}=\\arg\\min\_{x}f\_{M}(x). $

At optimal weights we should have a low level of loss. Hence, the level of the loss function, when computed on the training set with the some weights $ {x}$, measures the quality of the weights $ {x}$, but only with respect to the training set.  

We can improve the weights on this training set via first order optimization. Usually, we need to make use of the whole training set: the descent direction is found based on all training examples, and iterate the process till convergence. The non-convex nature of the loss function forces us to land on a local minimum, or a saddle point -- something seems cannot be avoided. But what is more serious, is that we are not able to compute the descent direction in the above way quickly, due to both the high-dimensionality, and the large number of training data.  

What seems to be a naive technical remedy for this is to use *stochastic gradient descent (SGD)* (Robbins and Monro, 1951). It computes the descent direction for only one, or a *batch* of *randomly* sampled training examples. Obviously, if the batch is just the entire training set, then we recover the usual gradient descent, and there is no longer stochastic effect.  

However, it is not an obvious matter that the weights obtained via optimization on the training examples actually *generalises* well to the entire data input of interest. The generalisation ability is the heart of the matter if the model $ {M}$ is to be used in practice. And it is pretty clear now to practitioners that good training error does not necessatily mean good generalisation error. This gives rise to at least the following, very general and interrelated questions:  

-   What training examples should one choose, and what need to be avoided? They are directly related to the empirical loss function. 
-   What model $ {M}$ should one choose, in accordance with the nature of the input data, practical purpose, etc?
-   Given the training set and the model $ {M}$, what is the generalisation performance a specific optimization procedure, for example some version of the stochastic gradient descent?

In regard to the model selection and data aspects, there are some important observations  

-   **The effect of model complexity.** This mainly refers to the ratio between the number of model parameters and the number of training samples. Small ratio will tend to *underfit* the training data, and large ratio tend to *overfit* the data. However, deep networks in practice have this ratio at least about 10, up to 200. Effectively this means that deep networks can memorise the whole training set. Given the argubly good generalisation performace of deep networks, the common belief about high model complexity easily overfits contradicts why they usually don't overfit (Zhang, 2017).
-   **The effect of regularization.** As a common way to stop the model from overfitting, practitioners usually use various ways to "destruct'' the usual or stochastic gradient descent optimization process that may lead to overfitting. As observed by (Zhang, 2017), they usually improve the generalisation performance by a relatively small margin.
    -   data augmentation
    -   early stopping
    -   weight decay
    -   drop out, batch normalisation ...
-   **The effect of underlying data semantic structure.** The random shuffling experiment of (Zhang, 2017) shows that deep nets can easily fit random labels, or even just noise. But the model so trained is useless in terms of generalisation. They also got a curve that goes up as the labels are more corrupted. There are some study of this when the net is simple, using statistical physics, phase transitions, spin glasses. (I am not familar with this, though, so this may be not accurate. Hope to look into it in the future) Anyway, in order for a deep net to generalise it has to exploit the data semantic structure.
-   **The energy landscape and the role of SGD.** The (local) minima found by SGD tend to be flatter, and it is speculated that SGD act as a implicit regulariser. It was observed for a variety of achitectures and datasets, the Hessian at the minima has a bulk of almost zero eigen values, a few negatives but small, a few big large ones (Sagun, 2017). Since long ago it has been suggested that "flat minima'', found by the SGD, generalizes better. Also, there is also study on optimal batch sizes for SGD. These phenomena seem not well understood.

**1\. Entropy SGD**

Can we improve upon SGD? This question was studied by (Chaudhari, 2016), motivated by the observations above.  
The modified energy now looks like  

$ \\displaystyle \\begin{array}{rcl} f\_{\\gamma,\\beta}(x) \\propto -\\log(G\_{\\beta^{-1}\\gamma}\*e^{(-\\beta f)}(x))\\\\ \\propto \\log\\int\\exp(-\\beta(y)-\\frac{|x-y|^{2}}{2\\beta^{-1}\\gamma})\\thinspace dy\\\\ = \\log\\int\\rho^{\\infty}(y,x)dy \\end{array} $

where $ {\\beta}$ is a parameter,  

$ \\displaystyle G\_{\\beta^{-1}\\gamma}(x)=\\frac{1}{(\\sqrt{2\\pi\\beta^{-1}\\gamma})^{d}}e^{-\\frac{|x|^{2}}{2\\beta^{-1}\\gamma}} $

is the Gaussian kernel, or heat kernel. We would like to think of $ {\\gamma}$ as some oscillation frequency (or time), and $ {\\beta^{-1}}$ as temparature. In fact, $ {f\_{t}(x)}$ is the solution of the following *viscous Hamilton-Jacobi PDE* at time $ {t}$  

$ \\displaystyle \\frac{\\partial u}{\\partial t}=-\\frac{1}{2}|\\nabla u|^{2}+\\frac{\\beta^{-1}}{2}\\Delta u $

with initial data $ {u(x,0)=f(x)}$. Thus the loss function's regularity could be studied through this PDE.  
Relation to statistical physics. The probability distribution  

$ \\displaystyle p(x)\\propto e^{(-\\beta f(x))} $

is known as the *Gibbs distribution*. Roughly speaking, at temperature $ {\\beta^{-1}}$, in a large amount of particles, the number of particles has energy $ {f(x)}$ is proportional to $ {p(x)}$. The convolution represents the fact that there is a independent Gaussian noise added to the particle systems, and so diffuses. It should be clear that the new distribution is smoother.  
How to compute it? One can find that  

$ \\displaystyle \\begin{array}{rcl} \\nabla\_{x}f\_{\\gamma}(x) = \\int\\frac{y-x}{\\gamma}\\rho^{\\infty}(y,x)dy, \\end{array} $

where remember that  

$ \\displaystyle \\rho^{\\infty}(y,x)\\propto\\exp(-\\beta f(y)-\\beta\\frac{|x-y|^{2}}{2\\gamma}). $

There is some MCMC algorithm (Langevin dynamics) for computing this. This is their first version.

**2\. SGD in continous time**

The stochastic gradient descent can be thought of as the discrete time approximation of the SDE  

$ \\displaystyle dx(t)=-\\nabla f(x(t))dt+(2\\beta)^{-1/2}dB(t). $

The Fokker-Planck equation associated to this dynamics is  

$ \\displaystyle \\frac{\\partial\\rho}{\\partial t}=\\nabla\\cdot(\\nabla f(x)\\rho(x,t))+\\beta^{-1}\\Delta\\rho(x,t). $

Its *stationary solution* is the Gibbs distribution $ {\\propto e^{-\\beta f(x)}}$.  
Can we obtain such an interpretation for entropy SGD? The previous discussion leads us to consider the stochastic dynamics  

$ \\displaystyle \\begin{array}{rcl} dx(s) = \\frac{1}{\\gamma}(y-x)ds \\end{array} $

$ \\displaystyle dy(s)=\\frac{1}{\\epsilon}\\left(-\\nabla f(y)+\\frac{1}{\\gamma}(x-y)\\right)ds+(\\frac{2\\beta^{-1}}{\\epsilon})^{1/2}dB(s),\\epsilon\\ll1 $

where $ {y}$ is a "fast variable'', experiences white noise.  
The Fokker-Planck equation of $ {y(s)}$ is  

$ \\displaystyle \\frac{\\partial\\rho}{\\partial t}=\\nabla\_{y}\\cdot(\\nabla\_{y}H\\rho)+\\beta^{-1}\\Delta\_{y}\\rho $

whose invariant measure is $ {\\rho^{\\infty}\\propto\\exp(-\\beta f(y)-\\beta\\frac{|x-y|^{2}}{2\\gamma})!}$ Results from multiscale analysis say that the dynamics can be approximated by the entropy-SGD.
