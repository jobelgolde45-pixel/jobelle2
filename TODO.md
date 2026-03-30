# Role
Act as a Senior Frontend Engineer and Next.js Expert. Your task is to migrate a static HTML file into a production-ready Next.js application using Tailwind CSS.

# Input Data
I will provide the content of a file named `need_to_mimic.html` at the end of this prompt. You must analyze this file to understand the layout, styling, scripts, and functionality.

# Tech Stack Requirements
- **Framework:** Next.js 14+ (App Router / `app` directory).
- **Language:** TypeScript (Strict mode, define interfaces for props and data).
- **Styling:** Tailwind CSS (Use utility classes exclusively, no custom CSS files unless necessary for animations).
- **Icons:** Convert inline SVGs from the HTML into reusable React components or use `lucide-react` if they match standard icons.
- **Fonts:** Use `next/font` to optimize fonts (match the HTML fonts as closely as possible via Google Fonts).
- **Images:** Use `next/image` for all image tags.

# Design & Functionality Requirements
1. **Visual Fidelity:** The output must look identical to the HTML file on desktop, tablet, and mobile.
2. **Responsiveness:** Ensure the layout is fully responsive. If the HTML is not responsive, make it responsive based on modern best practices.
3. **Interactivity:** Replicate all JavaScript functionality found in the HTML (e.g., mobile menus, sliders, modals, form validation, tabs). Use React `useState` and `useEffect` instead of vanilla JS.
4. **Accessibility:** Ensure semantic HTML (header, main, footer, nav), proper ARIA labels, and keyboard navigation support.

# Code Architecture & Quality
1. **Componentization:** Do not put everything in one file. Break the UI down into logical components.
   - Example: `components/layout/Header.tsx`, `components/sections/Hero.tsx`, `components/ui/Button.tsx`.
2. **Clean Code:** Follow DRY principles. Extract repeated Tailwind classes into variables or small UI components if they appear frequently.
3. **File Structure:** Organize files logically within the `app` and `components` directories.
4. **Comments:** Add brief comments explaining complex logic or specific design decisions.

# Step-by-Step Implementation Plan
1. **Analyze:** Review the provided HTML to identify distinct sections (Navbar, Hero, Features, Footer, etc.).
2. **Setup:** Suggest the folder structure for the components.
3. **Global Styles:** Define the `layout.tsx` with necessary metadata and fonts.
4. **Build Components:** Create the individual components one by one.
5. **Assemble:** Import components into `page.tsx`.
6. **Functionality:** Add state management for interactive elements.

# Constraints
- Do not use external CSS libraries (like Bootstrap) unless explicitly found in the HTML (but prefer Tailwind equivalents).
- Do not leave `TODO` comments for styling; implement the full design.
- Ensure all `className` attributes use Tailwind syntax.

# Input HTML Content
Read the need_to_mimic.html file found in this project

# Documentation
Create a detailed documentation after the implementation in docs folder