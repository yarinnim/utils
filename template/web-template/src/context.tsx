import { createContext } from 'react';
import { I18N_URL, I18N_VERSION } from '@/constant';
import useI18n, { type Locale } from '@core/i18n';
import ajax from '@/utils/ajax';
import { useModal, useTheme } from '@core/lite-ui/hooks';
import Modal from '@/components/Modal';

const langFetcher = (url: string) => ajax(url)
  .then((result: any) => result)
  .catch(() => ({}));

type I18n = {
  translate: (phrase: string, bindedParams?: unknown) => string,
  locale: Locale,
  setLocale: (code: string) => Promise<void>,
};

type ContextProps = {
  i18n: I18n,
  modal: any,
  theme: [string, (mode: string) => void],
};

const MainContext = createContext({} as ContextProps);

export function ContextProvider(props: any) {
  const { children } = props;
  const i18n = useI18n({
    getUrl: (code: string) => `${I18N_URL}/${code}.json`,
    version: I18N_VERSION,
    fetcher: langFetcher,
  });

  const modal = useModal({ template: Modal });
  const theme = useTheme();

  const value = {
    i18n,
    modal,
    theme,
  };

  return (<MainContext value={value}>{children}</MainContext>);
}

export default MainContext;
