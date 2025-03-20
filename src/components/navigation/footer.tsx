/**
 * @module Footer
 * @fileoverview Footer component with navigation links and social media
 * @since 1.0.0
 */

"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import { FooterLink } from "./footer-link";

const QUICK_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

const RESOURCE_LINKS = [
  { href: "#", label: "Documentation" },
  { href: "#", label: "Help Center" },
];

const SOCIAL_LINKS = [
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto py-8 px-4">
        <nav className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">ADHD Organizer</h3>
            <p className="text-sm text-muted-foreground">
              Helping you stay organized and focused
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <FooterLink href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-semibold">Connect</h4>
            <div className="flex justify-center md:justify-start gap-4">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <FooterLink key={href} href={href} external>
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </FooterLink>
              ))}
            </div>
          </section>
        </nav>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ADHD Organizer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
