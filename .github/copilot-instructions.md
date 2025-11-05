# Car Consultancy Website - AI Coding Guide

## Project Overview
This is a static car consultancy website with a 3-page funnel: landing page → service selection → checkout. Built with vanilla HTML/CSS/JS, no frameworks or build tools required.

## Architecture & File Structure

### Page Flow
- `index.html` - Hero landing page with photo collage and feature cards
- `consult.html` - Service selection with pricing cards  
- `checkout.html` - Billing form with order summary

### CSS Architecture
- `styles.css` - Global styles and landing page components
- `consult-styles.css` - Service selection page specific styles
- `checkout-styles.css` - Checkout form and payment UI styles

**Pattern**: Each page has its own CSS file that extends the base `styles.css`

## Key Design Patterns

### Interactive Feature Cards
The landing page uses a **flip card pattern** for the "Why Choose Us" section:
```html
<div class="feature-card orange flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front"><!-- Brief content --></div>
    <div class="flip-card-back"><!-- Detailed description --></div>
  </div>
</div>
```
Only the first card flips on hover; others are static with `.feature-card` class only.

### Photo Collage Layout
The hero uses absolute positioning to create a polaroid-style collage:
```css
.tile.t1{left:0;top:20px;transform:rotate(-10deg);width:300px;height:180px}
```
Each `.tile` has unique positioning and rotation values for organic appearance.

### Service Pricing System
JavaScript manages service selection via URL parameters:
```javascript
const servicePrices = {
  'whatsapp': { name: 'WhatsApp Consultation', price: 100 },
  'auto-expert': { name: 'Call with an Auto-Expert', price: 200 }
};
```
Services are passed between pages using `?service=service-key` parameters.

## Content & Asset Patterns

### Brand Elements
- Logo: `assets/logo.svg` (MotorOctane Consultancy)
- Color scheme: Red brand color `#e31b23`, dark background `#0d0d0f`
- Typography: Inter font family

### Placeholder Assets
Replace these SVG placeholders in `assets/` with real photos:
- `car1.svg` through `car6.svg` - Hero collage images
- Keep the same filenames or update HTML references

## Development Workflow

### Local Development
Simply open `index.html` in a browser - no build process needed.

### Adding New Services
1. Add service to `servicePrices` object in `checkout.js`
2. Create new service card in `consult.html`
3. Update `selectService()` function if needed

### Styling Guidelines
- Use BEM-like naming: `.feature-card`, `.hero-content`, `.checkout-form`
- Responsive breakpoints defined in media queries at bottom of CSS files
- Maintain consistent padding: `24px` for containers, `18px` for buttons

## Form Handling
Checkout form prevents submission without terms agreement:
```javascript
const agreeTerms = document.getElementById('agreeTerms');
if (!agreeTerms.checked) {
  alert('Please agree to the terms and conditions to continue.');
  return;
}
```
Currently simulates order processing - integrate with actual payment gateway as needed.