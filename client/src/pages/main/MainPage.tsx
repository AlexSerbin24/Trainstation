import React from 'react'
import "./MainPage.css";
import FindFlightsContainer from './components/FoundTrainContainer/FindFlightsContainer.tsx';
import TravelFeatures from './components/TravelFeatures/TravelFeatures.tsx';

export default function MainPage() {
  return (
    <>
      <FindFlightsContainer />
      <TravelFeatures/>
    </>
  )
}
