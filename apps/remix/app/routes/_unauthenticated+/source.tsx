import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

import { appMetaTags } from '~/utils/meta';
import { version } from '../../../../../package.json';

const SOURCE_REPOSITORY_URL = 'https://github.com/JohnChukwuemekaMgbemene/documenso';
const RELEASE_TAG_URL = `https://github.com/JohnChukwuemekaMgbemene/documenso/releases/tag/v${version}`;

export function meta() {
  return appMetaTags(msg`Source Code`);
}

export default function Source({}: Route.ComponentProps) {
  return (
    <div className="w-screen max-w-2xl px-4">
      <div className="rounded-xl border border-border bg-neutral-100 p-6 dark:bg-background">
        <p className="text-muted-foreground text-sm uppercase tracking-wide">
          <Trans>Open source</Trans>
        </p>

        <h1 className="mt-2 font-semibold text-2xl">
          <Trans>Source code</Trans>
        </h1>

        <p className="mt-3 text-muted-foreground text-sm leading-6">
          <Trans>
            This deployment is based on a public Documenso fork. The exact source for the running version should be
            available in the repository linked below.
          </Trans>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={SOURCE_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border bg-background px-4 py-2 font-medium text-sm duration-200 hover:bg-accent"
          >
            <Trans>View the repository</Trans>
          </a>

          <a
            href={RELEASE_TAG_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border bg-background px-4 py-2 font-medium text-sm duration-200 hover:bg-accent"
          >
            <Trans>View release tag</Trans>
          </a>

          <Link
            to="/signin"
            className="inline-flex items-center rounded-lg border border-transparent px-4 py-2 font-medium text-sm text-muted-foreground duration-200 hover:text-foreground"
          >
            <Trans>Back to sign in</Trans>
          </Link>
        </div>

        <p className="mt-6 text-muted-foreground text-xs leading-5">
          <Trans>
            The release tag above matches this app version. If production changes, update the tag so it stays in sync
            with the running source.
          </Trans>
        </p>
      </div>
    </div>
  );
}
