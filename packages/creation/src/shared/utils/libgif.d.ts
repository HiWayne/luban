declare module '*.svg' {
  const content: string;
  export default content;
}

interface LibgifConfig {
  gif: HTMLImageElement | string;
  max_width?: number;
  loop_delay?: number;
}

declare module 'libgif' {
  export default class Libgif {
    constructor(props: LibgifConfig);
    move_to: (i: number) => void;
    load: (callback: (imageDom?: HTMLImageElement) => void) => void;
    get_length: () => number;
    get_canvas: () => HTMLCanvasElement;
    get_duration_ms: () => number;
  }
}

interface GIFConfig {
  workers?: number;
  quality?: number;
  width: number;
  height: number;
  workerScript?: string;
}

interface AddFrameConfig {
  delay: number;
}

type EventName = 'finished';

declare module 'gif.js' {
  export default class GIF {
    constructor(props: GIFConfig);
    addFrame: (element: HTMLElement, config: AddFrameConfig) => void;
    on: (eventName: EventName, callback?: (blob: Blob) => any) => void;
    render: () => void;
  }
}

interface CreateGIFConfig {
  images?: any[];
  video?: any[];
  numFrames?: number;
  interval?: number;
  frameDuration?: number;
  gifWidth: number;
  gifHeight: number;
}

interface GIFShotResult {
  image: string;
  error?: boolean;
}

type CreateGIFCallback = (result: GIFShotResult) => any;

type CreatrGIF = (config: CreateGIFConfig, callback: CreateGIFCallback) => void;

declare module 'gifshot' {
  export const createGIF: CreatrGIF;
}
