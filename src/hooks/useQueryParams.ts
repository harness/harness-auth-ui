import React from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import type { IParseOptions } from "qs";

export function useQueryParams<T = Record<string, unknown>>(
  options?: IParseOptions
): T {
  const { search } = useLocation();

  const queryParams = React.useMemo(
    () => qs.parse(search, { ignoreQueryPrefix: true, ...options }),
    [search, options]
  );

  return (queryParams as unknown) as T;
}
