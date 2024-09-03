# Beaver Triple

We saw in BGW: when parties encounter a multiplication gate, everyone needs to secretly send shares of their random polynomial to all others. The communication cost is high.

Beaver Triple is a technique that allows parties to do some preprocessing offline before the actual input arrives. This way, when the real input comes, the online computation can be simpler.

(Note: offline doesn't mean parties don't need to communicate, but rather that processing is done before knowing the input)

In the following, we use Shamir's secret sharing. [(Please refer to the previous article)](./Shamir-Secret-Sharing-en-US.md)

## Assumptions

(Regardless of how it's achieved) A Beaver triple is:
- Parties hold shares [a] [b] [c] of three numbers a, b, c. Where a and b are random numbers, and c = a * b.
- No party knows the values of a, b, c.

We assume there's a cheap broadcast method available.

## Implementation

Let's see how these assumptions help us compute multiplication gates.

Offline, everyone gets [a] [b] [c].
Now online, everyone gets [x] [y], and we want everyone to hold [xy].

```
a   *   b   =  c  (offline)
+       +
d       e         (online, broadcast)
=       =
x   *   y   =  ?  (online, local)
```
We first let each party jointly compute two public numbers d = x - a and e = y - b.
How is this done?
Everyone can get [x - a], which is [d], using their [x] and [a].
Everyone can get [y - b], which is [e], using their [y] and [b].
Everyone broadcasts their shares of [d] [e] to all parties.
Each person can then reconstruct the numbers d and e.

Suppose A holds shares a1, b1, c1, x1, y1.
Then A broadcasts two numbers: d1 = x1 - a1 and e1 = y1 - b1.
After everyone sends out two deltas, everyone can reconstruct the numbers d and e from the shares.

Next, we roughly list the equations:
```
[xy] = [(a + d)(b + e)]
     = [ab + ae + db + de]
     <= [ab] + [ae] + [db] + [de]
     <= [c] + e[a] + d[b] + de
              ~~~~~~~~~~~~~~~~ correction term
```
Then we work backwards. We can reconstruct [xy] at the top of the equation from the bottom equation.<br>
[(Please refer to the previous article)](./Shamir-Secret-Sharing-en-US.md#from-a-b-c-d-p-q-r-s-to-ap--bq--cr--ds)

In other words, after each person broadcasts two numbers and calculates d and e, the remaining [xy] can be obtained with just local computation.

## Accelerating BGW

In the previous article, when BGW processes the "*" gate, all parties need to transmit messages in pairs through private channels.

If we use Beaver Triple, we only need to broadcast when encountering a "*" gate.

Each "*" gate will use up one set of Beaver Triple and cannot be reused. So we need to prepare many sets in advance.

## Summary

During offline time, we prepare some shares calculated from random numbers that are completely unrelated to the input.

When the input comes online, we then correct the error.

Since the calculation of the correction term `e[a] + d[b] + de` is relatively cheap, the online cost is significantly reduced.

As for how to efficiently mass-produce Beaver Triples, you'll need to look at other reference materials.
