# Tailered Oblivious Data Structures

## Oblivious Data Structure

If the memory access pattern is influenced by private data, then an adversary may obtain information about the private data from the memory access pattern.

For example:
```
access array[i]
```
Suppose `i` is a private value. If the adversary can observe which address we access, then `i` is leaked.

Or:
```
if (b) {
    push(v)
}
```
Suppose `b` is a private value. If after executing this program, the adversary observes no memory access, then `b` is leaked.

Borrowing the explanation from the paper [Oblivious Data Structures](https://eprint.iacr.org/2014/185.pdf):
>A data structure D is a collection of data supporting certain types of operations such as insert, del, or lookup.
Every operation is parameterized by some operands (e.g., the key to look up). Intuitively, the goal of
oblivious data structures is to ensure that for any two sequences each containing k operations, their resulting
access patterns must be indistinguishable. This implies that the access patterns, including the number of
accesses, should not leak information about both the op-code and the operand.

In other words, as long as the number of operations is the same, just by looking at the access pattern, the adversary cannot distinguish whether we did `insert(3, 4) delete(5) insert(6, 7)` or `delete(1) lookup(2) delete(3)`. The parameters within will not be leaked either.

## Tailored Oblivious Data Structures

If we use an array of length N to implement a stack with push and pop operations, the most naive method is to access all N memory addresses every time there's an operation. But this becomes too expensive when N gets a bit large.

So section 5.1 of the book introduces a method for an oblivious stack. (The author of this book was involved)<br>
The goal is to reduce the number of operations from the naive linear to sublinear.<br>
Here, it provides a conditional push that's a bit more advanced than a regular push.<br>
So the above `if (b) push(v)` becomes `condPush(b, v)`.<br>
Whether b is true or false, it generates the same memory access pattern.

Since stack operations are concentrated at the top and don't suddenly want elements in the middle,<br>
this method utilizes the locality of stack access patterns to reduce costs. (tailored)

The design used here is as shown in the figure. It's divided into levels. The purpose of doubling is that we can shift 2 blocks at a time from level i to level i+1.
```
1 1 1 1 1    2 2 2 2 2    4 4 4 4 4    8 8 8 8 8 ...
```

![Oblivious-Stack.png](./images/Oblivious-Stack.png)

Each level maintains that two modifications won't cause problems. Then a cross-level shift is arranged every two modifications.<br>
If after two modifications, the number in level 0 is greater than 3, it won't be able to accept two more pushes. So a shift will be used to right shift the data to level 1.<br>
If after two modifications, the number in level 0 is less than 2, it won't be able to accept two more pops. So a shift will be used to left shift the data to level 0.<br>

The reason for using 5 blocks instead of 4 in a level is:<br>
Imagine now we have 4 blocks with two filled. Then we have two condPush operations, one true and one false. Now 4 blocks have 3 filled.<br>
This way, it can't accept two more pushes, so we need to right shift.<br>
But when right shifting to the upper level, we can only shift 2 at a time, which would reduce from 3 to 1. This can't accept two pops.<br>
So the number 5 comes from this consideration.

Shifts are added manually by the programmer or automatically by the compiler.

Level 0 needs one shift after every 2 operations, with a cost of 1 for each reorganization.<br>
Level 1 needs one shift after every 4 operations, with a cost of 2 for each reorganization.<br>
Level 2 needs one shift after every 8 operations, with a cost of 4 for each reorganization.<br>
Level 3 needs one shift after every 16 operations, with a cost of 8 for each reorganization.

The amortized cost at each level for each operation is O(1).<br>
And there are O(log N) levels.<br>
So the amortized cost for each operation is O(log N). Better than the naive O(N).

A queue can be made using two stacks. It's also O(log N).

This way, we obtain a data structure where the access pattern is only related to the number of operations, not the content of the data.

----
## Postscript

1. The [original paper](https://uvasrg.github.io/2013/circuit-structures-for-improving-efficiency-of-security-and-privacy-tools.html) also mentions using symbolic execution to analyze program use cases. When the analyzed program can be modeled using a stack, using an O(log N) circuit is better than an O(N) circuit.
2. My own LazyTower design also happens to utilize the decreasing frequency of levels to reduce amortized cost. When I saw this part, I felt it had some similarity.
