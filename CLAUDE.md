# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Japanese designer portfolio website built with Pug templating, Sass, and vanilla JavaScript. The site showcases client work and personal projects with typewriter animations and an interactive menu system.

## Development Commands

- `npm run dev` - Start development server with hot reload (runs Pug watch, Sass watch, and BrowserSync)
- `npm run build` - Build production files (compile Pug and compress Sass)
- `npm run pug:watch` - Watch and compile Pug templates
- `npm run sass:watch` - Watch and compile Sass files
- `npm run serve` - Start BrowserSync development server

## Architecture

### Template Structure
- `layout.pug` - Base template with head, font imports, and script includes
- `index.pug` - Homepage extending layout with portfolio grid and typewriter copy
- `profile.pug` - Profile page
- `work.pug` - Individual work detail page
- `_footer.pug` - Shared footer component

### Styling
- `scss/style.scss` - Main stylesheet with custom font mixins
- `scss/reset.scss` - CSS reset
- Custom font stack combining Nuosu SIL (Latin), Shippori Mincho (Japanese), and IBM Plex Sans JP (Kanji)

### JavaScript Features
- `typeWriter.js` - Hacking-style typewriter animation for Japanese and English text
- `btn-open.js` - Menu toggle functionality with animation states
- `font-size-window-fit.js` - Responsive font sizing

### Content Management
- Portfolio items are hardcoded in Pug templates with image references
- Work samples organized by client works and private experiments
- Bilingual content (Japanese/English) with responsive layouts

## Key Technical Details

- Pug templates compile to HTML with `-P` flag for pretty output
- Sass compiles with compressed output for production
- Menu system uses CSS classes `is-open` and `is-close` for animations
- Typewriter effect supports different timing configs for Japanese vs English text
- Font loading uses unicode-range for optimal Japanese typography