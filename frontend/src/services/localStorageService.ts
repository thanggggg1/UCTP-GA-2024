export const setLocalStorageItemWithExpiry = (
  key: string,
  value: any,
  expiryInMilliseconds: number
) => {
  const now = new Date().getTime(); // Current time in milliseconds
  const dataWithExpiry = {
    value: value,
    expiry: now + expiryInMilliseconds,
  };
  localStorage.setItem(key, JSON.stringify(dataWithExpiry));
};

export const getLocalStorageItemWithExpiry = (key: string) => {
  const itemStr = localStorage?.getItem(key);
  // If the item doesn't exist, return an empty object
  if (!itemStr) {
    return {};
  }
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  // Compare the expiry time of the item with the current time
  if (now > item.expiry) {
    // If the item is expired, delete the item from storage and return an empty object
    localStorage.removeItem(key);
    return {};
  }
  // Ensure the value is parsed as an object if it's a stringified JSON
  try {
    const value = JSON.parse(item.value);
    return value;
  } catch (error) {
    // If parsing throws, return the value directly (assuming it's not a stringified JSON)
    return item.value;
  }
};
