# PSI by PSSZ

Section 3.8.1 of the book introduces the method proposed by Pinkas-Schneider-Segev-Zohner (PSSZ) in 2015, which also uses OPRF to create PSI.

(Please read [the previous article](./PSI-PSSZ-en-US.md) first)

## Cuckoo Hashing

Cuckoo hashing was initially proposed by Pagh and Rodler in 2004. It uses two hash functions.

PSSZ uses a modified version by Kirsch-Mitzenmacher-Wieder (KMW) from 2009. PSSZ uses three hash functions and includes a stash.

The basic idea is:

We have n items that we want to place into b bins. Each bin can only hold 1 item.<br>
There's also a stash of size s to handle items that are difficult to place in bins.<br>
There are hash functions h1, h2, h3 that map items to bins.

When an item x arrives, its possible positions are: bins h1(x), h2(x), h3(x), and the stash. It won't be in any other place.<br>
We prioritize checking if there's an empty spot in the three hashed bins. If there's an empty spot, we place it there.<br>
If there's no empty spot, we randomly kick out an item from one of these three positions and place the new item in that spot.<br>
The kicked-out item then repeats the above process.<br>
If too many iterations occur without finding an empty spot, KMW's version will put the item in the stash. (Previous versions without a stash would handle this problem with more expensive rehashing)

Usually, the stash is a constant-size area.<br>
The stash can also become full. (failure)<br>
KMW's Theorem 2.1 claims that the probability of the stash being full is less than O(n^(-s)). If the stash is large enough, this probability becomes very small.

## PSI

Assume the Receiver has placed their Y into bins and stash, filling empty spots with dummies.

The difference from the previously introduced method is that now each position uses a different key to calculate PRF / OPRF. Let's call this function F.

First, the Receiver calculates OPRF F with the Sender using the item y at the corresponding position.

The Sender doesn't perform complete Cuckoo hashing, but instead follows the property: "Possible positions are: bins h1(x), h2(x), h3(x), and the stash. It won't be anywhere else."

So the Sender calculates PRF F for x using the keys of the three possible bin positions, and also calculates PRF F for x for each position in the stash.<br>
Then all these values are sent to the Receiver for comparison.<br>
If the hash values are the same, it means the item exists on both sides. (Assuming there are no false positives caused by collisions from different keys)

For example, suppose there's an item with a value of 42.<br>
h1(42) = 10<br>
h2(42) = 20<br>
h3(42) = 30<br>
The stash has 2 positions.

Assume 42 is placed at position 20 on the Receiver's side.

If the Sender also has 42, then the Sender will send
```
F(key10, 42)
F(key20, 42)
F(key30, 42)
F(keyStash1, 42)
F(keyStash2, 42)
```
These 5 values are sent to the Receiver.

When the Receiver calculates the OPRF for each bin and stash, it will calculate F(key20, 42), so the Receiver knows that 42 is an item that exists on both sides.

## More efficient OPRF from 1-out-of-∞ OT

The main cost of the PSI approach described above is still in the OPRF.

TODO: In the book, Kolesnikov et al. proposed a more efficient OPRF method in 2016, which makes the entire PSI more efficient. However, I haven't fully understood this part yet.
