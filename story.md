Alice: Hi TBot  
Bob: Hi TBot  
TBot: Hi Alice, Bob  
Alice: Bob 和我手上各有一個秘密的數字. 你可以我們比大小嗎? 不可以把數字洩漏出去喔.  
TBot: 好的. 那 Alice 你的數字是多少?  
Alice: 我的數字是 xx (在 TBot 耳邊說)  
TBot: 收到. 那 Bob 你呢?  
Bob: 我的數字是 yy (在 TBot 耳邊說)  
TBot: 收到. 經過我的比較, 數字比較大的是... Alice!  
Alice: 耶! 我的數字比較大!  
Bob: 耶! 你請客!  

====

Bob: Hi TBot
TBot: Hi Bob, Alice
Bob: 聽說你可能有一陣子會不在? 這樣我們要找誰幫忙比大小呢?
TBot: 我想想...
TBot: 大概快 40 年前, 有一個叫 "Yao" 的人, 發明了 "Garbled Circuit". 不光是比大小, 只要你們把想計算的 function 表達成 boolean circuit, 就可以用 garbled circuit 的方式來計算了.

Alice : 那是什麼?

TBot: 先看一下普通的 boolean circuit. 你們可以計算 (1 AND 0) XOR (0 OR 1) 的結果嗎?

[[]]

Bob: 好... 答案是 1. 然後呢?

TBot: Garbled circuit 的想法是, 每一條 wire 上面如果傳的不是 0 或 1, 而是你看不懂的 label 的話, 那就可以在不知道秘密的狀況下做計算了.

Bob: 比方說?

TBot: 先看個不完整的版本. 像第一個 AND Gate 先換成這樣.

AND gate
a b c  a b c
0 0 0  🐱 🐭 🐮
0 1 0  🐱 🐰 🐮
1 0 0  🐶 🐭 🐮
1 1 1  🐶 🐰 🐴

Bob: 嗯... 雖然現在表面上不是 0 1 了, 但這只是文字代換吧? 從 a b 兩欄來看, 🐱 🐶 應該是 a 的 0 1, 🐭 🐰 應該是 b 的 0 1 吧? 這樣 input 有保密嗎?

TBot: 的確沒有保密. 那把四個 row 亂排過呢? 還看得出來嗎?

AND gate
a b c
🐱 🐰 🐮
🐶 🐰 🐴
🐶 🐭 🐮
🐱 🐭 🐮

Alice: 從 a b 的確看不出來. 但因為這是個 AND gate, 所以從 c 來看, 只出現一次的 🐴 應該是 1. 那 🐶 🐰 就是 a b 的 1 了.

TBot: 沒錯! 那如果只顯示給定 input 的那個 row 呢?

AND gate
a b c
x x x
x x x
🐶 🐭 🐮
x x x

Alice: 這樣應該保密了, 沒有辦法猜出來原本是 0 還是 1.

Bob: 嗯嗯. 而且知道超過一個 output 可能就危險了. 因為 AND gate 只有一個 output 是 1, 像下面這樣就會被看出 🐮 是 0 了.

AND gate
a b c
x x x
x x x
x x 🐮
x x 🐮

TBot: 你們的觀察很深入! 當我們拿到兩個 input label 的時候, 我們必須能算出正確且唯一的 output label. 其他 output label 都必須隱藏起來.

TBot: Bob, 你可以再當一次 Evaluator 來計算看看嗎?

Bob: 好.

[[]]


Bob: 算完了. 可是我不知道我剛剛算了什麼. Input 和 output 代表什麼也不知道. 這到底在做什麼??

TBot: 這就是我們先前說的, 用看不懂的 label 來作計算.
普通的 boolean circuit 有一個看得懂的 table 讓我們做計算.
而這邊為了算出唯一一個 output label 且隱藏其他的 label, Yao 用了一個技巧:
也就是用兩個 input labels 當成 keys 去 encrypt 對應的 output label.
計算時用 input labels 一個一個去解, 唯一能解出來的就是對的 output label.
現在的表格變成這樣:

AND gate
a b c
x x [BOX] = Encrypt(input label, input label, output label)
x x [BOX] = Encrypt(input label, input label, output label)
x x [BOX] = Encrypt(input label, input label, output label)
x x [BOX] = Encrypt(input label, input label, output label)

或者說
[BOX] = Encrypt(🐱, 🐰, 🐮)
[BOX] = Encrypt(🐶, 🐰, 🐴)
[BOX] = Encrypt(🐶, 🐭, 🐮)
[BOX] = Encrypt(🐱, 🐭, 🐮)

Bob: 也就是如果我手上有 input 🐶 和 🐭, 那我只能唯一 decrypt 出第三個 row 的 🐮, 而且也看不到 🐴 是嗎?

TBot: 沒錯! 所以你只知道這個 gate 的 output 是 🐮, 但是無法推測 🐮 到底是 0 還是 1. 也推測不出 🐶 和 🐭 是 0 還是 1.






用兩個 input label 拿到唯一一個 output label. Yao 的作法是用每一組





TBot: 我先扮演 Generator, 把弄亂過的 circuit 給你. 你試著算看看.




TBot: 你們理解的很快! 我們可以來把先前的 circuit 換成 garbled circuit 了.

TBot: Garbled circuit 有兩個角色: Generator 把 circuit 每條線的 0 1 轉成 label, 再交給 Evaluator 用這些 label 作運算. Bob, 你可以先當 Evaluator 嗎?
