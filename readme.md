# Zeera's Birthday Site: How to Put It Live

This is a plain website (HTML, CSS and JavaScript). It needs no server, no database and no build step. "Making it live" just means uploading the folder to a free hosting service, which gives you a link you can send on WhatsApp.

## What is in the folder

```
zeera-birthday-site/
├── index.html      Home page (this one must stay named index.html)
├── gallery.html    Photo roll
├── yaar.html       Friends page and letter
├── wishes.html     Cake and wishes
├── dua.html        Prayer page for his mother
├── style.css       All the design
├── script.js       All the animation and behaviour
├── i18n.js         The text in Roman Urdu, English and Urdu
└── images/         All 15 photos
```

Keep every file in the same folder structure. If a file is moved, the page will lose its styling or photos.

## Step 0: Test it on your own computer first

1. Unzip `Zeera-Birthday-Site.zip`.
2. Open the `zeera-birthday-site` folder and double-click `index.html`.
3. It opens in your browser. Click through all five pages and try the three languages.

The fonts load from Google Fonts, so you need internet for the site to look right.

## Option 1: Netlify Drop (easiest, about 2 minutes)

1. Go to **https://app.netlify.com/drop**
2. Drag the whole `zeera-birthday-site` folder onto the page.
3. Netlify gives you a link like `https://some-random-name.netlify.app`.
4. Create a free account when asked, so the site is kept permanently. Sites uploaded without an account may be removed after a short time.
5. In **Site configuration**, you can change the name to something nicer, for example `zeera-birthday.netlify.app`.

## Option 2: GitHub Pages (free, permanent)

1. Create a free account at **https://github.com**
2. Click **New repository**. Name it `zeera-birthday`. Set it to **Public**.
3. Click **uploading an existing file**, then drag in everything from inside the `zeera-birthday-site` folder (`index.html` must be at the top level of the repository, not inside another folder). Click **Commit changes**.
4. Open **Settings**, then **Pages**.
5. Under **Branch**, choose `main` and the `/ (root)` folder, then click **Save**.
6. Wait one or two minutes. Your link will be:
   `https://YOUR-USERNAME.github.io/zeera-birthday/`

## Option 3: Cloudflare Pages (free, fast)

1. Create a free account at **https://dash.cloudflare.com**
2. Go to **Workers & Pages**, then **Create**, then **Pages**, then **Upload assets**.
3. Name the project, upload the `zeera-birthday-site` folder, and click **Deploy**.
4. Your link will look like `https://zeera-birthday.pages.dev`

Menu names on these sites change from time to time. If a button has moved, look for "Deploy", "Upload" or "Pages".

## Sending it to Zeera

- Copy the link and send it on WhatsApp.
- The site is public, which means anyone who has the link can open it. Pick a name that is not easy to guess if you want it kept between friends.
- The page remembers the chosen language on each device. To send a link that opens in a specific language, add `#en`, `#ur` or `#rm` to the end:
  - `https://your-link/index.html#en` for English
  - `https://your-link/index.html#ur` for Urdu
  - `https://your-link/index.html#rm` for Roman Urdu

## Editing the site later

| What to change | File to edit |
| --- | --- |
| Any text, captions, wishes, the letter, the prayer page | `i18n.js` (each line has three versions: Roman Urdu, English, Urdu) |
| Photos | Replace files in `images/` and keep the same names, for example `night.jpg` |
| Colours and fonts | `style.css` (the colour list is at the top, under `:root`) |
| Page structure | The `.html` files |

After editing, upload the folder again to the same hosting service. On Netlify, open your site and drag the folder onto the **Deploys** page. On GitHub, upload the changed files again.

## Using your own domain (optional)

Netlify, GitHub Pages and Cloudflare Pages all allow a custom domain, for example `zeera.com`. You buy the domain from a registrar, then follow the **Domain settings** or **Custom domain** section of your host. This costs money and is not needed for a birthday gift.

## Checklist before you send it

- [ ] Every page opens and shows all photos.
- [ ] Clicking a photo opens it, and Close works.
- [ ] All three languages work, especially Urdu.
- [ ] Someone fluent has read the Urdu text and the prayer page.
- [ ] The photos are ones Zeera and the friends in them are happy to have online.
- [ ] You tested the link on a phone.