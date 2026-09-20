---
id: 2017-07-24-a-short-tour-to-stochastic-calculus
title: "A short tour to stochastic calculus"
date: 2017-07-24
tags: ["probability theory", "stochastic differential equation"]
source: https://sylqiu.blogspot.com/2017/07/a-short-tour-to-stochastic-calculus.html
publish: true
---
The intention for this non-technical article is to quickly build up some formalism and idea about Itô's calculus, and its relation to linear parabolic equations of diffusion type. The effort is spent on explaining the ideas and so no analysis is performed to justify the statements presented. Many important topics are simply ignored, e.g. *stopping times*.  

 Consider a tiny dye particle in water in constant temperature, or the price of a stock in an ideal market. Both their movements are subject to rapid, almost infinite number of *independent*, *identically distributed (i.i.d.)* forces from all directions, where in the first case it is the bombardments from the water molecules, and in the second it is the calls from buyers and sellers. Suppose we are interested in its position at each time $ {X(t)}$. The impossibility of an explicit deterministic argument has to compromise for a more statistical one, that is, one foregoes the study of a single particle but instead a collection of them. This is done by either studying a bunch of them (with no interaction) at once (replication in space), or one each time (replication in time), and then at a fixed time one counts the number of particles at each point in space. This concept can be more or less formalised by the mathematical notion of *probability*.  

According to Kolmogorov, the general setting of a probabilistic formulation requires three basic ingredients $ {(\\Omega,\\mathcal{F},P)}$. The first one is the *state space*, or *sample space* $ {\\Omega}$. It is a set consisting of all possible outcomes of the scenario of interest. (In fact, it is in some sense the canonical choice, but certainly not the only choice. There should be some care taken about the extension of the sample space when we add more random variables into our model. For a discussion on this and the fundation of probability theory, see Notes 0, 275A, by Tao.) In the particular simple case when $ {\\Omega}$ is finite, or countably infinite, then each element $ {\\omega\\in\\Omega}$ is simply associated to a nonnegative real number $ {P(\\omega)}$, called the *probability* of $ {\\omega}$, and $ {P}$ satisfies the normalisation  

$ \\displaystyle \\sum\_{\\omega\\in\\Omega}P(\\omega)=1. $

The probability $ {P(A)}$ of a subset $ {A\\subset\\Omega}$ is obtained by assuming the *countable additivity condition*  

$ \\displaystyle P(A)=\\sum\_{\\omega\\in A}P(\\omega). $

In more sophisticated situations, one then needs measure-theoretic notions to keep the analogy with the situation of finite outcomes. Those include a $ {\\sigma}$*\-algebra* $ {\\mathcal{F}\\subset2^{\\Omega}}$, and a probablity measure $ {P}$ defined on the measurable space $ {(\\Omega,\\mathcal{F})}$. The triple $ {(\\Omega,\\mathcal{F},P)}$ is called a *probability space*.  

The $ {\\sigma}$-algebra represents all the measurable information in our probability space. To see what this means, consider again the case of finite state space $ {\\Omega}$. Here the natural choice of $ {\\sigma}$-algebra $ {\\mathcal{F}}$ is the power set of $ {\\Omega}$, that is, all possible combinations of the outcomes. Thus any probability-theoretic questions formulated within this probability space basically boil down to probabilties of subsets of $ {\\mathcal{F}}$. These questions are often formulated in terms of *random variables*, which are modeled as $ {\\mathcal{F}}$-measurable functions on $ {\\Omega}$. If a random variable $ {X:\\Omega\\rightarrow V}$ has its value in some real (or complex) topological vector space $ {V}$, it then induces a probability measure on $ {V}$ via  

$ \\displaystyle \\mu(A)=P(X^{-1}(A)), $

where $ {A\\subset V}$ is Borel measurable. The *expectation*, or also commonly refered as the mean of a real valued random variable $ {X}$ is defined as the integral average  

$ \\displaystyle \\mathbb{E}X:=\\int\_{\\Omega}X(\\omega)\\thinspace dP(\\omega)=\\int\_{\\mathbb{R}}x\\thinspace d\\mu(x), $

expectation of an indicator function is just the probability of the set indicated; we can define as well the higher *moments* for integer $ {n\\geq1}$  

$ \\displaystyle \\mathbb{E}(X^{n})=\\int\_{\\Omega}X(\\omega)^{n}\\thinspace dP(\\omega)=\\int\_{\\mathbb{R}}x^{n}\\thinspace d\\mu(x), $

and *covariance* between two real valued random variable $ {X}$ and $ {Y}$  

$ \\displaystyle cov(X,Y)=\\mathbb{E}((X-\\mathbb{E}X)(Y-\\mathbb{E}Y)). $

The independence of two random variable is then the criterion  

$ \\displaystyle P(X\\in A,Y\\in B)=P(X\\in A)\\cdot P(Y\\in B), $

for all Borel sets $ {A,B\\subset\\mathbb{R}}$. Their vector valued analog are naturally extended, with the covariance in the form of a matrix.  

Now go back to our initial question about $ {X(t)}$. The proper point of view is that it is a family of random variables $ {(X\_{t})\_{t\\in\[0,T\]}}$ indexed in time, where $ {T\\in\[0,+\\infty\]}$, and is defined formally as a *stochastic process*, more specifically a *Brownian motion*. But before we come to the formal construction, let us first work out some heuristics. Suppose the particle lives in one dimension (as is the case of the stock price), and at the begining we release the particle at the orgin, thus $ {X(0)=0}$. It follows that the probability distribution of the particle appears in any position in $ {\\mathbb{R}}$ at the begining of time is the point mass at the origin, namley the dirac measure  

$ \\displaystyle \\delta\_{0}(A)=\\begin{cases} 1 & \\text{if }0\\in A\\\\ 0 & \\text{otherwise} \\end{cases}. $  

Now, assume that  

-   the increment $ {\\Delta X=X(t+\\tau)-X(t)}$ is a random variable following some density $ {\\varphi(\\Delta X)}$ that is independent of $ {t}$, the last position $ {X(t)}$, and the sign of $ {\\Delta X}$, namely $ {\\varphi(\\Delta X)=\\varphi(|\\Delta X|)}$ ;
-   the total number of particles is conserved, and probability of the particle appears at $ {x\\in\\mathbb{R}}$ at time $ {t}$ is described by a probability *density* (i.e. the *Radon-Nikodym derivative* of the probability measure respect to the Lebesgue measure on $ {\\mathbb{R}}$), and is denoted as $ {p(x,t)}$.

Then we see that $ {X(t+\\tau)=X(t)+\\Delta X}$ is a sum of independent random variables and its distribution is given by the convolution of their distribution  

$ \\displaystyle p(x,t+\\tau)=\\int\_{-\\infty}^{+\\infty}p(x+y,t)\\cdot\\varphi(y)dy. $

Expanding $ {p(x+y,t)}$ in Taylor series in the space variable, we have  

$ \\displaystyle \\begin{array}{rcl} p(x,t+\\tau) & = & p(x,t)\\cdot\\int\_{-\\infty}^{+\\infty}\\varphi(y)dy+\\frac{\\partial p}{\\partial x}\\int\_{-\\infty}^{+\\infty}y\\varphi(y)dy+\\frac{\\partial^{2}p}{\\partial^{2}x}\\int\_{-\\infty}^{+\\infty}\\frac{y^{2}}{2}\\varphi(y)dy+\\cdots\\\\ & = & p(x,t)+0+\\frac{\\partial^{2}p}{\\partial^{2}x}\\int\_{-\\infty}^{+\\infty}\\frac{y^{2}}{2}\\varphi(y)dy+\\cdots, \\end{array} $

where the first order term vanishes because of symmetry. Taking first order approximation in time, we are thus led to the one dimensional *heat equation*  

$ \\displaystyle \\frac{\\partial p}{\\partial t}=\\frac{1}{2}\\sigma^{2}\\frac{\\partial^{2}p}{\\partial^{2}x} $

where $ {\\frac{1}{2}\\sigma^{2}=\\int\_{-\\infty}^{+\\infty}\\frac{y^{2}}{2}\\varphi(y)dy}$ is a positive constant. Since the initial data is a Dirac point mass, the solution at time $ {t}$ is the fundamental solution of it, the famous *Gaussian* density[](https://www.blogger.com/null)  

[$ \\displaystyle P\_{t}(x):=p(x,t)=\\frac{1}{\\sqrt{2\\pi\\sigma^{2}t}}e^{-\\frac{x^{2}}{2\\sigma^{2}t}}. \\ \\ \\ \\ \\ (1)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)Thus $ {X(t)}$ follows a Gaussian distribution with mean $ {0}$ and variance $ {\\sigma^{2}t}$. Such stochastic processes are called *Brownian motion*, and in the normlised case $ {\\sigma=1}$ and debut at origin, the standard Brownian motion. It is a nontrivial fact that Brownian path $ {t\\mapsto X\_{t}(\\omega)}$, as a random path, is *almotst surely* continuous. This continuity result follows from a more general theorem of Kolmogorov. The probability measure induced on the path space is known as the *Wiener measure*. The appearance of Gaussian distribution also suggests its intimate connection to the *central limit theorem*, and so the central importance of Brownian motion.  

There are basically two distinct ways to construct a one dimensional Brownian motion. One can  

-   directly construct the probability space by approximating it using discrete time stochastic processes. One can use *random walk* scaled by inverse square root of time, or any other scaled process with i.i.d. increment with mean zero. This is known as the *Donsker's invariant principle*. The state space $ {\\Omega}$ here we have in mind is $ {C\_{0}(\[0,T\])}$, the space of all continuous real valued functions $ {f}$ defined on the interval $ {\[0,T\]}$ such that $ {f(0)=0}$, and is equipped with the *topology of uniform convergence on compact sets*. The path space of the random walk injects into $ {C\_{0}(\[0,T\])}$, and thus induce an probability measure. Then one goes on to show this measure converges *weak\*ly* to the Wiener measure, using central limit theorem.
-   specify the *finite dimensional distributions* of of the process, i.e. the distributions of $ {(X\_{t\_{i}})\_{i=1}^{n}}$ for any $ {n}$-tupe $ {(t\_{i}\\in\[0,T\])\_{i=1}^{n}}$ , and for any integer $ {n>0}$, with some compatibility condition; then follow the Kolmogorov extension theorem for the general construction of continuous time stochastic process.

The first approach is of more practical interests, since it suggest to a concrete simulation method for the Brownian motion. We summarise the characterising properties of the Brownian motion as its defintion:  

> **Definition 1** *The *Brownian motion* $ {B\_{t}}$ starting at origin $ {B\_{0}(\\omega)=0}$ or almost every $ {\\omega}$, is such that*  
> 
> *-   The increments are independent, that is, if $ {0\\leq t\_{i}<\\cdots<t\_{k}}$, then $ {B\_{t\_{1}}-B\_{t\_{2}},\\cdots,B\_{t\_{k}}-B\_{t\_{k-1}}}$ are mutually independent,
> -   The increments are Gaussian.
> -   The path $ {t\\mapsto B\_{t}(\\omega)}$ is continuous for almost every $ {\\omega}$.  
>     *

Further developments will center around the following listed properties of Brownian motion. For this we need to introduce the concept of *filtration*, and *conditional expectation*. A filtration is an increasing \`\`sequence'' of sub $ {\\sigma}$-algebras of $ {\\mathcal{F}}$, indexed in time $ {(\\mathcal{F}\_{t})\_{T\\geq t\\geq0}}$, and models the evolution of information as time evloves. Given a stochastic process, one can naturally introduce a filtration by considering the $ {\\sigma}$-algebra generated (via pullbacks) by the family of random variables $ {(X\_{t'})\_{t'\\leq t}}$ by the time $ {t}$. The conditional expectation of a real valued random variable $ {X}$ with respect to some sub $ {\\sigma}$-algebra $ {\\mathcal{G}}$ is defined to be the random variable $ {\\mathbb{E}(X/\\mathcal{G})}$ such that  

$ \\displaystyle \\int\_{G}\\mathbb{E}(X/\\mathcal{G})\\thinspace dP=\\int\_{G}X\\thinspace dP $

for all $ {G\\in\\mathcal{G}}$. If $ {\\mathcal{G}}$ is generated by some random variable $ {Y}$, then we also write $ {\\mathbb{E}(X/\\mathcal{G})=\\mathbb{E}(X/Y)}$. If $ {X}$ is an indicator function, then we also call it conditional probability.  

-   **Markov property.** Formally, this means for $ {t>s}$,

    $ \\displaystyle P(B\_{t}\\in A/\\mathcal{F}\_{s})=P(B\_{t}\\in A/B\_{s}), $

    where $ {A\\in\\mathcal{B}\_{\\mathbb{R}}}$ Boreal $ {\\sigma}$-algebra of $ {\\mathbb{R}}$, $ {\\mathcal{F}\_{s}}$ is the sub $ {\\sigma}$-algebra generated by the family $ {(B\_{t'})\_{t'\\leq s}}$. This follows from the independent increment property of the Brownian motion. With this property, and also the distribution of the increments, it is possible to talk about the *transition function* of the process without refering to its history. We have already obtained it essentially \\textendash{} it is the Gaussian distribution in ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965&pli=1#eq1)), the remaining thing is just to shift it to the last location

    $ \\displaystyle \\int\_{A}P\_{t}(x)\\thinspace dx=\\int\_{A}\\int\_{\\mathbb{R}}P\_{s}(y)P\_{t-s}(x-y)\\thinspace dxdy. $

    Note that it induces a 1-parameter family of operators

    $ \\displaystyle \\mathbf{P}\_{t}f\\thinspace(x)=\\int\_{\\mathbb{R}}f(y)P\_{t}(x-y)\\thinspace dy. $

    Note that it is noting but the solution operator of the heat equation with initial data $ {f}$. The 1-parameter family also satisfies the *semi-group property*

    $ \\displaystyle \\mathbf{P}\_{t\_{1}+t\_{2}}f=\\mathbf{P}\_{t\_{2}}\\circ\\mathbf{P}\_{t\_{1}}f. $

    This is an instance of a more general correspondence between *Markov (or diffusion) processes* and *diffusion equations*. In our case, the $ {\\frac{1}{2}}$laplacian is the *infinitesimal generator* of Brownain motion, and the diffusion equation is the heat equation. A more rigorous and comprehensive study goes well beyond the scope of this article.
-   **Martingale property.** Conditional expectation soon advances into the powerful technical tool of martingales and its related notions. Given a stochastic process $ {X\_{t}}$ and the filtration $ {(\\mathcal{F}\_{t})\_{t\\geq0}}$ it generates, the process is a martingale if $ {\\mathbb{E}(|X\_{t}|)<+\\infty}$, and for $ {t>s}$,

    $ \\displaystyle \\mathbb{E}(X\_{t}/\\mathcal{F}\_{s})=X\_{s}. $

    For instance, sum of independent random variables with zero mean is a martingale. Brownian motion is also a martingale. In fact, there is a continuous analogue of the previous statement, known as the *Itô's integral*, which we shall turn to shortly. If the martingale $ {M\_{t}}$ converge (in some appropriate sense, say $ {L^{2}}$) to some limit $ {M\_{\\infty}}$, then the whole sequence can be recovered by conditional expectation:

    $ \\displaystyle M\_{t}=\\mathbb{E}(M\_{\\infty}/\\mathcal{F}\_{t}). $

    This will be one of the benefits of the Itô's integral as a martingale.
-   **Path regularity and quadratic variation.** Brownian paths are contiuous, as we already knew, and it is even $ {\\gamma}$-Hölder continuous for every $ {\\gamma\\in(0,\\frac{1}{2})}$. However, it is nowhere differentiable for almost every $ {\\omega}$, neither it is of *bounded variation*. This suggests that in general pathwise integration (especially integrating one path against another path) does not make too much sense in measure theory (as a Lebesgue-Stieltjes integral), except when the integrand has enough regularity, then one can pass to the usual definition by duality. Thus a more probabilistic \`\`integration theory'' has to be envisaged when one tries to \`\`integrate'' a stochstic process with respect to the Brownian motion (not so much in the sense of measure theory, but more of a continuous analogue of summation). What is crucial in this development is to realize that Brownian motion actually has finite, almost deterministic *quadratic variation*

    $ \\displaystyle \\lim\_{\\|\\mathcal{P}\_{n}\\|\\rightarrow0}\\sum\_{i=1}^{n}|B\_{t\_{i}}(\\omega)-B\_{t\_{i-1}}(\\omega)|^{2}=t $

    for almost every $ {\\omega}$. Such equality is said hold *in probability*, or *in law*. The quadratic variation of $ {X\_{t}}$ is then denoted as $ {\\langle X\\rangle\_{t}}$, and in general it is a stochastic process. The quadratic variation will prove to be important in the Taylor expansion of the expression $ {f(X(t))}$, where $ {f}$ is a smooth function.  

As alluded above, as a continuous analogue of summing independent random variables with zero mean, we wish to make sense of the integral  

$ \\displaystyle B(t)=\\int\_{0}^{t}dB(s) $

and more generally  

$ \\displaystyle I(t)=\\int\_{0}^{t}X(t)dB(t), $

as a martingale, where the sub $ {\\sigma}$-algebra generated by $ {X\_{t}}$ is a subset of $ {B\_{t}}$'s, and develop the corresponding *Itô's calculus*. The idea is to consider the limit of a special Riemann sum[](https://www.blogger.com/null)  

[$ \\displaystyle I(t):=\\lim\_{\\|\\mathcal{P}\_{n}\\|\\rightarrow0}\\sum\_{i=1}^{n}X(t\_{i-1})(B(t\_{i})-B(t\_{i-1})). \\ \\ \\ \\ \\ (2)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)The point is that $ {X\_{t}}$ is evaluated at time $ {t\_{i-1}}$ instead of any other point, in order that  

$ \\displaystyle \\mathbb{E}(X(t\_{i-1})(B(t\_{i})-B(t\_{i-1}))/\\mathcal{F}\_{t\_{i-1}})=0 $

and at least we see that the finite sum is a martingale.  
The limit ([2](https://www.blogger.com/blogger.g?blogID=4046755691971152965&pli=1#eq2)) is taken in $ {L^{2}}$, and thus also converge in probability. The nature of Itô's integral is also manifested in the isometry  

$ \\displaystyle \\mathbb{E}|I(t)|^{2}=\\int\_{0}^{t}\\mathbb{E}|X(s)|^{2}ds. $

The starting point of Itô's calculus, and the *stochastic differential equations (SDE)* is the fundamental theorem of calculus of Itô: given a smooth function $ {f(x,t)}$ on $ {\\mathbb{R}\\times\[0,T\]}$, and expand its Taylor series in differential form  

$ \\displaystyle df=\\frac{\\partial f}{\\partial x}dx+\\frac{\\partial f}{\\partial t}dt+\\frac{1}{2}(\\frac{\\partial^{2}f}{\\partial x^{2}}+\\frac{\\partial^{2}f}{\\partial t^{2}})(dx)^{2}+\\frac{\\partial^{2}f}{\\partial t\\partial x}(dxdt)\\cdots. $

Subtituting $ {B(t)}$ as $ {x}$, the following identity holds in law  

$ \\displaystyle f(B(t),t)-f(B(0),0)=\\int\_{0}^{t}\\frac{\\partial f}{\\partial x}(B(s),s)dB(s)+\\int\_{0}^{t}\\frac{\\partial f}{\\partial t}(B(s),s)ds+\\frac{1}{2}\\int\_{0}^{t}\\frac{\\partial^{2}f}{\\partial x^{2}}(B(s),s)ds, $

or, in more convenient differential notation  

$ \\displaystyle df(B(t),t)=\\frac{\\partial f}{\\partial x}(B(t),t)dB(t)+\\frac{\\partial f}{\\partial t}(B(t),t)dt+\\frac{1}{2}\\frac{\\partial^{2}f}{\\partial x^{2}}(B(t),t)dt. $

Note that $ {(dB(t))^{2}}$ as quadratic variation is equal to $ {dt}$ in law. A similar formula can be worked out for another stochastic process $ {X\_{t}}$, provided we know its relation to the Brownian motion in terms of an SDE.  

Suppose at terminal time $ {T}$ we are interested in the expectation of certain quantity $ {F(B(T))}$. We can compute it by considering the conditional expectation  

$ \\displaystyle f(x,t)=\\mathbb{E}(F(B(T))/B(t)=x), $

which is a martingale. Once we know $ {f(x,t)}$, the expected value can be computed by plugging in $ {t=0}$. However, by Itô, $ {f(B(t),t)}$ is a martingale if and only if[](https://www.blogger.com/null)  

[$ \\displaystyle \\frac{\\partial f}{\\partial t}+\\frac{1}{2}\\frac{\\partial^{2}f}{\\partial x^{2}}=0, \\ \\ \\ \\ \\ (3)$](https://www.blogger.com/null)

[](https://www.blogger.com/null)which is known as the *backward Kolmogorov equation*. Thus one can compute expectations by solving the *final value problem* of this PDE.  
The duality between functions and measures also plays a role here. The expectation can be written as an integral  

$ \\displaystyle \\mathbb{E}F(B(T))=\\int\_{\\mathbb{R}}F(x)p(x,T)\\thinspace dx $

where we follow the notations as above, and more generally,  

$ \\displaystyle \\mathbb{E}(F(B(T))=\\int\_{\\mathbb{R}}f(x,t)p(x,t)\\thinspace dx. $

Then the duality immediately leads to our familiar equation ([1](https://www.blogger.com/blogger.g?blogID=4046755691971152965&pli=1#eq1))  

$ \\displaystyle \\frac{\\partial p}{\\partial t}-\\frac{1}{2}\\frac{\\partial^{2}p}{\\partial x^{2}}=0, $

now called the *Fokker-planck equation* satisfied by the probability density $ {p(x,t)}$.
