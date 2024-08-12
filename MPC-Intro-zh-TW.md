# Introduction

以下是我閱讀 [A Pragmatic Introduction to Secure Multi-Party Computation](https://securecomputation.org/) 一書的摘要.

MPC 想要處理的問題是: 如果有個 function 需要來自多個人的 input 才能計算出來, 我們如何設計一個計算方式(protocol), 讓我們除了 function output 洩漏的資訊之外, 不會洩漏更多的 input ?

首先, function output 是會洩漏資訊的.

比方說, 如果我和另一個人一起計算 `f(x, y) = x + y` , 如果我知道答案 s 和我的 input x, 那我馬上能用 s - x 得到對方的 y.

比方說, 如果我和另一個人一起計算 `f(x, y) = (x + y) % 2`, 如果我知道答案和我的 x, 雖然我沒有辦法明確知道對方的 y 是哪個數字, 但我也已經知道 y 是奇數還是偶數, 少掉了一半的可能性.

就像前面說的, 除了答案本身洩漏的資訊之外, 我們的設計的 protocol 不能再洩漏更多資訊.

## Ideal v.s. Real

在一個理想的世界裡, 我們可以另外找一個不會洩密的 trusted party, 每個人都秘密地把自己的 input 交給 trusted party, 再由他把 f 的計算結果交給大家.

但在我們所處的現實世界中, 找一個 trusted party 的成本很高. 所以我們想要建立一些 protocol, 讓 party 之間不依賴 trusted party, 卻能達到像在理想世界中計算 f 的效果.

![alt text](images/ideal-real.png)

## Generic v.s. Custom

書中介紹了一些 generic 的 protocol, 可以用一樣的手法處理各種 function. 另外有些 f 也可以針對其特性設計出 custom 的, 更有效率的 protocol.

## Adversary Models: "semi-honest" v.s. "malicious"

另外在設計 protocol 時, 我們要注意所謂的 "adversary model". 或者說: 參與這些 protocol 的人有多壞?

書中前半部分介紹的 protocol 都是以 "semi-honest" (又稱為 "honest-but-curious") 的模式來設計. 也就是說, 參與 protocol 的人都會遵守 protocol 的設計, 不會故意偏離(deviate), 但會試圖從收到的訊息推測別人的 input. 我們要在這個條件下算出 f, 同時防止資訊洩漏. (會故意偏離的是 "malicous" model)

本來我想: semi-honest model 是不是太弱了? 現實中的壞人為什麼會乖乖照著步驟走? 這個 model 有什麼意義?

後來我的想法改變了.

第一, 現實中可能真的有這樣的場景. 比方說多個醫院間想要找出解決疾病的方法, 但是又不能彼此洩漏病人的資料. 我們假設每個醫院負責執行的人都真心想要解決疾病, 所以會照著 protocol 計算. 但是醫院裡如果有壞人, 雖然他們沒有 write permission 去破壞 protocol, 但他們有可能有 read permission 去偷聽偷看到別的醫院傳來的資料(比方說偷看螢幕). 我們設計的 protocol 就要確保在這樣的情況下也不會洩密.

第二, 有方法可以把一個在 semi-honest model 下安全的 protocol 強化成 malicous model 下也安全的 protocol, 需要加上防弊的措施, 不過也會降低一些效率. (詳細作法我還沒讀到)

以下我會介紹一些在 semi-honest model 下的 protocol, 以及這些 protocol 所需要的 primitives.
