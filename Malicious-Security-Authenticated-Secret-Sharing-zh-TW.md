# Malicious Secret Sharing - Authenticated Secret Sharing

(draft)

## BDOZ

我們設計一個 function
$$\text{MAC}_{K, \Delta}(x) = K + \Delta \cdot x$$

如果公布 $x$ 和 $\text{MAC}_{K, \Delta}(x)$, 會洩漏原來的 $K$ 或 $\Delta$ 嗎?

不會. 因為滿足這個式子的 $K$ 和 $\Delta$ 有非常多組, 且每一組的可能性都一樣. (information-theoretic MAC)

但是同一組 $K$ 和 $\Delta$ 如果拿來計算另一個 message $x'$ 的 MAC 的話, $\Delta$ 和 $K$ 都會洩漏.
```
m1 = MAC(K, D, x1)
m2 = MAC(K, D, x2)
Let cancel_K = m1 - m2
             = (K + D * x1) - (K + D * x2)
             = D * x1 - D * x2
             = D * (x1 - x2)
Multiply cancel_K with (x1 - x2)^-1 to get D.
```

但如果每次用不同的 $K$, 即便重複用一樣的 $\Delta$ 也不會洩漏.

全部用同樣的 $\Delta$ 還有 homomorpic 的效果.
```
m1 = MAC(K1, D, x1)
m2 = MAC(K2, D, x2) // different K, same D

m1 + m2 = (K1 + D * x1) + (K2 + D * x2)
        = (K1 + K2) + D * (x1 + x2)
        = MAC(K1+K2, D, x1+x2)
```



現在有 n 個 parties P1 P2 ... Pn.

另有一個假想出來的 trusted party T.
有個數字 x 只有 T 知道.
T 把 x 拆成 shares / keys / MACs "[x]", 交給 n 個 parties 之後, T 就離開了.

即便 T 不在, n parties 也可以進行 "open" 這個動作, 讓單一一個 party 或所有 parties 知道 x 的 value.
惡意的 party 無法造假, 因為會被 keys / MACs 的檢查揭露.

T 除了提供一些 random [r] 之外 (singles), 也提供一些 random 的 [r1] [r2] [r1*r2]. (Beaver triple)

如果 parties 手上有 [x] 和 [y], 則 parties 即便不知道 x y, 也可以計算 x + y 和 x * y 對應的 shares / keys / MACs [x+y] [x*y].
我們可以保持 x 和 y private, 然後要求公開 x + y 和 x * y. 惡意的 party 無法造假, 因為會被 keys / MACs 的檢查揭露.


用 [BDOZ](https://eprint.iacr.org/2010/514) 這篇的說法:
我們想做到的 MPC, 可以透過 Functionality F_AMPC 來達成. ("A"rithmatic MPC) (Fig. 6)
F_AMPC 可以透過 Protocol Pi_AMPC 來實作. (Fig. 7)
Pi_AMPC 又建立在 Functionality F_TRIP 之上. (Fig. 5)
我們可以分層去理解這個 protocol.

如果 F(x, y) = ((x * y) + x) * y, 想計算 f(1, 2) 大概會像這樣:
```
let var10 = 1  // only known by P1
let var20 = 2  // only known by P2
let var30 = var10 * var20  // secret
let var40 = var30 + var10  // secret
let var50 = var40 * var20  // open it
```

一個 honest party 每一步 + * 都會照著 protocol 來計算新的 value 的 keys.
雖然中間的 variables 沒有 open, 但最後 output 的 keys 應該能讓這個 party 偵測出其他 parties 是否有按照 protocol 來計算.

在 BDOZ 中, 任何兩個 party 之間要驗證訊息正確都需要一組 MAC / key. 所以每個 value 都需要額外 O(n^2) 的資料.

而 SPDZ 改善了這個情況.



在 semi-honest 的情況下, 每個 party 各自持有某個 variable 的 shares.
比方說 P1 P2 P3 持有以下的 additive shares:
```
var10  6
P1     2
P2     3
P3     1
```
當我們要 reconstruct 出 "var10 = 6" 的時候, 只要每個 party 把自己的 share 公開再相加就好.

但是在 malicious 的情境中, P2 怎麼知道當 P1 說 "我的 var10 的 share 是 2" 的時候, P1 的 share 就真的是 2 呢?

在 BDOZ 中, 每個 variable 除了拆成 shares 之外, 還對每個 variable 加上了 party 之間一對一的 key 與 MAC.

當 P1 要和 P2 說 "我的 var10 的 share 是 2" 的時候, 還要附上 var10 的 P1-to-P2 的 MAC. 而 P2 收到之後, 會用 var10 的 P1-to-P2 的 key 來 verify. 如果 P2 計算 `MAC(2, var10-key-P1-to-P2) = var10-MAC-P1-to-P2` 等式成立, 則 P2 願意相信 P1 沒有作弊.

```
var10  6   For sending                             For receiving
P1     2   var10-MAC-P1-to-P2 var10-MAC-P1-to-P3   var10-key-P2-to-P1 var10-key-P3-to-P1
P2     3   var10-MAC-P2-to-P1 var10-MAC-P2-to-P3   var10-key-P1-to-P2 var10-key-P3-to-P2
P3     1   var10-MAC-P3-to-P1 var10-MAC-P3-to-P2   var10-key-P1-to-P3 var10-key-P2-to-P3
```
所以當我們有 n 個 party 時, 對於每個 variable, 我們都要有 O(n^2) 個 key 和 MAC 來確保正確性.

這些 key / MAC 不僅對一個 value 的 shares 有效, 而且還要能隨著計算更新.
舉例來說, 如果 F(x, y) = ((x * y) + x) * y, 想計算 f(6, 4) 大概會像這樣:
```
let var10 = 6  // only known by P1
let var20 = 4  // only known by P2
let var30 = var10 * var20  // secret
let var40 = var30 + var10  // secret
let var50 = var40 * var20  // open it
```
一個 honest party 如果照著 protocol 計算出 var30 var40 var50 的 keys, 則每一步的 keys 都讓他能抵擋來自 dishonest party 的訊息.

## Offline / Online

和前面介紹的 Beaver triple 一樣, BDOZ 分成 offline 和 online 的 phases.

P1 P2 P3 先用 offline phase 的 protocol 製造出很多 "single"s 和 "triple"s. 這個過程和 online 的 input 無關, 甚至也和 online 要計算的 function 無關.

到 online phase 時, 先取來 2 組 singles, 讓它變成 input 的值 (var10 = 6, var20 = 4). 在乘法時取用 triples. 每一步都計算正確的 keys / MACs. 最後再 open output variable var50 並檢查正確性.

## SPDZ

BDOZ 中, n 個 party 一對一的互相 verify, 總共需要另外儲存 O(n^2) 個數字.

SPDZ 改成是所有 party 一起 verify. 每個 variable 每個 party 只要另存一個數字, 總共只要 O(n) 個數字.

最後 open 一個 variable 需要三個步驟: open shares / commit to diffs / open diffs. 這裡 dishonest party 很難讓假的 value 通過驗證. (等於要猜中 honest party 手中的 diff 才行)

我們也可以想成把 x * delta 從兩個方向拆開. 一個是拆 x, 一個是拆 delta. 然後合併 (x1 + x2 + x3) * delta 和 x * (d1 + d2 + d3) 應該要一樣. 但

SPDZ 的 paper 中用 somewhat homomorphic encryption (SHE) 的方式生成符合 SPDZ 格式的 shares. 後來 Keller et al. 提出了 MASCOT 來加速 offline phase. 之後 Keller et al. 又提出基於 SHE 的 Overdrive 來改進 offline phase. 實作可以參考 MP-SPDZ 的 [repository](https://github.com/data61/MP-SPDZ).

## A SPDZ Example

以下我們用 mod 7 的 field 為例.

SPDZ 中, 有一個 global 的 delta, 由每個 party 各持有一份 share.<br>
每個 party 只知道自己的 share, 但不知道 delta 是多少.<br>
假設 delta 是 6.<br>
P1 P2 P3 各持有 d1 = 2, d2 = 3, d3 = 1.

在每個 variable x 的 shares 中, 每個 party 另外持有一個 t = delta * x 的 share.<br>
每個 party 只知道自己的 share, 但不知道 x 和 t 是多少.

假設 x 是 2. 則 t = delta * x = 6 * 2 = 12 = 5 mod 7 .<br>
P1 P2 P3 各持有 x1 = 5, x2 = 1, x3 = 3 以及 t1 = 3, t2 = 5, t3 = 4 .

現在我們試著 reconstruct x.

每個 party 先 publish 自己的 x 的 shares: x1 = 5, x2 = 1, x3 = 3 .

每個 party 可以各自 reconstruct 出 x = (5 + 1 + 3) mod 7 = 2 mod 7 .

但是我們不知道有沒有人作弊.

所以接著要 P1 publish 手上的 d1 * x - t1 的 commitment.<br>
所以接著要 P2 publish 手上的 d2 * x - t2 的 commitment.<br>
所以接著要 P3 publish 手上的 d3 * x - t3 的 commitment.

我們觀察上面減號的兩邊. 左邊加在一起可以湊出 (d1+d2+d3) * x = delta * x, 右邊是湊出 t 也是 delta * x . 如果沒有人作弊的話, 這三個數字加起來應該是 0.

接著要三個 party open 這三個數字.
```
d1 * x - t1 = 2 * 2 - 3 = 1
d2 * x - t2 = 3 * 2 - 5 = 1
d3 * x - t3 = 1 * 2 - 4 = -2
```
加在一起的確是 0.

這三個數字不會洩漏 d1 d2 d3, 也不會洩漏 t1 t2 t3. 也都不會洩漏 delta.

先 commit 再 open 是怕最後一個人看到前面的數字才湊成 0. 先 commit 可以避免這個問題.

假設 P2 P3 共謀, 想要欺騙 P1 x 是 3. 但 P2 P3 完全不知道 d1 t1 是多少, 因此很難去 cancel 3 * d1 - t1 的值. 也就騙不了 P1.

## 計算

如果 P1 P2 P3 有著 [2].
```
     2   2 * 6
P1   5   3
P2   1   5
P3   3   4
```

我們希望可以作一些運算.

先看怎麼 "* c" . (c 是 public constant)
```
     2c   2c * 6
P1   5c   3c
P2   1c   5c
P3   3c   4c
```
這樣應該就讓 P1 P2 P3 持有 [2c] .

再看怎麼 "+ c" .
```
     2+c   (2+c) * 6
P1   5+c   3
P2   1     5
P3   3     4
```
