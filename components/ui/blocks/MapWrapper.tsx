'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
const MapComponent = dynamic(
  () => import('./map'),
  {
    ssr: false,
    loading: () => <div className="h-[calc(100vh-65px)] flex items-center justify-center">Loading map...</div>
  }
);

export default function MapWrapper() {
  return <MapComponent />;
}