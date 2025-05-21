import { Slot } from 'expo-router';
import { MarkerProvider } from '../context/MarkerContext';

export default function Layout() {
  return (
    <MarkerProvider>
      <Slot />
    </MarkerProvider>
  );
}