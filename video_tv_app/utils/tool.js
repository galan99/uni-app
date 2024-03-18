
export function dateFormt () {
	let text = ''
	function getCurrentDate() {
	  const now = new Date();
	  const year = now.getFullYear();
	  const month = padStart(now.getMonth() + 1); // 月份是从0开始的
	  const day = padStart(now.getDate());
	  const hour = now.getHours()
	  const second = padStart(now.getMinutes())
	  
	  text = `${year}-${month}-${day} ${hour}:${second}`;
	}
	
	function padStart(value) {
	  return value.toString().padStart(2, '0');
	}
	
	getCurrentDate()
	return text
}