import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { Comment } from '../types/comment';
import { State } from '../types/main-state';
import { APIRoute, RequestStatus } from '../const/const';
import { changeFavoriteStatus } from './main-slice';

const NEARBY_LIMIT = 3;

export type OfferState = {
  offer: Offer | null;
  nearbyOffers: Offer[];
  comments: Comment[];
  offerLoadingStatus: RequestStatus;
  sendingCommentStatus: RequestStatus;
  offerError: string | null;
};

const initialState: OfferState = {
  offer: null,
  nearbyOffers: [],
  comments: [],
  offerLoadingStatus: RequestStatus.Idle,
  sendingCommentStatus: RequestStatus.Idle,
  offerError: null,
};

export const fetchOfferById = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance; rejectValue: string }
>('offer/fetchOfferById', async (id, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer>(`${APIRoute.Offers}/${id}`);
    return data;
  } catch {
    return rejectWithValue('Failed to load offer.');
  }
});

export const fetchNearbyOffers = createAsyncThunk<
  Offer[],
  string,
  { extra: AxiosInstance; rejectValue: string }
>('offer/fetchNearbyOffers', async (id, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Offer[]>(`${APIRoute.Offers}/${id}/nearby`);
    return data;
  } catch {
    return rejectWithValue('Failed to load nearby offers.');
  }
});

export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { extra: AxiosInstance; rejectValue: string }
>('offer/fetchComments', async (id, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.get<Comment[]>(`${APIRoute.Comments}/${id}`);
    return data;
  } catch {
    return rejectWithValue('Failed to load comments.');
  }
});

export const sendComment = createAsyncThunk<
  Comment,
  { offerId: string; rating: number; comment: string },
  { extra: AxiosInstance; rejectValue: string }
>('offer/sendComment', async ({ offerId, rating, comment }, { extra: api, rejectWithValue }) => {
  try {
    const { data } = await api.post<Comment>(`${APIRoute.Comments}/${offerId}`, {
      rating,
      comment,
    });
    return data;
  } catch {
    return rejectWithValue('Failed to send comment.');
  }
});

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    clearOffer(state) {
      state.offer = null;
      state.nearbyOffers = [];
      state.comments = [];
      state.offerLoadingStatus = RequestStatus.Idle;
      state.sendingCommentStatus = RequestStatus.Idle;
      state.offerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferById.pending, (state) => {
        state.offerLoadingStatus = RequestStatus.Loading;
        state.offerError = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.offer = action.payload;
        state.offerLoadingStatus = RequestStatus.Success;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.offerLoadingStatus = RequestStatus.Failed;
        state.offerError = action.payload ?? action.error.message ?? 'Unknown error';
      })
      .addCase(fetchNearbyOffers.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload.slice(0, NEARBY_LIMIT);
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(sendComment.pending, (state) => {
        state.sendingCommentStatus = RequestStatus.Loading;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.comments = [action.payload, ...state.comments];
        state.sendingCommentStatus = RequestStatus.Success;
      })
      .addCase(sendComment.rejected, (state) => {
        state.sendingCommentStatus = RequestStatus.Failed;
      })
      .addCase(changeFavoriteStatus.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        if (state.offer?.id === updatedOffer.id) {
          state.offer = updatedOffer;
        }
        state.nearbyOffers = state.nearbyOffers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );
      });
  }
});

export const { clearOffer } = offerSlice.actions;

export const selectOffer = (state: State) => state.offer.offer;
export const selectNearbyOffers = (state: State) => state.offer.nearbyOffers;
export const selectComments = (state: State) => state.offer.comments;

export const selectOfferLoadingStatus = (state: State) => state.offer.offerLoadingStatus;
export const selectIsOfferLoading = (state: State) => state.offer.offerLoadingStatus === RequestStatus.Loading;
export const selectOfferError = (state: State) => state.offer.offerError;

export const selectSendingCommentStatus = (state: State) => state.offer.sendingCommentStatus;
export const selectIsSendingComment = (state: State) => state.offer.sendingCommentStatus === RequestStatus.Loading;

export default offerSlice.reducer;
