import MainPage from '../../pages/main-page/main-page.tsx';

type AppScreenProps = {
  offersAmount: number;
}

export default function App({offersAmount}: AppScreenProps): JSX.Element {
  return (
    <MainPage offersAmount={offersAmount} />
  );
}
