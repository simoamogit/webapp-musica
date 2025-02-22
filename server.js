const express = require("express");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * Endpoint per scaricare l'intera playlist.
 * Questo endpoint utilizza yt-dlp per scaricare tutti i brani della playlist in formato mp3.
 * I file verranno salvati nella cartella "downloads" sul server.
 */
app.get("/downloadPlaylist", (req, res) => {
  const playlistId = req.query.playlistId;
  if (!playlistId) {
    return res.status(400).send("Playlist ID mancante");
  }
  
  // Costruisci l'URL della playlist
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
  
  // Costruisci il comando per scaricare e convertire la playlist in mp3.
  // Il parametro -o specifica il percorso e il pattern per il nome del file.
  const command = `yt-dlp -x --audio-format mp3 "${playlistUrl}" -o "./downloads/%(title)s.%(ext)s"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Errore durante il download:", error);
      return res.status(500).send("Errore durante il download: " + stderr);
    }
    res.send("Download completato. I file sono stati salvati sul server nella cartella 'downloads'.");
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});