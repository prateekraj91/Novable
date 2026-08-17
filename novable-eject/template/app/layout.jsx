import "./globals.css";
import site from "../lib/site";

export const metadata = {
  title: site.name,
  description: site.tagline || site.about || site.name,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ "--primary": site.theme.primary, "--ink": site.theme.ink }}>
        {children}
      </body>
    </html>
  );
}
