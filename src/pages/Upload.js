import { useTranslation } from 'react-i18next';

function Upload() {
  const { t } = useTranslation();
  return <h2 style={{ margin: '16px', textAlign: 'center' }}>{t('Upload View')}</h2>;
}

export default Upload;
