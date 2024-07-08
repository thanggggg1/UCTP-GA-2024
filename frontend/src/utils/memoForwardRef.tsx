import React from "react";

export function memoForwardRef<T, P = Record<string, unknown>>(
  component: React.ForwardRefRenderFunction<T, P>
): React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >
> {
  return React.memo(React.forwardRef(component));
}
