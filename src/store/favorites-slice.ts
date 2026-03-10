import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { State } from '../types/main-state';
import { APIRoute, RequestStatus } from '../const/const';
import { changeFavoriteStatus } from './main-slice';

type FavoritesState = {
  favorites: Offer[];
  favoritesLoadingStatus: RequestStatus;
  favoritesError: string | null;
};

const initialState: FavoritesState = {
  favorites: [],
  favoritesLoadingStatus: RequestStatus.Idle,
  favoritesError: null,
};

export const fetchFavorites = createAsyncThunk<
  Offer[],
  void,
  { extra: AxiosInstance; rejectValue: string }
>(
  'favorites/fetchFavorites',
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Offer[]>(APIRoute.Favorite);
      return data;
    } catch {
      return rejectWithValue('Failed to load favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesLoadingStatus = RequestStatus.Loading;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action) => {
          state.favorites = action.payload;
          state.favoritesLoadingStatus = RequestStatus.Success;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.favoritesLoadingStatus = RequestStatus.Failed;
        state.favoritesError =
          action.payload ?? action.error.message ?? 'Unknown error';
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        if (updatedOffer.isFavorite) {
          state.favorites = [
            ...state.favorites.filter((offer) => offer.id !== updatedOffer.id),
            updatedOffer
          ];
        } else {
          state.favorites = state.favorites.filter(
            (offer) => offer.id !== updatedOffer.id
          );
        }
      });
  },
});

export const selectFavorites = (state: State) => state.favorites.favorites;

export const selectFavoritesByCity = createSelector(
  [selectFavorites],
  (favorites) =>
    favorites.reduce<Record<string, Offer[]>>((acc, offer) => {
      const city = offer.city.name;

      if (!acc[city]) {
        acc[city] = [];
      }

      acc[city].push(offer);

      return acc;
    }, {})
);

export const selectFavoritesLoadingStatus = (state: State) =>
  state.favorites.favoritesLoadingStatus;

export default favoritesSlice.reducer;
