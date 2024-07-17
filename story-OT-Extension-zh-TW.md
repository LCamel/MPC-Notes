# OT Extension (IKNP)

Bob: Hi Alice.

Alice: Hi Bob. 今天想討論什麼嗎?

Bob: 上次在 Garbled Circuit 那邊看到 Oblivious Transfer 之後, 我又找了一下資料. 看到一個有趣的東西叫做 IKNP 的 OT Extension, 想找你討論看看.

Alice: 好啊, 我也查一下資料.

(Twelve Seconds Later)

Alice: 好了. 你還記得上次和 TBot 討論的 OT 嗎?

Bob: 記得啊. 就是你有兩個 message, 我選 0 就看到 message0, 我選 1 就看到 message1. 但是我看不到你的另一個 message, 你也不知道我選了哪個 message 來看.
![alt text](image-1.png)

Alice: 那你覺得 OT Extension 在做什麼呢?

Bob: 如果今天你有 100 萬組訊息要讓我挑, 那我們就得進行 100 萬次 OT, 成本比較高.

有幾個叫 IKNP 的人就想: 有沒有可能只做比方說 1000 次 OT, 再加上一些設計, 就能達到本來的 100 萬次 OT 的效果呢?

Alice: 嗯嗯. 我覺得 IKNP 的方法很簡潔. 就像這樣:
![alt text](image.png)

Bob: 這有點太簡潔了 😅 我們來扮演一下裡面的角色, 確認一下理解怎麼樣?

Alice: 好. 我當 Alice, 你當 Bob. 呃不是. 我當 Sender, 你當 Receiver.

Bob: OK. 我們先不看 100 萬組訊息, 先只看一組訊息.

作為 receiver, 我用一個秘密的 bit r 代表我想拿哪個訊息. 而 T 代表我生出的一個 random bit string.

如果我有辦法
- 用 r 來控制 T 出現在你那邊的位置 0 還是位置 1 上面
- 且另外一個空位放上我不知道的 bit string

那就可以拿來做 OT 了: 只要你把 message 用對應的 bit string 加密送給我, 我就只能唯一解出那個用 T 加密的 -- 也就是 r 指到的那個 message 了.
![alt text](image-2.png)

Alice: 我們再更簡化一點, 先把 T 縮到只有一個 bit 來看.

作為 sender, 我生出一個秘密的 random bit s.

因為 s 只有我知道, 所以 T⊕s 的值你不會知道. 放在另外一個空位來加密 message 的話, 你是解不開的.

![alt text](image-3.png)

我們觀察上下兩格的關係: 如果上面那格叫做 q, 那下面那格一定是 q⊕s .

![alt text](image-4.png)

也就是說, 我們可以把問題轉成: 專心看 q, 看要怎麼用 r 控制 q 那格出現 T 還是 T⊕s . 而下面那格只要 ⊕s 就好了.

![alt text](image-5.png)

Bob: 整理一下: 我們剛剛從 100 萬組 message 縮到一組, 從兩個 bit string 縮到兩個 bit, 再聚焦在上面那個 bit q 如何被 r 控制成 T 或 T⊕s .

但是話又說回來, 我的 r 和 T 不能讓你知道, 你的 s 也不能讓我知道.

Alice: 嗯嗯, 雖然我手上可能拿著 T 或 T⊕s, 但是對我來說都只是個 random bit, 分不出來現在是哪個 case.

Bob: 要是分的出來, 就會被你知道現在 r 是 0 還是 1 了 😅

那到底要怎麼在我不知道 s, 你不知道 r 的情況下, 達成:
```
q = T   if r = 0
q = T⊕s if r = 1
```
這是怎麼做到的呢? 就是用...

Alice: 等你說

Bob: 一起說...

Alice, Bob: 反向 OT !

Alice: 這樣有點羞恥. 回到反向 OT.

Bob: 反向 OT.

不論 r 是 0 還是 1, 我都準備兩個箱子讓你用 s 選, 只是箱子的內容會隨著 r 而變.

先看 case r = 0: 我準備兩個箱子, 裡面都是 T.

Alice: 我用 s 選, 不管選 0 選 1, 因為內容一樣, 所以一定都選到 T.

Bob: 再看 case r = 1: 我準備兩個箱子, 一個是 T, 一個是 NOT T .

Alice: 因為單獨從 XOR 的性質看, ⊕ 0 不動, ⊕ 1 flip, T⊕s 可以看成
```
T   s   T⊕s
T   0   T
T   1   NOT T
```
也可以看成: 用箱子裝好 T 和 NOT T, 0 選上面 1 選下面, 用選的結果和用算的 T⊕s 是一樣的.

Bob: 或者說, 用 s 選 T 或 NOT T, 也就是用 s 查表, 也就是計算 T⊕s .

Alice: 也能看成我們用 OT 進行了小型的 MPC, 讓我計算了 q = T⊕s .

你在不知道 s 的狀況下, 替 s = 0 和 s = 1 分別計算了 T⊕s 放在對的位子上, 所以我用 s 去選就能選到/算出了對的 T⊕s .

Bob: 所以不論 r = 0 或 r = 1, 你都是用 s 來從我這邊 OT 一個值.

只是我會隨著 r 而放入 (T, T) 或者是 (T, T⊕s) . 或者也可以看成總是 (T, T⊕r)

Alice: 就像我去店家挑 blind box. 表面上是我做了選擇, 但是袋子裡面裝什麼其實已經先有店家的選擇在裡面了.

Bob: 嗯嗯. 再來我們一步一步把簡化了的步驟加回去.

Alice: 我這邊反向 OT 完之後, 把結果 ⊕s 放下面那格. 所以一定是 (T, T⊕s) 或是 (T⊕s, T). T 會在 r 指的那一格.

Bob: 我把 bit T 恢復成 bit string T. 也就是我 random 比方說 1000 個 bit, 都用同一個 r 做出第二個箱子, 總共 2000  個箱子.

Alice: 我也製造 1000 個 random bit s, 在你的兩個箱子間做 OT, 做 1000 次. 結果像這樣.

~~~圖~~~

Bob: 如果你用這兩個 bit strings 加密 message 給我, 我會解的開 r 所指的那個. 不過這樣我們只 OT 了一組 message.

Alice: 而我們其實想 OT 100 萬組 message.

Bob: 所以這邊要把箱子拉很高. 我們還是只做 1000 次 OT, 但每次 OT 得到不是 1 個 bit, 而是 100 萬個 bit. 像這樣.







先看 r = 0 的 case.

我準備兩個箱子, 讓你用 bit s 做 OT 選其中一個箱子.

如果我兩個箱子都放 T, 那不管你選 0 還是選 1, 你拿到的都是 T. 也就是 `q = T if r = 0`.

再看比較複雜的 r = 1 的 case.

我準備兩個箱子, 讓你用 bit s 做 OT 選其中一個箱子.

如果我第 0 個箱子放 T, 但第二個箱子放 NOT T 的話, 你選出來的結果剛好可以表示成 T⊕s !

觀察 XOR 的性質, 我們知道 ⊕0 等於沒做, ⊕1 則是 flip.
```
```




我們讓位置 0 1 出現

Bob: 嗯嗯. 我覺得最妙的地方就是到底這兩個 bit strings 是怎麼根據 r 造出來的.

我們也先不看整個 bit string, 先只看一個 bit 就好了.

這邊要做一個反向的 OT, 我準備兩個 bits, 讓你來選一個 bit.

Alice: 好. 我是 sender, 那我的選擇變數就叫 s 好了.
我用變數 s 從你準備的兩個 bit 中挑一個. 那你要準備什麼讓我挑呢?

Bob: 我準備兩個 bit
```
t
t + r
```
其中前面的 t 是隨機的 bit, 而 t + r 則是計算出來的.

Alice: 這就像