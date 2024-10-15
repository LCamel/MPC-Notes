# Malicious Security - Cut-and-Choose

在前面的文章中, 我們假設每個 party 都會遵守 protocol, 並在這個前提下討論 protocol 會不會洩密.

接下來我們拿掉這個假設.

以 Garbled Circuit 為例, generator 把想計算的 function F 轉成 garbled circuit 送給 evaluator.

如果 generator 是惡意的, 則有可能先和 evaluator 說 "我們來計算 F(x, y) = x > y ? 0 : 1", 但實際上卻偏離 protocol, 把 "F2(x, y) = first bit of y" 的 circuit 傳給 evaluator. 這樣當 evaluator 把答案回傳給 generator 時, 其 input 就會洩漏了. (全部或部分)

要怎麼防止這種問題呢?

## Cut-and-Choose

一種手法是 "Cut-and-Choose" (本來是指一個人切蛋糕一個人選蛋糕的情境). 這邊是由一個 party 做一些事, 而讓另一個 party 可以挑一些來 check.

以 Garbled Circuit 來說, 我們可以要求 generator 對同一個 F 產生多個 circuit, 而 evaluator 則從中挑選一些 circuit 來 check. 如果 generator 給的 circuit 不是 F, 則有可能被 evaluator 抓到. 如果挑選的 circuit check 過的確都是 F, 則 evaluator 再 evaluate 剩下沒有 check 過的 circuit.

挑選 circuit 的方式很明顯地會影響 generator 做壞事被發現的機率. Evaluator 最多可以在 N 個中 check N - 1 個, 但是這樣成本很高, 而且被騙過的機率也沒有小到 negligible.

Evaluator 也可以 check 少一點, 然後 evaluate 剩下的多個 circuit 並比較結果. 如果幾個結果不一致, 則顯然 generator 有問題.

但是這裡要小心. 光是 "指出 generator 有問題" 這個動作也可能會洩密. 如果 generator 生出一個這樣的 circuit:
```
if (first bit of y == 1) {
    output a wrong answer of F(x, y)
} else {
    output F(x, y)
}
```
則當這個 circuit 和其他正常的 circuit 一起被 evaluate 時, 如果 evaluator 指出問題, 那就等於洩漏了一個 bit.

一種改進的方法是: 在多個 evaluate 的結果中取 majority. 書中說:
> The cut-and-choose parameters (number of circuits, probability of checking each circuit) are chosen so that Pr[majority of evaluated circuits incorrect ∧ all check circuits correct] is negligible.

直覺想: 如果後面 evaluate 的個數夠多, 錯誤的 circuit 要能達到 majority 就要夠多. 但同時這數量多起來, 又要在一開始檢查時不被抽驗到, 應該就很不容易.

書中提到, 如果我們希望錯誤率小於 2^(-lambda), 則最少需要 3.12 * lambda 份 circuit, 然後建議取其中比例 0.6 的 circuit 來 check, 剩下 0.4 拿來 evaluate. (但也要考慮執行 check 和 evaluate 的成本)

## Input Consistency

Evaluator 對同一個 function 的多個選中的 circuits 會各 evaluate 一次. 有可能惡意的 generator 或惡意的 evaluator 會在不同次的 evaluation 中給不同的 input.

### Input Consistency (Evaluator)

如果要防止惡意的 evaluator, 可以讓 generator 把所有要 evaluate 的 circuit 的同一個 wire 的 0 labels 通通接在一起, 1 labels 也接在一起, 每個 wire 只讓 evaluator 用一次 OT 選取.

### Input Consistency (Generator)

這邊引入一個 2-universal hash 的觀念, 用來形容一組每一個都很難有 collision 的 hash functions: 對於任何 given 的相異的 inputs z1 z2, 我們從 hash functions 中抽單一一個 h 出來, 則 h(z1) = h(z2) 的機會很小. 小到 1 / |range| 這麼小. 也就是當 range 很大時, 如果 hash output value 相同, 我們就當作 input 是相同的.

這邊我們要求 generator 先給出要給每一份 circuit 的 input labels. 然後 evaluator 抽一個 hash function. 用 MPC 在每一份 circuit 都另外計算 generator input values hash 出來的結果. 如果 output value 都相同, 我們就相信 generator 有在每一份 circuit 都給了一樣的 input values.

另外為了不要洩漏 generator 的 input, 這邊另外補了 random r 一起去 hash.

## Selective Abort Attack (Selective Failure)

惡意的 generator 可以在 OT 時把某個 wire 的 1 label 換成垃圾. 這樣如果 evaluator 在這個 wire 的 input 是 1 就會導致計算失敗. 而這個 "計算失敗" 的事實就會洩漏 "這個 bit 是 1" 給 generator.

這個手法依賴於失敗或不失敗兩種情況都可能發生. 也就是 "成功 => 那個 bit 應該是 0", "失敗 => 那個 bit 應該是 1".

書中說 Lindell and Pinkas (2007) 和後續 shelta and Shen (2013) 用了一個技巧. 把 evaluator 的 input y 轉成 y' . 這個 y' 的特性是: 如果只知道其中不超過 k 個 bit 的話, 則和 y 是完全無關的, 得不到 y 的資訊.

這裡 y 和 y' 滿足一個性質: M * y' = y . 此處 M 是一個 public matrix, 而其計算在 FreeXOR 下不會增加成本.

對給定的 y, 應該有多個 y' 可以滿足 M * y' = y . 此處 evaluator randomly 選其中一個 y' 來 encode y.

現在修改過的 circuit 的 input 變成 generator 的 x 和 y' . 可以想成前半段會算出 y = M * y' , 再接著算原來的 F(x, y) . 惡意的 generator 攻擊得到的 input 變成是 y' .

這邊 M 的 parameter 的選取, 試圖讓想做惡的 generator 面臨兩難:

* 如果操弄的 wire 數目不超過 k, 則雖然會有失敗和沒失敗兩種結果, 但因為得到的 y' bit 數太少, 所以沒辦法推測出 y 的資訊.
* 如果操弄的 wire 數目超過 k, 則失敗率幾乎會是 1. 也因此沒有 "成功/失敗" 的兩個 case 可以分辨 y, 因為總是失敗.

## Input Recovery Technique

前面提到, 如果我們希望錯誤率低於 2^(-lambda), 則至少需要複製 3.12 * lambda 份 circuit 來 cut-and-choose, 成本高.

Lindell 和 Brandão 分別在 2013 提出了方法來改進這個問題. 大致上的想法是: 如果 evaluate 出來的結果不一致, 則這個結果可以用來繼續算出 generator 的 input x (input recovery). 然後 evaluator 再單獨計算 F(x, y). 整個過程不管是否一致都繼續做下去, 因此 generator 無法讓 evaluator 洩漏訊息.

這裡的目的不是要透過揭露 "generator 作弊" 或 "generator 的 input 是 x" 來讓 generator 蒙受損失. 雖然這在某些場景或許有用, 但這樣會讓 evaluator 的 input 洩漏, 並不理想.

這樣一來, 要騙過 evaluator 的難度就更高了. 以前是:
1. 壞的 circuit 不能被 check 到.
2. 剩下的 circuit 中壞的佔 majority.

現在是:
1. 壞的 circuit 不能被 check 到.
2. 剩下的 circuit 中壞的佔全部! (consistent)

因此如果每個 circuit 被 check 的機率是 1/2 的話, 只要 lambda 份 circuit 就可以讓錯誤率降到 2^(-lambda) 了.

## Batched Cut-and-Choose

如果同一個 function 要被 evaluate N 次, 則可以想辦法進一步降低平均的成本.

本來是要 O(lambda) 的, 現在可以降到 O(lambda / log N). (lambda 是 security parameter)

現在的方法是:
1. Generator 生成 N * rho + c 個 circuit
2. Evaluator 抽 c 個 circuit 來 check
3. 把剩下的 N * rho 個 circuit 分成 N 個 bucket, 每次 evaluate rho 個 circuits.

Generator 只有在前面沒被 check 到壞的 circuit, 且後面某個 bucket 裡面整個都是壞的 circuit 才算騙過 evaluator. (或 majority 是壞的)

## Gate-level Cut-and-Choose: LEGO

一個 boolean circuit 可以只用 NAND gate 來組成.

Nielsen and Orlandi 的想法是: 做出很多 NAND gates, 像 batched cut-and-choose 一樣抽其中一些來 check, 剩下的裝進 buckets. 然後用同一個 bucket 的多個 NAND gate 來 "solder" 出各種只要 majority 對就對的, fault-tolerant 的  gate. 再用這些 gates 組出單一一個 circuit 來 evaluate.

這裡用到一個叫做 "Homomorphic Commitment" 的概念: 對於兩個 values a 和 b, 做出兩個 commitments. 然後可以看情況 open a, open b, 或者 open "a XOR b".

一個 gate 的一個 wire 上有 k0 k1. 這邊用 FreeXOR, 所以 k1 = k0 ⊕ delta. 因為 delta 是 global 共用的 constant, 所以在 check 時不能把 k0 k1 都公開.

這邊 check 的方法有調整: 在 NAND gate 的四個 row 中, 由 evaluator randomly 挑一個來 check.
舉例來說: 如果 wire a NAND wire b = wire c.
```
a b c
0 0 1      ka0 kb0 kc1
0 1 1      ka0 kb1 kc1
1 0 1      ka1 kb0 kc1 <== check: open ka1 / kb0 / kc1
1 1 0      ka1 kb1 kc0
```
這邊因為每個 wire 只單獨開一個 key, 所以不會洩漏 delta.

也因為這邊作弊只有 1/4 的機會被 check 到(有人改進到 1/2), 所以要多一些 gates.

再來是要把不同 gate 的 wires 連在一起. 如果 wire u 要傳遞到 wire v, 則要能把 ku0 轉成 kv0, ku1 轉成 kv1.

ku0 kv0 兩者的差: let suv = ku0 ⊕ kv0 .  ku1 kv1 的差因為 FreeXOR 所以是一模一樣的. 也就是說, 只要盲目地加上 suv, 就能把 ku0 變成 kv0, ku1 變成 kv1. 而這個差可以用 homomorphic commitment 來 open 出來.

TODO: 還沒看懂怎麼把多個 NAND solder 成一個 fault-tolerant 的 gate.

即便只 evaluate 一次, 這邊的節省效果也和 batch 相似, 只要 O(1) + O(lambda / log N). (N 為 gate 數)

----
## 後記

書中 "input consistency" 一節引用 shelat and Shen 2011 的版本, 我猜其實是想引用 2013 的版本?

[2011](https://eprint.iacr.org/2011/533.pdf) 的版本在處理 generator 的 input consistency 時, 是利用 claw-free functions, 把一些 random points 透過 f0 f1 送到 range, 再用 range elements 算出 circuit labels.

Claw-free functions 的性質使得 generator 可以和 evaluator 證明這些 range elements 是同一個 f0 或 f1 算出來的. 且因為其 distribution 一樣, 所以不會洩漏是 f0 或是 f1.

<img src="./images/Input-Consistency-Claw-Free.png" width="300">
