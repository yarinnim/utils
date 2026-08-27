import { createAutoFetch, createUseFetch, createUseForm } from '@core/lite-ui/hooks';
import { useContext } from 'react';
import ajax from '@/utils/ajax';
import context from '@/context';

export const useAutoFetch = createAutoFetch({ fetcher: ajax });
export const useFetch = createUseFetch({ fetcher: ajax });
export const useForm = createUseForm({ fetcher: ajax });

export const useI18n = () => {
  const { i18n } = useContext(context);
  return i18n;
};

export const useTranslation = () => {
  const { i18n } = useContext(context);
  return i18n.translate;
};

export const useModal = () => {
  const { modal } = useContext(context);
  return modal;
};

export const useTheme = () => {
  const { theme } = useContext(context);
  return theme;
};
