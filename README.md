# Sarava Parihaara – Website

Official website of **Sarava Parihaara**, an Indian hair and skin-care brand by Dr. Humayra Aslam Sheikh.
Live at **https://saravaparihaaraglobal.com**

- **Hosting:** GitHub Pages (free)
- **Domain:** Namecheap (DNS only)
- **Type:** plain HTML, CSS and JavaScript. No WordPress, database or build step is needed.

---

## 1. Put the new website on GitHub

### Option A – In the browser (easiest)
1. Unzip `sarava-parihaara-website.zip` on your computer.
2. Open the website's repository on github.com.
3. **Delete the old site files.** Open each old file (or folder) → **⋯ → Delete file** → **Commit changes**.
   Keep the repository itself. Don't delete the repo.
4. Click **Add file → Upload files**. Drag in **everything inside** the unzipped folder: all `.html` files, the `assets` folder, `CNAME`, `.nojekyll`, `favicon.png`, `robots.txt`, `sitemap.xml` and this `README.md`.
   - `index.html` must be at the **top level** of the repo, not inside another folder.
   - On Windows and Mac, `.nojekyll` can be hidden. Turn on "show hidden files" before dragging. If it still doesn't upload, that's fine.
5. Write a message such as `New website` and click **Commit changes**.

### Option B – With Git (if you use it)
```bash
git clone https://github.com/<USERNAME>/<REPO>.git
cd <REPO>
git rm -r --quiet .            # removes the old site
# copy everything from the unzipped folder into this folder, then:
git add -A
git commit -m "New Sarava Parihaara website"
git push
```

## 2. Turn on GitHub Pages
In the repo: **Settings → Pages**
- **Source:** Deploy from a branch
- **Branch:** `main` and `/ (root)`, then **Save**
- **Custom domain:** `saravaparihaaraglobal.com`, then **Save**. This matches the `CNAME` file.
- Once the domain check turns green, tick **Enforce HTTPS**. This can take anything from a few minutes to about an hour.

After each commit, the site updates in about 1–2 minutes. To see progress, open the **Actions** tab.

## 3. Connect the Namecheap domain
If the old site already works on saravaparihaaraglobal.com, this is already done. Skip this step.

Namecheap → **Domain List → Manage → Advanced DNS**:

| Type | Host | Value |
|---|---|---|
| A Record | @ | 185.199.108.153 |
| A Record | @ | 185.199.109.153 |
| A Record | @ | 185.199.110.153 |
| A Record | @ | 185.199.111.153 |
| CNAME Record | www | `<USERNAME>.github.io.` |

Delete any other records for `@` or `www`, such as the "URL Redirect" or "parkingpage" records. DNS changes can take up to 24 hours.

---

## 4. Everyday settings – one file
Edit `assets/js/config.js` on GitHub: open the file → ✏️ pencil icon → edit → **Commit changes**.

| Setting | What it does |
|---|---|
| `whatsapp` | Number that receives orders: `91` + number, no spaces or `+` |
| `phoneDisplay`, `email` | Contact details shown on the site |
| `metaPixelId` | Meta (Facebook) Pixel ID. Leave `""` to switch off |
| `ga4Id` | Google Analytics 4 ID (`G-XXXXXXXXXX`) |
| `instagram`, `facebook`, `youtube` | Profile links for the footer. Empty = hidden |
| `formEndpoint` | Where form submissions go by email (see section 6) |
| `videos` | YouTube video testimonials (see section 5) |

## 5. Video testimonials (YouTube)
1. Upload the videos to YouTube as **Public** or **Unlisted**. Private videos won't play.
2. In `config.js`, paste the links inside `videos: [ ]`, each in quotes with a comma:
   ```js
   videos: [
     "https://youtube.com/shorts/AbCdEfGhIjk | Geeta, Raipur",
     "https://youtu.be/XyZ123abcDE | Prachi"
   ]
   ```
   The text after `|` is an optional caption.
- All videos show on the **Results** page. The first 4 also show on the **Home** page.
- Shorts appear vertical and normal videos appear wide. Videos load only when tapped, so the site stays fast.
- The section stays hidden until at least one link is added.

## 6. Form emails (Partner, Consultation, Contact)
GitHub Pages can't send email by itself, so forms work in one of two ways:

- **Default (no setup):** after the visitor fills the form, a **Send on WhatsApp** button appears with all their details already typed.
- **Email as well (free, 5 minutes):**
  1. Sign up at **formspree.io** with `humayrasheikh03@gmail.com`.
  2. Create a new form and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
  3. Paste it into `formEndpoint` in `config.js` and commit.
  4. Submit a test form on the live site and confirm the first email Formspree sends.

  The free plan includes 50 submissions a month.

## 7. Orders
**Cart → Checkout on WhatsApp** opens WhatsApp with the full order already typed: items, quantities, total, name, phone and address. There's no payment gateway. Payment is confirmed on WhatsApp.

## 8. Changing products or prices
- **Prices in the cart:** `assets/js/products.js`
- **Prices and text on the pages:** the product's `.html` file. Use the pencil icon and search for the old price, e.g. `₹999`.

Change both places so they match.

| Product | Page | Size | MRP |
|---|---|---|---|
| Hair Regrowth Oil | `hair-regrowth-oil.html` | 200 ml / 100 ml | ₹999 / ₹599 |
| Hair Growth Shampoo | `hair-growth-shampoo.html` | 200 ml | ₹369 |
| Maonic Hair Mask | `maonic-hair-mask.html` | 200 gm | ₹499 |
| 21 Herbs Heena | `21-herbs-heena.html` | 150 gm | ₹399 |
| Lily Pure Wood Neem Comb | `neem-wood-comb.html` | 1 piece | ₹399 |
| Fresh Face Cream | `fresh-face-cream.html` | 25 gm | ₹699 |
| AuraGlow Skin Polish | `auraglow-skin-polish.html` | 150 gm | ₹499 |

**Images:** `assets/img/`. To replace a photo, upload a new file with **exactly the same name**. Square JPGs about 1000 × 1000 px work best.

## 9. After going live
- **Google Search Console:** add the domain and submit `https://saravaparihaaraglobal.com/sitemap.xml`
- **Meta Events Manager:** check that the Pixel receives `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout` and `Lead` (a WhatsApp order counts as a `Lead`).
- **Ads:** use product pages as landing pages, e.g. `https://saravaparihaaraglobal.com/hair-regrowth-oil.html`

## Files
```
index.html               Home
shop.html                All products (filters: hair / skin / tools)
*-*.html                 Product pages (7)
our-story.html  founder.html  results.html
business-community.html  consultation.html  faq.html  contact.html
shipping-policy.html  refund-policy.html  privacy-policy.html  terms.html
404.html                 "Page not found" page (GitHub uses it automatically)
assets/css/style.css     Design
assets/js/config.js      Settings (edit this one)
assets/js/products.js    Cart product list & prices
assets/js/app.js         Cart, WhatsApp checkout, forms, videos, tracking
assets/img/              Photos and logo
CNAME                    Custom domain for GitHub Pages
.nojekyll                Tells GitHub to publish files as they are
sitemap.xml  robots.txt  For Google
```

---
© Sarava Parihaara · *Mehenat Hamesha Rang Laati Hai*
