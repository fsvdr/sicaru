import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/generic/Tooltip';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { getPublicUrl } from '@utils/getPublicUrl';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

const Header = ({ store }: { store: ReturnType<typeof StoreDAO.cleanupStoreFields> }) => {
  const logo = store.logo ? getPublicUrl(store.logo.url) : undefined;
  const dimensions = store.logo ? store.logo.dimensions : undefined;

  return (
    <header className="px-10 py-8">
      <div className="flex flex-col gap-6 pt-16">
        {logo && (
          <div className="relative w-10/12 max-w-80">
            <Image
              src={logo}
              alt={store.name}
              className="object-contain w-full"
              width={dimensions?.width ?? 320}
              height={dimensions?.height ?? 64}
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          <h2 className="text-2xl font-semibold empty:hidden">{store.tagline}</h2>
          <p className="text-sm leading-5 whitespace-pre-wrap empty:hidden opacity-80">{store.bio}</p>
        </div>

        <div className="flex gap-2 empty:hidden">
          <TooltipProvider>
            {store.socialLinks?.map((link, index) => {
              const Icon = getSocialIcon(link.url);
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-0.5 transition-colors rounded-lg hover:bg-black/5"
                    >
                      <Icon className="size-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{link.title || link.url}</TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;

const getSocialIcon = (url: string) => {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('instagram.com')) return FaInstagram;
  if (urlLower.includes('facebook.com')) return FaFacebook;
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return FaXTwitter;
  if (urlLower.includes('tiktok.com')) return FaTiktok;

  return Globe;
};
