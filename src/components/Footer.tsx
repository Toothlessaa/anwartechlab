import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FooterBinaryRain } from './FooterBinaryRain';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591170526288', Icon: FaFacebookF },
  { label: 'X', href: '#contact', Icon: FaXTwitter },
  { label: 'YouTube', href: '#contact', Icon: FaYoutube },
  { label: 'Instagram', href: '#contact', Icon: FaInstagram },
  { label: 'LinkedIn', href: '#contact', Icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <>
    <aside aria-label="Social links" className="fixed left-0 top-1/2 z-40 -translate-y-1/2 pl-2 sm:pl-4">
      <div className="social-rail overflow-hidden rounded-[1.25rem]">
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
            aria-label={label}
            className="grid h-12 w-12 place-items-center border-b transition-colors last:border-b-0"
          >
            <Icon className="h-6 w-6" />
          </a>
        ))}
      </div>
    </aside>
    <footer className="footer-bar binary-surface relative overflow-hidden">
      <FooterBinaryRain />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="pixel-copy text-sm font-bold text-white">AnwarTechLabs._</p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">© {new Date().getFullYear()} Anwar Tech Labs. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
}
