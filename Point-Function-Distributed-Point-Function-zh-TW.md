# Point Function / Distributed Point Function

## Point Function

Point Function 是整個 domain 只有一個點的 value 不是 0 的 function.

```
y 0 0 0 0 0 2 0 0
x 0 1 2 3 4 5 6 7
```
在 x = 5 的這個點, f(x) = 2. 在其他點為 0. (想像一下圖形)

## Distributed Point Function

每個 party 各拿著一個 share.<br>
幾個 share 合起來可以得到一個 point function.

舉例來說, 假設有如下的 point function f:
```
y  00  00  00  00  00  10  00  00
x  0   1   2   3   4   5   6   7
```
我們試著用某種 secret sharing 的方式 把 f 拆開, 比方說 XOR.

先在同 domain 取一個 random 的 function f1.
```
y  01  11  00  10  10  11  00  01
x  0   1   2   3   4   5   6   7
```

找出 f2 使得 f1 ⊕ f2 = f (by letting f2 = f ⊕ f1)
```
y  01  11  00  10  10  01  00  01
x  0   1   2   3   4   5   6   7
```

如果把 f1 f2 的 table 交給兩個 party, 則可以期待 f1(x) ⊕ f2(x) = f(x) for all x.

這兩個 party 各自看著手上的 table, 不會知道原本只有在 5 這個點有一個不為 0 的 value "10".

## A 2-Server Secure Keyword Search Protocol

現在有一個 set `S = {x1, x2, ... , xn}`, 複製完整的兩份給 party P1 P2.<br>
來了一個 user.<br>
User 想問: 我的 x 在 S 裡面嗎?<br>
但 user 不想讓 P1 P2 知道 x 的值.

假設 S 包含在 [0, 7] 裡面.<br>
假設 user 想查的 x 為 5.

於是 user 做出 domain 為 0 到 7 的上面兩個 function f1 f2 交給 P1 P2.<br>
只拿到 f1 f2 的其中一個的話不會洩漏 x = 5, 也不會洩漏 f(5) = "10".

User 要求兩個 party 都把所有 f(x) XOR 出來的數字交回來. User 再計算這兩個數字 XOR 的結果.

假設 S = { 3, 5, 7 }
```
P1: f1(3) ⊕ f1(5) ⊕ f1(7) = 10 ⊕ 11 ⊕ 01
P2: f2(3) ⊕ f2(5) ⊕ f2(7) = 10 ⊕ 01 ⊕ 01

⊕                          
     f(3) ⊕  f(5) ⊕  f(7) = 00 ⊕ 10 ⊕ 00
```
這兩個數字 XOR 起來會得到 "10" = f(5) != "00". 所以 5 在 S 裡面.

假設 S = { 3, 4, 7 }
```
P1: f1(3) ⊕ f1(4) ⊕ f1(7) = 10 ⊕ 10 ⊕ 01
P2: f2(3) ⊕ f2(4) ⊕ f2(7) = 10 ⊕ 10 ⊕ 01

⊕                          
     f(3) ⊕  f(4) ⊕  f(7) = 00 ⊕ 00 ⊕ 00
```
這兩個數字 XOR 起來會得到 "00". 所以 5 不在 S 裡面.

## 效率

上述的方法雖然做出了一個 distributed point function, 但 table 的大小和 function domain 之間是 linear 的關係, domain 一大就會無法使用. 我們需要更有效率的作法.


----

## 參考資料

[Distributed Point Functions and their Applications](https://www.iacr.org/archive/eurocrypt2014/84410245/84410245.pdf)