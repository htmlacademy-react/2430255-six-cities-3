import Header from '../../components/layout/header/header';
import OfferCard from '../../components/offer-card/offer-card';
import NavTabs from '../../components/nav-tabs/nav-tabs';
import PlacesSorting from '../../components/places-sorting/places-sorting';

type MainPageProps = {
  offersAmount: number;
}

export default function MainPage({offersAmount}: MainPageProps): JSX.Element {
  return (
    <div className="page page--gray page--main">
      <Header />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <NavTabs />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offersAmount} places to stay in Amsterdam</b>
              <PlacesSorting />
              <div className="cities__places-list places__list tabs__content">
                <OfferCard />
                <OfferCard />
                <OfferCard />
                <OfferCard />
                <OfferCard />
              </div>
            </section>
            <div className="cities__right-section">
              <section className="cities__map map" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
