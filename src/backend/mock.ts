export const test = 'test';

// import dayjs from 'dayjs';
// import { LogicAST, PageModel } from './types';
// import { EsAst, NodeAST } from './types/backstage';

// const treeDemo: NodeAST = {
//   id: 1,
//   type: 'BlockContainer',
//   children: [
//     {
//       id: 32,
//       type: 'Button',
//       props: {
//         text: '新建',
//         action: {
//           type: 'Interact',
//           receive: 'true',
//           data: {
//             setState: 'component_scope_variable_set_show',
//             mode: 'Cover',
//           },
//         },
//       },
//     },
//     {
//       id: 33,
//       type: 'Modal',
//       props: {
//         open: 'component_scope_variable_show',
//         setOpen: 'component_scope_variable_set_show',
//         title: '新建',
//         okAction: {
//           type: 'Interact',
//           receive: 'false',
//           data: {
//             setState: 'component_scope_variable_set_show',
//             mode: 'Cover',
//           },
//         },
//       },
//     },
//     {
//       id: 2,
//       type: 'Form',
//       children: [
//         {
//           id: 15,
//           type: 'SelectWithLabel',
//           props: {
//             label: '类型',
//             value: 'component_scope_variable_params.type',
//             setValue: 'component_scope_variable_set_params',
//             width: 100,
//             options: [
//               {
//                 label: 'blog',
//                 value: 'blog',
//               },
//               {
//                 label: 'atlas',
//                 value: 'atlas',
//               },
//               {
//                 label: 'people',
//                 value: 'people',
//               },
//             ],
//           },
//         },
//         {
//           id: 16,
//           type: 'RadioGroupWithLabel',
//           props: {
//             label: '类型',
//             value: 'component_scope_variable_params.type',
//             setValue: 'component_scope_variable_set_params',
//             options: [
//               {
//                 label: 'blog',
//                 value: 'blog',
//               },
//               {
//                 label: 'atlas',
//                 value: 'atlas',
//               },
//               {
//                 label: 'people',
//                 value: 'people',
//               },
//             ],
//           },
//         },
//         {
//           id: 16,
//           type: 'CheckboxGroupWithLabel',
//           props: {
//             label: '多选类型',
//             value: 'component_scope_variable_params.types',
//             setValue: 'component_scope_variable_set_params',
//             options: [
//               {
//                 label: 'blog',
//                 value: 'blog',
//               },
//               {
//                 label: 'atlas',
//                 value: 'atlas',
//               },
//               {
//                 label: 'people',
//                 value: 'people',
//               },
//             ],
//           },
//         },
//         {
//           id: 17,
//           type: 'RangePickerWithLabel',
//           props: {
//             label: '时间范围',
//             value1: 'component_scope_variable_params.startTime',
//             value2: 'component_scope_variable_params.endTime',
//             setValue: 'component_scope_variable_set_params',
//             format: 'YYYY-MM-DD HH:mm:ss',
//             defaultValue: [
//               dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
//               dayjs().format('YYYY-MM-DD HH:mm:ss'),
//             ],
//             placeholder: ['开始', '结束'],
//           },
//         },
//         {
//           id: 3,
//           type: 'InputWithLabel',
//           props: {
//             label: 'id',
//             value: 'component_scope_variable_params.id',
//             setValue: 'component_scope_variable_set_params',
//             width: 200,
//             placeholder: '输入id',
//           },
//         },
//         {
//           id: 4,
//           type: 'Button',
//           props: {
//             text: '查询',
//             action: {
//               type: 'Fetch',
//               data: {
//                 url: '/api/mock/pagination/',
//                 method: 'GET',
//                 params: 'component_scope_variable_params',
//                 computeParams: `(params) => ({...params, startTime: params.startTime.format('YYYY-MM-DD HH:mm:ss'), endTime: params.endTime.format('YYYY-MM-DD HH:mm:ss')})`,
//                 computeResponse: `(response) => response.data`,
//               },
//               output: 'action_scope_variable_response',
//               next: {
//                 type: 'Interact',
//                 receive: 'action_scope_variable_response',
//                 data: {
//                   setState: 'component_scope_variable_set_table_data',
//                   mode: 'Cover',
//                 },
//                 next: {
//                   type: 'Interact',
//                   receive: 1,
//                   data: {
//                     setState: 'component_scope_variable_set_current_page',
//                     mode: 'Cover',
//                   },
//                 },
//               },
//             },
//           },
//         },
//       ],
//     },
//     {
//       id: 5,
//       type: 'Table',
//       props: {
//         data: 'component_scope_variable_table_data.object_list',
//         columns: [
//           {
//             title: 'ID',
//             dataIndex: 'id',
//             key: 'id',
//             render: {
//               iterate_scope_variable: 'row',
//               render: [
//                 {
//                   id: 6,
//                   type: 'Text',
//                   props: {
//                     text: 'iterate_scope_variable_row.id',
//                     copyable: true,
//                   },
//                 },
//               ],
//             },
//           },
//           { title: '类型', dataIndex: 'type', key: 'type' },
//           {
//             title: '内容',
//             dataIndex: 'content',
//             key: 'content',
//             width: 360,
//             render: {
//               iterate_scope_variable: 'row',
//               render: [
//                 {
//                   id: 7,
//                   type: 'Image',
//                   condition: ['iterate_scope_variable_row.type', 'blog'],
//                   props: {
//                     src: 'iterate_scope_variable_row.content',
//                     width: 150,
//                     height: 150,
//                   },
//                 },
//                 {
//                   id: 8,
//                   type: 'ImageGroup',
//                   condition: ['iterate_scope_variable_row.type', 'atlas'],
//                   props: {
//                     images: 'iterate_scope_variable_row.content',
//                     width: 100,
//                     height: 100,
//                   },
//                 },
//                 {
//                   id: 10,
//                   type: 'Grid',
//                   condition: ['iterate_scope_variable_row.type', 'people'],
//                   props: {
//                     row: 1,
//                     column: 2,
//                     align: 'middle',
//                     gutter: [10, 0],
//                     items: [
//                       {
//                         span: 5.33,
//                       },
//                       { flex: 'center', span: 8 },
//                     ],
//                   },
//                   children: [
//                     {
//                       id: 11,
//                       type: 'Avatar',
//                       props: {
//                         src: 'iterate_scope_variable_row.content.avatar',
//                         size: 70,
//                       },
//                     },
//                     {
//                       id: 12,
//                       type: 'Grid',
//                       props: {
//                         row: 2,
//                         column: 1,
//                       },
//                       children: [
//                         {
//                           id: 13,
//                           type: 'Text',
//                           props: {
//                             text: 'iterate_scope_variable_row.content.username',
//                           },
//                         },
//                         {
//                           id: 30,
//                           type: 'Grid',
//                           props: {
//                             row: 1,
//                             column: 2,
//                             items: [
//                               {
//                                 span: 14,
//                               },
//                               { span: 10 },
//                             ],
//                           },
//                           children: [
//                             {
//                               id: 14,
//                               type: 'Text',
//                               props: {
//                                 text: '粉丝数：',
//                               },
//                             },
//                             {
//                               id: 14,
//                               type: 'Text',
//                               props: {
//                                 text: 'iterate_scope_variable_row.content.fans',
//                               },
//                             },
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           },
//         ],
//         rowKey: 'id',
//         pagination: {
//           pageSize: 1,
//           total: 'component_scope_variable_table_data.total',
//           current: 'component_scope_variable_current_page',
//           setCurrent: 'component_scope_variable_set_current_page',
//           action: {
//             type: 'PaginationStartCompute',
//             data: {
//               code: '(pageCount, pageSize) => (pageCount - 1) * pageSize',
//             },
//             output: 'function_scope_variable_start',
//             next: {
//               type: 'Fetch',
//               data: {
//                 url: '/api/mock/pagination/',
//                 method: 'GET',
//                 params: 'component_scope_variable_params',
//                 computeParams: '(params, start) => ({...params, start})',
//                 computeResponse: '(response) => response.data',
//               },
//               receive: 'function_scope_variable_start',
//               output: 'action_scope_variable_response',
//               next: {
//                 type: 'Interact',
//                 receive: 'action_scope_variable_response',
//                 data: {
//                   setState: 'component_scope_variable_set_table_data',
//                   mode: 'Cover',
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   ],
// };

// const logicDemo: LogicAST[] = [
//   {
//     id: 100,
//     type: 'state',
//     identifiers: [
//       { name: 'component_scope_variable_params' },
//       { name: 'component_scope_variable_set_params' },
//     ],
//     raw: `const [component_scope_variable_params, component_scope_variable_set_params] = useState({id: null, type: null, types: null, start: 0, limit: 1})`,
//   },
//   {
//     id: 101,
//     type: 'state',
//     identifiers: [
//       { name: 'component_scope_variable_table_data' },
//       { name: 'component_scope_variable_set_table_data' },
//     ],
//     raw: 'const [component_scope_variable_table_data, component_scope_variable_set_table_data] = useState({total: 0, object_list: []})',
//   },
//   {
//     id: 102,
//     type: 'state',
//     identifiers: [
//       { name: 'component_scope_variable_current_page' },
//       { name: 'component_scope_variable_set_current_page' },
//     ],
//     raw: `const [component_scope_variable_current_page, component_scope_variable_set_current_page] = useState(1)`,
//   },
//   {
//     id: 103,
//     type: 'state',
//     identifiers: [
//       { name: 'component_scope_variable_show' },
//       { name: 'component_scope_variable_set_show' },
//     ],
//     raw: `const [component_scope_variable_show, component_scope_variable_set_show] = useState(false)`,
//   },
// ];

// export const pageModel: PageModel = {
//   meta: {
//     title: '测试页面',
//     key: 'test1',
//     path: '/test1',
//     env: ['pc', 'react', 'mpa'],
//     mode: 'development',
//   },
//   logics: logicDemo,
//   view: treeDemo,
// };

// const esAstDemo: EsAst = {
//   type: 'Program',
//   body: [
//     {
//       type: 'VariableDeclaration',
//       declarations: [
//         {
//           type: 'VariableDeclarator',
//           id: {
//             type: 'ArrayPattern',
//             elements: [
//               {
//                 type: 'Identifier',
//                 name: 'component_scope_variable_table_data',
//               },
//             ],
//           },
//           init: {
//             type: 'CallExpression',
//             callee: {
//               type: 'Identifier',
//               name: 'useState',
//             },
//             arguments: [
//               {
//                 type: 'ArrayExpression',
//                 elements: [
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'id',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 1423466106,
//                           raw: '1423466106',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'type',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'blog',
//                           raw: '"blog"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'content',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value:
//                             'https://c-ssl.duitang.com/uploads/blog/202209/02/20220902221157_bd1fc.jpeg',
//                           raw: '"https://c-ssl.duitang.com/uploads/blog/202209/02/20220902221157_bd1fc.jpeg"',
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'id',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 132075756,
//                           raw: '132075756',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'type',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'atlas',
//                           raw: '"atlas"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'content',
//                         },
//                         value: {
//                           type: 'ArrayExpression',
//                           elements: [
//                             {
//                               type: 'Literal',
//                               value:
//                                 'https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_59029.jpg',
//                               raw: '"https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_59029.jpg"',
//                             },
//                             {
//                               type: 'Literal',
//                               value:
//                                 'https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_41449.jpg',
//                               raw: '"https://c-ssl.duitang.com/uploads/blog/202210/04/20221004124153_41449.jpg"',
//                             },
//                           ],
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'id',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 22155500,
//                           raw: '22155500',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'type',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'people',
//                           raw: '"people"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'content',
//                         },
//                         value: {
//                           type: 'ObjectExpression',
//                           properties: [
//                             {
//                               type: 'Property',
//                               method: false,
//                               shorthand: false,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 name: 'avatar',
//                               },
//                               value: {
//                                 type: 'Literal',
//                                 value:
//                                   'https://c-ssl.dtstatic.com/uploads/avatar/202209/23/20220923212247_d4030.thumb.200_200_c.jpg',
//                                 raw: '"https://c-ssl.dtstatic.com/uploads/avatar/202209/23/20220923212247_d4030.thumb.200_200_c.jpg"',
//                               },
//                               kind: 'init',
//                             },
//                             {
//                               type: 'Property',
//                               method: false,
//                               shorthand: false,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 name: 'username',
//                               },
//                               value: {
//                                 type: 'Literal',
//                                 value: '栗子味雪糕',
//                                 raw: '"栗子味雪糕"',
//                               },
//                               kind: 'init',
//                             },
//                             {
//                               type: 'Property',
//                               method: false,
//                               shorthand: false,
//                               computed: false,
//                               key: {
//                                 type: 'Identifier',
//                                 name: 'fans',
//                               },
//                               value: {
//                                 type: 'Literal',
//                                 value: 34,
//                                 raw: '34',
//                               },
//                               kind: 'init',
//                             },
//                           ],
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: 'VariableDeclaration',
//       declarations: [
//         {
//           type: 'VariableDeclarator',
//           id: {
//             type: 'ArrayPattern',
//             elements: [
//               {
//                 type: 'Identifier',
//                 name: 'component_scope_variable_table_columns',
//               },
//             ],
//           },
//           init: {
//             type: 'CallExpression',
//             callee: {
//               type: 'Identifier',
//               name: 'useState',
//             },
//             arguments: [
//               {
//                 type: 'ArrayExpression',
//                 elements: [
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'title',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'ID',
//                           raw: '"ID"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'dataIndex',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'id',
//                           raw: '"id"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'key',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'id',
//                           raw: '"id"',
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'title',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: '类型',
//                           raw: '"类型"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'dataIndex',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'type',
//                           raw: '"type"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'key',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'type',
//                           raw: '"type"',
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                   {
//                     type: 'ObjectExpression',
//                     properties: [
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'title',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: '内容',
//                           raw: '"内容"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'dataIndex',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'content',
//                           raw: '"content"',
//                         },
//                         kind: 'init',
//                       },
//                       {
//                         type: 'Property',
//                         method: false,
//                         shorthand: false,
//                         computed: false,
//                         key: {
//                           type: 'Identifier',
//                           name: 'key',
//                         },
//                         value: {
//                           type: 'Literal',
//                           value: 'content',
//                           raw: '"content"',
//                         },
//                         kind: 'init',
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
