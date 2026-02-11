import { observer } from 'mobx-react';
import { Content } from 'src/pages/explore-meetings/components/Content/Content.tsx';
import { Header } from './components/Header/Header.tsx';

export const ExploreMeetings = observer(() => {
  return (
    <>
      <Header />
      <Content />
    </>
  );
});
