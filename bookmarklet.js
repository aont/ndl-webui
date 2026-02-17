const w = document.getElementById("HTML5PlayerFrame")?.contentWindow || window
const url = "https://aont.github.io/ndl-webui/#?jsonInput=" + encodeURIComponent(JSON.stringify({"Cookie":document.cookie,"BaseURL":window.location.origin,"PlayListsTracks":w.PlayListsTracks}))
window.open(url);
