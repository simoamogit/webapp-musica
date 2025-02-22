document.getElementById("downloadBtn").addEventListener("click", async () => {
    const playlistUrl = document.getElementById("playlistUrl").value;
    const status = document.getElementById("status");

    if (!playlistUrl) {
        status.innerText = "Inserisci un link valido!";
        return;
    }

    status.innerText = "Scaricamento in corso...";

    const response = await fetch("/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: playlistUrl })
    });

    const data = await response.json();
    status.innerText = data.message;
});