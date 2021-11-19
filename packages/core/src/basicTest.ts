const basicTest = JSON.stringify({
  vdom: [
    {
      level: 'advanced',
      name: 'mount',
      id: -1,
      api: {
        url: '/api/query',
        method: 'get',
        effect: ['list'],
        model: ['queryParams'],
        computeParams: '',
      },
    },
    {
      level: 'basic',
      id: 1,
      name: 'form',
      api: {
        method: 'get',
        url: '/api/query',
        model: ['queryParams'],
        effect: ['list'],
        rules: `(params) => {
          if (params && (params.title || params.createTime)) {
            return true
          } else {
            return '标题和时间至少填写一个'
          }
        }`,
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
      pagination: {
        limit: 10,
        computeStart: '',
        computeMore: '(data) => data && !!data.data.more',
        computeTotal: '(data) => data && data.data.total',
        api: {
          url: '/api/query',
          method: 'get',
          effect: ['list'],
          model: ['queryParams'],
        },
      },
      hasOperate: true,
      operateApi: {
        method: 'put',
        url: '/api/update',
      },
      hasDelete: true,
      deleteApi: {
        method: 'delete',
        url: '/api/delete',
      },
      canSelect: true,
      selectApi: {
        method: 'delete',
        url: '/api/batchdelete',
        computeParams: '(rows) => rows && {ids: rows.map(row => row.id).join(",")}',
      },
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
