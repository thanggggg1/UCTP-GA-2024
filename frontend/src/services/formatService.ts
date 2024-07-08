export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("de-DE").format(value);
};
export const convertFormattedStringToNumber = (
  formattedString: string
): number => {
  // Remove periods used as thousand separators and replace comma with period
  const stringWithoutSeparators = formattedString
    .replace(/\./g, "")
    .replace(/,/, ".");

  // Convert the cleaned string to a number
  return Number(stringWithoutSeparators);
};
export const formatNumberDisplay = (value: number): string => {
  const formatted = new Intl.NumberFormat("de-DE").format(value);
  return formatted.split(",")[0]; // Keep only the part before the comma
};
