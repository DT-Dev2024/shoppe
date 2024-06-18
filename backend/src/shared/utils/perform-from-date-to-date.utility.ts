export function performFromDateToDate(
  fromDate?: Date | string | number,
  toDate?: Date | string | number,
): { fromDate: Date; toDate: Date } {
  if (!fromDate) fromDate = new Date(0);
  else fromDate = new Date(fromDate);
  if (!toDate) toDate = new Date();
  else toDate = new Date(toDate);
  return { fromDate, toDate };
}
