const basicTest = JSON.stringify({
  vdom: [
    {
      level: 'basic',
      id: 1,
      name: 'form',
      api: {
        method: 'GET',
        url: '/api/query',
        model: ['queryParams'],
        effect: ['list'],
      },
      children: [
        {
          level: 'basic',
          id: 2,
          name: 'input',
          label: '标题',
          model: ['queryParams', 'title'],
          required: true,
          width: 200,
        },
        {
          level: 'basic',
          id: 3,
          name: 'datepicker',
          label: '创建时间',
          model: [
            ['queryParams', 'createTimeStart'],
            ['queryParams', 'createTimeEnd'],
          ],
          type: 'range',
          picker: 'time',
        },
      ],
    },
    {
      level: 'basic',
      id: 4,
      name: 'table',
      columns: [
        { title: '标题', name: 'copy', dataIndex: 'title' },
        { title: '图片', name: 'multiImages', dataIndex: 'images' },
        { title: '内容', name: 'text', dataIndex: 'content' },
        { title: '创建时间', name: 'time', dataIndex: 'createTime' },
      ],
      state: ['list'],
      computeData: '(data) => data && data.data.object_list.map(item => ({...item, key: item.id}))',
    },
  ],
  model: {
    queryParams: {
      title: null,
      createTimeStart: null,
      createTimeEnd: null,
    },
  },
  state: {
    list: null,
  },
});

export default basicTest;
