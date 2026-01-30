# Prasanth Kotaru - Personal Website

Modern, minimalist personal academic website built with Next.js 15, React 19, and TailwindCSS.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see your site!

### Building for Production

```bash
# Create optimized production build
npm run build

# The static site will be in the 'out/' folder
```

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Main page (single-page site)
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Hero.tsx      # About section
│   │   ├── Research.tsx  # Research interests
│   │   ├── Publications.tsx  # Publications list
│   │   ├── Projects.tsx  # Projects showcase
│   │   ├── Contact.tsx   # Contact information
│   │   └── Footer.tsx    # Footer
│   └── data/             # Content in JSON format
│       └── publications.json  # All publications
├── public/
│   ├── media/            # Images and videos
│   └── pdf/              # PDFs (CV, papers)
└── _archive/             # Old HTML files (for reference)
```

## ✏️ Editing Content

### Adding/Updating Publications

Edit `src/data/publications.json`:

```json
{
  "publications": [
    {
      "id": "unique-id",
      "title": "Paper Title",
      "authors": ["Author 1", "Prasanth Kotaru", "Author 3"],
      "venue": "Conference Name",
      "year": 2024,
      "type": "conference",  // or "journal" or "preprint"
      "image": "/media/image.gif",
      "links": {
        "pdf": "/pdf/paper.pdf",
        "arxiv": "https://arxiv.org/...",
        "video": "https://youtube.com/...",
        "github": "https://github.com/..."
      }
    }
  ]
}
```

### Adding Images

1. Place images in `public/media/`
2. Reference them as `/media/filename.png` in your JSON files

### Updating Bio

Edit these files:
- `src/components/Hero.tsx` - About section and education
- `src/components/Research.tsx` - Research interests
- `src/components/Contact.tsx` - Contact information

## 🚀 Deployment

### GitHub Pages (Automatic)

GitHub Actions will automatically deploy when you push to `main`:

```bash
git add .
git commit -m "Update content"
git push origin main
```

The site will be live at `https://vkotaru.github.io` in ~2 minutes!

### Manual Deployment

```bash
npm run build
# Upload the 'out/' folder to your hosting service
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Deployment**: GitHub Pages (static export)

## 📝 Notes for Non-JS Developers

- **JSON files** are like Python dictionaries - easy to edit!
- **Don't edit** `.tsx` files unless you're comfortable with TypeScript/React
- **To update content**: Just edit the JSON files in `src/data/`
- **To add images**: Drop them in `public/media/` folder
- **To see changes**: Run `npm run dev` and visit `localhost:3000`

## 🔧 Maintenance

### Installing Dependencies

```bash
npm install
```

### Running Development Server

```bash
npm run dev
```

### Common Tasks

- **Add a publication**: Edit `src/data/publications.json`
- **Change bio**: Edit `src/components/Hero.tsx`
- **Update research interests**: Edit `src/components/Research.tsx`
- **Add/remove projects**: Edit `src/components/Projects.tsx`

## 📄 License

This is a personal website. Feel free to use the code structure as a template for your own site!

---

Built with ❤️ using Next.js and TailwindCSS
