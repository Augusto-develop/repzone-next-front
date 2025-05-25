import { useEffect, useState } from "react";

type UseResponsivePageSizeOptions = {
  estimatedRowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  padding?: number;
};

export const useResponsivePageSize = ({
  estimatedRowHeight = 50,
  headerHeight = 245,
  footerHeight = 64,
  padding = 100,
}: UseResponsivePageSizeOptions = {}) => {
  const getPageSizeForHeight = () => {
    const availableHeight = window.innerHeight - headerHeight - footerHeight - padding;
    return Math.floor(availableHeight / estimatedRowHeight);
  };

  const [pageSize, setPageSize] = useState<number>(getPageSizeForHeight());

  useEffect(() => {
    const handleResize = () => {
      setPageSize(getPageSizeForHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return pageSize;
};
