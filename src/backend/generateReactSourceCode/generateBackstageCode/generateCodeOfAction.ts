import {
  Action,
  FetchData,
  InteractData,
  PaginationStartComputeData,
} from '@/backend/types/backstage';

export const generateCodeOfAction = (action: Action) => {
  let actionCode = '';
  const { output, next, receive } = action;
  switch (action.type) {
    case 'Fetch':
      const {
        url,
        method,
        params,
        body,
        computeParams,
        computeBody,
        computeResponse,
      } = action.data as FetchData;
      const responseVariableName = output || 'computedResponse';
      actionCode = `
        const response = await request["${method}"]('${url}'${
        body ? (computeBody ? `, (${computeBody})(${body})` : `, ${body}`) : ''
      }${
        params
          ? computeParams
            ? `, (${computeParams})(${params}${receive ? `, ${receive}` : ''})`
            : `, ${params}`
          : ''
      })
        if (response) {
            const ${responseVariableName} = ${
        computeResponse ? `(${computeResponse})(response)` : 'response'
      }
            ${next ? generateCodeOfAction(next) : ''}
        }
      `;
      break;
    case 'Interact':
      const { setState, mode } = action.data as InteractData;
      switch (mode) {
        case 'Cover':
          actionCode = `${setState}(${receive});${
            next ? generateCodeOfAction(next) : ''
          }`;
          break;
        case 'Increase':
          actionCode = `${setState}(state => Array.isArray(state) ? [...state, ...${receive}] : {...state, ...${receive}});${
            next ? generateCodeOfAction(next) : ''
          }`;
          break;
        default:
          break;
      }
      break;
    case 'PaginationStartCompute':
      const { code } = action.data as PaginationStartComputeData;
      actionCode =
        output && code
          ? `const ${output} = (${code})(page, pageSize);${
              next ? generateCodeOfAction(next) : ''
            }`
          : next
          ? generateCodeOfAction(next)
          : '';

      break;
    default:
      break;
  }
  return actionCode;
};
