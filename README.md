# Personal IndieWeb Site

Static personal website with a homepage, About Me page, an Eleventy‑powered blog and photo gallery, plus simple link and 404 pages.

## Features

- Game menu style homepage ([index.html](index.html), [script.js](script.js), [style.css](style.css))
- Visual novel style about me page ([about_me/index.html](about_me/index.html), [about_me/script.js](about_me/script.js), [about_me/style.css](about_me/style.css))
- Blog built with Eleventy ([blog/.eleventy.js](blog/.eleventy.js), [blog/src/index.html](blog/src/index.html), [blog/src/\_includes/layouts/base.html](blog/src/_includes/layouts/base.html))
- Photo gallery built with Eleventy ([photos/.eleventy.js](photos/.eleventy.js), [photos/src/\_data/photos.js](photos/src/_data/photos.js), [photos/src/index.html](photos/src/index.html))
- Netlify deployment ([netlify.toml](netlify.toml))

## Tech Stack

- HTML/CSS/JS (no framework)
- Eleventy for blog & photos collections
- Netlify for build & hosting (command: `npm run build`)

## Project Structure (selected)

- Root build script ([package.json](package.json))
- Blog source: [blog/src](blog/src/)
- Photos source: [photos/src](photos/src/)
- Static sections: [about_me](about_me/), [links](links/)

## Development

1. Install dependencies for subprojects:
   ```
   cd blog && npm install
   cd ../photos && npm install
   ```
2. Run local servers (each in its folder):
   ```
   npm run start
   ```
3. Root build (outputs to `blog/_site` and `photos/_site`):
   ```
   npm run build
   ```

## Eleventy Notes

- Blog collection defined in [blog/.eleventy.js](blog/.eleventy.js) (`collections.posts`).
- Photos collection defined in [photos/.eleventy.js](photos/.eleventy.js) with file data loader ([photos/src/\_data/photos.js](photos/src/_data/photos.js)).

## Deployment

Netlify uses [netlify.toml](netlify.toml) to run `npm run build` and publish root.

## License

MIT – see [LICENSE](LICENSE).
