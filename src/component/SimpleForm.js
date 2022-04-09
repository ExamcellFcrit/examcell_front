import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
    background: '#f5f8fb',
    headerBgColor: '#009434',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#009434',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

class SimpleForm extends Component {
    render() {
      return (
        <ThemeProvider theme={theme}>
        
    
        <ChatBot
       
          steps={[
            {
              id: '1',
              message: 'What is your name?',
              trigger: 'name',
            },
            {
              id: 'name',
              user: true,
              trigger: '3',
            },
            {
              id: '3',
              message: 'Hi {previousValue}! Please select your options from the below Query',
              trigger: 'question',
            },
            {
              id: 'question',
              options: [
                { value: 'Exam Form Query', label: 'Exam Form Query', trigger: '4' },
                { value: 'Profile Query', label: 'Profile Query', trigger: '5' },
                {value: 'Form Verification Query', label:'Form Verification Query', trigger: '6'},
                //{value: 'Just Hanging Out', label:'Just Hanging Out!!', trigger: '12'},
              ],
            },
            {
              id: '4',
              options: [
                { value: 'Session', label: 'Session Query', trigger: '7' },
                { value: 'Scheme', label: 'Scheme Query', trigger: '8' },
              ],
            },
            {
              id: '7',
              message :' "SH" is the exams conducted in the period of December and January. "FH" stands for exams conducted in the period of May and June',
              trigger: 'end-message',
            },
            {
              id: '8',
              message :'The Latest scheme that students have to opt for is 2019 C-Scheme',
              trigger: 'end-message',
            },
            {
              id: '5',
              options: [
                { value: 'full name', label:'Full Name', trigger: '9' },
                { value: 'profile picture', label: 'Profile Picture', trigger: '10' },
                { value: 'reset password', label: 'Reset Password', trigger: '11' },
              ],
            },
            {
              id: '9',
              message :"Please enter your name in the format of Lastname Firstname Father's name Mother's name ",
              trigger: 'end-message'

            },
            {
              id: '10',
              message :'Please enter the profile picture as the same on your Id card',
              trigger: 'end-message'
            },
            {
              id: '11',
              message :'Please click on the Forgot password link on the login page',
              trigger: 'end-message'
            },

            {
              id: '6',
              message :'Please check your mail id which was provided on the portal or contact the examcell immediately',
              trigger: 'end-message'
            },
            
            
            {
              id: 'end-message',
              message: 'Please let me know if you need anything else. Have a great day !!',
              trigger: 'question',
              //end: true,
            },
          ]}
        />
          </ThemeProvider>
    );
      
    }
  }
  
  export default SimpleForm;