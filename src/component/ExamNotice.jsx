import React, { Component } from 'react'

export class ExamNotice extends Component {
    render() {
        return (
            <div style={{ marginTop: '20px' }}>
                <div className="has-text-centered" style={{fontSize:'2.4em'}}>INSTRUCTIONS FOR CANDIDATES</div>
                <ul>
                    <li>1. Candidate must preserve and produce this hall ticket along with the college identity card, during examination, without which entry to the exam hall will be restricted</li><br />
                    <li>2. Candidate should be present in the exam hall 15 minutes before the commencement of examination</li><br />
                    <li>3. Cell phones, watch calculators, alarm clocks, digital watches with built in calculators/memory or any electronic or smart devices with memory are not allowed in the examination hall</li><br />
                    <li>4. Your Admit Card will be verified during the examination. Please ensure that this is duly signed by you and the supervisor/invigilator</li><br />
                    <li>5. No students will be allowed to enter examination hall 30 minutes after the start of examination</li><br />
                    <li>6. No student will be allowed to go out of the exam hall in the first 30 minutes and last 10 minutes of examination.</li><br />
                    <li>7. Without stamping the college seal, the hallticket is not valid</li><br />
                    <li>8. Fine will be collected incase of loss of hallticket and a duplicate hallticket will be issued</li><br />

                    <span style={{display:'flex',justifyContent:'center'}}>
                        <div className="subtitle" style={{margin:'0px 5px'}}>&#128522; NO COPY, BE HAPPY &#128522;</div>
                    </span>

                </ul>
            </div>
        )
    }
}

export default ExamNotice
