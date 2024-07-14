# XOR

## Symbol

a XOR b : a ⊕ b

## Truth Table
```
a b a⊕b
0 0 0
0 1 1
1 0 1
1 1 0
```

## 相異

a 和 b 不同的時候就是 1, 相同的時候就是 0

a 和 b 相同的時候就是 0

a⊕b = (a != b) ? 1 : 0

## 交換 / 結合

a ⊕ b = b ⊕ a

(a ⊕ b) ⊕ c = a ⊕ (b ⊕ c)

## 奇數偶數

a ⊕ b ⊕ c 如果有奇數個 1 就是 1, 偶數個 1 就是 0

## ⊕ 0 等於沒做

a ⊕ 0 = a

## ⊕ 1 等於 Flip

a ⊕ 1 = NOT a

## 自己消掉

a ⊕ a = 0

## ⊕ b 兩次等於沒做

a ⊕ b ⊕ b = a

## 可以在等式左右互換

a ⊕ b = c

a = c ⊕ b

b = c ⊕ a

## 0, 1 上的加法 / 減法

a ⊕ b = (a + b) mod 2

a ⊕ b = (a - b) mod 2

## 和 AND 的分配率 (AND 是乘法)

a ∧ (b ⊕ c) = (a ∧ b) ⊕ (a ∧ c)

## One-time pad / Hiding

a: biased, non-uniform

b: uniform

a⊕b: uniform
```
a   b   a⊕b
0   0   0
0   1   1
1   0   1
1   0   1
1   1   0
1   1   0
```
P(a = 1 | a⊕b = 1) = P(a = 1)

P(b = 1 | a⊕b = 1) = P(b = 1)

## Selection

因為
```
a ⊕ 0 = a
a ⊕ 1 = NOT a
```
所以計算 a⊕b 也可以看成在 pair (a, NOT a) 中用 b 當 index 去選
```
b = 0 選中 a
b = 1 選中 NOT a
```

