# Garbled Circuit Optimization: Garbled Row Reduction (GRR3)

This is an optimization to reduce bandwidth.

In the previous article, we introduced point-and-permute. Since we don't need to spend extra effort to identify whether decryption is correct, our encryption function and ciphertext can become:

```
H(key of wire a || key of wire b)  XOR  corresponding label of wire c
```

Where a and b are input wires, c is the output wire. H is a hash function.

The idea of Row Reduction is: Originally, the output labels were generated independently. But if we deliberately choose the label for c so that the first ciphertext of the gate becomes 0 after XOR, then we only need to transmit 3 ciphertexts to the evaluator. Because the evaluator can directly assume that the first ciphertext is 0.

The example in the book is:
```
H(a1 || b0) XOR c0
H(a0 || b0) XOR c0
H(a1 || b1) XOR c1
H(a0 || b1) XOR c0
```
This should be the result after arranging an AND gate.

To make the first ciphertext become 0, we should, after determining the table order, choose `c0 = H(a1 || b0)` in the first row so that it will cancel out to 0 after XOR.

Let's give another example. If the table looks like this after arrangement:
```
H(a1 || b1) XOR c1
H(a1 || b0) XOR c0
H(a0 || b0) XOR c0
H(a0 || b1) XOR c0
```
Then we should choose `c1 = H(a1 || b1)` in the first row so that it will cancel out to 0 after XOR.

After row reduction, the required bandwidth immediately drops to 3/4 of the original.

Also, because now the output label depends on the input label, the circuit should be processed according to the topological order.

The book mentions that although Pinkas et al. later proposed a method to further reduce rows (GRR2), it is incompatible with other optimizations (FreeXOR). So later, people chose other methods that can also reduce rows but are compatible with FreeXOR. In other words, a technology is not only judged by how good it is on its own, but sometimes also by whether it can be compatible with other technologies.

In the next article, we will discuss FreeXOR.
