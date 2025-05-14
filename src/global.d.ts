declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}
  
declare module "*.png" {
    const value: string;
    export default value;
}

declare module "three/examples/jsm/loaders/PCDLoader";

declare module 'video.js' {
  interface Player {
    vr: (options: { projection: string, debug: boolean }) => void;
  }
}