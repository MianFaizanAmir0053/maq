'use client';

import { Fragment } from 'react';
import { SITE } from '@/lib/site';
import { useIsClient } from '@/lib/useClient';

/** Opening hours, with today's line highlighted (worked out in the visitor's browser). */
export default function HoursList() {
  const today = useIsClient() ? (new Date().getDay() + 6) % 7 : -1;
  return (
    <dl>
      {SITE.hours.map(([day, hours], i) => {
        const cls = i === today ? 'today' : undefined;
        return (
          <Fragment key={day}>
            <dt className={cls}>{day}{i === today ? ' · today' : ''}</dt>
            <dd className={cls}>{hours}</dd>
          </Fragment>
        );
      })}
    </dl>
  );
}
