import React from 'react'
import FindTrainsForm from './components/FindTrainsForm.tsx'


export default function FindFlightsContainer() {

    return (
        <div className='find-trains-container'>
            <div className='find-trains-content'>
                <FindTrainsForm/>
                <div className='travel-info-container'>
                    <span className='explore-span'>Досліджуйте Україну з вітерцем у поїздах та автобусах.</span>
                    <span className='fast-comfortable-span'>Швидко, комфортно і без затримок.</span>
                </div>
            </div>
        </div>
    )
}
