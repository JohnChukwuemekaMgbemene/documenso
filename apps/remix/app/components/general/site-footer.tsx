import { Link } from 'react-router';
import { version } from '../../../../package.json';

const SOURCE_REPOSITORY_URL = 'https://github.com/JohnChukwuemekaMgbemene/documenso';
const RELEASE_TAG_URL = `https://github.com/JohnChukwuemekaMgbemene/documenso/releases/tag/v${version}`;

export const SiteFooter = () => {
  return (
    <footer className="mx-auto flex w-full max-w-screen-xl flex-col gap-2 px-4 pb-6 pt-10 text-center text-muted-foreground text-xs md:flex-row md:items-center md:justify-between md:text-left">
      <p>Documenso is open source.</p>

      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
        <Link to="/source" className="duration-200 hover:text-foreground">
          Source code
        </Link>
        <a href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer" className="duration-200 hover:text-foreground">
          GitHub
        </a>
        <a href={RELEASE_TAG_URL} target="_blank" rel="noreferrer" className="duration-200 hover:text-foreground">
          Release tag
        </a>
        <a href="https://documen.so/terms" target="_blank" rel="noreferrer" className="duration-200 hover:text-foreground">
          Terms
        </a>
        <a href="https://documen.so/privacy" target="_blank" rel="noreferrer" className="duration-200 hover:text-foreground">
          Privacy
        </a>
      </nav>
    </footer>
  );
};
