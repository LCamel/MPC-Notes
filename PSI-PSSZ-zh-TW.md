# PSI by PSSZ

書中 3.8.1 介紹了 Pinkas-Schneider-Segev-Zohner (PSSZ) 在 2015 提出的, 也是用 OPRF 做出 PSI 的方法.

(請先看[上一篇](./PSI-PSSZ-zh-TW.md))

## Cuckoo Hashing

一開始 Cuckoo hashing 是 Pagh and Rodler 在 2004 提出的. 有兩個 hash function.

PSSZ 用的是 Kirsch-Mitzenmacher-Wieder (KMW) 2009 修改過的版本. PSSZ 用了三個 hash function, 以及有 stash.

大致的想法是:

我們有 n 個 item 想放進 b 個 bin 裡面. 每個 bin 只能放 1 個 item.<br>
另外有大小為 s 的 stash 用來處理不容易放在 bin 裡的 item.<br>
有 hash function h1 h2 h3 把 item mapping 到 bin.

如果 item x 來了, 這個 item 可能的位置有: h1(x) h2(x) h3(x) 的 bin 和 stash. 不會在別的地方.<br>
優先看 hash 的三個 bin 有沒有空位. 有空位就放進去.<br>
沒空位就從這三個位置 random 踢走一個 item, 放進這個空位.<br>
被踢走的 item 再重複上面的程序.<br>
如果太多 iteration 都還沒找到空位, KMW 的版本就會把 item 放到 stash. (以前沒 stash 的版本會用比較貴的 rehash 來處理這個問題)

通常 stash 是一個 constant size 的區域.<br>
Stash 也有可能滿. (failure)<br>
KMW 的 Theorem 2.1 主張, stash 滿的機率小於 O(n^(-s)) . Stash 夠大, 機率就很小.

## PSI

假設 Receiver 把自己的 Y 塞進了 bins 和 stash 中, 空白補 dummy.

再來和前面介紹的方法不同的是: 每個位置現在用不同的 key 來算 PRF / OPRF. 假設這個 function 為 F.

先是 Receiver 拿對應位置的 item y 和 Sender 算 OPRF F.

而 Sender 不做完整的 Cuckoo hashing, 而是根據上面的性質: "可能的位置有: h1(x) h2(x) h3(x) 的 bin 和 stash. 不會在別的地方."

所以 Sender 用三個可能的 bin 位置的 key 和 x 算 PRF F, 也對 stash 的每個位置算 x 的 PRF F.<br>
再把所有這些值丟給 Receiver 去比對.<br>
Hash 值一樣就代表 item 在兩邊都有. (如果沒有更多不同 key 的 collision 造成的 false positive 的話)

舉例來說, 假設有個 item 的值是 42.<br>
h1(42) = 10<br>
h2(42) = 20<br>
h3(42) = 30<br>
stash 有 2 個位置.

假設 42 在 Receiver 端放在位置 20.

如果 Sender 也有 42, 則 Sender 就會送
```
F(key10, 42)
F(key20, 42)
F(key30, 42)
F(keyStash1, 42)
F(keyStash2, 42)
```
這樣的 5 個值給 Receiver.

而 Receiver 在算每個 bin 和 stash 的 OPRF 時會算到 F(key20, 42), 所以 Receiver 知道 42 是兩邊都有的 item.

## More efficient OPRF from 1-out-of-∞ OT

前面的 PSI 的作法的成本主要還是在 OPRF 上.

TODO: 書中 Kolesnikov 等人在 2016 提出了一個效率比較好的 OPRF 作法, 所以整個 PSI 的效率就比較好. 不過這邊我還沒看懂.









