import React, { useState } from 'react'
import { useHistory} from 'react-router-dom'
import Input from './untilities/Input'
import Button from './untilities/Button'
import axios from 'axios'

export default function Login() {

    const history = useHistory();
    
    const [signUp , setSignUp] = useState(false)
    const [newPassport, setNewPassport] = useState('')
    const [newName, setNewName] = useState('')
    const [newPassword , setNewPassword] = useState('') 
    const [confirmapssword , setConfirmPassword] = useState('')
    const [messageSign, setMessage] = useState('')
    const [passport, setPassport] =useState('')
    const [password, setPassword] =useState('')
    const [messageLogin , setMessageL] = useState('')

    const attempLogin = async () => {  
        try {
            const attemp = await axios({
                method: 'post',
                url: 'https://bank-gilad.herokuapp.com/api/login',
                data: {
                    passport : passport,
                    password : password
                }
            })

            if(attemp.status === 200) {
                console.log(attemp)
                localStorage.setItem('token' , attemp.data.token)
                setMessageL(attemp.data.success)
                setTimeout(() => {
                    history.push(`/account/${passport}`)
                }, 1000);
        } 
    }
         catch (err) {
             console.log(err)
             setMessageL('Invalid Input please try again')
             return err 
        }
    } 
    
    const createNewAccount = async () => {
        if(newPassword === confirmapssword) {
            try {
                const newAccount = await axios({
                    method : 'post',
                    url : `https://bank-gilad.herokuapp.com/api/${newPassport}/${newName}`,
                    data : {
                        password : newPassword
                    }
                })
                const kind = Object.keys(newAccount.data)
                const text = Object.values(newAccount.data)
                setMessage(`${kind[0].toUpperCase()}!, ${text[0]}`)
                if( newAccount.status === 200 ) {
                    setTimeout(() => {
                        localStorage.setItem('token' , newAccount.data.token)
                        history.push(`/account/${newPassport}`)
                    }, 2500);  
            }
        }
             catch(err) {
                setMessage('Invalid Attemp')
                 return err
            }
        }
          else {
            setMessage('Passwords dont match')
          }
    }
   

    return (
        <div className="landingPage">
            <div className="loginSigninPage">
            {signUp ?  
            <React.Fragment>
                <div className="newUserSection">
            <p>Type passport and password to login</p>
            <Input type="text" name="PASSPORT" onChange={(e)=> setPassport(e.target.value)}/>
            <Input type="text" name="PASSWORD" onChange={(e)=> setPassword(e.target.value)}/>
            <Button name="LOGIN" onClick={attempLogin}/>
            <p>{messageLogin}</p>
            </div>
            </React.Fragment>

            :
                <React.Fragment>   
                    <div className="newUserSection">
                    <Button name="Alreay have an account" onClick={()=>setSignUp(true)}/>
                    <br></br>
                    <h3>Create New Account:</h3>
                    <Input name="Passport:" type="text" onChange={(e) => setNewPassport(e.target.value)} />
                    <Input name="Name:" type="text" onChange={(e) => setNewName(e.target.value)} />
                    <Input name="Password:" type="password" onChange={(e) => setNewPassword(e.target.value)} />
                    <Input name="Confirm Password:" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button name="Add New Account" onClick={createNewAccount} />
                </div>
                <p className="message">{messageSign}</p>
                </React.Fragment>}
                </div>
        </div>
    )
}
