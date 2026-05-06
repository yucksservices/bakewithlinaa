# BakeWithLinaa Full-Stack Website

This version uses a real backend instead of FormSubmit.

## What it includes

- React frontend
- Express backend
- Nodemailer email sender
- Inspiration photo attachments
- Sends orders to bakewithlinaa@gmail.com
- Pickup information uses customer Instagram instead of email

## Setup

1. Unzip this folder.
2. Open the folder in VS Code.
3. Open a terminal in the folder.
4. Run:

```bash
npm install
```

5. Copy `.env.example` and rename the copy to `.env`.

6. In `.env`, replace:

```txt
EMAIL_APP_PASSWORD=PASTE_YOUR_16_CHARACTER_APP_PASSWORD_HERE
```

with your Gmail App Password.

Do not use your normal Gmail password.

7. Start the website and backend together:

```bash
npm run dev
```

8. Open:

```txt
http://localhost:5173
```

9. Submit a test order.

## Gmail App Password

You need 2-Step Verification enabled on the Gmail account first. Then create a Google App Password and paste the 16-character code into `.env`.

Remove spaces when you paste it.

## Notes

Keep the backend terminal open while testing. The frontend sends order requests to:

```txt
http://localhost:5000/api/order
```
