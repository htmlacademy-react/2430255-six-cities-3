import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Link, generatePath, useNavigate } from 'react-router-dom';
import { PageTitle, AppRoute, AuthorizationStatus } from '../../const/const';
import { fetchFavorites, selectFavoritesByCity } from '../../store/favorites-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeFavoriteStatus } from '../../store/main-slice';
import { selectAuthStatus } from '../../store/auth-slice';
import Footer from './components/footer';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthStatus);
  const favoritesByCity = useAppSelector(selectFavoritesByCity);

  const isEmpty = Object.keys(favoritesByCity).length === 0;

  const handleBookmarkClick = (offerId: string) => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(changeFavoriteStatus({
      offerId,
      isFavorite: false
    }));
  };

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavorites());
    }
  }, [authorizationStatus, dispatch]);

  return (
    <>
      <Helmet>
        <title>{PageTitle.Favorites}</title>
      </Helmet>

      <main className={`page__main page__main--favorites ${isEmpty ? 'page__main--favorites-empty' : ''}`}>
        <div className="page__favorites-container container">
          <section className={`favorites ${isEmpty ? 'favorites--empty' : ''}`}>
            <h1 className="favorites__title">Saved listing</h1>

            {!isEmpty ? (
              <ul className="favorites__list">
                {Object.entries(favoritesByCity).map(([city, offers]) => (
                  <li key={city} className="favorites__locations-items">

                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link">
                          <span>{city}</span>
                        </a>
                      </div>
                    </div>

                    <div className="favorites__places">
                      {offers.map((offer) => (
                        <article key={offer.id} className="favorites__card place-card">

                          {offer.isPremium && (
                            <div className="place-card__mark">
                              <span>Premium</span>
                            </div>
                          )}

                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <Link to={generatePath(AppRoute.Offer, { id: offer.id })}>
                              <img
                                className="place-card__image"
                                src={offer.previewImage}
                                width={150}
                                height={110}
                                alt={offer.title}
                              />
                            </Link>
                          </div>

                          <div className="favorites__card-info place-card__info">

                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">€{offer.price}</b>
                                <span className="place-card__price-text">/&nbsp;night</span>
                              </div>

                              <button
                                className="place-card__bookmark-button place-card__bookmark-button--active button"
                                type="button"
                                onClick={() => handleBookmarkClick(offer.id)}
                              >
                                <svg className="place-card__bookmark-icon" width={18} height={19}>
                                  <use xlinkHref="#icon-bookmark" />
                                </svg>
                                <span className="visually-hidden">In bookmarks</span>
                              </button>
                            </div>

                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{ width: `${(offer.rating / 5) * 100}%` }} />
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>

                            <h2 className="place-card__name">
                              <Link to={generatePath(AppRoute.Offer, { id: offer.id })}>
                                {offer.title}
                              </Link>
                            </h2>

                            <p className="place-card__type">{offer.type}</p>

                          </div>
                        </article>
                      ))}
                    </div>

                  </li>
                ))}
              </ul>
            ) : (
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
    Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
