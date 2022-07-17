import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React, {useState} from 'react'
import './imageSlider.css'


const ImageSlider = ({slides}) => {
    
    const [current, setCurrent] = useState(0);
    const length = slides.length;

    const nextSlide = () => {
        setCurrent(current === length -1 ? 0 : current+1)
    }

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current-1)
    }

    if(!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }
  
    return (
    <div className='slider'>
        {slides.map((slide, index) => {
            return (
                <div className={index === current ? 'slide active' : 'slide'} key={index}>
                    {index === current && 
                        (<img src={slide.image} className="image"/>)}
                    ;
                </div>
            )  
        })}
        <FontAwesomeIcon icon={faArrowLeft} className="arrow" id="left" onClick={prevSlide}/>
        <FontAwesomeIcon icon={faArrowRight} className="arrow" id="right" onClick={nextSlide}/>
    </div>
  )
}

export default ImageSlider