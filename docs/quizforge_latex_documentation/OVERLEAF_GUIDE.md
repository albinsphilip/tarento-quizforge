# QuizForge Documentation - Overleaf Setup Guide

## 📚 How to Use This Documentation on Overleaf

Overleaf is an online LaTeX editor - perfect for compiling this documentation without installing anything locally!

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Overleaf Account
1. Go to https://www.overleaf.com
2. Sign up for a free account (or log in)

### Step 2: Create New Project
1. Click **"New Project"** button
2. Select **"Blank Project"**
3. Name it: **"QuizForge Backend Documentation"**

### Step 3: Upload Files

**Option A: Upload as ZIP**
1. On your computer, create a ZIP of the documentation folder:
   ```bash
   cd /home/albinsphilip/Desktop/proj/quizforge
   zip -r quizforge-docs.zip documentation/
   ```
2. In Overleaf, click **Upload** icon (📤)
3. Select **"Upload Project"**
4. Choose `quizforge-docs.zip`
5. Wait for upload to complete

**Option B: Upload Individual Files**
1. In Overleaf project, click **"Upload"** icon
2. Select **all files** from your documentation folder:
   - `quizforge_main.tex`
   - All `.md` files (README, QUICKSTART, etc.)
3. Create a folder called `chapters` (click "New Folder")
4. Upload all 13 `.tex` files from your `chapters/` folder into the `chapters` folder

### Step 4: Set Main Document
1. In Overleaf, find `quizforge_main.tex` in file list
2. Click the **three dots** (⋮) next to it
3. Select **"Set as Main File"**
4. The icon should change to show it's the main file

### Step 5: Compile!
1. Click the green **"Recompile"** button at the top
2. Wait 30-60 seconds for first compilation
3. View your PDF on the right side! 📄

---

## 📁 Required File Structure in Overleaf

Your Overleaf project should look like this:

```
QuizForge Backend Documentation/
├── quizforge_main.tex          ← Main file (set as main)
├── README.md
├── QUICKSTART.md
├── INDEX.md
├── SUMMARY.md
├── OVERVIEW.txt
└── chapters/                    ← Folder
    ├── 01_introduction.tex
    ├── 02_architecture.tex
    ├── 03_models.tex
    ├── 03_models_continued.tex
    ├── 04_repositories.tex
    ├── 05_services.tex
    ├── 05_services_continued.tex
    ├── 06_controllers.tex
    ├── 07_security.tex
    ├── 08_api_documentation.tex
    ├── 09_er_diagram.tex
    ├── 10_configuration.tex
    └── appendix_a_dependencies.tex
```

---

## ⚙️ Overleaf Settings

### Compiler Settings
1. Click **"Menu"** button (top-left, ☰)
2. Under **"Settings"**:
   - **Compiler:** pdfLaTeX (default)
   - **TeX Live version:** 2024 or latest
   - **Main document:** quizforge_main.tex

### Auto-Compile
- Turn ON **"Auto Compile"** for automatic updates as you edit
- Or manually click **"Recompile"** when ready

---

## 🎯 Using Overleaf Features

### Download PDF
1. After successful compilation
2. Click **"Download PDF"** button (next to Recompile)
3. Save as `quizforge_main.pdf`

### View Logs
1. Click **"Logs and output files"** (next to Recompile)
2. View compilation details
3. Check for warnings or errors

### Search & Replace
1. Use **Ctrl+F** (or Cmd+F on Mac)
2. Find text across all files
3. Click **"Replace"** for edits

### Share with Team
1. Click **"Share"** button (top-right)
2. Options:
   - **Turn on Link Sharing:** Anyone with link can view
   - **Invite Collaborators:** Add by email
   - **Set Permissions:** View only or Can edit

### Version History
1. Click **"History"** button (top-right)
2. See all changes over time
3. Restore previous versions if needed

---

## 📊 Compilation Tips

### First Compilation
- Takes **30-60 seconds** (normal!)
- Overleaf compiles 3 times automatically
- Wait for "PDF compiled successfully" message

### Subsequent Compilations
- Usually **5-10 seconds**
- Auto-compile on save (if enabled)
- Much faster than first time

### If Compilation Fails
1. Check the **Logs**
2. Look for red error messages
3. Common issues:
   - Missing chapter file
   - Typo in file path
   - Special characters in text

---

## 🔧 Troubleshooting

### "File not found" error
**Problem:** Chapter files not in `chapters/` folder

**Solution:**
1. Create `chapters` folder in Overleaf
2. Move all chapter `.tex` files into it
3. Recompile

### "File 'tikz-er2.sty' not found"
**Problem:** Non-standard package (already fixed in latest version)

**Solution:**
- ✅ Already fixed! The documentation now uses standard TikZ libraries
- If you see this error, re-download the latest files
- The ER diagram uses standard `tikz` with `shapes.multipart` and `positioning` libraries

### "Undefined control sequence"
**Problem:** Missing LaTeX package

**Solution:**
- Overleaf includes all packages automatically
- If error persists, check for typos in LaTeX commands

### Compilation timeout
**Problem:** Document too large (Free plan has limits)

**Solution:**
1. Upgrade to Overleaf Premium (optional)
2. Or compile locally with pdflatex
3. Free plan usually works for 200-page documents

### PDF not showing
**Problem:** Compilation errors

**Solution:**
1. Check logs for errors
2. Fix errors one by one
3. Click "Clear cached files" in menu
4. Recompile

---

## 💡 Overleaf Advantages

✅ **No Installation:** Works in browser  
✅ **Auto-save:** Never lose work  
✅ **Collaboration:** Real-time editing with team  
✅ **Version Control:** Git integration  
✅ **All Packages:** No manual package installation  
✅ **Cross-platform:** Works on any OS  
✅ **Professional Output:** Publication-quality PDF  

---

## 🎨 Customization in Overleaf

### Change Colors
Edit `quizforge_main.tex`, find these lines:
```latex
\definecolor{codegreen}{rgb}{0,0.6,0}
\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
```
Change RGB values and recompile.

### Change Page Margins
Find in `quizforge_main.tex`:
```latex
\geometry{
    a4paper,
    left=25mm,    ← Change this
    right=25mm,   ← Change this
    top=30mm,     ← Change this
    bottom=30mm   ← Change this
}
```

### Change Font Size
In first line of `quizforge_main.tex`:
```latex
\documentclass[12pt,a4paper]{report}
```
Change `12pt` to `10pt` or `11pt`

---

## 📥 Exporting from Overleaf

### Download Source (ZIP)
1. Click **"Menu"** (☰)
2. Select **"Source"** under Download
3. Get ZIP with all LaTeX files
4. Can upload to another Overleaf project

### Download PDF
1. Click **"Download PDF"** button
2. Or: Menu → Download → PDF
3. Share PDF with team members

---

## 🔗 Useful Overleaf Links

- **Overleaf Home:** https://www.overleaf.com
- **Documentation:** https://www.overleaf.com/learn
- **Templates:** https://www.overleaf.com/latex/templates
- **Support:** https://www.overleaf.com/contact

---

## 📝 Quick Reference Card

| Action | How To |
|--------|--------|
| Compile | Click green "Recompile" button |
| Download PDF | Click "Download PDF" |
| View logs | Click "Logs and output files" |
| Share project | Click "Share" button |
| Set main file | Right-click file → "Set as Main File" |
| Create folder | New Folder button |
| Upload files | Upload button (📤) |
| Search | Ctrl+F (Cmd+F on Mac) |
| Auto-compile | Menu → Auto Compile: ON |

---

## ✨ Step-by-Step Walkthrough

### For Complete Beginners:

**1. Create Account**
   - Go to overleaf.com
   - Click "Register" (top-right)
   - Use your email
   - Verify email

**2. Start Project**
   - After login, click "New Project"
   - Choose "Blank Project"
   - Name it anything you want

**3. Upload Your Files**
   - You'll see an empty project
   - Click "Upload" icon (looks like ↑)
   - On your computer, go to:
     `/home/albinsphilip/Desktop/proj/quizforge/documentation/`
   - Select ALL files and folders
   - Drag and drop into Overleaf

**4. Set Main File**
   - In file list (left side)
   - Find `quizforge_main.tex`
   - Click three dots next to it
   - Click "Set as Main File"

**5. Compile!**
   - Big green button at top: "Recompile"
   - Click it
   - Wait 30-60 seconds
   - PDF appears on right!

**6. Done!**
   - Your documentation is now compiled
   - Download PDF using "Download PDF" button
   - Share with your team

---

## 🎓 Free vs Premium

### Free Plan (Good Enough!)
✅ Compile this documentation  
✅ Download PDF  
✅ Share with link  
✅ Basic collaboration  
⏱️ May have compile timeout on very large docs  

### Premium Plan (Optional)
✅ Faster compilation  
✅ More compile time  
✅ Full version history  
✅ Advanced collaboration  
✅ Track changes  
💰 ~$12/month or ~$100/year  

**For this documentation:** Free plan works perfectly fine!

---

## ❓ Common Questions

**Q: Do I need to install LaTeX on my computer?**  
A: No! Overleaf has everything built-in.

**Q: Can multiple people edit at once?**  
A: Yes! Share the project and collaborate in real-time.

**Q: How do I fix compilation errors?**  
A: Click "Logs and output files" to see what went wrong.

**Q: Can I work offline?**  
A: No, Overleaf is online-only. But you can download source and compile locally.

**Q: Is my data safe?**  
A: Yes! Overleaf auto-saves and has version history.

**Q: Can I use Git with Overleaf?**  
A: Yes! Premium plan has Git integration.

---

## 🎉 You're Ready!

Your QuizForge documentation is ready for Overleaf:

1. ✅ All files are properly structured
2. ✅ No build scripts needed
3. ✅ Just upload and compile
4. ✅ Get professional PDF output

**Next Steps:**
1. Go to https://www.overleaf.com
2. Create free account
3. Upload documentation files
4. Click Recompile
5. Enjoy your 200+ page professional documentation!

---

**Need Help?** 
- Read the logs in Overleaf
- Check file structure matches above
- Ensure `quizforge_main.tex` is set as main file
- All chapter files must be in `chapters/` folder

---

**Document Package:** Ready for Overleaf  
**No Installation Required:** 100% Online  
**Compilation Time:** ~30-60 seconds first time  
**Output:** Professional PDF, 200+ pages  

Happy Compiling! 🚀
