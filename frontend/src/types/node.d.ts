// Para módulos de Node.js
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

// Para archivos de imagen
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
declare module '*.webp';
declare module '*.ico';

// Para archivos de fuente
declare module '*.woff';
declare module '*.woff2';
declare module '*.eot';
declare module '*.ttf';
declare module '*.otf';

// Para archivos de video y audio
declare module '*.mp4';
declare module '*.webm';
declare module '*.ogg';
declare module '*.mp3';
declare module '*.wav';
declare module '*.flac';
declare module '*.aac';

// Para archivos de documentos
declare module '*.pdf';
declare module '*.doc';
declare module '*.docx';
declare module '*.xls';
declare module '*.xlsx';
declare module '*.ppt';
declare module '*.pptx';

// Variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    // Añade aquí más variables de entorno según sea necesario
  }
}

// Extender la interfaz de Window si es necesario
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  // Añade aquí más propiedades de window según sea necesario
}
