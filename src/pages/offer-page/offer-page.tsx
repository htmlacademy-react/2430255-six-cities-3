import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { AppRoute, PageTitle, AuthorizationStatus } from '../../const/const';
import OffersList from '../../components/offers-list/offers-list';
import Review from '../../components/review/review';
import Map from '../../components/map/map';
import { pluralize } from '../../utils/util';
import { changeFavoriteStatus } from '../../store/main-slice';
import { selectAuthStatus } from '../../store/auth-slice';
import {
  fetchOfferById,
  fetchNearbyOffers,
  fetchComments,
  clearOffer,
  selectOffer,
  selectNearbyOffers,
  selectComments,
  selectIsOfferLoading,
  selectOfferError
} from '../../store/offer-slice';

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const authorizationStatus = useAppSelector(selectAuthStatus);
  const currentOffer = useAppSelector(selectOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const comments = useAppSelector(selectComments);
  const isLoading = useAppSelector(selectIsOfferLoading);
  const error = useAppSelector(selectOfferError);

  const MAX_GALLERY_IMAGES = 6;
  const MAX_COMMENTS = 10;

  const sortedComments = useMemo(
    () =>
      [...comments]
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, MAX_COMMENTS),
    [comments]
  );

  const handleBookmarkClick = () => {
    if (!currentOffer) {
      return;
    }

    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(
      changeFavoriteStatus({
        offerId: currentOffer.id,
        isFavorite: !currentOffer.isFavorite
      })
    );
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferById(id));
      dispatch(fetchNearbyOffers(id));
      dispatch(fetchComments(id));
    }

    return () => {
      dispatch(clearOffer());
    };
  }, [id, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  if (!currentOffer) {
    return null;
  }

  const bookmarkButtonClassName = `offer__bookmark-button button ${
    currentOffer.isFavorite ? 'offer__bookmark-button--active' : ''
  }`;

  const offersForMap = [currentOffer, ...nearbyOffers];

  return (
    <>
      <Helmet>
        <title>{PageTitle.Offer}</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {currentOffer.images.slice(0, MAX_GALLERY_IMAGES).map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt={currentOffer.title}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}

              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>

                <button
                  className={bookmarkButtonClassName}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width={31} height={33}>
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${(currentOffer.rating / 5) * 100}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{currentOffer.rating}</span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{currentOffer.type}</li>
                <li className="offer__feature offer__feature--bedrooms">
                  {currentOffer.bedrooms}{' '}
                  {pluralize(currentOffer.bedrooms, 'Bedroom', 'Bedrooms')}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {currentOffer.maxAdults}{' '}
                  {pluralize(currentOffer.maxAdults, 'adult', 'adults')}
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">€{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {currentOffer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src={currentOffer.host.avatarUrl}
                      width={74}
                      height={74}
                      alt={currentOffer.host.name}
                    />
                  </div>
                  <span className="offer__user-name">{currentOffer.host.name}</span>
                  {currentOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>

                <div className="offer__description">
                  <p className="offer__text">
                    {currentOffer.description}
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews · <span className="reviews__amount">{comments.length}</span>
                </h2>

                <Review authorizationStatus={authorizationStatus} comments={sortedComments} />
              </section>
            </div>
          </div>
          <section className="offer__map map">
            <Map city={currentOffer.city} offers={offersForMap} activeOfferId={currentOffer.id} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <OffersList offers={nearbyOffers} className="near-places__list places__list" />
          </section>
        </div>
      </main>
    </>
  );
}
