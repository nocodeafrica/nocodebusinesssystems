# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for NoCode Business Systems (NCBS), a company providing no-code software solutions for African businesses. The site is built using a Bootstrap-based HTML template with custom styling and JavaScript functionality.

## Project Structure

```
ncbs/
├── assets/              # All static assets
│   ├── css/            # Stylesheets (Bootstrap, animations, custom styles)
│   ├── img/            # Images organized by section/feature
│   ├── js/             # JavaScript files
│   ├── scss/           # SASS source files
│   └── webfonts/       # Font files
├── planning/           # Planning and documentation
└── *.html             # HTML pages (index, about, services, etc.)
```

## Key Technologies

- **HTML5**: Static markup structure
- **Bootstrap 5**: CSS framework for responsive design
- **jQuery**: DOM manipulation and event handling
- **SCSS**: For maintainable stylesheets (compiled to CSS)
- **Swiper.js**: For carousel/slider functionality
- **MeanMenu**: Mobile menu navigation
- **Magnific Popup**: For lightbox/modal functionality
- **WOW.js + Animate.css**: Scroll animations

## Development Commands

Since this is a static HTML site without a build system:

1. **To view the site**: Open any HTML file directly in a browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server (if available)
   npx http-server
   ```

2. **To compile SCSS** (if modifications are needed):
   ```bash
   # Install sass globally first
   npm install -g sass
   
   # Watch and compile SCSS
   sass --watch assets/scss/main.scss:assets/css/main.css
   ```

## Architecture Patterns

### Page Structure
- Each HTML page follows a consistent structure with shared header/footer sections
- Pages use the same navigation, preloader, and offcanvas menu components
- Content sections are modular and can be mixed/matched across pages

### JavaScript Organization
- `main.js` contains all custom JavaScript functionality
- Initialization happens on document ready
- Features are organized as separate functions/sections
- External libraries are loaded via CDN or local files

### Styling Architecture
- SCSS files are modular, with separate files for each component/section
- Variables and mixins are centralized for consistency
- Main.css is the compiled output that should not be edited directly
- Bootstrap provides the foundation with custom overrides

### Image Organization
- Images are organized by feature/section (hero/, about/, service/, etc.)
- Icons are primarily SVG for scalability
- Background images are in bg/ directory
- Shape overlays and decorative elements in shape/ directory

## Important Files

- `index.html`: Main landing page
- `assets/css/main.css`: Compiled styles (do not edit directly)
- `assets/scss/main.scss`: Main SCSS file that imports all partials
- `assets/js/main.js`: Custom JavaScript functionality
- `planning/current-site-structure.md`: Detailed content structure and copy

## Common Tasks

### Adding a New Page
1. Copy an existing HTML file as a template
2. Update the title, meta tags, and content sections
3. Ensure navigation links are updated across all pages
4. Test responsive behavior on mobile devices

### Modifying Styles
1. Edit the appropriate SCSS file in `assets/scss/`
2. Compile SCSS to CSS using the sass command
3. Test changes across different breakpoints

### Adding JavaScript Functionality
1. Add new functions to `assets/js/main.js`
2. Follow the existing pattern of document.ready initialization
3. Ensure compatibility with existing libraries

### Updating Content
1. Refer to `planning/current-site-structure.md` for content guidelines
2. Maintain consistent tone and messaging
3. Update meta descriptions for SEO

## Template Customization Instructions

Based on the documentation in `/documentation/index.html`, follow these guidelines:

### Changing Images
To replace any image on the website:
1. Identify the source name of the image (e.g., `hero.jpg`)
2. Navigate to the `assets/img/` folder
3. Find the specific image file
4. Replace it with your new image
5. **Important**: Keep the exact same filename to avoid breaking references

**Note**: Preview images are not included in the template files.

### Changing Brand Logo
To update the company logo:
1. Locate the logo files in `assets/img/` (typically `logo.svg`, `footer-logo.svg`, `logo-white.svg`)
2. Replace with your logo files
3. Maintain the same filenames and formats
4. Update any inline SVG logos in HTML files if needed

### Changing Colors
The template uses SCSS for styling. To modify colors:

1. **Open the variables file**: `assets/scss/_variables.scss`
2. **Modify color variables**: Change the values on the right side of variable declarations
3. **Save the file**
4. **Compile SCSS**: Run the sass compiler to generate new CSS
   ```bash
   sass assets/scss/main.scss:assets/css/main.css
   ```

Key color variables to modify:
- Primary colors
- Secondary colors
- Text colors
- Background colors
- Accent colors

### HTML Structure
The template follows a consistent structure:
- Fixed layout with responsive columns
- Content divided into sections (header, banner, services, footer)
- Bootstrap grid system for layout
- Modular components that can be reused

### CSS Architecture
- **Main CSS**: `assets/css/main.css` (compiled from SCSS)
- **Vendor CSS**: Bootstrap, Swiper, animations, etc.
- **SCSS Files**: Modular structure with partials for each component

### JavaScript Architecture
- **Main JS**: `assets/js/main.js` (custom functionality)
- **jQuery**: Primary JavaScript library
- **Vendor JS**: Swiper, MeanMenu, WOW.js, etc.

## Testing Considerations

- Test all pages on mobile, tablet, and desktop viewports
- Verify all links and navigation work correctly
- Check that JavaScript features work across browsers
- Ensure images are optimized and load properly
- Validate HTML markup for accessibility

## Support

For template-specific issues, the original template (Extech) documentation recommends contacting their support at https://creativedigitalhelp.freshdesk.com/support/tickets/new (Note: This is for the original template, not NCBS-specific support)
- heres my project id add it to your memory - sjbvvrjxsbqrgtpgdxwr