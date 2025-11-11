# 🚨 QuizForge Documentation - Quick Troubleshooting

## Common Overleaf Compilation Errors

### ❌ Error 1: "File not found" - Chapter Files

**Error Message:**
```
! LaTeX Error: File `chapters/01_introduction.tex' not found.
```

**Cause:** Chapter files are not in the `chapters` folder

**Solution (30 seconds):**
1. Create a folder named `chapters` in Overleaf
2. Move all 13 numbered `.tex` files into it:
   - `01_introduction.tex`
   - `02_architecture.tex`
   - `03_models.tex`
   - `03_models_continued.tex`
   - `04_repositories.tex`
   - `05_services.tex`
   - `05_services_continued.tex`
   - `06_controllers.tex`
   - `07_security.tex`
   - `08_api_documentation.tex`
   - `09_er_diagram.tex`
   - `10_configuration.tex`
   - `appendix_a_dependencies.tex`
3. Click "Recompile"

**Visual Check:**
```
✅ CORRECT:
Project/
├── quizforge_main.tex
└── chapters/
    └── [all 13 .tex files]

❌ WRONG:
Project/
├── quizforge_main.tex
├── 01_introduction.tex  ← Should be in chapters/
└── chapters/  ← Empty!
```

---

### ❌ Error 2: Only Chapter 1 Compiles

**Error Message:**
```
PDF shows only 10-15 pages (Introduction chapter only)
Rest of chapters missing from output
```

**Cause:** Chapter files contained `\end{document}` commands

**Solution:**
✅ **Already fixed!** All `\end{document}` commands removed from chapter files.

**If you still see this:**
1. Download latest files from `/home/albinsphilip/Desktop/proj/quizforge/documentation/`
2. Delete old Overleaf project
3. Upload fresh files as ZIP
4. Recompile

**How to verify it's fixed:**
- Open any chapter file in Overleaf
- Search for `\end{document}` (Ctrl+F)
- Should find: 0 results
- Only `quizforge_main.tex` should have `\end{document}` at the very end

---

### ❌ Error 3: "Unicode character ├ (U+251C)" or similar

**Error Message:**
```
! LaTeX Error: Unicode character ├ (U+251C)
! LaTeX Error: Unicode character └ (U+2514)
! LaTeX Error: Unicode character │ (U+2502)
```

**Cause:** Tree diagrams or special characters used Unicode

**Solution:**
✅ **Already fixed!** The latest version uses ASCII-only characters.

**What was changed:**
- Tree diagrams now use ASCII: `|--`, `\`--`, `|`
- Arrows now use LaTeX: `$\rightarrow$` instead of `→`
- All special characters converted to LaTeX equivalents

---

### ❌ Error 4: "File 'tikz-er2.sty' not found"

**Error Message:**
```
! LaTeX Error: File `tikz-er2.sty' not found.
```

**Cause:** Old version of documentation used non-standard package

**Solution:**
✅ **Already fixed!** The latest version (you should have) uses standard TikZ libraries.

**If you still see this error:**
1. Download the latest files from `/home/albinsphilip/Desktop/proj/quizforge/documentation/`
2. Replace these files in Overleaf:
   - `quizforge_main.tex` (line 11 should say `\usetikzlibrary{shapes.multipart, positioning, arrows.meta, calc}`)
   - `chapters/09_er_diagram.tex`
3. Recompile

**What was changed:**
- **Old:** `\usepackage{tikz-er2}` ❌
- **New:** `\usetikzlibrary{shapes.multipart, positioning, arrows.meta, calc}` ✅

---

### ❌ Error 5: Main document not set

**Error Message:**
```
No .tex file found to compile
```

**Cause:** `quizforge_main.tex` is not set as the main document

**Solution:**
1. Find `quizforge_main.tex` in the file list (left sidebar)
2. Right-click on it
3. Select "Set as Main File"
4. You should see a main file icon (📄) next to it
5. Click "Recompile"

---

### ❌ Error 6: "Undefined control sequence"

**Error Message:**
```
! Undefined control sequence.
l.123 \somecommand
```

**Cause:** Typo in LaTeX command or missing package

**Solution:**
1. Click "Logs and output files"
2. Find the line number (e.g., `l.123`)
3. Check that line for typos
4. Overleaf includes all standard packages, so this is usually a typo

---

### ❌ Error 7: Compilation timeout

**Error Message:**
```
Compilation timed out
```

**Cause:** Document is large, free plan has time limits

**Solution (usually not needed for this doc):**
1. Wait a few minutes and try again
2. Click Menu → "Clear cached files"
3. Recompile
4. If persistent, consider Overleaf Premium (optional)
5. Or compile locally with pdflatex

**Note:** This 200-page documentation should compile fine on free plan!

---

## ⚠️ Warnings (Usually Safe to Ignore)

### Warning: "Overfull \hbox"
- **Meaning:** A line is slightly too wide
- **Impact:** Minor formatting issue
- **Action:** Usually safe to ignore

### Warning: "Underfull \hbox"
- **Meaning:** A line has too much space
- **Impact:** Minor formatting issue
- **Action:** Usually safe to ignore

### Warning: "Reference undefined"
- **Meaning:** Cross-reference not resolved yet
- **Action:** Recompile again (Overleaf does this automatically)

---

## 🔍 How to Debug

### Step 1: Check Logs
1. Click "Logs and output files" (next to Recompile button)
2. Look for lines starting with `!` (errors)
3. Note the file name and line number

### Step 2: Common Patterns

**If error says "file not found":**
- Check file structure (see Error 1 above)

**If error says "package not found":**
- Check if you're using the latest version
- See Error 2 above for tikz-er2

**If error says "undefined":**
- Usually a typo in LaTeX command

**If no specific error:**
- Try Menu → "Clear cached files" → Recompile

---

## 🎯 Pre-Flight Checklist

Before asking for help, verify:

- [ ] I'm using the latest documentation files
- [ ] `chapters` folder exists in Overleaf
- [ ] All 13 chapter files are inside `chapters` folder
- [ ] `quizforge_main.tex` is in root (not in chapters)
- [ ] `quizforge_main.tex` is set as main file
- [ ] I clicked "Recompile" and waited 60 seconds
- [ ] I checked the logs for specific error messages
- [ ] File names match exactly (no typos)

---

## 🚀 Fresh Start (Nuclear Option)

If nothing works, start completely fresh:

### On Your Computer:
```bash
cd /home/albinsphilip/Desktop/proj/quizforge/documentation
ls -la  # Verify files exist
zip -r ../quizforge-docs-fresh.zip .
```

### In Overleaf:
1. Delete the problematic project
2. Click "New Project"
3. Select "Upload Project"
4. Choose the fresh ZIP file
5. Wait for upload (2 minutes)
6. Right-click `quizforge_main.tex` → "Set as Main File"
7. Click "Recompile"
8. ✅ Should work now!

---

## 📊 Expected Compilation Output

### Success Indicators:
✅ Green message: "PDF compiled successfully"  
✅ PDF preview shows content  
✅ Page count: 200+ pages  
✅ Table of contents appears  
✅ All chapters are listed  
✅ No red error messages (warnings are OK)  

### Compilation Times:
- **First time:** 30-60 seconds (normal!)
- **Subsequent:** 5-10 seconds

---

## 🔧 File Version Check

Make sure you have the correct version of key files:

### quizforge_main.tex (line 10-12 should be):
```latex
\usepackage{tikz}
\usetikzlibrary{shapes.multipart, positioning, arrows.meta, calc}
\usepackage{listings}
```

**NOT:**
```latex
\usepackage{tikz}
\usepackage{tikz-er2}  ← OLD VERSION!
\usepackage{listings}
```

### File List Check:
You should have exactly:
- 1 main file: `quizforge_main.tex`
- 13 chapter files in `chapters/` folder
- 6 markdown guide files (README, etc.) - optional

---

## 💡 Pro Tips

### Tip 1: Save Logs
After successful compilation:
- Download the logs
- Keep as reference for future troubleshooting

### Tip 2: Incremental Compilation
If you have errors, comment out chapters one by one:
```latex
\include{chapters/01_introduction}
% \include{chapters/02_architecture}  ← Commented out
% \include{chapters/03_models}        ← Commented out
```
Find which chapter has the problem.

### Tip 3: Clear Cache
Menu → "Clear cached files" → Recompile
Often fixes mysterious errors.

### Tip 4: Browser Cache
If Overleaf seems stuck:
- Refresh the browser (Ctrl+F5)
- Or try incognito/private mode

---

## 📞 Still Need Help?

### What to Provide:
1. Screenshot of file structure (left sidebar)
2. Copy of error message from logs
3. Which step you're on in the setup process

### Quick Diagnostic:
```bash
# On your computer, verify files
cd /home/albinsphilip/Desktop/proj/quizforge/documentation
find . -name "*.tex" | sort
```

Should show:
```
./quizforge_main.tex
./chapters/01_introduction.tex
./chapters/02_architecture.tex
... (11 more files)
```

---

## ✅ Most Common Solutions Summary

| Error | Fix |
|-------|-----|
| File not found | Create `chapters` folder, move files into it |
| tikz-er2.sty not found | Update to latest version |
| Main document not set | Right-click `quizforge_main.tex` → Set as Main |
| Compilation timeout | Wait and retry, or clear cache |
| Can't find project | Upload as ZIP instead |

---

## 🎉 Success!

When everything works:
1. Download PDF: Click "Download PDF" button
2. Verify: 200+ pages of professional documentation
3. Share: Send to your team!

---

**90% of errors are fixed by:**
1. Creating the `chapters` folder
2. Moving chapter files into it
3. Setting `quizforge_main.tex` as main
4. Recompiling

**Try that first!** 🚀
