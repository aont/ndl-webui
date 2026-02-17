let currentJobId = null;
let pollInterval = null;

/* ----------------------------------------
   Prefill from URL fragment
---------------------------------------- */

function prefillFromHash() {
    if (!window.location.hash) return;

    const fragment = window.location.hash.substring(1);
    if (!fragment.startsWith("?")) return;

    const params = new URLSearchParams(fragment.substring(1));
    const jsonInputParam = params.get("jsonInput");

    if (!jsonInputParam) return;

    try {
        const decoded = decodeURIComponent(jsonInputParam);
        document.getElementById("jsonInput").value = decoded;
    } catch (e) {
        console.error("Failed to decode jsonInput");
    }
}

/* ----------------------------------------
   Start job
---------------------------------------- */

document.getElementById("startBtn").onclick = async () => {
    const raw = document.getElementById("jsonInput").value;

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        alert("Invalid JSON");
        return;
    }

    const resp = await fetch("/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(parsed)
    });

    const data = await resp.json();
    currentJobId = data.job_id;

    document.getElementById("progressSection").style.display = "block";
    document.getElementById("downloadSection").style.display = "none";

    pollInterval = setInterval(pollProgress, 1000);
};

/* ----------------------------------------
   Poll progress
---------------------------------------- */

async function pollProgress() {
    const resp = await fetch(`/progress/${currentJobId}`);
    const data = await resp.json();

    const percent = data.total
        ? (data.progress / data.total) * 100
        : 0;

    document.getElementById("progressBar").value = percent;
    document.getElementById("progressText").innerText =
        `Progress: ${data.progress} / ${data.total}`;

    document.getElementById("logOutput").innerText =
        data.logs.join("\n");

    if (data.done) {
        clearInterval(pollInterval);
        await fetchZipIntoMemory();
    }
}

/* ----------------------------------------
   Fetch ZIP and create blob URL
---------------------------------------- */

async function fetchZipIntoMemory() {
    document.getElementById("progressText").innerText =
        "Downloading ZIP into memory...";

    const resp = await fetch(`/download/${currentJobId}`);
    if (!resp.ok) {
        alert("Failed to download ZIP");
        return;
    }

    const blob = await resp.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.getElementById("downloadLink");
    link.href = blobUrl;

    document.getElementById("downloadSection").style.display = "block";

    document.getElementById("progressText").innerText =
        "ZIP ready for download";
}

/* ----------------------------------------
   Initialize
---------------------------------------- */

window.addEventListener("DOMContentLoaded", () => {
    prefillFromHash();
});
