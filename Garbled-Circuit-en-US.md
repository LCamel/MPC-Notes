# Garbled Circuit

Garbled Circuit is one of the earliest and most practical MPC protocols. It was invented by Andrew Yao, so this protocol is often referred to as Yao's Garbled Circuit / Yao's GC.

## Problem

As mentioned in the [previous article](MPC-Intro-en-US.md): we want to compute `f(x, y)`, but we don't want the other party to know our input. Garbled Circuit is a protocol that deals with the situation where there are only two parties (so-called "2PC").

## Overview

The idea of Garbled Circuit is: we first express `f(x, y)` as a boolean circuit. One of the parties plays the role of "Generator", who "garbles" the circuit and their own input, then passes it to the "Evaluator" to execute and reveal the answer. Since what the evaluator receives has been garbled, although they can follow the steps to execute it, they cannot deduce the generator's input from it. The evaluator's input only interacted with the generator during initialization through secure "Oblivious Transfer", so it won't be known by the generator either.

## Articles and Visualization Tools

I feel that when reading the book Pragmatic MPC, many times you see text like the above: a paragraph correctly describes the protocol, gives a high-level overview, but <mark>still requires looking into the details to gain insights</mark>.

I wrote a [long article without prerequisites](story-en-US.md), accompanied by visualization tools, introducing the steps and motivations of garbled circuits. In addition to providing "how it is", I also wrote some thoughts on "why it is this way". We first look at it from the evaluator's perspective in reverse, what exactly is "computation"? How is it different from a regular boolean circuit? Then we look back at what the generator should provide. Why encrypt? Why shuffle? Finally, we introduce the concept of oblivious transfer.

As for the [visualization tool](https://lcamel.github.io/MPC-Notes/), I hope it will make it easier for everyone to grasp the intuition during the explanation. The tool is released under the MIT license. It can also be used independently outside of the article.

After reading the above article, we can continue to look at some optimizations.

----

## Postscript

Andrew Yao moved from China to Taiwan at a very young age, graduated from National Taiwan University with a degree in physics, and then obtained a PhD in physics from Harvard. Later, his interest shifted to computer science, and he obtained a PhD from UIUC under the supervision of Chung Laung Liu. He received the Turing Award in 2000. He is currently teaching at Tsinghua University in Beijing.
