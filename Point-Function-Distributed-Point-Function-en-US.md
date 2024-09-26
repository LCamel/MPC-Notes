# Point Function / Distributed Point Function

## Point Function

A Point Function is a function where only one point in the entire domain has a non-zero value.

```
y 0 0 0 0 0 2 0 0
x 0 1 2 3 4 5 6 7
```
At the point x = 5, f(x) = 2. At other points, it's 0. (Imagine the graph)

More commonly used is a point function where only one point has a value of 1.

## Distributed Point Function

Each party holds one share.<br>
When several shares are combined, they form a point function.

For example, suppose we have the following point function f where only f(5) = 1:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
We try to split f using a form of secret sharing, such as XOR.

First, we take a random function f0 in the same domain.
```
y 1 1 0 1 0 0 1 0
x 0 1 2 3 4 5 6 7
```

Find f1 such that f0 ⊕ f1 = f (by letting f1 = f ⊕ f0)
```
y 1 1 0 1 0 1 1 0
x 0 1 2 3 4 5 6 7
```

If we give the tables of f0 and f1 to two parties, we can expect f0(x) ⊕ f1(x) = f(x) for all x.

Looking at their own tables, these two parties won't know that originally only f(5) was 1.

## A 2-Server Secure Keyword Search Protocol

Now we have a set `S = {x1, x2, ... , xn}`, with two identical copies given to parties P0 and P1.<br>
A user arrives.<br>
The user wants to ask: Is my x in S?<br>
But the user doesn't want P0 and P1 to know the value of x.

Assume S is contained in [0, 7].<br>
Assume the x the user wants to query is 5.

The user thinks: I'll design an f like this:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
If we calculate
```
f(x1) ⊕ f(x2) ⊕ ... ⊕ f(xn)
```
It will only be 1 if 5 is in S.

For example, if S = { 3, 5, 7 }, it will be mapped to 0 1 0. Because 5 is in it, the sum will be 1.

So the user creates two functions f0 and f1 as in the previous section and gives them to P0 and P1.<br>
Having only one of f0 or f1 won't reveal that f(5) = 1.

The user asks both parties to XOR all f(x) and return the number. The user then calculates the XOR of these two numbers.

Assume S = { 3, 5, 7 }
```
P0: f0(3) ⊕ f0(5) ⊕ f0(7) = 1 ⊕ 0 ⊕ 0 = 1
P1: f1(3) ⊕ f1(5) ⊕ f1(7) = 1 ⊕ 1 ⊕ 0 = 0

⊕                          
     f(3) ⊕  f(5) ⊕  f(7) = 0 ⊕ 1 ⊕ 0 = 1
```
The XOR of these two numbers will be 1 = f(5) != 0. So 5 is in S.

Assume S = { 3, 4, 7 }
```
P0: f0(3) ⊕ f0(4) ⊕ f0(7) = 1 ⊕ 0 ⊕ 0 = 1
P1: f1(3) ⊕ f1(4) ⊕ f1(7) = 1 ⊕ 0 ⊕ 0 = 1

⊕                          
     f(3) ⊕  f(4) ⊕  f(7) = 0 ⊕ 0 ⊕ 0 = 0
```
The XOR of these two numbers will be 0. So 5 is not in S.

## Additive Sharing

In the above example, we have six values of f1 and f2.<br>
Because we're using XOR, which is a form of additive sharing, adding these values "vertically then horizontally" or "horizontally then vertically" will yield the same result.

## A 2-Server Private Information Retrieval (PIR) Protocol

Now we have an 8-bit database D = { b0, b1, ... , b7 }.<br>
Two servers P0 and P1 each hold an identical copy.

The user wants to ask: What is the i-th bit?<br>
But the user doesn't want P0 and P1 to know the value of i.

Suppose the user wants to know the value of b5.

The user thinks: I'll first design an f like this:
```
y 0 0 0 0 0 1 0 0
x 0 1 2 3 4 5 6 7
```
If we calculate
```
b0 * f(0)  +  b1 * f(1)  +  ...  +  b7 * f(7)
```
Then all bits except the 5th will be eliminated. Only b5 will remain.

So the user splits this f into f0 and f1, and gives them to P0 and P1 respectively.<br>
P0 and P1 multiply and sum the results, then send them back to the user.<br>
The user then adds these two numbers to get b5.

```
P0:  b0 * f0(0)  +  b1 * f0(1)  +  ...  +  b7 * f0(7)
P1:  b0 * f1(0)  +  b1 * f1(1)  +  ...  +  b7 * f1(7)

+

b0 * f0(0) + b0 * f1(0)
= b0 * (f0(0) + f1(0)) = b0 * f(0) = b0 * 0 = 0

b5 * f0(5) + b5 * f1(5)
= b5 * (f0(5) + f1(5)) = b5 * f(5) = b5 * 1 = b5
```

## Efficiency

Although the above method creates a distributed point function, the size of the table has a linear relationship with the function domain, making it unusable when the domain becomes large. We need a more efficient approach.


----

## References

[Distributed Point Functions and their Applications](https://www.iacr.org/archive/eurocrypt2014/84410245/84410245.pdf)
