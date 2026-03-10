import MockAdapter from 'axios-mock-adapter';
import { fetchOffers } from './main-slice';
import { createAPI } from '../services/api';
import { Offer } from '../types/offer';
import { changeFavoriteStatus } from './main-slice';

describe('main async actions', () => {
  const api = createAPI();
  const mockAxios = new MockAdapter(api);

  it('should return offers when server responds 200', async () => {
    const mockOffers = [{ id: '1' }] as Offer[];

    mockAxios.onGet('/offers').reply(200, mockOffers);

    const dispatch = vi.fn();

    const result = await fetchOffers()(dispatch, () => ({}), api);

    expect(result.type).toBe('main/fetchOffers/fulfilled');
    expect(result.payload).toEqual(mockOffers);
  });

  it('should return error when server responds 500', async () => {
    mockAxios.onGet('/offers').reply(500);

    const dispatch = vi.fn();

    const result = await fetchOffers()(dispatch, () => ({}), api);

    expect(result.type).toBe('main/fetchOffers/rejected');
    expect(result.payload).toBe(
      'Failed to load offers. Check your connection to the server.'
    );
  });

  it('should change favorite status', async () => {
    const mockOffer = { id: '1', isFavorite: true } as Offer;

    mockAxios.onPost('/favorite/1/1').reply(200, mockOffer);

    const dispatch = vi.fn();

    const result = await changeFavoriteStatus({
      offerId: '1',
      isFavorite: true,
    })(dispatch, () => ({}), api);

    expect(result.type).toBe('main/changeFavoriteStatus/fulfilled');
    expect(result.payload).toEqual(mockOffer);
  });
});
