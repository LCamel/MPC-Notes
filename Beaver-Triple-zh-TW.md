# Beaver's Triple

我們在 BGW 中看到: 當 parties 遇到乘法 gate 時, 每個人都要和其他所有人秘密傳送自己的 random polynomial 的 shares. 溝通成本高.

Beaver's Triple 是一種技巧, 讓 parties 可以在真正的 input 來之前 offline 做一些 preprocessing. 這樣拿到真的 input 時 online 的計算就可以比較簡單.

## 假設

(先不管怎麼做到的) 一個 Beaver's triple 是:
- 讓 parties 持有 a b c 三個數字的 shares [a] [b] [c]. 其中 a b 是 random number, 而 c = a * b.
- 沒有任何 party 知道 a b c 的值.

我們假設 secret sharing scheme 有以下的性質:
1. 如果大家持有 [p] [q], 則透過各自的運算, 可以讓大家持有 [p+q]
2. 如果大家持有 [p], 給一個公開的 constant r, 則透過各自的運算, 可以讓大家持有 [rp]
3. 如果大家持有 [p], 給一個公開的 constant r, 則透過各自的運算, 可以讓大家持有 [r+p]

(請參考 [Shamir's secret sharing](./Shamir-Secret-Sharing-zh-TW.md) 一文)

我們假設有便宜的 broadcast 方式.

## 實作

我們來看上面的這些假設如何幫助我們計算乘法 gate.

Offline 大家先拿到 [a] [b] [c].
現在 online 大家拿到 [x] [y], 想要讓大家持有 [xy].

我們先讓每個 party 共同求出 e = x - a 和 d = y - b 兩個公開數字.
怎麼做到呢?
大家透過手上的 [x] [a] 可以得到 [x - a] 也就是 [e].
大家透過手上的 [y] [b] 可以得到 [y - b] 也就是 [d].
大家透過 broadcast 公布各自的 [e] [d] 的 shares 給所有人.
每個人都能 reconstruct 出 e d 兩個數字.

以 Shamir secret sharing 為例.
假設 A 手上的 shares 為 a1, b1, c1, x1, y1.
則 A broadcast 出 e1 = x1 - a1 和 d1 = y1 - b1 兩個數字.
每個人都送出兩個 diff 後, 每個人都能從 shares reconstruct 出 e d 兩個數字.

再來我們先粗略的列式(不管意義)
```
[xy] = [(e + a)(d + b)]
     = [ed + eb + ad + ab]
     = [ed] + [eb] + [ad] + [ab]
     = ed + e[b] + d[a] + [ab]
```
然後反過來做.
因為一開始大家有拿到 [c], 而已知 c = ab, 所以大家不用算就有 [ab].
前面有 reconstruct 出兩個數字 e d, e*d 現在是公開的數字了. 所以大家各自運算後, 可以持有 [ed + ab] (性質 3)
因為一開始大家有拿到 [a], 而現在 d 是公開的數字了, 所以大家各自運算後, 可以持有 [ad] (性質 2)
因為一開始大家有拿到 [b], 而現在 e 是公開的數字了, 所以大家各自運算後, 可以持有 [eb] (性質 2)
有了上面三份 shares, 大家經過各自運算後, 可以持有 [ed + eb + ad + ab]. 也就是 [xy] (兩次性質 1)

也就是說, 每個人 broadcast 兩個數字算出 e d 之後, 剩下只要 local 計算就能得到 [xy] 了.


https://www.youtube.com/watch?v=N80DV3Brds0