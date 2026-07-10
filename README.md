# FramingBench — project website

Static site (plain HTML/CSS/JS, no build step) for the FramingBench paper.

```
site/
├── index.html         # the page
├── styles.css         # all styling
├── app.js             # interactive results chart + document explorer + copy-BibTeX
├── data.js            # headline numbers, sourced from
│                      #   notes/paper/experiments/finalized/1b_multi_seed_benchmark_data.json
├── explorer_data.js   # real baseline + all 19 technique variants (magnesium) for the
│                      #   document explorer, generated from the released benchmark documents
├── assets/            # paper PDF + figures (teaser, benchmark construction)
├── .nojekyll          # tell GitHub Pages to serve files as-is
└── README.md
```

## Preview locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to framingbench.github.io

1. Create a **free GitHub organization** named `framingbench`
   (github.com → your avatar → *Your organizations* → *New organization* → Free).
   This is an organization, not a second account — it attaches to your existing login.
2. Inside the org, create a repo named exactly **`framingbench.github.io`** (public).
3. Push the *contents of this `site/` folder* to the root of that repo:
   ```bash
   cd site
   git init && git add -A && git commit -m "FramingBench site"
   git branch -M main
   git remote add origin https://github.com/framingbench/framingbench.github.io.git
   git push -u origin main
   ```
4. In the repo: *Settings → Pages → Build and deployment → Source = "Deploy from a branch"*,
   branch `main` / root. The site goes live at **https://framingbench.github.io/** within a minute.

### Alternative (no new org)
Push `site/` to any repo under your existing account and enable Pages; the URL becomes
`https://<your-username>.github.io/<repo>/`. Everything works the same — only the URL differs.

## Document explorer

The "See it on a real document" tool in the Techniques section (`#docExplorer` in `index.html`,
rendering in `app.js`, data in `explorer_data.js`) shows the neutral baseline for the magnesium
supplements domain alongside any of the **19 technique variants**, with a word-level diff
(green = added, red strike-through = removed). `explorer_data.js` is generated directly from the
released benchmark documents (baseline + variants for the primary target, *MegaFood Magnesium
Capsules*); to regenerate or add another domain, re-export those documents and rebuild the
`window.FB_DOCS` object.
