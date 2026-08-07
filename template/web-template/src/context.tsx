import { createContext } from 'react';
import { I18N_URL, I18N_VERSION } from '@/constant';
import useI18n from '@core/i18n';
import ajax from '@/utils/ajax';
import { useModal } from '@core/lite-ui/hooks';
import Modal from '@/components/Modal';

const langFetcher = (url: string) => ajax(url)
  .then((result: any) => result)
  .catch(() => ({}));

type ContextProps = {
  i18n: any,
  modal: any,
};

const MainContext = createContext({} as ContextProps);

export function ContextProvider(props: any) {
  const { children } = props;
  const [translate, locale, setLocale] = useI18n({
    getUrl: (code: string) => `${I18N_URL}/${code}.json`,
    version: I18N_VERSION,
    fetcher: langFetcher,
  });

  const modal = useModal({ template: Modal });

  const value = {
    i18n: { translate, locale, setLocale },
    modal,
  };

  return (<MainContext value={value}>{children}</MainContext>);
}

export default MainContext;
