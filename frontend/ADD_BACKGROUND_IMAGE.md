# 🖼️ How to Add Your Background Image to Login Page

## Step 1: Prepare Your Image

1. Save your background image as `login-bg.jpg` or `login-bg.png`
2. Place it in: `/frontend/src/assets/images/`

**Recommended specifications:**

- Size: 1920 x 1080px (or higher for better quality)
- Format: JPG (for smaller file size) or PNG
- Aspect ratio: 16:9 (wider is better for full-screen)

## Step 2: Update the Login Component

Open `frontend/src/pages/auth/Login.jsx` and find this line:

```jsx
style={{
  backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)`,
  backgroundColor: '#f8f9ff',
}}
```

**Replace it with:**

```jsx
style={{
  backgroundImage: `url('/src/assets/images/login-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}}
```

Or if you want to keep the gradient overlay on top of your image:

```jsx
style={{
  backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.7) 0%, rgba(99, 102, 241, 0.6) 100%), url('/src/assets/images/login-bg.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}}
```

## Step 3: Optional - Adjust the Form Card

If your background image is very bright, you might want to increase the shadow and opacity of the form card. Update the card div:

```jsx
<div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 bg-opacity-95">
```

## Step 4: Optional - Adjust Decorative Elements

If the dots are hard to see against your image, change their color:

```jsx
<div key={i} className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
```

Or increase opacity:

```jsx
<div
  key={i}
  className="w-2 h-2 bg-indigo-500 rounded-full shadow-lg opacity-70"
></div>
```

## Complete Example

Here's a complete styled version with a background image and semi-transparent overlay:

```jsx
<div
  className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(135deg, rgba(79, 70, 229, 0.6) 0%, rgba(99, 102, 241, 0.5) 100%), url('/src/assets/images/login-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  }}
>
```

## Testing

1. Make sure your image file is in the correct folder
2. Check the file path matches exactly (case-sensitive!)
3. Refresh your browser (Ctrl+Shift+R for hard refresh)
4. If the image doesn't show, check the browser console for 404 errors

## Troubleshooting

**Image not showing?**

- Check if the path is correct: `/src/assets/images/login-bg.jpg`
- Ensure the file extension matches (.jpg, .png, etc.)
- Try absolute path: `${import.meta.env.BASE_URL}src/assets/images/login-bg.jpg`

**Image looks pixelated?**

- Use a larger/higher resolution image
- Add `backgroundSize: 'contain'` instead of `'cover'`

**Want to blur the image?**

```jsx
<div
  className="absolute inset-0 backdrop-blur-sm"
  style={{
    backgroundImage: `url('/src/assets/images/login-bg.jpg')`,
  }}
/>
```

---

Let me know your image and I can help you integrate it perfectly! 🎨
