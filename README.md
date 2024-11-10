# MPC-Notes

(English)

These are my notes from reading [A Pragmatic Introduction to Secure Multi-Party Computation](https://securecomputation.org/). Most viewpoints come from the book or original papers, supplemented with some personal insights. For some topics, I wrote programs to demonstrate the concepts. If there are any errors, please feel free to point them out. Thank you.

Thanks to the Ethereum Foundation's Learning Grant and to Nam Ngo for reviewing this work.

(Chinese)

Thanks to the Ethereum Foundation's Learning Grant.
這裡是我在讀 [A Pragmatic Introduction to Secure Multi-Party Computation](https://securecomputation.org/) 這本書時的筆記. 主要觀點都來自書中或原 paper, 再補充一些心得. 部分主題另外寫了程式來展示概念. 如有錯誤, 還請不吝指正, 謝謝.

感謝 Ethereum Foundation 的 Learning Grant. 感謝 Nam Ngo 的審閱. 

## Study Notes

| | | |
|--|--|--|
| Introduction | [English](./MPC-Intro-en-US.md) | [Chinese](./MPC-Intro-zh-TW.md) |
| Garbled Circuit | [English](./Garbled-Circuit-en-US.md) | [Chinese](./Garbled-Circuit-zh-TW.md) |
| Garbled Circuit and Oblivious Transfer (story) | [English](./story-en-US.md) | [Chinese](./story-zh-TW.md) |
| Garbled Circuit Optimization: Point-and-Permute | [English](./Garbled-Circuit-Point-and-Permute-en-US.md) | [Chinese](./Garbled-Circuit-Point-and-Permute-zh-TW.md) |
| Point-and-Permute (story) | [English](./story-point-and-permute-en-US.md) | [Chinese](./story-point-and-permute-zh-TW.md) |
| Garbled Circuit Optimization: Garbled Row Reduction (GRR3) | [English](./Garbled-Circuit-Garbled-Row-Reduction-GRR3-en-US.md) | [Chinese](./Garbled-Circuit-Garbled-Row-Reduction-GRR3-zh-TW.md) |
| Garbled Circuit Optimization: FreeXOR | [English](./Garbled-Circuit-FreeXOR-en-US.md) | [Chinese](./Garbled-Circuit-FreeXOR-zh-TW.md) |
| Garbled Circuit Optimization: Half Gates | [English](./Garbled-Circuit-Half-Gates-en-US.md) | [Chinese](./Garbled-Circuit-Half-Gates-zh-TW.md) |
| Oblivious Transfer | [English](./Oblivious-Transfer-en-US.md) | [Chinese](./Oblivious-Transfer-zh-TW.md) |
| IKNP OT Extension | [English](./Oblivious-Transfer-IKNP-en-US.md) | [Chinese](./Oblivious-Transfer-IKNP-zh-TW.md) |
| IKNP OT Extension (story) | [English](./OT3D/story-OT-Extension-en-US.md) | [Chinese](./OT3D/story-OT-Extension-zh-TW.md) |
| From Two to Three | [English](./Two-to-Three-en-US.md) | [Chinese](./Two-to-Three-zh-TW.md) |
| GMW / GMW87 | [English](./GMW-en-US.md) | [Chinese](./GMW-zh-TW.md) |
| BGW | [English](./BGW-en-US.md) | [Chinese](./BGW-zh-TW.md) |
| Shamir's Secret Sharing | [English](./Shamir-Secret-Sharing-en-US.md) | [Chinese](./Shamir-Secret-Sharing-zh-TW.md) |
| Beaver Triple | [English](./Beaver-Triple-en-US.md) | [Chinese](./Beaver-Triple-zh-TW.md) |
| Beaver Triple Generation: The MASCOT Way | [English](./Beaver-Triple-Generation-MASCOT-en-US.md) | [Chinese](./Beaver-Triple-Generation-MASCOT-zh-TW.md) |
| BMR | [English](./BMR-en-US.md) | [Chinese](./BMR-zh-TW.md) |
| PRF / OPRF / PSI | [English](./PRF-OPRF-PSI-en-US.md) | [Chinese](./PRF-OPRF-PSI-zh-TW.md) |
| PSI by PSSZ | [English](./PSI-PSSZ-en-US.md) | [Chinese](./PSI-PSSZ-zh-TW.md) |
| Permutation Network | [English](./Permutation-Network-en-US.md) | [Chinese](./Permutation-Network-zh-TW.md) |
| Tailored Oblivious Data Structures | [English](./Tailored-Oblivious-Data-Structures-en-US.md) | [Chinese](./Tailored-Oblivious-Data-Structures-zh-TW.md) |
| Oblivious RAM (ORAM) / Path ORAM | [English](./ORAM-en-US.md) | [Chinese](./ORAM-zh-TW.md) |
| ORAM and MPC | [English](./ORAM-MPC-en-US.md) | [Chinese](./ORAM-MPC-zh-TW.md) |
| Circuit ORAM / Square-Root ORAM | [English](./Circuit-ORAM-Square-Root-ORAM-en-US.md) | [Chinese](./Circuit-ORAM-Square-Root-ORAM-zh-TW.md) |
| Point Function / Distributed Point Function | [English](./Point-Function-Distributed-Point-Function-en-US.md) | [Chinese](./Point-Function-Distributed-Point-Function-zh-TW.md) |
| Function Secret Sharing / Distributed Point Function | [English](./Function-Secret-Sharing-Distributed-Point-Function-en-US.md) | [Chinese](./Function-Secret-Sharing-Distributed-Point-Function-zh-TW.md) |
| Malicious Security - Cut-and-Choose | [English](./Malicious-Security-Cut-And-Choose-en-US.md) | [Chinese](./Malicious-Security-Cut-And-Choose-zh-TW.md) |
| Malicious Security - Zero-knowledge Proofs | [English](./Malicious-Security-Zero-Knowledge-Proofs-en-US.md) | [Chinese](./Malicious-Security-Zero-Knowledge-Proofs-zh-TW.md) |
| Malicious Secret Sharing - Authenticated Secret Sharing | [English](./Malicious-Security-Authenticated-Secret-Sharing-en-US.md) | [Chinese](./Malicious-Security-Authenticated-Secret-Sharing-zh-TW.md) |
| Authenticated Garbling | [English](./Malicious-Security-Authenticated-Garbling-en-US.md) | [Chinese](./Malicious-Security-Authenticated-Garbling-zh-TW.md) |

## Programs

<a href="https://lcamel.github.io/MPC-Notes/boolean-circuit.html">
Boolean Circuit<br>
<img src="images/boolean-circuit.png" alt="boolean-circuit.png" width="25%">
</a>
<br>
<br>


<a href="https://lcamel.github.io/MPC-Notes/garbled-circuit.html?startFrom=evaluator&w0=0&w3=1">
Garbled Circuit - Evaluator<br>
<img src="images/evaluator.png" alt="evaluator.png" width="25%">
</a>
<br>

<a href="https://lcamel.github.io/MPC-Notes/garbled-circuit.html">
Garbled Circuit - Generator<br>
<img src="images/generator.png" alt="generator.png" width="25%">
</a>
<br>
<br>


<a href="https://lcamel.github.io/MPC-Notes/garbled-circuit.html?startFrom=evaluator&w0=0&w3=1&pointAndPermute=1">
Garbled Circuit - Point-and-Permute - Evaluator<br>
<img src="images/point-and-permute-evaluator.png" alt="evaluator.png" width="25%">
</a>
<br>

<a href="https://lcamel.github.io/MPC-Notes/garbled-circuit.html?pointAndPermute=1">
Garbled Circuit - Point-and-Permute - Generator<br>
<img src="images/point-and-permute-generator.png" alt="generator.png" width="25%">
</a>
<br>
<br>


<a href="images/debug.png">
(Learning the inner works)<br>
<img src="images/debug.png" alt="debug.png" width="25%">
</a>
<br>
<br>

<a href="https://lcamel.github.io/MPC-Notes/OT3D/">
OT Extension (IKNP)<br>
<img src="images/OT-extension.png" alt="OT-extension.png" width="25%">
</a>
<br>
<br>

<a href="https://lcamel.github.io/MPC-Notes/Path-ORAM/Path-ORAM.html">
Path-ORAM<br>
<img src="images/Path-ORAM.png" alt="Path-ORAM.png" width="25%">
</a>
<br>
<br>