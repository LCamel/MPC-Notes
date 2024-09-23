# Point Function / Distributed Point Function

## Point Function

A Point Function is a function where only one point in the entire domain has a non-zero value.

```
y 0 0 0 0 0 2 0 0
x 0 1 2 3 4 5 6 7
```
At the point x = 5, f(x) = 2. At other points, it's 0. (Imagine the graph)

## Distributed Point Function

Each party holds a share.<br>
When combined, these shares form a point function.

For example, suppose we have the following point function f:
```
y  00  00  00  00  00  10  00  00
x  0   1   2   3   4   5   6   7
```
We'll try to split f using a secret sharing method, such as XOR.

First, we choose a random function f1 in the same domain.
```
y  01  11  00  10  10  11  00  01
x  0   1   2   3   4   5   6   7
```

We then find f2 such that f1 ⊕ f2 = f (by letting f2 = f ⊕ f1)
```
y  01  11  00  10  10  01  00  01
x  0   1   2   3   4   5   6   7
```

If we give the tables of f1 and f2 to two parties, we can expect f1(x) ⊕ f2(x) = f(x) for all x.

Looking at their own tables, these two parties won't know that originally only the point 5 had a non-zero value "10".

## 2-Server Private Information Retrieval (PIR)

Now we have a set `S = {x1, x2, ... , xn}`, copied in full to parties P1 and P2.<br>
A user arrives.<br>
The user wants to know: Is my x in S?<br>
But the user doesn't want P1 and P2 to know the value of x.

Assume S is contained in [0, 7].<br>
Assume the x the user wants to query is 5.

So the user creates the above two functions f1 and f2 with domain 0 to 7 and gives them to P1 and P2.
Having only one of f1 or f2 won't reveal that x = 5, nor will it reveal that f(5) = "10".

The user asks both parties to XOR all f(x) values and return the result. The user then computes the XOR of these two numbers.

Suppose S = { 3, 5, 7 }
```
P1: f1(3) ⊕ f1(5) ⊕ f1(7) = 10 ⊕ 11 ⊕ 01
P2: f2(3) ⊕ f2(5) ⊕ f2(7) = 10 ⊕ 01 ⊕ 01

⊕                          
     f(3) ⊕  f(5) ⊕  f(7) = 00 ⊕ 10 ⊕ 00
```
The XOR of these two numbers will result in "10" = f(5) != "00". So 5 is in S.

Suppose S = { 3, 4, 7 }
```
P1: f1(3) ⊕ f1(4) ⊕ f1(7) = 10 ⊕ 10 ⊕ 01
P2: f2(3) ⊕ f2(4) ⊕ f2(7) = 10 ⊕ 10 ⊕ 01

⊕                          
     f(3) ⊕  f(4) ⊕  f(7) = 00 ⊕ 00 ⊕ 00
```
The XOR of these two numbers will result in "00". So 5 is not in S.

## Efficiency

Although the above method creates a distributed point function, the size of the table has a linear relationship with the function domain, making it unusable when the domain becomes large. We need a more efficient approach.


----

## References

[Distributed Point Functions and their Applications](https://www.iacr.org/archive/eurocrypt2014/84410245/84410245.pdf)
