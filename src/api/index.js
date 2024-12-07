import request from '@/request/axios';

// 示例请求
export const queryBankList = (params) => {
  return request({
    url: '/rankListRequest',
    method: 'get',
    params
  });
}

export const userRankDetail = (params) => {
  return request({
    url: '/userRankDetailRequest',
    method: 'get',
    params
  });
}