export const sortBy = (prop: any, desc = false) => {
  const sorter = (a: any, b: any) => {
    const multiplier = desc ? -1 : 1;
    if (a[prop] > b[prop]) return 1 * multiplier;
    // if (a[prop] < b[prop]) return -1 * multiplier;
    return -1 * multiplier;
  }
  return sorter;
}