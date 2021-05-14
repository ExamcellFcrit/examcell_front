import React, { Component } from 'react'
import rutvik from '../assets/rutvik.jpg'
import romik from '../assets/romik.jpeg'
import srividya from '../assets/srividya.JPG'
import github from '../assets/icons/github.svg'
import linkedin from '../assets/icons/linkedin.svg'
import instagram from '../assets/icons/instagram.svg'
import Tilt from 'react-tilt'

export class developer extends Component {
    render() {
        return (
            <div>
                <div className="hero">
                    <div className="section">

                        <div className="title has-text-white is-size-1 ">Developers</div>
                        <div className="columns">
                       
                            <div className="column is-4">
                            <Tilt className="Tilt" options={{ max: 5,scale:1 }} >
                                <div className="card">
                                    <header class="card-header">
                                        <p class="card-header-title">
                                            <div className="title">Rutvik Kokate</div>
                                        </p>
                                    </header>
                                    <div className="card-content">
                                        <div class="card-image">
                                            <figure className="image is-150x150">
                                                <img className="is-rounded" style={{ width: "150px", height: '150px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={rutvik} alt="" />
                                            </figure>
                                        </div>
                                        <div class="media-content">
                                            <p class="title is-5">Computer Engineering (2017-2021)</p>
                                            
                                        </div>
                                    </div>
                                   
                                </div>
                                </Tilt>
                            </div>
                           
                            <div className="column is-4">
                            <Tilt className="Tilt" options={{ max: 5,scale:1}} >
                                <div className="card">
                                    <header class="card-header">
                                        <p class="card-header-title">
                                            <div className="title">Romik Amipara</div>
                                        </p>
                                    </header>
                                    <div className="card-content">
                                        <div class="card-image">
                                            <figure className="image is-150x150">
                                                <img className="is-rounded" style={{ width: "150px", height: '150px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={romik} alt="" />
                                            </figure>
                                        </div>
                                        <div class="media-content">
                                            <p class="title is-5">Computer Engineering (2017-2021)</p>
                                            
                                        </div>
                                    </div>
                                   
                                </div>
                                </Tilt>
                            </div>

                            <div className="column is-4">
                            <Tilt className="Tilt" options={{ max: 5,scale:1}} >
                                <div className="card">
                                    <header class="card-header">
                                        <p class="card-header-title">
                                            <div className="title">Srividya Inampudi</div>
                                        </p>
                                    </header>
                                    <div className="card-content">
                                        <div class="card-image">
                                            <figure className="image is-150x150">
                                                <img className="is-rounded" style={{ width: "150px", height: '150px', display: 'block', margin: 'auto', marginBottom: '10px' }} src={srividya} alt="" />
                                            </figure>
                                        </div>
                                        <div class="media-content">
                                            <p class="title is-5">Computer Engineering (2017-2021)</p>
                                            
                                        </div>
                                    </div>
                                   
                                </div>
                                </Tilt>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default (developer)
