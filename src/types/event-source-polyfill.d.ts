declare module 'event-source-polyfill' {
  export interface EventSourcePolyfillInit {
    headers?: Record<string, string>;
    heartbeatTimeout?: number;
    withCredentials?: boolean;
  }

  export class EventSourcePolyfill extends EventTarget {
    static readonly CONNECTING: 0;
    static readonly OPEN: 1;
    static readonly CLOSED: 2;

    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSED: 2;

    readonly readyState: 0 | 1 | 2;
    readonly url: string;
    readonly withCredentials: boolean;

    onopen: ((event: Event) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((event: Event) => void) | null;

    constructor(url: string, eventSourceInitDict?: EventSourcePolyfillInit);

    close(): void;

    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;

    dispatchEvent(event: Event): boolean;
  }
}

