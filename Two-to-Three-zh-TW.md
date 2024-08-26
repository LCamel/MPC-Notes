# 從 2 人到 3 人

在前面的 Garbled Circuit 中, 我們看到了怎麼讓兩個 party 在不洩密的條件下計算任意的 function. (2PC)

如果我們有 3 個 party, 又要怎麼計算呢?

先看一個例子: A B C 三個人各有 private input a b c, 如何在不洩密的條件下, 求出 a + b + c ?

## Custom protocol

一種作法是: A 秘密地取一個 random number r, 加上自己的數字, 把 RA = r + a 秘密地傳給 B.

B 收到 RA, 加上自己的數字, 把 RAB = RA + b 秘密地傳給 C.

C 收到 RAB, 加上自己的數字, 把 RABC = RAB + c 秘密地傳給 A.

A 收到 RABC, 計算 RABC - r
```
RABC - r
= (RAB + c) - r
= (RA + b) + c - r
= (r + a) + b + c - r
= a + b + c
```

<img src="images/MPC-custom-1.png" alt="MPC-custom-1.png" class="to-be-resized">

## 再一個 custom protocol

我們用 additive secret sharing 來試看看.

每個人都秘密地把自己的 input 拆成三份, 使得
```
a = a1 + a2 + a3
b = b1 + b2 + b3
c = c1 + c2 + c3
```
A 把 a2 a3 秘密地分給 B C.<br>
B 把 b1 b3 秘密地分給 A C.<br>
C 把 c1 c2 秘密地分給 A B.

A 收到 b1 c1, 計算 ABC1 = a1 + b1 + c1, 公開給大家.<br>
B 收到 a2 c2, 計算 ABC2 = a2 + b2 + c2, 公開給大家.<br>
C 收到 a3 b3, 計算 ABC3 = a3 + b3 + c3, 公開給大家.

每個人計算 ABC1 + ABC2 + ABC3 就能 "reconstruct" 出 a + b + c .

(想想看, 如果你是 A, 手上會有哪些資訊? 有沒有辦法推導出別人的資訊呢?)

<img src="images/MPC-custom-2.png" alt="MPC-custom-2.png" class="to-be-resized">


在這個例子中有我們看到了兩種加法.<br>
一種是要計算的 function, 也就是題目本身 a + b + c 的加法.<br>
另一個是做 secret sharing 拆開/合併時用的加法.<br>
在後面我們可以看到別種 secret sharing 的方式. 也會重複看到這種 "拆開/計算/合併" 的 3 步驟的手法.

接下來, 我們來看可以處理一般性問題的, 多於兩個 party 的 protocol: GMW.

----
參考資料:

<a href="https://www.youtube.com/watch?v=XA_4dzs1Zys#t=11m22s">
Secure Multi Party Computation part 1- The BGW Protocol - Gilad Asharov<br>
<img src="images/Two-To-Three-ref1.png" class="to-be-resized">
</a>

<a href="https://www.youtube.com/watch?v=Li2QJ8yImoY#t=2m20s">
January 2021 CACM, Secure Mulitparty Computation<br>
<img src="images/Two-To-Three-ref2.png" class="to-be-resized">
</a>

<script>
function resizeImg(i) { i.style.width = (i.naturalWidth * 0.25) + "px"; }
function resizeAllImg() { document.querySelectorAll(".to-be-resized").forEach(resizeImg); }
window.addEventListener("load", resizeAllImg);
</script>