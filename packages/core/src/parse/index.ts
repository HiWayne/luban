import { traverse } from '@core/utils/index';
import handleVdom from './handleVdom';

type Input = string | ParseInput;
interface ParseInput {
  vdom: VDomNode[];
  model: ModelTree;
  state: StateTree;
}
interface ParseResult {
  vdomTree?: VDomNode[];
  modelTree?: ModelTree;
  stateTree?: StateTree;
}

const parse = (input: Input): ParseResult => {
  try {
    const parseInput = typeof input === 'string' ? (JSON.parse(input) as ParseInput) : input;
    const { vdom, model, state } = parseInput;
    const newVdom = traverse(vdom, handleVdom(model, state));
    return {
      vdomTree: Array.isArray(newVdom) ? newVdom : [newVdom],
      modelTree: model,
      stateTree: state,
    };
  } catch (e) {
    console.error(e);
    return {
      vdomTree: undefined,
      modelTree: undefined,
      stateTree: undefined,
    };
  }
};

export default parse;
