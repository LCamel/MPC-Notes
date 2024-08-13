# Garbled Circuit

Garbled Circuit 是最早, 也是最實用的 MPC protocol 之一. 發明的人是姚期智, 所以這個 protocol 常被稱為 Yao's Garbled Circuit / Yao's GC.

## 問題

如同 [上一篇](MPC-Intro-zh-TW.md) 中提到的: 我們想計算 `f(x, y)`, 但不想讓對方知道自己的 input. Garbled Circuit 便是一個處理只有兩個 party 情況下的 protocol (所謂 "2PC").

## Overview

Garbled Circuit 的想法是: 我們先把 `f(x, y)` 表達成 boolean circuit. 由其中一個人扮演 "Generator", 把 circuit 和自己的 input "弄亂"(garbled) 後, 交給 "Evaluator" 去執行並把答案公開. 由於 evaluator 拿到的東西被弄亂過, 雖然他可以照著步驟執行, 但卻無法從中推敲出 generator 的 input. 而 evaluator 的 input 只有初始化的時候透過安全的 "Oblivious Transfer" 和 generator 互動過, 所以也不會被 generator 知道.

## 文章和視覺化工具

我覺得看 Pragmatic MPC 這本書的時候, 很多時候都是看到像上面的文字: 一段話正確的描述了 protocol, 給了一個 high-level overview, 但還是<mark>需要看實際作法才會有所收穫</mark>.

我寫了一篇[不用基礎(但很長)的文章](story-zh-TW.md), 搭配視覺化的工具, 介紹了 garbled circuit 的步驟和動機. 除了提供 "是這樣" 之外, 也寫了一些我覺得 "為什麼是這樣" 的想法. 我們先反過來從 evaluator 的角度來看, 到底 "計算" 是什麼? 和一般的 boolean circuit 有什麼不一樣? 再回頭看 generator 應該提供什麼. 為什麼要加密? 為什麼要 shuffle? 最後再帶出 oblivious transfer 的概念.

而[視覺化的工具](https://lcamel.github.io/MPC-Notes/), 我希望在解說的過程中, 能讓大家更容易抓到直覺. 工具採用 MIT license. 也可以獨立在文章之外使用.

看完上面的文章後, 我們可以繼續看一些 optimization.

----

## 後記

姚期智很小的時候從中國到台灣, 台大物理畢業後, 取得哈佛物理博士. 後來興趣轉向電腦科學, 在劉炯朗指導下取得 UIUC 博士學位. 在 2000 年得到 Turing Award. 現於北京清華教書.
