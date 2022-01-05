export default JSON.stringify({
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
      level: 'advanced',
      name: 'button',
      id: 0,
      type: 'primary',
      text: '新建',
      topOffset: 0.5,
      leftOffset: 0.5,
      effect: ['showCreation'],
      value: true,
      customLogic: `
        (immer_produce, next) => {
          const newState = immer_produce((state) => {
            state.showCreation = true;
          })
          next(newState)
        }
      `,
    },
    {
      level: 'advanced',
      name: 'form',
      id: 1,
      children: [
        {
          level: 'advanced',
          name: 'input',
          id: 2,
          label: '标题',
          width: '200px',
          model: ['queryParams', 'title'],
          rules: [{ required: true }, { type: 'string', min: 1, max: 10 }],
          leftOffset: 0.5,
          topOffset: 0.5,
        },
        {
          level: 'advanced',
          name: 'datepicker',
          id: 3,
          type: 'range',
          picker: 'time',
          label: '创建时间',
          width: '200px',
          model: [
            ['queryParams', 'createTimeStart'],
            ['queryParams', 'createTimeEnd'],
          ],
          leftOffset: 0.5,
        },
        {
          level: 'advanced',
          name: 'button',
          id: 4,
          text: '查询',
          api: {
            url: '/api/query',
            method: 'get',
            effect: ['list'],
            model: ['queryParams'],
            computeParams: '(params) => params && {...params, start: 0, limit: 25}',
            rules: `(params) => {
              if (params && (params.title || params.createTime)) {
                return true
              } else {
                return '标题和时间至少填写一个'
              }
            }`,
          },
          init: {
            url: '/api/query',
            method: 'get',
            effect: ['list'],
            model: ['queryParams'],
            computeParams: '(params) => params && {...params, start: 0, limit: 25}',
          },
          leftOffset: 0.5,
        },
      ],
    },
    {
      level: 'advanced',
      name: 'table',
      id: 5,
      state: ['list'],
      model: ['selectedList'],
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
          computeParams: '',
        },
      },
      columns: [
        {
          title: '标题',
          name: 'copy',
          dataIndex: 'title',
        },
        {
          title: '图片',
          name: 'multiImages',
          dataIndex: 'images',
        },
        {
          title: '内容',
          dataIndex: 'content',
        },
        {
          title: '创建时间',
          name: 'time',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          render: [
            {
              level: 'advanced',
              name: 'button',
              id: 6,
              text: '编辑',
              effect: ['showEditor'],
              model: ['selectedData'],
              value: true,
            },
            {
              level: 'advanced',
              name: 'button',
              id: 7,
              text: '删除',
              leftOffset: 0.5,
              api: {
                method: 'delete',
                url: '/api/delete',
                computeParams: '(data) => data && {id: data.id}',
              },
              refresh: {
                url: '/api/query',
                method: 'get',
                effect: ['list'],
              },
            },
          ],
        },
      ],
      topOffset: 0.5,
      leftOffset: 0.5,
    },
    {
      level: 'advanced',
      name: 'modal',
      id: 8,
      state: ['showEditor'],
      effect: ['showEditor'],
      title: '编辑',
      content: [
        {
          level: 'advanced',
          name: 'input',
          id: 9,
          label: '标题',
          width: '200px',
          model: ['selectedData', 'title'],
          rules: [{ required: true }, { type: 'string', min: 1, max: 10 }],
        },
        {
          level: 'advanced',
          name: 'input',
          id: 10,
          type: 'textarea',
          label: '内容',
          width: '200px',
          model: ['selectedData', 'content'],
        },
      ],
      footer: [
        {
          level: 'advanced',
          name: 'button',
          id: 11,
          text: '取消',
          effect: ['showEditor'],
          value: false,
        },
        {
          level: 'advanced',
          name: 'button',
          id: 12,
          text: '确定',
          type: 'primary',
          effect: ['showEditor'],
          value: false,
          api: {
            method: 'put',
            url: '/api/update',
            model: ['selectedData'],
            computeParams:
              '(data) => {if (data) {const newData = {...data}; Reflect.deleteProperty(newData, "key"); return newData} else {return data}}',
          },
          refresh: {
            url: '/api/query',
            method: 'get',
            effect: ['list'],
          },
        },
      ],
    },
    {
      level: 'advanced',
      name: 'button',
      id: 13,
      text: '批量删除',
      type: 'danger',
      leftOffset: 0.5,
      state: ['list'],
      api: {
        method: 'delete',
        url: '/api/batchdelete',
        model: ['selectedList'],
        computeParams: '(data) => data && {id: data.map(item => item.id).join()}',
      },
      refresh: {
        url: '/api/query',
        method: 'get',
        effect: ['list'],
      },
    },
    {
      level: 'advanced',
      name: 'modal',
      id: 14,
      state: ['showCreation'],
      effect: ['showCreation'],
      title: '新建',
      content: [
        {
          level: 'advanced',
          name: 'input',
          id: 15,
          label: '标题',
          width: '200px',
          model: ['createData', 'title'],
          rules: [{ required: true }, { type: 'string', min: 1, max: 10 }],
        },
        {
          level: 'advanced',
          name: 'input',
          id: 16,
          type: 'textarea',
          label: '内容',
          width: '200px',
          model: ['createData', 'content'],
        },
      ],
      footer: [
        {
          level: 'advanced',
          name: 'button',
          id: 17,
          text: '取消',
          effect: ['showCreation'],
          value: false,
        },
        {
          level: 'advanced',
          name: 'button',
          id: 18,
          text: '确定',
          type: 'primary',
          effect: ['showCreation'],
          value: false,
          api: {
            method: 'post',
            url: '/api/create',
            model: ['createData'],
            computeParams: '',
          },
          init: {
            url: '/api/query',
            method: 'get',
            effect: ['list'],
            model: ['queryParams'],
            computeParams: '(params) => params && {...params, start: 0, limit: 25}',
          },
        },
      ],
    },
  ],
  model: {
    queryParams: {
      title: null,
      createTimeStart: null,
      createTimeEnd: null,
    },
    submitParams: {
      title: null,
      content: null,
    },
    selectedData: {
      id: null,
      title: null,
      content: null,
    },
    createData: {
      title: null,
      content: null,
    },
    selectedList: null,
  },
  state: {
    hasTitle: null,
    list: null,
    showEditor: null,
    showCreation: null,
  },
});
