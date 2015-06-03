var test
var test2
var num

function decrypt(pswds, keys, count){
	test = pswds
	test2 = keys
	num = count
	var temp
	for(i = 1; i < count; i++){
		temp = document.getElementById(i)
		temp = temp.getElementsByTagName('td')
		for(j = 0; j <= 5; j++){
			if(j == 3 || j == 5){
				var text = document.createTextNode(pswds[i-1][j])
				temp[j].appendChild(text)
			} else {
				var data = getPass(keys[pswds[i-1][5]], pswds[i-1][j])
				var text = document.createTextNode(data)
				temp[j].appendChild(text)
			}
		}
	}
}