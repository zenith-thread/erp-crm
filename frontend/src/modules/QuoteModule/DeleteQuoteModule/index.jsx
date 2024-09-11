import { ErpLayout } from '@/layout';
import DeleteItem from '@/modules/ErpPanelModule/DeleteItem';

export default function DeleteQuoteModule({ config }) {
  return (
    <ErpLayout>
      <DeleteItem config={config} />
    </ErpLayout>
  );
}
