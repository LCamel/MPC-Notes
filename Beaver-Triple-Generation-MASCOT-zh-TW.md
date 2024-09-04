# Beaver Triple Generation: The MASCOT Way

<mark>(draft version)</mark>

在上一篇中, 我們看到 offline 先準備很多 Beaver triple 的話, 可以降低 online 計算的成本.

但是 Beaver triple 怎麼來的呢?

書中提到其中一種方法: "... Beaver triples can be generated in a variety of ways, such as by simply running the BGW multiplication subprotocol on random inputs."

另外也有用 homomorphic encryption 或 oblivious transfer 的作法.<br>
我們這邊補充一個書中沒有的, 基於 OT 的作法: [MASCOT](https://eprint.iacr.org/2016/505) .

先來看 MOSCOT 的起點: Gilboa's multiplication protocol.

## Gilboa’s multiplication protocol

舉例來說, Sender 手上有 42, Receiver 手上有 11 .<br>
我們希望讓他們手上持有一份 42 * 11 的 additive shares.<br>
也就是讓 Sender 持有某數字 c1, Receiver 持有某數字 c2, 使得 c1 + c2 = 42 * 11 .<br>
執行後 Sender 不知道 11 也不知道 c2.<br>
Receiver 不知道 42 也不知道 c1.<br>
兩個人都不知道 42 * 11 .

我們手上的工具有 1-out-of-2 OT.

11 = 1 0 1 1 in binary.

```
42 * 11
= 42 * (8 + 0 + 2 + 1)
= (42 * 8) + 0 + (42 * 2) + (42 * 1)
```

我們先假設 Receiver 的數字不超過 4 個 bits. (實際要看 field 的 size, 文中是 k 個 bits)

Sender 準備 4 個 random number t1 t2 t3 t4.<br>
然後和 Receiver 進行 4 個如下的 1-out-of-2 OT:

```
t1
t1 + 42        1    =>   t1 + 42      t1 + 42 * 1

t2
t2 + 42        1    =>   t2 + 42      t1 + 42 * 1

t3             0    =>   t3           t1 + 42 * 0
t3 + 42

t4
t4 + 42        1    =>   t4 + 42      t1 + 42 * 1
```

對 Reciver 來說, 只是拿到 4 個看似 random number 的東西. 猜不出 42.

然後想辦法在右邊的式子湊出 42 * 11 .

參考前面的式子, 我們這樣湊:
```
                         (t1 + 42) * 1    (t1 + 42 * 1) * 1
                         (t2 + 42) * 2    (t2 + 42 * 1) * 2
                         (t3 +  0) * 4    (t3 + 42 * 0) * 4
                         (t4 + 42) * 8    (t4 + 42 * 1) * 8
                    +)_________________
                let c2 = blah + 42 * 11
                where blah = (t1 * 1) + (t2 * 2) + (t3 * 4) + (t4 * 8)
```
那只要 let c1 = -blah 的話, 會有 c1 + c2 = 42 * 11 .<br>
c1 c2 就是一組 42 * 11 的 additive share.


## Protocol COPEe

(上面用很多次 OT 可以造出一個 triple. 但是 OT 很貴. 直覺會想要用前面介紹過的 IKNP OT extension 來做大量 OT. 不過這篇用了自己建構的, 類似 OT extension 的作法.)

COPEe: 讓 Receiver 固定一個 delta. 然後每次 Sender 用不同的 x 來製造一組新的 shares t q, 使得 t + q = x * delta .

在 initialize phase, Sender 準備 k paris of seeds (k 就是上面例子中的 4). 每個 seed 的長度都是 lambda.

Receiver 用 delta 分解出的 bits 拿對應的 k 個 seeds 回來.

而在 extend phase, Sender 提供一個新的 x.

Sender 用 PRF 和 seed 生出 k 組數字 (t0 t1) .... , 取代 Gilboa 的 random. <br>
Receiver 用一樣的規則計算, 會知道其中 k 個數字 (initial phase 選的那些 seed 生的).

(Fig. 3 想要的 functionality 的 t 是 random 的. 這邊實作上是用 PRF 代替.)

Sender 送出 k 個 u = t0 - t1 + x 給 Receiver.<br>
藉由 u, Receiver 可以算出 k 個 q = t0 or q = t0 + x .

為什麼作者會想出 u 這樣的式子?<br>
我猜可以這樣想:<br>
如果 Receiver 的 choice bit 是 b, 我們想要的是 t0 or t0 + x .
```
if b == 0, the Receiver knows t0.   ?? =>  t0
if b == 1, the Receiver knows t1.   ?? =>  t0 + x
```
所以安排一個 correction term.<br>
當 b == 0 時 t0 == t0 不用修正.<br>
而 b == 1 時要讓 t1 變成 t0 + x, 所以安排 -t1 + (t0 + x) . 這樣可以消掉 t1, 得到 t0 + x.<br>
因此設計 protocol 時讓 Sender 送來 u = (-t1 + (t0 + x)), 乘上 b 就能依照情況來修正.

k 個合起來看, 會有 Q = T + (delta's bit i) * x .

兩邊乘上 1 2 4 8 16 ... (以及為了湊 additive share 讓 T 變號), 會得到 q = -t + x .<br>
這樣 q t 這兩個數字就是 x 的 additive shares.

也就是變成每送 k 個數字 (k * k bits), 就得到一組新的 triple.

這邊只有 initial phase 用真的 OT 來選取 seeds.<br>
後面用相對便宜的 PRF 來做出用 delta's bits 選取 t0 or t0 + x 的效果.

我覺得這種 OT extension 本身也有 Beaver triple 的風格:<br>
Sender 想: 我有 t0 t1, 我不知道你選了哪個. 但是我送材料給你, 讓你可以 "修正" 出我們想要的 t0 or t0 + x (且不洩漏 x).

----

to be continued
