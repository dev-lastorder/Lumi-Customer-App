// app/index.tsx
import { Redirect } from 'expo-router';

export default function RootPage() {
  console.log("app index page - redirecting to welcome");
  
  // Redirect to welcome screen first 
  return <Redirect href="/(ai-chat)/chatScreen" />;
}