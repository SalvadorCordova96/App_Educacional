import { apiGet, apiPost } from '../services/apiService';

describe('apiService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('realiza una petición GET correctamente', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ data: 123 }) });
    const data = await apiGet('/test', 'token');
    expect(data).toEqual({ data: 123 });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({ headers: { Authorization: 'Bearer token' } }));
  });

  it('lanza error en petición GET fallida', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(apiGet('/fail')).rejects.toThrow('Error en la petición GET');
  });

  it('realiza una petición POST correctamente', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    const data = await apiPost('/test', { foo: 'bar' }, 'token');
    expect(data).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({ method: 'POST' }));
  });

  it('lanza error en petición POST fallida', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });
    await expect(apiPost('/fail', {})).rejects.toThrow('Error en la petición POST');
  });
});