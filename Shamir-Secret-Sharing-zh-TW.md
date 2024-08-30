# Shamir's Secret Sharing

現在有 A B C 三個 party.

前面我們看過其他的 additive secret sharing scheme, 像:
```
secret = a1 + a2 + a3

secret = a1 ⊕ a2 ⊕ a3
```

而 Shamir's secret sharing 則是用通過 (0, secret) 的多項式上的一些點來表示.

## 拆開

先給定每個 party 一個固定的 x 值. 比方說 A: 1, B: 2, C: 3.

如果 secret 是 p, 則我們找一個通過 (0, p) 的多項式 P, 再代入 1 2 3:
```
p = P(0)   let p1 = P(1)   let p2 = P(2)   let p3 = P(3)

           for party A     for party B     for party C
```

我們用 `[]` 的符號來代表一組 shares. 這邊 [p] = (p1, p2, p3) .

## 合併

我們先用 Lagrange polynomial interpolation 從 p1 p2 p3 重建回 P:

$$P(x) = \frac{(x - 2)(x - 3)}{(1 - 2)(1 - 3)} p1 + \frac{(x - 3)(x - 1)}{(2 - 3)(2 - 1)} p2 + \frac{(x - 1)(x - 2)}{(3 - 1)(3 - 2)} p3$$

再把 x = 0 代入, 得

$$p = P(0) = 3 p1 + (-3) p2 + 1 p3$$

因為我們只對 x = 0 的 P(x) 有興趣, 所以可以先算出 (3, -3, 1). 這只和我們選取的 x = 1 2 3 有關, 和 p1 p2 p3 無關.

<mark>也就是說, 從 p1 p2 p3 重建 secret p 可以是簡單的 weighted sum 計算. (或說 linear combination)</mark>

<video src="images/Shamir-weighted-sum.mp4" controls autoplay="true" muted loop></video><br>
[[geogebra]](https://www.geogebra.org/calculator/a55ddkcg)

## 不一定會用到的性質

由於我們選擇 secret 在 x = 0 的位置上, 所以 p = P(0) = 多項式 P 的常數項.

## Degree

不同於前面的 additive sharing, Shamir's secret sharing 需要多考慮一個參數, 就是 polynomial 的 degree.

以 deg() = 2 的曲線為例. 3 個點可以決定 2 次曲線. 所以洩漏 2 個點沒有關係, 洩漏 3 個點就洩漏 secret 了.

如果我們用 threshold t 來表示 "最多有 t 個壞人也不會洩密", 那上面例子的 t 就是 2. 和 degree 一樣.

這樣說來, degree 高比較不容易洩密, 那 degree 不是越高越好嗎?

但是 degree 也不是要多高就能多高. 因為一個人只能拿一份 share (也就是一個點), 所以過程中多項式的 degree 都受到這個限制.

像 3 個 party 就只能決定 2 次曲線. 3 次曲線就不行了.

接著我們來看設計 protocol 時會用到的一些操作.

## 從 c, [p] 到 [c * p]

如果現在 A B C 手上有一份 [p] 的 shares. 又都拿到一個 constant c.

我們可以讓 A B C 手上拿到一份 [c * p] 的 shares 嗎?

可以.

只要每個 party 把手上的 share 乘上 c, 這份新的 shares (c * p1, c * p2, c * p3) 就是一份 [c * p] 的 shares.
(請自行用多項式 c * P 來證明)

這個過程中, A B C 都不需要互相溝通. 也不需要知道 p 的值.

## 從 [p] [q] 到 [p + q]

現在 A B C 手上有 [p] 和 [q] 的 shares.

我們可以讓 A B C 手上拿到一份 [p + q] 的 shares 嗎?

可以.

只要每個 party 把手上的兩個數字相加, 這份新的 shares (p1 + q1, p2 + q2, p3 + q3) 就是一份 [p + q] 的 shares.
(請自行用多項式 P + Q 來證明)

這個過程中, A B C 都不需要互相溝通. 也不需要知道 p q 的值.

## 從 a b c d [p] [q] [r] [s] 到 [ap + bq + cr + ds]

現在 A B C 手上有 [p] [q] [r] [s] 的 shares, 也都拿到數字 a b c d.

我們可以讓 A B C 手上拿到一份 [ap + bq + cr + ds] 的 shares 嗎?

可以.

只要重複使用上面兩個性質就能做到.
(或考慮 aP + bQ + cR + dS 這個多項式)

這個過程中, A B C 都不需要互相溝通. 也不需要知道 p q r s 的值.

<mark>也就是說, 我們設計 protocol 時, 可以要求 parties 計算 shares 的 weighted sum. (或說 linear combination)</mark>

而且因為不用互相溝通, 所以這個計算很便宜.

## Degree (again)

上面的三個計算 [c * p] [p + q] [ap + bq + cr + ds] 都不會提高穿過 shares 的多項式所需的 degree.

比方說, 如果穿過 [p] [q] 的兩個多項式的 degree 皆為 1, 則穿過算出來的 [p+q] 的多項式的 degree 也只需要 1. 不需要用二次曲線.

## 下一步

接著我們來看 BGW protocol 怎麼運用 Shamir's secret sharing.

----
## 後記

本來 Lagrange interpolation 的式子比較複雜, 但在選定 x = 0 1 2 3 之後, 一下子變成簡單的 weighted sum. 這點和中國餘式定理是一樣的. (兩個作法本來就很像)

<script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};
</script>
<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
