import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import Button from '../untilities/Button'
import Input from '../untilities/Input'
import Table from './TransacionTAble'
import './singleAccount.css'

export default function Account() {
    const {passport} = useParams()
    const [account, setAccount] = useState({})
    const [transaction , setTransactions] = useState([])
    const [action , setAction] = useState('')
    const [amount , setAmount] = useState('')
    const [message , setMessage] = useState('')
    const [trasfer , setTransfer] = useState(false)
    const [reciver , setReciver] = useState('')
    const [filter , setFilter] = useState('all')

    
    useEffect(() => {
        const search = async () => {
            const getData = await axios.get(`https://bank-gilad.herokuapp.com/api/accounts/${passport}`);
            setAccount(getData.data)
            const getTrans = await axios.get(`https://bank-gilad.herokuapp.com/api/accounts/${passport}/transactions`)
            setTransactions(getTrans.data) 
    }
    search()
    },[transaction,passport])


    const applyAction = async () => {
        const confirm = await axios({
            method: 'put',
            url: `https://bank-gilad.herokuapp.com/api/accounts/${passport}/${action}`,
            data: {
                amount : amount
            }
        })
        const kind = Object.keys(confirm.data)
        const text = Object.values(confirm.data)
        setMessage(`${kind[0].toUpperCase()}! ${text[0]}`) 
        setTimeout(() => {
            setMessage('')
        }, 3500);       
    }

    const applyTransfer = async () => {
        const confirm = await axios({
            method: 'put',
            url: `https://bank-gilad.herokuapp.com/api/accounts/${passport}/transfer`,
            data: {
                toAccount : reciver,
                amount : amount
            }
        })
        const kind = Object.keys(confirm.data)
        const text = Object.values(confirm.data)
        setMessage(`${kind[0].toUpperCase()}!, ${text[0]}`)
        setTimeout(() => {
            setMessage('')
        }, 3500); 
    
    }

    return (
        <div>
            <div className="upperPageSingle">
                <div className="accountInfo">
            <Link to={'/'}>Back</Link>
           <h2>Name: {account.name}</h2>
           <h2>Account: {account.passport}</h2>
           <h5>Line Of Credit: {account.credit}</h5>
           <h1>Balance: <span style={account.balance>=0?{color:'green'}:{color:'red'}}>{Number.parseFloat(account.balance).toFixed(2)}</span> ILS</h1>
           </div>
           <div className="accountActions">
           <div className="actionSection">
           <Input type="radio" group="Actions" name="Deposit" value="deposit" onChange={(e) => setAction(e.target.value)} />
           <Input type="radio" group="Actions" name="Withdraw" value="debit" onChange={(e) => setAction(e.target.value)} />
           <Input type="radio" group="Actions" name="Update Credit" value="credit" onChange={(e) => setAction(e.target.value)} />
           <Input type="number" name="Amount:" onChange={(e) => setAmount(e.target.value)}/>
           <Button name="Apply" onClick={applyAction}/>
           </div>
           <div className="trasnferAction">
               <Input type="checkbox" name="Trasfer Between Account" onChange={(e)=> setTransfer(!trasfer)}></Input>
               {trasfer && <div className="transferPop">
                   <Input type="text" name="To Account: " onChange={(e)=> setReciver(e.target.value)}/>
                   <Input type="Number" name="Amount: "onChange={(e) => setAmount(e.target.value)}/>
                   <Button name="Apply" onClick={applyTransfer}/>
                   </div>}
           </div>
           <p className="messageOut">{message}</p>
           </div>
           </div>
           <div className="filterSection">
           <Input type="radio" group="filter" name="ALL" value="all" onChange={(e) => setFilter(e.target.value)} />
           <Input type="radio" group="filter" name="DEBIT" value="Debit" onChange={(e) => setFilter(e.target.value)} />
           <Input type="radio" group="filter" name="CREDIT" value="Credit" onChange={(e) => setFilter(e.target.value)} />
           </div>
           <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Comments</th>
                    </tr>
                </thead>
            <Table data={transaction.filter(item => {
                if(filter==='all') {
                    return item.action !== filter
                } else {
                    return item.action === filter
                }
              
            })}/>
            </table>
            {transaction.length ===0 && <h3 style={{textAlign:'center'}}>No Trasactions yet for this account</h3>}
        </div>
    )
}
