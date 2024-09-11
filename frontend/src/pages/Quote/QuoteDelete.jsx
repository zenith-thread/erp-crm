import useLanguage from '@/locale/useLanguage';
import DeleteQuoteModule from '@/modules/QuoteModule/DeleteQuoteModule';

export default function QuoteDelete() {
  const translate = useLanguage();

  const entity = 'quote';

  const Labels = {
    PANEL_TITLE: translate('quote'),
    DATATABLE_TITLE: translate('quote_list'),
    DELETE_ENTITY: translate('delete_quote'),
    ENTITY_NAME: translate('quote'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  return <DeleteQuoteModule config={configPage} />;
}
