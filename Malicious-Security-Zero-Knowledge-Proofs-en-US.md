# Malicious Security - Zero-knowledge Proofs

## GMW Compiler

In addition to proposing the protocol mentioned earlier, GMW (the three authors) also proposed a transformation that can convert any semi-honest protocol into one that can handle malicious behavior.

### Pure Function

```
function f1(x) {
    return x + Math.random();
}
```
Is the above function a pure function?

No. Because calling f1 with the same input won't return the same output every time.

```
function f2(x, r) {
    return x + r;
}
```
Is the above function a pure function?

Yes. Because calling f1 with the same input will return the same output every time.

We can view a 2-party protocol Pi as two pure functions: Pi1 Pi2.

For Pi1, if given the same input x1, the same random values r1, and the same transcript t1 (all previously sent and received messages), it will produce the same next message. The same applies to Pi2.

### Coin-tossing into the Well

When designing a semi-honest protocol, if the random value r1 is truly uniformly random, then regardless of what input x1 is, it won't leak P2's x2.

However, in the malicious case, P1 might manipulate their random value to make P2 leak information. How do we handle this?

We know that if u ⊕ v, as long as either u or v is uniformly random, then u ⊕ v will be uniformly random.

So we change P1's random value used in the original semi-honest protocol to r1 ⊕ r1'. Here, r1 is P1's own provided random value, and r1' is the random value P2 provides to P1. The benefits of doing this are:
1. To prevent P1 from manipulating the random value, P2 will provide uniform r1', making r1 ⊕ r1' uniformly random.
2. Because it still contains r1 which P2 doesn't know, P1 doesn't need to worry about P2 knowing the final r1 ⊕ r1'.

But since P1 is malicious, how do we know P1 actually used r1'? Or rather, how do we know P1 actually followed Pi1 in execution?

### Zero-knowledge Proof

"Computation" is public. "Data" can be partly public and partly private.

With the help of Zero-Knowledge Proof systems, we can achieve:
1. The Verifier is willing to believe that the Prover computed F using public input "pub" and private input "priv", resulting in public output y. That is, F(pub, priv) = y.
2. The Verifier won't get any information about the private data beyond y.

If F here is the verify function of some commitment scheme, then we can make the Verifier believe that the Prover indeed has the originally committed data without revealing the original data.

We require P1 to first create a commitment of their input x1 and all random values r1 needed throughout the process. Then each time, besides calculating the original message for P2, P1 also uses Zero-knowledge Proof to show P2 that:
1. P1 indeed calculated this message according to the original Pi1, using r1 ⊕ r1'.
2. Although P1's x1 r1 are private, they haven't changed between rounds. (fixed by the commitment)

P2 does the symmetric actions as P1. Thus, with the help of Zero-knowledge Proof, we obtain a protocol that can handle malicious situations.

## ZK from Garbled Circuits

The GMW compiler introduced earlier uses ZK to implement MPC. The following work by Jawurek, Kerschbaum, and Orlandi (JKO) does the opposite. We'll see how to use MPC techniques to implement ZK.

In ZK, the prover wants to prove to the verifier that: prover has a private input w, such that F(w) = 1.

For example, if the prover wants to prove "I know a value w such that SHA256(w) = 42", then we can define F as
```
function F(w) {
    return (SHA256(w) == 42) ? 1 : 0;
}
```

We can incorporate all public input/output into F's definition itself. This way, from MPC's perspective, we only have a public function F, a private input w known only to the prover, and no input needed from the verifier (or think of it as null).

Then we use Garbled Circuit to execute F. Here, we let the verifier play the role of generator, and the prover play the role of evaluator. The verifier converts the public F into a circuit, and the evaluator uses oblivious transfer to get the keys corresponding to w.

In cut-and-choose, circuits that have been opened won't be used for evaluation, and circuits that have been evaluated won't be opened. The latter is to protect the generator, because the generator will convert their input into keys for the evaluator, and if the circuit is opened, the input would be leaked.

However, in the ZK use case, the verifier (generator) has no input, so there's nothing to leak! This means the evaluator only needs to evaluate a single circuit, and after calculating the answer, they can ask the generator to open this circuit. Very efficient!

However, to prevent the generator from cheating, here the evaluator first commits to the calculated answer, and only opens their commitment if the generator can correctly open the circuit. If it indeed corresponds to the key for 1, then the generator (verifier) will believe that the evaluator (prover) indeed has an input w that satisfies the condition (because it's hard to guess the key before opening the circuit).
