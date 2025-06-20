declare module "*.scss" {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  declare module "*.svg" {
    const content: string;
    export default content;
  }

declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
declare module '*.jpeg';