import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61591170526288', Icon: FaFacebookF },
  { label: 'X', href: '#contact', Icon: FaXTwitter },
  { label: 'YouTube', href: '#contact', Icon: FaYoutube },
  { label: 'Instagram', href: '#contact', Icon: FaInstagram },
  { label: 'LinkedIn', href: '#contact', Icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <aside aria-label="Social links" className="fixed left-0 top-1/2 z-40 -translate-y-1/2 pl-2 sm:pl-4">
      <div className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#171717]/95 shadow-[0_0_24px_rgba(0,255,65,0.2)] backdrop-blur">
        {socialLinks.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
            aria-label={label}
            className="grid h-11 w-11 place-items-center border-b border-white/12 text-[#93ff31] transition last:border-b-0 hover:bg-[#93ff31]/10 hover:text-[#baff5f] hover:shadow-[inset_0_0_18px_rgba(147,255,49,0.18)] sm:h-12 sm:w-12"
          >
            <Icon className="h-5 w-5 drop-shadow-[0_0_7px_rgba(147,255,49,0.9)]" />
          </a>
        ))}
      </div>
    </aside>
  );
}
