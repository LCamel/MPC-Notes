# Point Function / Distributed Point Function

## Point Function

Point Function 是整個 domain 只有一個點的 value 不是 0 的 function.

```
y 0 0 0 0 0 2 0 0
x 0 1 2 3 4 5 6 7
```
在 x = 5 的這個點, f(x) = 2. 在其他點為 0. (想像一下圖形)

比較常用的是只有一個點的 value 是 1 的 point function.

## Distributed Point Function

每個 party 各拿著一個 share.<br>
幾個 share 合起來可以得到一個 point function.

舉例來說, 假設有如下的只有 f(5) = 1 的 point function f:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
我們試著用某種 secret sharing 的方式 把 f 拆開, 比方說 XOR.

先在同 domain 取一個 random 的 function f0.
```
y 1 1 0 1 0 0 1 0
x 0 1 2 3 4 5 6 7
```

找出 f1 使得 f0 ⊕ f1 = f (by letting f1 = f ⊕ f0)
```
y 1 1 0 1 0 1 1 0
x 0 1 2 3 4 5 6 7
```

如果把 f0 f1 的 table 交給兩個 party, 則可以期待 f0(x) ⊕ f1(x) = f(x) for all x.

這兩個 party 各自看著手上的 table, 不會知道原本只有 f(5) 是 1.

## A 2-Server Secure Keyword Search Protocol

現在有一個 set `S = {x1, x2, ... , xn}`, 複製完整的兩份給 party P0 P1.<br>
來了一個 user.<br>
User 想問: 我的 x 在 S 裡面嗎?<br>
但 user 不想讓 P0 P1 知道 x 的值.

假設 S 包含在 [0, 7] 裡面.<br>
假設 user 想查的 x 為 5.

User 想: 我先設計一個這樣的 f:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
如果我們計算
```
f(x1) ⊕ f(x2) ⊕ ... ⊕ f(xn)
```
那麼只有當 5 在 S 裡面的話才會是 1.

舉例來說, 如果 S = { 3, 5, 7 }, map 過去會是 0 1 0. 因為 5 在裡面, 所以加起來結果才是 1.

於是 user 做出如上一節中的兩個 function f0 f1 交給 P0 P1.<br>
只拿到 f0 f1 的其中一個的話不會洩漏 f(5) = 1 .

User 要求兩個 party 都把所有 f(x) XOR 出來的數字交回來. User 再計算這兩個數字 XOR 的結果.

假設 S = { 3, 5, 7 }
```
P0: f0(3) ⊕ f0(5) ⊕ f0(7) = 1 ⊕ 0 ⊕ 0 = 1
P1: f1(3) ⊕ f1(5) ⊕ f1(7) = 1 ⊕ 1 ⊕ 0 = 0

⊕                          
     f(3) ⊕  f(5) ⊕  f(7) = 0 ⊕ 1 ⊕ 0 = 1
```
這兩個數字 XOR 起來會得到 1 = f(5) != 0. 所以 5 在 S 裡面.

假設 S = { 3, 4, 7 }
```
P0: f0(3) ⊕ f0(4) ⊕ f0(7) = 1 ⊕ 0 ⊕ 0 = 1
P1: f1(3) ⊕ f1(4) ⊕ f1(7) = 1 ⊕ 0 ⊕ 0 = 1

⊕                          
     f(3) ⊕  f(4) ⊕  f(7) = 0 ⊕ 0 ⊕ 0 = 0
```
這兩個數字 XOR 起來會得到 0. 所以 5 不在 S 裡面.

## Additive Sharing

在上面的例子中, 我們有六個 f1 f2 的 values.<br>
因為我們用的是 XOR 這種 additive sharing, 所以把這些 value "先直的-再橫的" 和 "先橫的-再直的" 加起來, 結果是一樣的.

## A 2-Server Private Information Retrieval (PIR) Protocol

現在有一個 8 個 bit 的 database D = { b0, b1, ... , b7 }.<br>
兩個 server P0 P1 各持有完全相同的 copy.

User 想問: 第 i 個 bit 是多少?<br>
但 user 不想讓 P0 P1 知道 i 的值.

假設現在 user 想知道 b5 的值.

User 想: 我先設計一個這樣的 f:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
如果我們計算
```
b0 * f(0)  +  b1 * f(1)  +  ...  +  b7 * f(7)
```
那麼除了第 5 個以外的 bits 都會消掉. 只會留下 b5.

於是 user 把這樣的 f 拆成 f0 f1, 分別交給 P0 P1.<br>
P0 P1 分別把相乘再加在一起的結果傳回給 user.<br>
User 再把兩個數字加起來就會得到 b5.

```
P0:  b0 * f0(0)  +  b1 * f0(1)  +  ...  +  b7 * f0(7)
P1:  b0 * f1(0)  +  b1 * f1(1)  +  ...  +  b7 * f1(7)

+

b0 * f0(0) + b0 * f1(0)
= b0 * (f0(0) + f1(0)) = b0 * f(0) = b0 * 0 = 0

b5 * f0(5) + b5 * f1(5)
= b5 * (f0(5) + f1(5)) = b5 * f(5) = b5 * 1 = b5
```

## 效率

上述的方法雖然做出了一個 distributed point function, 但 table 的大小和 function domain 之間是 linear 的關係, domain 一大就會無法使用. 我們需要更有效率的作法.


----

## 參考資料

[Distributed Point Functions and their Applications](https://www.iacr.org/archive/eurocrypt2014/84410245/84410245.pdf)