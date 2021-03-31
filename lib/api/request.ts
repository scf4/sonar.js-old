import axios, { AxiosInstance, AxiosRequestConfig as Config, AxiosResponse } from 'axios';
import { camelizeKeysInPlace, decamelizeKeys } from 'fast-case';
import { HTTPS_URL, HTTPS_URL_V2, SONAR_BUILD, SONAR_VERSION } from 'lib/constants';
import { getClientHeaders } from 'lib/api/auth';

let getHeaders = () => ({
  'Accept': '*/*',
  'Accept-Language': 'en-us',
  'Accept-Encoding': 'gzip, deflate, br',
  'Content-Type': 'application/json',
  'version': SONAR_VERSION,
  'build': SONAR_BUILD,
  ...getClientHeaders(),
});

let createAxiosInstance = (baseUrl = HTTPS_URL) =>
  axios.create({
    baseURL: baseUrl,
    responseType: 'json',
    headers: getHeaders(),
    transformRequest: body => JSON.stringify(decamelizeKeys(body)),
    transformResponse: response => {
      if (!response) return;
      return camelizeKeysInPlace(JSON.parse(response).data);
    },
  });

let axiosInstances = [createAxiosInstance(HTTPS_URL), createAxiosInstance(HTTPS_URL_V2)];

type Body = any;
type Prop = string | undefined;
type Version = 1 | 2;

function createRequestFn(method: 'get' | 'post' | 'put' | 'patch' | 'delete') {
  function request<T = void>(path: string, body?: any, prop?: string, version?: Version, config?: Config): Promise<T>;
  function request<T = void>(path: string, body?: any, version?: Version, config?: Config): Promise<T>;
  function request<T = void>(path: string, version?: Version, config?: Config): Promise<T>;
  async function request<T = void>(
    path: string,
    ...args: (Body | Version | string | Config)[]
  ): Promise<T> {
    let prop: Prop;
    let version: Version = 1;
    let body: Body = {};
    let config: Config = {};

    args.forEach(arg => {
      if ([1, 2].includes(arg)) version = arg;
      if (typeof arg === 'string') prop = arg;
    });

    [body, config] = args.filter(arg => typeof arg === 'object') as [body: Body, config: Config];

    const axiosRequest: AxiosInstance = axiosInstances[version - 1];

    let response: AxiosResponse<T>;

    if (['delete', 'get'].includes(method)) {
      response = await axiosRequest[method]<T>(path, { ...config, params: body });
    } else {
      response = await axiosRequest[method]<T>(path, body, config);
    }

    return !prop ? response.data : response.data[prop];
  }

  return request;
}

const get = createRequestFn('get');
const post = createRequestFn('post');
const put = createRequestFn('put');
const patch = createRequestFn('patch');
const del = createRequestFn('delete');

export { get, post, put, patch, del as delete, getHeaders };
