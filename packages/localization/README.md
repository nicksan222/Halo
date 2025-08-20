# @acme/localization

Utilities for localization across apps.

- **defineLang**: validate translation objects at build-time/runtime
- **Per-framework useLocale**: unified shape for reading/updating the current locale

## Install

This package is part of the monorepo. Import it directly.

### Root export

```ts
import { defineLang } from '@acme/localization';
```

### Framework-specific exports

```ts
// Next.js Client Components
import { useLocale } from '@acme/localization/next-client';

// Next.js Server (Route Handlers or Server Components)
import { useLocale } from '@acme/localization/next-server';
```

## defineLang

```ts
import { defineLang } from '@acme/localization';

const translations = defineLang({
	common: {
		ok: { en: 'OK', it: 'OK' },
		cancel: { en: 'Cancel', it: 'Annulla' }
	}
});
```

## useLocale (unified shape)

Both client and server variants return the same shape:

```ts
type UseLocaleResult = {
	locale: 'en' | 'it';
	setLocale: (next: 'en' | 'it') => void;
};
```

### Next.js client example

```tsx
'use client';
import { useLocale } from '@acme/localization/next-client';

export function LocaleSwitcher() {
	const { locale, setLocale } = useLocale({ cookieName: 'locale', defaultLocale: 'en' });
	return (
		<select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
			<option value="en">English</option>
			<option value="it">Italiano</option>
		</select>
	);
}
```

### Next.js server example

```ts
import { cookies, headers } from 'next/headers';
import { useLocale } from '@acme/localization/next-server';

export function GET() {
	const { locale, setLocale } = useLocale(
		{
			headers: headers(),
			cookies: {
				get: (name) => cookies().get(name)?.value,
				set: (name, value) => cookies().set(name, value)
			}
		},
		{ cookieName: 'locale', defaultLocale: 'en' }
	);

	// optionally set a new locale
	setLocale('it');

	return new Response(`Locale is ${locale}`);
}
```

Notes:
- The server variant requires you to pass `headers` and `cookies` adapters. On Next.js, use `next/headers`.
- Both variants persist the locale in a cookie (default: `locale`). 