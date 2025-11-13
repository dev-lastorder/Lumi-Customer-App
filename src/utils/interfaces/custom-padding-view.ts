import { ReactNode } from "react";

export interface CustomPaddingViewProps {
  children: ReactNode;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}
