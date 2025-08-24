const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('zipFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries().map((entry) => entry.entryName);
    res.send(`<h2>Files:</h2><ul>${entries.map((e) => `<li>${e}</li>`).join('')}</ul>`);
  } catch (err) {
    console.error('Error processing zip:', err);
    res.status(500).send('Error processing zip file');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
