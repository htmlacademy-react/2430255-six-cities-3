export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export const OFFER_TYPE_LABEL = {
  apartment: 'Apartment',
  room: 'Room',
  house: 'House',
  hotel: 'Hotel',
} as const;


export const SORTING_OPTIONS = {
  POPULAR: 'Popular',
  PRICE_LOW_TO_HIGH: 'Price: low to high',
  PRICE_HIGH_TO_LOW: 'Price: high to low',
  TOP_RATED_FIRST: 'Top rated first',
} as const;

export type SortOption =
  typeof SORTING_OPTIONS[keyof typeof SORTING_OPTIONS];

export const AppRoute = {
  Main: '/',
  Login: '/login',
  Offer: '/offer/:id',
  Favorites: '/favorites',
  NotFound: '*',
} as const;

export const APIRoute = {
  Offers: '/offers',
  Login: '/login',
  Logout: '/logout',
  Favorite: '/favorite',
  Comments: '/comments',
} as const;

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum PageTitle {
  Main = '6 Cities',
  Login = '6 Cities. Authorization',
  Favorites = '6 Cities. Favorites',
  Offer = '6 Cities. Offer',
  NotFound = '6 Cities. Page not found',
}

export enum RequestStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Failed = 'failed',
}
