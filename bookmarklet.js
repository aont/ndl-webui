const w = document.getElementById("HTML5PlayerFrame")?.contentWindow || window
const url = "http://127.0.0.1:8080/index.html#?jsonInput=" + encodeURIComponent(JSON.stringify({"Cookie":document.cookie,"BaseURL":window.location.origin,"PlayListsTracks":w.PlayListsTracks}))
window.open(url);