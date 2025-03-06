export const capitalize = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  

  export const noop = (..._args: any[]): void => {};
