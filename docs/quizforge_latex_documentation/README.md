# QuizForge Backend Documentation

## 🚀 Quick Start with Overleaf (Recommended!)

**⚠️ IMPORTANT:** The full document (200+ pages) may timeout on Overleaf's free plan.  
**✅ SOLUTION:** Use the **split version** (5 separate PDFs) - see below!

### Option A: Split Documentation (Works on Free Plan!) ⭐

Compile 5 smaller PDFs instead of one large document:

**READY-TO-USE ZIP:** `quizforge-overleaf-ready.zip` (in parent folder)

1. Go to https://www.overleaf.com and create free account
2. **Upload ZIP:**
   - "New Project" → "Upload Project"
   - Select: `/home/albinsphilip/Desktop/proj/quizforge-overleaf-ready.zip`
   - Wait for upload (structure preserved automatically!)
3. Compile each part separately:
   - `quizforge_part1_intro_architecture.tex` (~40 pages)
   - `quizforge_part2_models.tex` (~100 pages)
   - `quizforge_part3_business_logic.tex` (~70 pages)
   - `quizforge_part4_security_api.tex` (~60 pages)
   - `quizforge_part5_config.tex` (~50 pages)
4. Download 5 PDFs covering all content ✅

**📖 See:** `SPLIT_DOCUMENTATION_GUIDE.md` for complete instructions

### Option B: Single Document (May Timeout on Free Plan)

1. Upload files to Overleaf
2. Set `quizforge_main.tex` as main file
3. Click "Recompile" (⚠️ may timeout after 60 seconds)

**If timeout:** Use Option A (split version) or upgrade to Overleaf Premium

---

**📖 Detailed Setup:** See `OVERLEAF_GUIDE.md`  
**🚨 Having Issues?** See `TROUBLESHOOTING.md` for common error fixes  
**✅ All Fixes Applied:** Unicode, \end{document}, tikz-er2 (see `FIXES_APPLIED.md`)

---

## Overview

This directory contains comprehensive LaTeX documentation for the QuizForge backend system, including:

- Complete line-by-line code explanations
- OpenAPI 3.0 API documentation
- Entity-Relationship diagrams
- Architecture and design patterns
- Configuration details
- Dependency information

## Document Structure

```
documentation/
├── quizforge_main.tex              # Main LaTeX document
├── chapters/
│   ├── 01_introduction.tex         # Project overview and tech stack
│   ├── 02_architecture.tex         # System architecture
│   ├── 03_models.tex               # JPA entities (Part 1)
│   ├── 03_models_continued.tex     # JPA entities (Part 2)
│   ├── 04_repositories.tex         # Data access layer
│   ├── 05_services.tex             # Business logic (Part 1)
│   ├── 05_services_continued.tex   # Business logic (Part 2)
│   ├── 06_controllers.tex          # REST endpoints
│   ├── 07_security.tex             # JWT authentication & authorization
│   ├── 08_api_documentation.tex    # Complete API reference
│   ├── 09_er_diagram.tex           # Database relationships
│   ├── 10_configuration.tex        # Application configuration
│   └── appendix_a_dependencies.tex # Complete dependency list
└── README.md                        # This file
```

## Prerequisites

To compile this documentation, you need:

### LaTeX Distribution

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install texlive-full
```

**macOS:**
```bash
brew install --cask mactex
```

**Windows:**
Download and install MiKTeX or TeX Live from:
- MiKTeX: https://miktex.org/download
- TeX Live: https://www.tug.org/texlive/

### Required LaTeX Packages

The following packages are used (included in texlive-full):
- `geometry` - Page layout
- `tikz` - Diagrams and ER diagrams
- `tikz-er2` - ER diagram support
- `listings` - Code syntax highlighting
- `xcolor` - Color support
- `hyperref` - Hyperlinks and PDF metadata
- `tcolorbox` - Colored boxes
- `fancyhdr` - Headers and footers
- `titlesec` - Title formatting
- `longtable` - Multi-page tables
- `array` - Enhanced tables
- `booktabs` - Professional tables
- `enumitem` - Enhanced lists
- `pdflscape` - Landscape pages

## Compiling the Documentation

### Method 1: Using Overleaf (Easiest - No Installation!)

**See detailed guide in `OVERLEAF_GUIDE.md`**

Quick steps:
1. Go to https://www.overleaf.com
2. Create free account
3. New Project → Upload files
4. Set `quizforge_main.tex` as main file
5. Click "Recompile"
6. Download PDF!

**Advantages:**
- No LaTeX installation needed
- Works in browser
- Auto-saves your work
- Easy collaboration
- All packages included

### Method 2: Using pdflatex (Local Installation)

If you prefer local compilation:

```bash
cd /home/albinsphilip/Desktop/proj/quizforge/documentation

# First pass
pdflatex quizforge_main.tex

# Second pass (for references)
pdflatex quizforge_main.tex

# Third pass (for table of contents)
pdflatex quizforge_main.tex
```

**Why three passes?**
- First pass: Processes content
- Second pass: Resolves references
- Third pass: Updates table of contents

### Method 3: Using latexmk (Automated Local)

```bash
cd /home/albinsphilip/Desktop/proj/quizforge/documentation

# Compile with automatic passes
latexmk -pdf quizforge_main.tex

# Clean auxiliary files
latexmk -c
```

## Output

After successful compilation, you'll get:
- `quizforge_main.pdf` - The complete documentation (200+ pages)

## Viewing the PDF

**Linux:**
```bash
xdg-open quizforge_main.pdf
# or
evince quizforge_main.pdf
```

**macOS:**
```bash
open quizforge_main.pdf
```

**Windows:**
```bash
start quizforge_main.pdf
```

## Troubleshooting

### Missing Packages Error

If you get errors about missing packages:

**MiKTeX (Windows):**
- Packages are auto-installed on first use
- Or use MiKTeX Package Manager

**TeX Live (Linux/Mac):**
```bash
# Install specific package
sudo tlmgr install <package-name>

# Update all packages
sudo tlmgr update --all
```

### Compilation Errors

1. **"File not found" errors:**
   - Ensure you're in the `documentation` directory
   - Check that all chapter files exist in `chapters/` subdirectory

2. **"Undefined control sequence" errors:**
   - Install missing LaTeX packages
   - Check package versions

3. **"Dimension too large" errors:**
   - Usually with TikZ diagrams
   - Try compiling with LuaLaTeX instead:
     ```bash
     lualatex quizforge_main.tex
     ```

### Clean Build

To remove all auxiliary files and start fresh:

```bash
# Manual cleanup
rm -f *.aux *.log *.out *.toc *.lof *.lot *.fls *.fdb_latexmk

# Using latexmk
latexmk -C

# Compile fresh
pdflatex quizforge_main.tex
pdflatex quizforge_main.tex
pdflatex quizforge_main.tex
```

## Document Features

### Table of Contents
- Automatically generated
- Hyperlinked to sections
- Page numbers included

### Code Listings
- Syntax highlighted (Java, SQL, JSON, XML, Bash)
- Line numbers
- Colored backgrounds
- Copy-paste ready

### Diagrams
- System architecture diagrams
- ER diagrams with relationships
- Authentication flow diagrams
- Request flow diagrams

### Tables
- Professional formatting with booktabs
- Multi-page tables with longtable
- API endpoint documentation
- Configuration references

### Hyperlinks
- Internal cross-references
- External URLs
- Clickable table of contents
- Colored links for easy navigation

## Customization

### Changing Colors

Edit in `quizforge_main.tex`:
```latex
\definecolor{codegreen}{rgb}{0,0.6,0}
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
```

### Page Layout

Edit in `quizforge_main.tex`:
```latex
\geometry{
    a4paper,
    left=25mm,
    right=25mm,
    top=30mm,
    bottom=30mm
}
```

### Font Size

Change in document class:
```latex
\documentclass[11pt,a4paper]{report}  % or 10pt, 12pt
```

## Splitting the PDF

If you need separate PDFs for each chapter:

```bash
# Install pdftk
sudo apt-get install pdftk

# Split by page ranges
pdftk quizforge_main.pdf cat 1-20 output chapter1.pdf
pdftk quizforge_main.pdf cat 21-40 output chapter2.pdf
```

## Version Information

- **Document Version:** 1.0.0
- **Date:** November 10, 2025
- **LaTeX Version:** LaTeX2e
- **Target Output:** PDF/A-1b compliant

## License

This documentation is part of the QuizForge project.

## Support

For issues or questions:
1. Check compilation logs in `.log` files
2. Verify all chapter files are present
3. Ensure LaTeX distribution is up to date

## File Sizes (Approximate)

- Main document: ~5 KB
- Each chapter: 10-50 KB
- Final PDF: ~1-2 MB (depending on diagrams)

## Backup

Before making changes, backup the documentation:

```bash
tar -czf quizforge-docs-backup-$(date +%Y%m%d).tar.gz documentation/
```

---

**Generated:** November 2025
**Format:** LaTeX with pdflatex
**Pages:** ~200+ pages
**Language:** English
