import { useEffect } from "react";
import { store } from "../data/store";
import { buildWhatsAppUrl } from "../lib/catalog";

const socialLinks = [
  { name: "Facebook", href: store.social.facebook, icon: FacebookIcon },
  { name: "Instagram", href: store.social.instagram, icon: InstagramIcon },
  { name: "TikTok", href: store.social.tiktok, icon: TikTokIcon },
  {
    name: "WhatsApp",
    href: buildWhatsAppUrl(`Hello, ${store.name}. I have a question.`),
    icon: WhatsAppIcon,
  },
  { name: "Twitter", href: store.social.twitter, icon: TwitterIcon },
];

export function VisitPage() {
  useEffect(() => {
    document.title = `Visit · ${store.name}`;
  }, []);

  return (
    <article className="max-w-2xl">
      <h1 className="font-serif text-4xl">Visit</h1>

      <section className="mt-8">
        <h2 className="font-serif text-2xl">Physical address</h2>
        <p className="mt-3 leading-7">{store.physicalAddress}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Email</h2>
        <a href={`mailto:${store.email}`} className="mt-3 inline-block text-clay">
          {store.email}
        </a>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Social media</h2>
        <ul className="mt-4 space-y-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-clay"
                >
                  <Icon />
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 3.5c.5 2.2 2 3.8 4.2 4.2v2.5c-1.5-.1-2.8-.6-4-1.5v6.6a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.7a2.6 2.6 0 1 0 1.8 2.5V3.5H14z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.2A8.2 8.2 0 0 0 5 15.6L4 20l4.5-1.2A8.2 8.2 0 1 0 12 3.2zm4.6 11.6c-.2.6-1.1 1-1.5 1.1-.4 0-1 .2-3.2-.7-2.6-1.1-4.2-3.8-4.3-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2 .5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .8 2.1 0 .2 0 .3-.2.5l-.4.4c-.1.2-.3.3-.1.6.1.3.7 1.2 1.5 1.9 1 .8 1.9 1.1 2.2 1.2.3.1.5.1.6-.1l.5-.6c.1-.2.3-.1.5-.1l1.8.8c.3.1.4.2.5.3.1.3.1.8-.1 1.4z"
      />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.2 7.2c-.6.3-1.2.4-1.8.5.6-.4 1.1-1 1.4-1.7-.6.4-1.3.6-2 .8A3.1 3.1 0 0 0 12.2 9c0 .2 0 .5.1.7-2.6-.1-4.9-1.4-6.4-3.3-.3.5-.4 1-.4 1.6 0 1.1.6 2 1.4 2.6-.5 0-1-.2-1.4-.4 0 1.5 1.1 2.8 2.5 3.1-.3.1-.6.1-.8.1-.2 0-.4 0-.6-.1.4 1.2 1.6 2.1 2.9 2.2A6.3 6.3 0 0 1 4.5 17 8.8 8.8 0 0 0 9.3 18.4c5.8 0 9-4.8 9-9v-.4c.6-.4 1.2-1 1.6-1.8z"
      />
    </svg>
  );
}
