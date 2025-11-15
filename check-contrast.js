#!/usr/bin/env node

/**
 * Color Contrast Checker
 * Verifies WCAG AA compliance (4.5:1 minimum for normal text)
 */

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(name, foreground, background, minRatio = 4.5) {
    const ratio = getContrastRatio(foreground, background);
    const passes = ratio >= minRatio;
    const status = passes ? '✓' : '✗';
    
    console.log(`${status} ${name}`);
    console.log(`  Foreground: ${foreground}`);
    console.log(`  Background: ${background}`);
    console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1 (${passes ? 'PASS' : 'FAIL'} - need ${minRatio}:1)`);
    console.log('');
    
    return passes;
}

console.log('🎨 Color Contrast Checker - WCAG AA Compliance\n');
console.log('='.repeat(60));
console.log('');

const results = [];

// Test 1: Main text on white background
results.push(checkContrast(
    'Main text on white background',
    '#0f1720', // --text
    '#ffffff'  // --bg
));

// Test 2: User bubble text on light green
results.push(checkContrast(
    'User bubble text on light green',
    '#0f1720', // --text
    '#e6f7e6'  // --bubble-user
));

// Test 3: Bot bubble text on white
results.push(checkContrast(
    'Bot bubble text on white',
    '#0f1720', // --text
    '#ffffff'  // --bubble-bot
));

// Test 4: Error text on pale red
results.push(checkContrast(
    'Error text on pale red',
    '#c62828', // --error-text
    '#fff3f3'  // --error-bg
));

// Test 5: Muted text on white
results.push(checkContrast(
    'Muted text (timestamps) on white',
    '#5f6368', // --muted
    '#ffffff'  // --bg
));

// Test 6: Accent color on white (for links)
results.push(checkContrast(
    'Accent links on white',
    '#2e7d32', // --accent-2
    '#ffffff'  // --bg
));

console.log('='.repeat(60));
const passed = results.filter(r => r).length;
const total = results.length;
console.log(`\n📊 Summary: ${passed}/${total} tests passed`);

if (passed === total) {
    console.log('✅ All color contrasts meet WCAG AA standards!\n');
    process.exit(0);
} else {
    console.log('❌ Some color contrasts need adjustment.\n');
    process.exit(1);
}
