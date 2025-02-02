import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function ScmDetails() {
  const translate = useLanguage();
  const entity = 'scm';
  const searchConfig = {
    displayLabels: ['bankName_scm'],
    searchFields: ['bankName_scm'],
  };
  const deleteModalLabels = ['bankName_scm'];

  const Labels = {
    PANEL_TITLE: translate('scm'),
    DATATABLE_TITLE: translate('SCM Solutions Details'),
    ADD_NEW_ENTITY: translate('add_new_detail'),
    ENTITY_NAME: translate('scm'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
