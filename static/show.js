/**
 * Fills the table with the decrypted data
 *
 * @param {array} pswds Array of encrypted data for the row
 * @param {array} keys Array of the group keys
 */
function decrypt(pswds, keys) {
  // For each row populate it's columns
  pswds.forEach((rowData, rowIndex) => {
    let row = document.getElementById(rowIndex);
    row = row.getElementsByTagName('td');

    // For each column decrypt the data and place it in the column
    rowData.forEach((colData, colIndex) => {
      // Group and type don't need to be decrypted
      if (colIndex == 3 || colIndex == 5) {
        const text = document.createTextNode(colData);
        row[colIndex].appendChild(text);
      } else {
        const data = getPass(keys[rowData[5]], colData);
        const text = document.createTextNode(data);
        row[colIndex].appendChild(text);
      }
    });
  });
}
