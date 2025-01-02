export function DateToUTCDate(date: Date) {
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, // Set time to 00:00:00
      0,
      0,
      0
    )
  );
  return utcDate;
}
export function GetFormattedForCurrency(currency: string) {
  const locale = "id-ID";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
