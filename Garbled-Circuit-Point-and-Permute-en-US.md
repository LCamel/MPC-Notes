# Garbled Circuit Optimization: Point-and-Permute

In the previous article, we introduced Garbled Circuit. Originally, GC was mainly theoretical, but after years of optimization by many people and advancements in computer hardware, GC has now become a practically usable protocol.

Here, we'll first introduce an important optimization: point-and-permute.

A detailed and lengthy article with tools can be found [here](story-point-and-permute-en-US.md).

Point-and-permute randomly appends two different pointer bits to the two keys on the same wire.

We'll get (key0 + 0, key1 + 1) or (key0 + 1, key1 + 0).

Since 0 1 or 1 0 is random, this bit is unrelated to the value represented by the key.

Because it's unrelated, even if we sort the encrypted output labels using the pointer bits at the end of their input keys, it won't leak any information!

For example, even if I know that the pointer bits of the input keys corresponding to this output label are 0 0 after sorting, it doesn't mean anything. Because the bits at the end are randomly paired with the keys at the front, the values represented by the original keys could still be any of 00 01 10 11.

We replace the original "shuffle" with "append random pointer bits + sort by pointer bits".

This approach has several impacts:

* Because the ciphertexts are already sorted, when the evaluator gets the labels of two input wires, they can directly decrypt the ciphertext pointed to by the pointer bits. Decryption will directly reduce from an average of 2.5 times to 1 time.

* Originally, to ensure that only one of the four ciphertexts could be decrypted, it might be necessary to append some strings after the plaintext to verify correctness. This approach would worsen the bandwidth problem, but using point-and-permute eliminates this issue.

* There are other optimizations like "half gates" that will make ingenious use of pointer bits, so it's important to understand this first and not skip over it.

As mentioned in the previous article, the description here is just a summary of key points. You need to look at the detailed approach to gain insights.

----

TODO: The permutation obtained by this method is less than the original 4! = 24 types. But I haven't carefully thought through whether it affects security.
