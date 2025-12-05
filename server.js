import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());

// ------------------------------
// Load JSON files
// ------------------------------
const artists = JSON.parse(fs.readFileSync("./data/artists.json"));
const galleries = JSON.parse(fs.readFileSync("./data/galleries.json"));
const paintings = JSON.parse(fs.readFileSync("./data/paintings-nested.json"));

// ------------------------------
//   API ROUTES
// ------------------------------

// ---------------- PAINTINGS ----------------

// /api/paintings  → all paintings
app.get("/api/paintings", (req, res) => {
    res.json(paintings);
});

// /api/painting/:id → single painting by ID
app.get("/api/painting/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const result = paintings.find(p => p.paintingID === id);

    if (!result) {
        return res.json({ message: `Painting with id ${id} not found` });
    }
    res.json(result);
});

// /api/painting/gallery/:id → paintings from gallery
app.get("/api/painting/gallery/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const result = paintings.filter(p => p.gallery.galleryID === id);

    if (result.length === 0) {
        return res.json({ message: `No paintings found for gallery id ${id}` });
    }
    res.json(result);
});

// /api/painting/artist/:id → paintings from artist
app.get("/api/painting/artist/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const result = paintings.filter(p => p.artist.artistID === id);

    if (result.length === 0) {
        return res.json({ message: `No paintings found for artist id ${id}` });
    }
    res.json(result);
});

// /api/painting/year/:min/:max → year range
app.get("/api/painting/year/:min/:max", (req, res) => {
    const min = parseInt(req.params.min);
    const max = parseInt(req.params.max);

    const result = paintings.filter(
        p => p.yearOfWork >= min && p.yearOfWork <= max
    );

    if (result.length === 0) {
        return res.json({ message: `No paintings found between ${min} and ${max}` });
    }
    res.json(result);
});

// /api/painting/title/:text → title contains text (case insensitive)
app.get("/api/painting/title/:text", (req, res) => {
    const text = req.params.text.toLowerCase();

    const result = paintings.filter(p =>
        p.title.toLowerCase().includes(text)
    );

    if (result.length === 0) {
        return res.json({ message: `No paintings found containing '${text}' in title` });
    }
    res.json(result);
});

// /api/painting/color/:name → dominant color name match
app.get("/api/painting/color/:name", (req, res) => {
    const colorName = req.params.name.toLowerCase();

    const result = paintings.filter(p =>
        p.details.annotation.dominantColors.some(
            c => c.name.toLowerCase() === colorName
        )
    );

    if (result.length === 0) {
        return res.json({ message: `No paintings found with color '${colorName}'` });
    }
    res.json(result);
});

// ---------------- ARTISTS ----------------

// /api/artists → all artists
app.get("/api/artists", (req, res) => {
    res.json(artists);
});

// /api/artists/:country → filter by nationality (case insensitive)
app.get("/api/artists/:country", (req, res) => {
    const search = req.params.country.toLowerCase();

    const result = artists.filter(a =>
        a.Nationality.toLowerCase() === search
    );

    if (result.length === 0) {
        return res.json({ message: `No artists found from '${search}'` });
    }
    res.json(result);
});

// ---------------- GALLERIES ----------------

// /api/galleries → all galleries
app.get("/api/galleries", (req, res) => {
    res.json(galleries);
});

// /api/galleries/:country → filter galleries by country
app.get("/api/galleries/:country", (req, res) => {
    const search = req.params.country.toLowerCase();
    const result = galleries.filter(g =>
        g.GalleryCountry.toLowerCase() === search
    );

    if (result.length === 0) {
        return res.json({ message: `No galleries found in '${search}'` });
    }
    res.json(result);
});

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
