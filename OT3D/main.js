export let ROW;
export let r;

export function setR(rArr) {
    console.log("rArr: ", rArr);
    ROW = rArr.length;
    r = rArr.slice();
}
// export { setR };