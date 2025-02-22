const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/download", (req, res) => {
    const { url } = req.body;
    
    if (!url) return res.json({ message: "Errore: nessun URL inserito!" });

    const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "public/downloads/%(title)s.%(ext)s" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Errore: ${stderr}`);
            return res.json({ message: "Errore nel download della playlist!" });
        }
        res.json({ message: "Download completato!" });
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server avviato su http://localhost:${PORT}`);
});