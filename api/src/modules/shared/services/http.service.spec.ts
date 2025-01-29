import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from './http.service';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('HttpService', () => {
  let httpService: HttpService;
  let mockedAxiosHttpService: jest.Mocked<AxiosHttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        {
          provide: AxiosHttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    mockedAxiosHttpService =
      module.get<jest.Mocked<AxiosHttpService>>(AxiosHttpService);
  });

  it('should be defined', () => {
    expect(httpService).toBeDefined();
    expect(mockedAxiosHttpService).toBeDefined();
  });

  describe('get', () => {
    it('should return values from get request', async () => {
      jest
        .spyOn(mockedAxiosHttpService, 'get')
        .mockImplementation(
          () => of({ status: 200, data: { value: 'value' } }) as any,
        );

      const result = await httpService.get('url.com.br/api', {
        queryParams: { param1: 'value1', param2: 'value2' },
        headers: { header1: 'header1' },
      });

      expect(result).toStrictEqual({
        status: 200,
        data: { value: 'value' },
      });
      expect(mockedAxiosHttpService.get).toHaveBeenCalledWith(
        'url.com.br/api',
        {
          params: { param1: 'value1', param2: 'value2' },
          headers: { header1: 'header1' },
        },
      );
    });

    it('should return false when get request fails', async () => {
      jest.spyOn(mockedAxiosHttpService, 'get').mockImplementation(() => {
        throw new Error();
      });

      const result = await httpService.get('url.com.br/api', {
        queryParams: { param1: 'value1', param2: 'value2' },
        headers: { header1: 'header1' },
      });

      expect(result).toBe(false);
      expect(mockedAxiosHttpService.get).toHaveBeenCalledWith(
        'url.com.br/api',
        {
          params: { param1: 'value1', param2: 'value2' },
          headers: { header1: 'header1' },
        },
      );
    });
  });

  describe('post', () => {
    it('should return values from post request', async () => {
      jest
        .spyOn(mockedAxiosHttpService, 'post')
        .mockImplementation(
          () => of({ status: 200, data: { value: 'value' } }) as any,
        );

      const result = await httpService.post('url.com.br/api', {
        body: { data: 'data' },
        queryParams: { param1: 'value1', param2: 'value2' },
        headers: { header1: 'header1' },
      });

      expect(result).toStrictEqual({
        status: 200,
        data: { value: 'value' },
      });
      expect(mockedAxiosHttpService.post).toHaveBeenCalledWith(
        'url.com.br/api',
        { data: 'data' },
        {
          params: { param1: 'value1', param2: 'value2' },
          headers: { header1: 'header1' },
        },
      );
    });

    it('should return false when post request fails', async () => {
      jest.spyOn(mockedAxiosHttpService, 'post').mockImplementation(() => {
        throw new Error();
      });

      const result = await httpService.post('url.com.br/api', {
        body: { data: 'data' },
        queryParams: { param1: 'value1', param2: 'value2' },
        headers: { header1: 'header1' },
      });

      expect(result).toBe(false);
      expect(mockedAxiosHttpService.post).toHaveBeenCalledWith(
        'url.com.br/api',
        { data: 'data' },
        {
          params: { param1: 'value1', param2: 'value2' },
          headers: { header1: 'header1' },
        },
      );
    });
  });
});
