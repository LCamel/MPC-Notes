test html 

# 我的頁面

這是一個示例頁面。

<div id="my-div">
  <p>這裡是放在 div 裡的內容。</p>
</div>

<script type="module">
  import { greet } from './greet.js';
  greet();
</script>


# 測試 123


        <style>
            #THE_CONTAINER { width: 500px; height: 500px; background-color: gray; margin: 0; }
        </style>


        <script type="module">
            import * as main from "./main.js";
            main.init(document.getElementById("THE_CONTAINER"), 5, 3);
            window.main = main;
        </script>
        <script>
            function inputR() {
                var rStr = prompt("Input r:\nExample:\n1\n0\n101\n01001011001");
                console.log(rStr);
                main.setR([...rStr]);
            }

            var nextOTColumn = 0;
            function getNextOTColumn() {
                let ans = nextOTColumn;
                nextOTColumn = (nextOTColumn + 1) % main.COL;
                return ans;
            }

            var showRowIfGreatOrEqualThan = 0;
            var showTarget = false;
            function nextRow() {
                showRowIfGreatOrEqualThan = (showRowIfGreatOrEqualThan + 1) % main.ROW;
            }
            function toggleTarget() {
                showTarget = !showTarget;
            }
            function hideShow() {
                main.hideShowRows((i) => i >= showRowIfGreatOrEqualThan);
                main.hideShowTargets((i) => showTarget && (i >= showRowIfGreatOrEqualThan));
            }
        </script>
        <button onclick="inputR()">input r</button>
        <button onclick="main.generateT()">🎲 generate T</button>
        <button onclick="main.computeT_XOR_r()">compute T⊕r</button><br>

        <button onclick="main.generateS()">🎲 generate s</button>
        <button onclick="main.obliviousTransferQColumn(getNextOTColumn())">Oblivious Transfer q *</button>
        <button onclick="main.computeQ_XOR_s()">compute Q⊕s</button><br>

        <button onclick="toggleTarget(); hideShow();">toggle targes *</button>
        <button onclick="nextRow(); hideShow();">examine layers *</button>

        <div id="THE_CONTAINER"></div>

# 測試 223