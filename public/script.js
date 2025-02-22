document.addEventListener("DOMContentLoaded", () => {
    const usbStatus = document.getElementById("usb-status");
    const selectUsbBtn = document.getElementById("select-usb");
    const youtubeSection = document.getElementById("youtube-section");
    const playlistContainer = document.getElementById("playlist-container");
    const downloadSection = document.getElementById("download-section");
    const downloadStatus = document.getElementById("download-status");
    const downloadBtn = document.getElementById("download-btn");
    const etaElem = document.getElementById("eta");
    const playerSection = document.getElementById("player-section");
    const openPlayerBtn = document.getElementById("open-player");
    const audioPlayer = document.getElementById("audio-player");
  
    let usbDirectoryHandle = null;
    let selectedPlaylist = null;
  
    // Step 1: Selezione della USB (simulata con File System Access API)
    selectUsbBtn.addEventListener("click", async () => {
      try {
        usbDirectoryHandle = await window.showDirectoryPicker();
        usbStatus.textContent = "USB collegata: " + usbDirectoryHandle.name;
        // Ora che la USB è collegata, mostra la sezione YouTube
        youtubeSection.style.display = "block";
        fetchPlaylists();
      } catch (error) {
        console.error("Errore nella selezione della USB:", error);
        usbStatus.textContent = "Errore nella selezione della USB.";
      }
    });
  
    // Step 2: Recupera le playlist da YouTube (simulazione)
    async function fetchPlaylists() {
      // Qui dovresti usare la YouTube Data API con la tua API key.
      // Per questo esempio, usiamo dati dummy.
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
          // Mostra la sezione download
          downloadSection.style.display = "block";
          downloadStatus.textContent = `Playlist selezionata: ${playlist.title}`;
        });
        div.appendChild(selectBtn);
        playlistContainer.appendChild(div);
      });
    }
  
    // Step 3: Simula il download della playlist in MP3
    downloadBtn.addEventListener("click", async () => {
      if (!selectedPlaylist) {
        alert("Seleziona prima una playlist.");
        return;
      }
      downloadStatus.textContent = "Download in corso...";
      // Simuliamo il download con un timer (ad esempio 10 secondi)
      const downloadTime = 10; // secondi
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed++;
        etaElem.textContent = `Tempo stimato: ${downloadTime - elapsed} secondi rimanenti...`;
        if (elapsed >= downloadTime) {
          clearInterval(interval);
          downloadStatus.textContent = "Download completato!";
          etaElem.textContent = "";
          // Mostra la sezione del media player
          playerSection.style.display = "block";
          // Qui dovresti chiamare il backend per scaricare e salvare i file sulla USB
        }
      }, 1000);
    });
  
    // Step 4: Avvia il media player
    openPlayerBtn.addEventListener("click", () => {
      // Simulazione: mostra l'elemento audio con un file mp3 d'esempio
      audioPlayer.style.display = "block";
      // Puoi impostare una sorgente dummy, ad esempio un file mp3 ospitato online
      audioPlayer.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
      audioPlayer.play();
    });
  });  