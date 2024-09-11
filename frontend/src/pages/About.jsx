import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'SCM Solutions'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.scmsolutionspk.com">www.scmsolutionspk.com</a>{' '}
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.scmsolutionspk.com/contact-us/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
