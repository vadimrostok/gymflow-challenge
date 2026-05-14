import { createContext, type PropsWithChildren, type RefObject, useContext } from 'react';

type PageScrollContextValue = {
  scrollRef: RefObject<HTMLDivElement | null>;
};

const PageScrollContext = createContext<PageScrollContextValue | undefined>(undefined);

export function PageScrollProvider({
  children,
  scrollRef,
}: PropsWithChildren<PageScrollContextValue>) {
  return <PageScrollContext.Provider value={{ scrollRef }}>{children}</PageScrollContext.Provider>;
}

export function usePageScroll() {
  return useContext(PageScrollContext);
}
