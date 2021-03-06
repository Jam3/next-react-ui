import { memo, PropsWithChildren, useCallback, useState } from 'react';
import classnames from 'classnames';
import noop from 'no-op';

import styles from './CookieBanner.module.scss';

import BaseButton from '@/components/BaseButton/BaseButton';

const copy = {
  settings: 'Cookie Settings',
  close: 'close',
  description:
    'Ullamco deserunt dolore officia cillum ea culpa eu. Voluptate ex in commodo in dolor magna velit pariatur in nostrud enim tempor aliquip nisi.',
  purpose: {
    necessary: 'necessary',
    preference: 'preference',
    statistics: 'statistics',
    marketing: 'marketing'
  },
  defaultText: 'We use cookies on this website to improve your experience.',
  accept: 'Accept All',
  reject: 'Reject All'
};

type CookieConsentProps = {
  // duration
  session: boolean;
  persistent: boolean;
  // purpose
  necessary: boolean;
  preference: boolean;
  statistics: boolean;
  marketing: boolean;
  // provenance
  firstParty: boolean;
  thirdParty: boolean;
};

export type Props = PropsWithChildren<{
  className?: string;
  defaultText?: string;
  acceptCta?: string;
  rejectCta?: string;
  cookieConsent: CookieConsentProps;
  onAccept(): void;
  onUpdate(arg0: CookieConsentProps): void;
  onReject(): void;
}>;

function CookieBanner({
  className,
  defaultText = copy.defaultText,
  acceptCta = copy.accept,
  rejectCta = copy.reject,
  cookieConsent,
  onUpdate = noop,
  onAccept = noop,
  onReject = noop,
  children
}: Props) {
  const [cookieSettings, setCookieSettings] = useState(cookieConsent);
  const [showCookieSetting, setShowCookieSettings] = useState(false);

  const handleAcceptAllCookies = useCallback(() => {
    onAccept();
  }, [onAccept]);

  const handleDeclineAllCookies = useCallback(() => {
    onReject();
  }, [onReject]);

  const handleCookieSettingsClick = useCallback(() => {
    setShowCookieSettings(true);
  }, []);

  const handleCookieSettingsClose = useCallback(() => {
    setShowCookieSettings(false);
    onUpdate(cookieSettings);
  }, [onUpdate, cookieSettings]);

  const handleCookieUpdate = useCallback(
    (key: string, value: boolean) => {
      setCookieSettings({ ...cookieSettings, [key]: value });
    },
    [cookieSettings]
  );

  return (
    <div className={classnames(styles.CookieBanner, className)}>
      <p className={styles.description}>{children || defaultText}</p>

      <div className={styles.buttonContainer}>
        <BaseButton onClick={handleAcceptAllCookies}>{acceptCta}</BaseButton>
        <BaseButton onClick={handleDeclineAllCookies}>{rejectCta}</BaseButton>
        <BaseButton onClick={handleCookieSettingsClick}>{copy.settings}</BaseButton>
      </div>

      {showCookieSetting && (
        <div className={styles.cookieSettings}>
          <BaseButton className={styles.cookieSettingsClose} onClick={handleCookieSettingsClose}>
            {copy.close}
          </BaseButton>

          <div className={styles.cookieSettingsContent}>
            <p className={styles.cookieSettingsDescription}>{copy.description}</p>

            <ul>
              <li>
                <input type="checkbox" id="cookie-necessary" checked={cookieSettings?.necessary ?? false} readOnly />
                <label htmlFor="cookie-necessary">{copy.purpose.necessary}</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="cookie-preference"
                  checked={cookieSettings?.preference ?? false}
                  onChange={(e) => handleCookieUpdate('preference', e.target.checked)}
                />
                <label htmlFor="cookie-preference">{copy.purpose.preference}</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="cookie-statistics"
                  checked={cookieSettings?.statistics ?? false}
                  onChange={(e) => handleCookieUpdate('statistics', e.target.checked)}
                />
                <label htmlFor="cookie-statistics">{copy.purpose.statistics}</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="cookie-marketing"
                  checked={cookieSettings?.marketing ?? false}
                  onChange={(e) => handleCookieUpdate('marketing', e.target.checked)}
                />
                <label htmlFor="cookie-marketing">{copy.purpose.marketing}</label>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(CookieBanner);
