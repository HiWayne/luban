import Mock from 'mockjs';

const { Random } = Mock;

const getMock = (rurl: string | RegExp, template: any) => Mock.mock(rurl, 'get', template);
const postMock = (rurl: string | RegExp, template: any) => Mock.mock(rurl, 'post', template);
const putMock = (rurl: string | RegExp, template: any) => Mock.mock(rurl, 'put', template);
const deleteMock = (rurl: string | RegExp, template: any) => Mock.mock(rurl, 'delete', template);

const getMockConfig = {
  url: /api/,
  template: () => ({
    status: 1,
    message: 'success',
    data: {
      more: 1,
      total: 100,
      object_list: new Array(10).fill(true).map((_, index) => ({
        id: Random.natural(1, 100000),
        title: Random.ctitle(),
        content: Random.csentence(),
        images: [
          Random.dataImage('200x200', 'hello'),
          Random.dataImage('200x200', '2'),
          Random.dataImage('200x200', '3'),
          Random.dataImage('200x200', '4'),
          Random.dataImage('200x200', '5'),
          Random.dataImage('200x200', '6'),
          Random.dataImage('200x200', '7'),
          Random.dataImage('200x200', '8'),
          Random.dataImage('200x200', '9'),
        ],
        createTime: Random.datetime(),
      })),
    },
  }),
};

const postMockConfig = {
  url: /api/,
  template: () => ({
    status: 1,
    message: 'success',
    data: {
      result: true,
    },
  }),
};

const mockInit = () => {
  Mock.setup({
    timeout: '200-1000',
  });
  getMock(getMockConfig.url, getMockConfig.template);
  postMock(postMockConfig.url, postMockConfig.template);
  putMock(postMockConfig.url, postMockConfig.template);
  deleteMock(postMockConfig.url, postMockConfig.template);
};

export default mockInit;
