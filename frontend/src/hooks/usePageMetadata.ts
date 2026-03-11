import { useEffect } from 'react';
import { applyPageMetadata } from '../utils/seo';

export function usePageMetadata(pathname: string) {
  useEffect(() => {
    applyPageMetadata(pathname);
  }, [pathname]);
}
