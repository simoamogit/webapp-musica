document.addEventListener("DOMContentLoaded", () => {
    const usbStatus = document.getElementById("usb-status");
    const selectUsbBtn = document.getElementById("select-usb");
    const youtubeSection = document.getElementById("youtube-section");
    const playlistContainer = document.getElementById("playlist-container");
    const downloadSection = document.getElementById("download-section");
    const downloadStatus = document.getElementById("download-status");
    const downloadBtn = document.getElementById("download-btn");
    const etaElem = document.getElementById("eta");
    const saveFileBtn = document.getElementById("save-file-btn");
  
    let usbDirectoryHandle = null;
    let selectedPlaylist = null;
  
    // Step 1: Selezione della USB (API File System Access)
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
  
    // Step 2: Recupera le playlist reali da YouTube
    async function fetchPlaylists() {
      const apiKey = "AIzaSyBlqaZztfx0f0WH2NHZQ0Cyk3e5ULAAZR0"; // Sostituisci con la tua API key
      const query = "music playlist";
      const maxResults = 10;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${apiKey}`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
  
    // Step 3: Simula il download della playlist
    downloadBtn.addEventListener("click", () => {
      if (!selectedPlaylist) {
        alert("Seleziona prima una playlist.");
        return;
      }
      if (!usbDirectoryHandle) {
        alert("USB non selezionata. Seleziona una USB prima di scaricare.");
        return;
      }
      downloadStatus.textContent = "Download in corso...";
      const downloadTime = 10; // secondi di simulazione
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed++;
        etaElem.textContent = "Tempo stimato: " + (downloadTime - elapsed) + " secondi rimanenti...";
        if (elapsed >= downloadTime) {
          clearInterval(interval);
          downloadStatus.textContent = "Download completato! Premi il pulsante per salvare il file.";
          etaElem.textContent = "";
          // Mostra il pulsante per salvare il file (richiede user activation)
          saveFileBtn.style.display = "block";
        }
      }, 1000);
    });
  
    // Step 4: Salva il file dummy sulla USB (richiede un'azione utente)
    saveFileBtn.addEventListener("click", async () => {
      await saveDummyFile();
    });
  
    async function saveDummyFile() {
      try {
        const fileName = `${selectedPlaylist.title.replace(/\s+/g, '_')}.mp3`;
        const fileHandle = await usbDirectoryHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write("Contenuto dummy MP3 per " + selectedPlaylist.title);
        await writable.close();
        alert("File salvato sulla USB: " + fileName);
      } catch (error) {
        console.error("Errore nel salvataggio del file:", error.message);
        alert("Errore nel salvataggio del file sulla USB: " + error.message);
      }
    }
  });