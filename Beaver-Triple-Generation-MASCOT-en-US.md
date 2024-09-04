# Beaver Triple Generation: The MASCOT Way

<mark>(draft version)</mark>

In the previous article, we saw that preparing many Beaver triples offline can reduce the cost of online computation.

But where do Beaver triples come from?

The book mentions one method: "... Beaver triples can be generated in a variety of ways, such as by simply running the BGW multiplication subprotocol on random inputs."

There are also methods using homomorphic encryption or oblivious transfer.<br>
Here, we'll introduce a method not mentioned in the book, based on OT: [MASCOT](https://eprint.iacr.org/2016/505).

Let's start with the foundation of MASCOT: Gilboa's multiplication protocol.

## Gilboa's multiplication protocol

For example, the Sender has 42, and the Receiver has 11.<br>
We want them to hold additive shares of 42 * 11.<br>
That is, let the Sender hold a number c1, and the Receiver hold a number c2, such that c1 + c2 = 42 * 11.<br>
After execution, the Sender doesn't know 11 or c2.<br>
The Receiver doesn't know 42 or c1.<br>
Neither of them knows 42 * 11.

The tool we have is 1-out-of-2 OT.

11 = 1 0 1 1 in binary.

```
42 * 11
= 42 * (8 + 0 + 2 + 1)
= (42 * 8) + 0 + (42 * 2) + (42 * 1)
```

Let's assume the Receiver's number doesn't exceed 4 bits. (In practice, this depends on the field size, which is k bits in the paper)

The Sender prepares 4 random numbers t1 t2 t3 t4.<br>
Then performs 4 1-out-of-2 OTs with the Receiver as follows:

```
t1
t1 + 42        1    =>   t1 + 42      t1 + 42 * 1

t2
t2 + 42        1    =>   t2 + 42      t1 + 42 * 1

t3             0    =>   t3           t1 + 42 * 0
t3 + 42

t4
t4 + 42        1    =>   t4 + 42      t1 + 42 * 1
```

For the Receiver, these are just 4 seemingly random numbers. They can't guess 42.

Then we try to construct 42 * 11 in the right-hand expression.

Referring to the previous equation, we construct it like this:
```
                         (t1 + 42) * 1    (t1 + 42 * 1) * 1
                         (t2 + 42) * 2    (t2 + 42 * 1) * 2
                         (t3 +  0) * 4    (t3 + 42 * 0) * 4
                         (t4 + 42) * 8    (t4 + 42 * 1) * 8
                    +)_________________
                let c2 = blah + 42 * 11
                where blah = (t1 * 1) + (t2 * 2) + (t3 * 4) + (t4 * 8)
```
If we let c1 = -blah, then we have c1 + c2 = 42 * 11.<br>
c1 and c2 are now an additive share of 42 * 11.

## Protocol COPEe

(The above method uses OT many times to create one triple. But OT is expensive. Intuitively, we might want to use the previously introduced IKNP OT extension to perform bulk OT. However, this paper uses its own construction, similar to OT extension.)

COPEe: Let the Receiver fix a delta. Then each time the Sender uses a different x to create a new pair of shares t and q, such that t + q = x * delta.

In the initialize phase, the Sender prepares k pairs of seeds (k is 4 in the above example). Each seed is of length lambda.

The Receiver uses the bits from the decomposition of delta to retrieve the corresponding k seeds.

In the extend phase, the Sender provides a new x.

The Sender uses PRF and seeds to generate k pairs of numbers (t0 t1) ..., replacing the random numbers in Gilboa's protocol.<br>
The Receiver calculates using the same rule and will know k of these numbers (those generated from the seeds chosen in the initial phase).

(The t in the functionality desired in Fig. 3 is random. Here, in the implementation, PRF is used instead.)

The Sender sends k values of u = t0 - t1 + x to the Receiver.<br>
Using u, the Receiver can calculate k values of q = t0 or q = t0 + x.

Why did the author come up with this formula for u?<br>
I guess we can think of it this way:<br>
If the Receiver's choice bit is b, we want t0 or t0 + x.
```
if b == 0, the Receiver knows t0.   ?? =>  t0
if b == 1, the Receiver knows t1.   ?? =>  t0 + x
```
So we arrange a correction term.<br>
When b == 0, t0 == t0 needs no correction.<br>
When b == 1, we need to turn t1 into t0 + x, so we arrange -t1 + (t0 + x). This cancels out t1 and gives t0 + x.<br>
Therefore, in designing the protocol, we let the Sender send u = (-t1 + (t0 + x)), which when multiplied by b can correct as needed.

Looking at all k together, we have Q = T + (delta's bit i) * x.

Multiplying both sides by 1 2 4 8 16 ... (and changing the sign of T to make an additive share), we get q = -t + x.<br>
Now q and t are additive shares of x.

This means that for every k numbers sent (k * k bits), we get a new triple.

Only the initial phase uses real OT to select seeds.<br>
Later, the relatively cheaper PRF is used to achieve the effect of selecting t0 or t0 + x using delta's bits.

I think this kind of OT extension itself has a Beaver triple style:<br>
The Sender thinks: I have t0 and t1, I don't know which one you chose. But I send you materials so you can "correct" to get the t0 or t0 + x we want (without leaking x).

----

to be continued
