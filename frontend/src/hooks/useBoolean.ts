import { useCallback, useState } from "react";

export const useBoolean = (
  initValue = false
): [boolean, () => void, () => void, () => void] => {
  const [value, setValue] = useState(initValue);
  const valueOn = useCallback(() => {
    setValue(true);
  }, []);
  const valueOff = useCallback(() => {
    setValue(false);
  }, []);
  const valueToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);
  return [value, valueOn, valueOff, valueToggle];
};
