export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

export function GetFormattedForCurrency(currency: string) {
  const locale = "id-ID";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
