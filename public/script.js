document.addEventListener("DOMContentLoaded", () => {
    const usbStatus = document.getElementById("usb-status");
    const selectUsbBtn = document.getElementById("select-usb");
    const youtubeSection = document.getElementById("youtube-section");
    const playlistContainer = document.getElementById("playlist-container");
    const downloadSection = document.getElementById("download-section");
    const downloadStatus = document.getElementById("download-status");
    const downloadBtn = document.getElementById("download-btn");
    const etaElem = document.getElementById("eta");
  
    let usbDirectoryHandle = null;
    let selectedPlaylist = null;
  
    // Step 1: Selezione della "USB" (API File System Access)
    selectUsbBtn.addEventListener("click", async () => {
      try {
        if (window.showDirectoryPicker) {
          usbDirectoryHandle = await window.showDirectoryPicker();
          usbStatus.textContent = "USB collegata: " + usbDirectoryHandle.name;
          youtubeSection.style.display = "block";
          fetchPlaylists();
        } else {
          alert("Il tuo browser non supporta l'API File System Access. Usa Google Chrome.");
        }
      } catch (error) {
        console.error("Errore nella selezione della USB:", error);
        usbStatus.textContent = "Errore nella selezione della USB.";
      }
    });
  
    // Step 2: Recupera le playlist reali da YouTube usando la Data API
    async function fetchPlaylists() {
      const apiKey = "YOUR_API_KEY_HERE"; // Sostituisci con la tua API key
      const query = "music playlist";
      const maxResults = 10;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Errore nella risposta di rete");
        }
        const data = await response.json();
        renderPlaylists(data.items);
      } catch (error) {
        console.error("Errore nel recupero delle playlist:", error);
        alert("Errore nel recupero delle playlist da YouTube: " + error.message);
      }
    }
  
    function renderPlaylists(playlists) {
      playlistContainer.innerHTML = "";
      playlists.forEach(item => {
        const playlistId = item.id.playlistId;
        const title = item.snippet.title;
        const div = document.createElement("div");
        div.className = "playlist-item";
        div.textContent = title;
        
        // Pulsante per selezionare la playlist
        const selectBtn = document.createElement("button");
        selectBtn.textContent = "Seleziona";
        selectBtn.addEventListener("click", () => {
          selectedPlaylist = { id: playlistId, title: title };
          downloadSection.style.display = "block";
          downloadStatus.textContent = "Playlist selezionata: " + title;
        });
        div.appendChild(selectBtn);
        playlistContainer.appendChild(div);
      });
    }
  
    // Step 3: Quando clicchi "Scarica Playlist in MP3", chiama l'endpoint backend
    downloadBtn.addEventListener("click", async () => {
      if (!selectedPlaylist) {
        alert("Seleziona prima una playlist.");
        return;
      }
      downloadStatus.textContent = "Download in corso...";
      etaElem.textContent = "Attendere, la playlist sta venendo scaricata...";
      
      try {
        const response = await fetch(`/downloadPlaylist?playlistId=${selectedPlaylist.id}`);
        if (!response.ok) {
          throw new Error("Errore nel download dal server");
        }
        const result = await response.text();
        downloadStatus.textContent = result;
        etaElem.textContent = "";
        // Nota: I file vengono scaricati sul server nella cartella "downloads".
        // Per trasferirli sulla USB del client, dovresti implementare un ulteriore meccanismo (es. listare i file e permettere il download via API File System Access).
      } catch (error) {
        console.error("Errore nel download della playlist:", error);
        downloadStatus.textContent = "Errore nel download: " + error.message;
        etaElem.textContent = "";
      }
    });
  });  