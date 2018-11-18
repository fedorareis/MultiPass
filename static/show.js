let test;
let test2;
let num;

/**
 *
 * @param {*} pswds
 * @param {*} keys
 * @param {*} count
 */
function decrypt(pswds, keys, count) {
  test = pswds;
  test2 = keys;
  num = count;
  let temp;
  for (i = 1; i < count; i++) {
    temp = document.getElementById(i);
    temp = temp.getElementsByTagName('td');
    for (j = 0; j <= 5; j++) {
      if (j == 3 || j == 5) {
        const text = document.createTextNode(pswds[i-1][j]);
        temp[j].appendChild(text);
      } else {
        const data = getPass(keys[pswds[i-1][5]], pswds[i-1][j]);
        const text = document.createTextNode(data);
        temp[j].appendChild(text);
      }
    }
  }
}
