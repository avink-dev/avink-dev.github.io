# Avinash Kumar Portfolio

A responsive personal portfolio website for **Avinash Kumar**, Senior Associate at PwC and Certified IFS Cloud Web Developer / IFS ERP Technical Consultant.

The site is built as a static GitHub Pages portfolio with a polished interactive UI, profile photo, downloadable resume, professional experience, skills, education, certifications, awards, and contact links.

## Live Website

[https://avink-dev.github.io](https://avink-dev.github.io)

## Current Highlights

- Current role: **Senior Associate at PwC**
- 8+ years of IFS ERP and IFS Cloud experience
- IFS Apps 8, 9, 10, and IFS Cloud delivery background
- Experience with IFS Aurena, Base Server, AFP, Oracle Database, PL/SQL, Boomi integrations, web services, reporting, packaging, deployment, and L3 support
- Onsite consulting experience in Adelaide for a defense client
- B.Tech in Electronics & Communication Engineering

## Features

- Fully responsive single-page portfolio
- Light/dark theme toggle with saved preference
- Iron Man-inspired boot loader, HUD accents, arc-reactor styling, and ambient animated background
- Canvas particle network, cursor glow, parallax movement, typewriter role text, animated counters, card tilt effects, and scroll progress indicator
- Reduced-motion support through `prefers-reduced-motion`
- Fixed navigation with active section highlighting and mobile slide-out menu
- Hero profile card with photo fallback, resume download, GitHub, and LinkedIn links
- Impact, About, Experience, Skills, Education, Certifications, Awards, and Contact sections
- Contact form that drafts a message, copies it to the clipboard, and opens LinkedIn
- Back-to-top control and smooth anchor scrolling
- Static deployment setup for GitHub Pages

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API
- Google Fonts / Inter
- GitHub Pages

## Portfolio Sections

- **Hero**: Name, professional role, summary, resume link, contact link, experience link, profile photo, and key stats
- **Impact**: IFS delivery span, onsite consulting, and integration highlights
- **About**: Professional summary and consulting focus
- **Experience**: PwC, Xitricon, Tietoevry, and Capgemini timeline
- **Skills**: IFS ERP development, integrations, deployment, reporting, data, development, communication, support, and delivery skills
- **Education**: B.Tech in Electronics & Communication
- **Certifications & Awards**: IFS certifications and STAR Award
- **Contact**: Current role, GitHub, LinkedIn, resume download, and message draft form

## Project Structure

```text
.
|-- index.html
|-- README.md
|-- .gitignore
|-- .nojekyll
|-- css/
|   `-- style.css
|-- js/
|   |-- script.js
|   `-- animations.js
`-- assets/
    `-- profile/
        |-- photo.jpg
        `-- resume.pdf
```

## File Responsibilities

- `index.html`: Main page markup, SEO metadata, theme preloader script, sections, navigation, contact form, and asset references
- `css/style.css`: Complete visual system including themes, responsive layout, loader, HUD/ambient visuals, cards, forms, navigation, and section styling
- `js/script.js`: Core interactions including theme persistence, loader sequence, mobile navigation, active nav links, reveal observer, smooth scrolling, back-to-top, photo fallback, and contact form behavior
- `js/animations.js`: Motion layer including scroll progress, cursor glow, parallax, stat counters, typewriter text, tilt cards, focus animation, and canvas particles
- `assets/profile/photo.jpg`: Profile image used in the hero and about sections
- `assets/profile/resume.pdf`: Downloadable resume used across the nav, hero, contact section, and footer
- `.nojekyll`: Ensures GitHub Pages serves static files directly without Jekyll processing

## Local Preview

Because the page uses root-relative asset links such as `/assets/profile/photo.jpg`, preview it from the project root with a static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

This repository is ready for GitHub Pages. Commit the root files and assets, then deploy from the repository's GitHub Pages settings.

Important files for deployment:

- `index.html`
- `css/style.css`
- `js/script.js`
- `js/animations.js`
- `assets/profile/photo.jpg`
- `assets/profile/resume.pdf`
- `.nojekyll`

File names are case-sensitive on GitHub Pages, so keep the asset names exactly as referenced in the code: `photo.jpg` and `resume.pdf`.
