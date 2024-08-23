# IKNP OT Extension

In the previous article, we discussed how to implement 1-out-of-2 OT using public key cryptography.

However, when we want to perform a large number of OTs, the public key approach becomes more expensive.

The idea of OT Extension is: Can we use a small number of expensive public key OTs (base OT), combined with cheaper symmetric-key operations, to reduce the cost of large-scale OTs?

For each message pair that the Sender wants to send, we try to create a symmetric key known to the Receiver at one position specified by the Receiver, while the other position appears as a random string to the Receiver. The Sender uses these two strings as keys to encrypt messages, and the Receiver can only decrypt one of them.

As long as we can generate many such keys in large quantities and cheaply, we can reduce the overall cost.

<img src="images/OT-extension-2.png" alt="OT-extension-2.png" class="to-be-resized">

As shown in the image above, the left side is the Sender's end. We want to generate 5 keys at 5 positions specified by the Receiver (01101), with each key having 3 bits.

In practice, we perform 3 reverse OTs on the right side of the Receiver, transmitting 5 vertical bits each time.

This `(5, 3) -> (3, 5)` transformation is the key to saving the number of public key operations.

The detailed article can be found [here](OT3D/story-OT-Extension-en-US.md).

A standalone tool demonstration is available [here](https://lcamel.github.io/MPC-Notes/OT3D/).

The source code for the tool is [here](https://github.com/LCamel/MPC-Notes/tree/main/OT3D). MIT license, feel free to use.

<script>
function resizeImg(i) { i.style.width = (i.naturalWidth * 0.50) + "px"; }
function resizeAllImg() { document.querySelectorAll(".to-be-resized").forEach(resizeImg); }
window.addEventListener("load", resizeAllImg);
</script>
