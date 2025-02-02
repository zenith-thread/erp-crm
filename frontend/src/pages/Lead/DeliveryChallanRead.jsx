import useLanguage from '@/locale/useLanguage';
import ReadDeliveryChallanModule from '@/modules/DeliveryChallanModule/ReadDeliveryChallanModule';

export default function DeliveryChallanRead() {
  const translate = useLanguage();

  const entity = 'deliveryChallan';

  const Labels = {
    PANEL_TITLE: translate('deliveryChallan'),
    DATATABLE_TITLE: translate('deliveryChallan_list'),
    ADD_NEW_ENTITY: translate('add_new_deliveryChallan'),
    ENTITY_NAME: translate('deliveryChallan'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <ReadDeliveryChallanModule config={configPage} />;
}
