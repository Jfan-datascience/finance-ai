# Fanance.ai

Personal website for Jonathan Fan — hosted via GitHub Pages at [fanance.ai](https://fanance.ai).

## Setup

### 1. Add your photo
Place your photo in the `images/` folder and name it `jonathan.jpg`.

Then open `index.html` and find the `hero-image-placeholder` div. Replace:
```html
<div class="placeholder-face">
  <span>Your photo<br/>goes here</span>
</div>
```
With:
```html
<img src="images/jonathan.jpg" alt="Jonathan Fan" />
```

### 2. Update your links
In `index.html`, update:
- LinkedIn URL (search for `linkedin.com/in/jonathanfan`)
- Email address (search for `jonathan@fanance.ai`)
- Any bio copy you want to personalize

### 3. Wire up the email form
The subscribe form currently shows a success message but doesn't send data anywhere.
To connect it to a real email list:
- **ConvertKit / Kit**: Get your form embed code and replace the form action
- **Mailchimp**: Get your audience API endpoint
- **Buttondown**: Simple, great for writers

### 4. Deploy to GitHub Pages

1. Create a GitHub account at github.com if you don't have one
2. Create a new repository named exactly: `yourusername.github.io`
3. Upload all files from this folder to that repo
4. Go to repo Settings → Pages → set source to `main` branch
5. The CNAME file handles custom domain pointing

### DNS Setup (Squarespace / wherever you own fanance.ai)

Add these records in your domain registrar's DNS settings:

| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | yourusername.github.io |

DNS changes take 24–48 hours to fully propagate.
