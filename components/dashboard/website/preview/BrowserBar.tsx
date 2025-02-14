import { LockIcon } from 'lucide-react';

const BrowserBar = ({ title, subdomain, domain }: { title: string; subdomain: string; domain: string }) => {
  return (
    <div className="flex flex-col items-center gap-1 py-2 text-center bg-gray-200">
      <p className="text-xs font-medium md:text-sm">{title}</p>

      <div className="flex items-center gap-2 px-4 text-white bg-gray-500 rounded-md w-max">
        <LockIcon className="size-3" />
        <p className="text-sm font-medium md:text-base">{subdomain || domain}</p>
      </div>
    </div>
  );
};

export default BrowserBar;
