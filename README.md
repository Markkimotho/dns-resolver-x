# dns-resolver-x

A browser-based domain evidence desk. It checks DNS records through Cloudflare DNS-over-HTTPS and registration events through RDAP. It reports registration age when available and links to Google Safe Browsing's public site-status page for a separate manual reputation check.

It **does not declare a domain safe or a scam**. DNS records and age cannot prove trustworthiness, and a browser-only GitHub Pages app cannot securely hold a threat-intelligence API key or reliably scrape arbitrary websites. Some registries also block browser RDAP requests; in that case the app says the age is unavailable.

Serve `site/` with any static server; for example `python3 -m http.server 8000 --directory site`. Run `npm test` for the domain and registration parsing tests. GitHub Actions runs tests before publishing the site.
