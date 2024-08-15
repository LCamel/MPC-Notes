# Garbled Circuit Optimization: Garbled Row Reduction (GRR3)

這是一個減少 bandwidth 的 optimization.

在上一篇中, 我們介紹了 point-and-permute. 因為不用另外花力氣識別能否正確 decrypt, 所以我們的 encryption function 和 ciphertext 可以變成:

```
H(key of wire a || key of wire b)  XOR  corresponding lable of wire c
```

其中 a b 是 input wire, c 是 output wire. H 是一個 hash function.

Row Reduction 的想法是: 本來 output label 是獨立產生的. 但是如果我們故意挑選 c 的 label, 使得 gate 的第一個 ciphertext 在 XOR 後會變成 0 的話, 那就只要傳 3 個 ciphertext 給 evaluator 就好. 因為 evaluator 可以直接假設第一個 ciphertext 是 0.

書中的例子是
```
H(a1 || b0) XOR c0
H(a0 || b0) XOR c0
H(a1 || b1) XOR c1
H(a0 || b1) XOR c0
```
這應該是一個 AND gate 排列後的結果.

為了讓第一個 ciphertext 變成 0, 我們應該在 table 順序決定後, 挑選在第一個 row 的 `c0 = H(a1 || b0)` 使得 XOR 後會消去變成 0.

再舉一個例子. 如果 table 排列後看起來像這樣:
```
H(a1 || b1) XOR c1
H(a1 || b0) XOR c0
H(a0 || b0) XOR c0
H(a0 || b1) XOR c0
```
那我們應該挑選在第一個 row 的 `c1 = H(a1 || b1)` 使得 XOR 後會消去變成 0.

經過 row reduction, 所需的 bandwidth 馬上就降到原本的 3/4 .

也因為現在 output label 會 depend on input label, 這邊 circuit 應該要照著 topological order 來處理.

書中提到, 雖然後來 Pinkas et al. 有提出進一步減少 row 的方法 (GRR2), 可是因為和其他 optmization (FreeXOR) 不相容, 所以後來大家就選了其他也能減少 row 但是和 FreeXOR 相容的作法. 也就是說, 一個技術不光是要看本身好不好, 有時也要看能否和別的技術相容.

下一篇, 我們來討論 FreeXOR.
