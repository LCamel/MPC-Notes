# OT Extension

Bob: Hi Alice.

Alice: Hi Bob. 今天想討論什麼嗎?

Bob: 上次在 Garbled Circuit 那邊看到 Oblivious Transfer 之後, 我又找了一下資料. 看到一個有趣的東西叫做 OT Extension. 如果你有空的話, 想找你討論看看.

Alice: 好啊. 你還記得上次和 TBot 討論的 OT 嗎?

Bob: 記得啊. 就是你有兩個 message, 我選 0 就看到 message0, 我選 1 就看到 message1. 但是我看不到你的另一個 message, 你也不知道我選了哪個 message 來看.
![alt text](image-1.png)

Alice: 哪你覺得 OT 

Bob: 上次我們在討論 Garbled Circuit 的時候, 不是講到 2-out-of-1 OT 嗎?

Alice: 嗯嗯, 就是我有兩個一組的 message, 你可以從其中挑一個. 你看不到我的另一個 message, 我也不知道你挑了哪一個.

Bob: 我們上次 OT 是用 public key 的作法. 如果今天你有 100 萬組訊息要讓我挑, 那我們就得進行 100 萬次 OT, 成本比較高. 有幾個叫 IKNP 的人就想: 有沒有可能只做比方說 1000 次 OT, 再加上一些設計, 就能完成本來的 100 萬次 OT 的效果呢?

Alice: 嗯嗯. 從我查到的資料來看, 我覺得 IKNP 的方法很簡潔. 就像這樣
![alt text](image.png)

Bob: 是很 "簡潔" 沒錯啦... 我們來扮演一下裡面的角色, 確認一下理解怎麼樣?

Alice: 好. 我當 Sender, 你當 Receiver.

我們先不看 100 萬組, 先看一組訊息就好.

Bob: 嗯嗯. 我用一個 bit r 代表我想拿哪個訊息.

如果有一個方法, 可以根據我手上的 r 在你那邊生出兩個 bit strings, 一個我知道一個我不知道, 就可以拿來做 OT 了.

比方說, 如果我手上是 0, 而想辦法讓你手上有
```
a_string_that_bob_knowns
a_string_that_bob_does_not_known
```

那只要你拿這兩個字串來把 message0 和 message1 裝箱送給我, 我就只能解出 message0 了.
```
Encrypt(a_string_that_bob_knowns,         message0)
Encrypt(a_string_that_bob_does_not_known, message1)
```

Alice: 或者當你手上的 r 是 1, 則想辦法讓我這邊有反過來的
```
a_string_that_bob_does_not_known
a_string_that_bob_knowns
```
那我送兩個加密的結果給你, 你就只能解出 r = 1 所選到的 message1 了.

而且不管 r 是 0 還是 1, 這個過程必須讓我分不出現在是 r = 0 還是 r = 1 的 case.

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