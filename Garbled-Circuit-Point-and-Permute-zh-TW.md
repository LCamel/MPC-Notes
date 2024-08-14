# Garbled Circuit Optimization: Point-and-Permute

在前一篇文章中, 我們介紹了 Garbled Circuit. 本來 GC 是以理論為主, 後來經過多年眾人的 optimization, 以及電腦硬體的進步, 現在 GC 已經是一個實際可用的 protocol 了.

這邊我們先介紹一個重要的 optimization: point-and-permute.

詳細而長的文章和工具在[這裡](story-point-and-permute-zh-TW.md).

Point-and-permute 在同一個 wire 的兩把 key 後面隨機 append 兩個相異的 pointer bits.

我們會得到 (key0 + 0, key1 + 1) 或者是 (key0 + 1, key1 + 0).

由於 0 1 或 1 0 是隨機的, 所以這個 bit 和 key 代表的 value 無關.

因為無關, 所以我們即便把 encrypt 過的 output labels 用其 input keys 後面的 pointer bits 來 sort, 也不會洩密!

比方說, sort 後即便我知道這個 output label 對應的 input keys 的 pointer bits 是 0 0, 也不代表什麼. 因為後面的 bits 和前面的 key 是隨機配對的, 所以原來的 keys 代表的 values 仍可能是 00 01 10 11 的任何一組.

我們用 "append random pointer bits + sort by pointer bits" 取代了原來的 "shuffle".

這個作法有幾個影響:

* 因為 ciphertext 已經 sort 好了, 所以當 evaluator 拿到兩個 input wire 的 labels 時, 可以直接去解 pointer bits 指到的 ciphtertext 就好. Decrypt 會從原來的平均 2.5 次直接降到 1 次.

* 本來為了只讓四個 ciphertext 只能解開一個, 可能需要在 plaintext 後面 append 一些字串來確認正確與否. 這種作法會讓頻寬問題惡化, 但用 point-and-permute 就沒這問題了.

* 後面還有像 "half gates" 的其他 optimization 會神奇的使用 pointer bits, 所以這邊要先弄懂, 不要跳過.

如同前一篇說過的, 這裡的描述只是重點整理, 要看詳細的作法才會有收穫.

----

TODO: 這個作法得到的 permutation 少於原來的 4! = 24 種. 但我沒有仔細想通是否影響安全.
