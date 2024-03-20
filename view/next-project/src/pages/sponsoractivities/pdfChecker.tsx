import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Test: NextPage = () => {
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const App = isClient ? require('../../components/sponsoractivities/createSponsoractivitiesPDF').default : () => null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <App />
    </>
  );
};

export default Test;
