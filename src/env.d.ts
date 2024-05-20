/// <reference types="vite/client" />

declare let SvgIcon: import("vue").DefineComponent<{
  type: {
    type: StringConstructor;
    default: string;
  };
  path: {
    type: StringConstructor;
    default: string;
  };
  size: {
    type: NumberConstructor;
    optional: boolean;
  };
  viewbox: {
    type: StringConstructor;
    optional: boolean;
  };
  flip: {
    type: StringConstructor;
    optional: boolean;
  };
  rotate: {
    type: StringConstructor;
    optional: boolean;
  };
}>;

declare module "@jamescoyle/vue-icon" {
  export default SvgIcon
}