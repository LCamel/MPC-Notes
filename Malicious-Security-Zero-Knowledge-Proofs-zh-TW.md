# Malicious Security - Zero-knowledge Proofs

## GMW Compiler

GMW 三個人除了提出前面的 protocol 之外, 也提出了一種轉換, 可以把任意的 semi-honest protocol 轉成可以處理 malicious 的 protocol.

### Pure Function

```
function f1(x) {
    return x + Math.random();
}
```
上面的 function 是 pure function 嗎?

不是. 因為用同樣的 input 呼叫 f1 不會每次都拿到一樣的 output.

```
function f2(x, r) {
    return x + r;
}
```
上面的 function 是 pure function 嗎?

是. 因為用同樣的 input 呼叫 f1 每次都會拿到一樣的 output.

我們把一個 2-party 的 protocol Pi 看成兩個 pure function: Pi1 Pi2.

對於 Pi1 而言, 如果給一樣的 input x1, 一樣的 random values r1, 一樣的 transcript t1 (先前收送的所有訊息), 則會產出一樣的 next message. Pi2 也是一樣.

### Coin-tossing into the Well

在設計 semi-honest protocol 時, 如果 random value r1 是真的 uniformly random, 則不論 input x1 是什麼值, 都不會洩漏 P2 的 x2.

但是在 malicious 的情況下, 說不定 P1 會操弄其 random value 來讓 P2 洩密. 要怎麼處理呢?

我們知道, 如果 u ⊕ v 中, 只要 u 或 v 其中一個是 uniformly random, 則 u ⊕ v 就會是 uniformly random.

所以我們把 P1 在原本 semi-honest protocol 中使用的 random 改成 r1 ⊕ r1' . 其中 r1 是 P1 自己提供的 random value, r1' 是 P2 提供給 P1 的 random value. 這樣做的好處是:
1. P2 為了避免 P1 操弄 random value, 所以會提供 uniform 的 r1' , 這樣 r1 ⊕ r1' 會是 uniformly random.
2. 因為裡面還保有 P2 不知道的 r1, 所以 P1 不用擔心被 P2 知道最後的 r1 ⊕ r1' .

但是既然 P1 是惡意的, 我們怎麼知道 P1 真的有拿 r1' 來用? 或者說, 我們怎麼知道 P1 真的有照著 Pi1 來執行呢?

### Zero-knowledge Proof

"計算" 是 public 的. "資料" 可以一部分 public, 一部分 private.

在 Zero-Knowledge Proof 系統的幫助下, 可以做到:
1. Verifier 願意相信 Prover 用 public input "pub" 和 private input "priv" 計算了 F, 結果為 public output y . 也就是 F(pub, priv) = y .
2. Verifier 不會得到 y 之外的關於 private data 的資訊.

如果 F 這邊是某個 commitment scheme 的 verify 的 function, 則我們可以在不揭露原本資料的情況下, 讓 Verifier 願意相信 Prover 手上的確有當初 commit 的資料.

我們要求 P1 一開始就把自己的 input x1 和整個過程需要的 random r1 產出一個 commitment. 接下來每次除了算出原本的 message 給 P2 之外, P1 還透過 Zero-knowledge Proof 和 P2 表示:
1. P1 的確有依照原本的 Pi1 來計算這次要送出的訊息, 而且使用了 r1 ⊕ r1' .
2. P1 的 x1 r1 雖然是 private 的, 但每個 round 間沒有改變. (被 commitment 固定住)

P2 也做和 P1 對稱的事. 如此我們藉由 Zero-knowledge Proof 的幫助, 得到了一個可以處理 malicious 情況的 protocol.


## ZK from Garbled Circuits

前面介紹的 GMW compiler 是用 ZK 來實作 MPC. 接下來介紹的 Jawurek, Kerschbaum, and Orlandi (JKO) 則是相反的. 我們看如何用 MPC 的技巧來實作 ZK.

在 ZK 中, prover 希望向 verifier 證明: prover 有個 private input w, 使得 F(w) = 1.

比方說, prover 想證明 "我知道一個 w, 使得 SHA256(w) = 42". 則我們可以定義 F 為
```
function F(w) {
    return (SHA256(w) == 42) ? 1 : 0;
}
```

我們可以把所有 public input / output 都收進 F 的定義本身. 這樣從 MPC 的角度來看, 會只剩下一個 public function F, 一個 prover 才知道的 private input w, 以及 verifier 不用提供任何 input (或想成 null).

接著我們用 Garbled Circuit 來執行 F. 此時讓 verifier 扮演 generator, 讓 prover 扮演 evaluator. Verifier 把 public 的 F 轉成 circuit, evaluator 再用 oblivious transfer 來拿到 w 對應的 keys.

在 cut-and-choose 中, 有 open 過 circuit 的不會拿來 evaluate, 而 evaluate 過的 circuit 也不會拿來 open. 後者是為了保護 generator, 因為 generator 會把自己的 input 轉成 key 給 evaluator, 如果 open circuit 的話 input 就洩漏了.

但是在 ZK 的 use case 中, verifier (generator) 沒有 input, 所以沒有東西可以洩漏! 也就是說, evaluator 可以只要 evaluate 單一一個 circuit, 算出答案之後再要求 generator open 這個 circuit. 效率很高!

不過為了防止 generator 作惡, 這邊 evaluator 先 commit 算出的答案, 如果 generator 能正確地 open circuit, evaluator 才 open 其 commitment. 如果的確是對應到 1 的 key, 則 generator (verifier) 會願意相信 evaluator (prover) 的確有滿足條件的 input w (因為在 open circuit 前很難猜到 key).