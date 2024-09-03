# Beaver Triple

我們在 BGW 中看到: 當 parties 遇到乘法 gate 時, 每個人都要和其他所有人秘密傳送自己的 random polynomial 的 shares. 溝通成本高.

Beaver Triple 是一種技巧, 讓 parties 可以在真正的 input 來之前 offline 做一些 preprocessing. 這樣拿到真的 input 時 online 的計算就可以比較簡單.

(註: offline 不是指 party 間不用互傳訊息, 而是指還不知道 input 就先作處理)

以下我們用的是 Shamir's secret sharing. [(請參考前文)](./Shamir-Secret-Sharing-zh-TW.md)

## 假設

(先不管怎麼做到的) 一個 Beaver triple 是:
- 讓 parties 持有 a b c 三個數字的 shares [a] [b] [c]. 其中 a b 是 random number, 而 c = a * b.
- 沒有任何 party 知道 a b c 的值.

我們假設有便宜的 broadcast 方式.

## 實作

我們來看上面的這些假設如何幫助我們計算乘法 gate.

Offline 大家先拿到 [a] [b] [c].
現在 online 大家拿到 [x] [y], 想要讓大家持有 [xy].

```
a   *   b   =  c  (offline)
+       +
d       e         (online, broadcast)
=       =
x   *   y   =  ?  (online, local)
```
我們先讓每個 party 共同求出 d = x - a 和 e = y - b 兩個公開數字.
怎麼做到呢?
大家用手上的 [x] [a] 可以得到 [x - a] 也就是 [d].
大家用手上的 [y] [b] 可以得到 [y - b] 也就是 [e].
大家透過 broadcast 公布各自的 [d] [e] 的 shares 給所有人.
每個人都能 reconstruct 出 d e 兩個數字.

假設 A 手上的 shares 為 a1, b1, c1, x1, y1.
則 A broadcast 出 d1 = x1 - a1 和 e1 = y1 - b1 兩個數字.
每個人都送出兩個 delta 後, 每個人都能從 shares reconstruct 出 d e 兩個數字.

再來我們粗略的列式
```
[xy] = [(a + d)(b + e)]
     = [ab + ae + db + de]
     <= [ab] + [ae] + [db] + [de]
     <= [c] + e[a] + d[b] + de
              ~~~~~~~~~~~~~~~~ correction term
```
然後反過來做. 就可以從最下面的算式組回算式最上面的 [xy].<br>
[(請參考前文)](./Shamir-Secret-Sharing-zh-TW.md#from-a-b-c-d-p-q-r-s-to-ap--bq--cr--ds)

也就是說, 每個人 broadcast 兩個數字, 算出 d e 之後, 剩下只要 local 計算就能得到 [xy] 了.

## 加速 BGW

前文中, BGW 在處理 "*" gate 時, 需要所有 party 兩兩透過 private channel 傳訊.

如果用 Beaver Triple 的話, 遇到 "*" gate 就只需要 broadcast.

每個 "*" gate 會用掉一組 Beaver Triple, 不能重用. 所以要事先準備很多組.

## 總結

Offline 時我們準備一些和 input 完全無關的, 用 random 算出的 shares.

Online 時 input 來了, 我們再去修正誤差.

由於 correction term `e[a] + d[b] + de` 的計算相對便宜, 所以 online 的成本就大幅降低了.

至於怎麼有效率的大量製造 Beaver Triple, 要看其他的參考資料.
