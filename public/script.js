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
  
    // Step 1: Selezione della USB (usando l'API File System Access)
    selectUsbBtn.addEventListener("click", async () => {
      try {
        if (window.showDirectoryPicker) {
          usbDirectoryHandle = await window.showDirectoryPicker();
          usbStatus.textContent = "USB collegata: " + usbDirectoryHandle.name;
          // Mostra la sezione YouTube
          youtubeSection.style.display = "block";
          fetchPlaylists();
        } else {
          alert("Il tuo browser non supporta la selezione della directory USB. Prova con Google Chrome.");
        }
      } catch (error) {
        console.error("Errore nella selezione della USB:", error);
        usbStatus.textContent = "Errore nella selezione della USB.";
      }
    });
  
    // Step 2: Recupera le playlist da YouTube (simulazione con dati dummy)
    async function fetchPlaylists() {
      const dummyPlaylists = [
        { id: "playlist1", title: "Top Hits" },
        { id: "playlist2", title: "Rock Classics" },
        { id: "playlist3", title: "Pop Favorites" }
      ];
      renderPlaylists(dummyPlaylists);
    }
  
    function renderPlaylists(playlists) {
      playlistContainer.innerHTML = "";
      playlists.forEach(playlist => {
        const div = document.createElement("div");
        div.className = "playlist-item";
        div.textContent = playlist.title;
        
        // Pulsante per selezionare la playlist
        const selectBtn = document.createElement("button");
        selectBtn.textContent = "Seleziona";
        selectBtn.addEventListener("click", () => {
          selectedPlaylist = playlist;
          downloadSection.style.display = "block";
          downloadStatus.textContent = `Playlist selezionata: ${playlist.title}`;
        });
        div.appendChild(selectBtn);
        playlistContainer.appendChild(div);
      });
    }
  
    // Step 3: Scarica la playlist in MP3 (simulazione + salvataggio file sulla USB)
    downloadBtn.addEventListener("click", async () => {
      if (!selectedPlaylist) {
        alert("Seleziona prima una playlist.");
        return;
      }
      if (!usbDirectoryHandle) {
        alert("USB non selezionata. Seleziona una USB prima di scaricare.");
        return;
      }
      downloadStatus.textContent = "Download in corso...";
      const downloadTime = 10; // secondi
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed++;
        etaElem.textContent = `Tempo stimato: ${downloadTime - elapsed} secondi rimanenti...`;
        if (elapsed >= downloadTime) {
          clearInterval(interval);
          downloadStatus.textContent = "Download completato!";
          etaElem.textContent = "";
          // Salva un file dummy sulla USB
          saveDummyFile();
        }
      }, 1000);
    });
  
    // Funzione per salvare un file dummy sulla USB
    async function saveDummyFile() {
      try {
        // Creiamo un nome file basato sul titolo della playlist
        const fileName = `${selectedPlaylist.title.replace(/\s+/g, '_')}.mp3`;
        const fileHandle = await usbDirectoryHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write("Contenuto dummy MP3 per " + selectedPlaylist.title);
        await writable.close();
        alert("File salvato sulla USB: " + fileName);
      } catch (error) {
        console.error("Errore nel salvataggio del file:", error);
        alert("Errore nel salvataggio del file sulla USB.");
      }
    }
  });  