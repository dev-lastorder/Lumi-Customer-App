import { Href } from "expo-router";

export interface AccountStackProps {
  title: string;
  content?: string;
  route: Href;
  isExternal: boolean;
}
