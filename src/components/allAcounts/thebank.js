import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Table from '../untilities/Table'
import Input from '../untilities/Input'
import './theBank.css'

export default function Thebank() {

    const [data, setData] = useState([])
    const [search , setSearch] = useState('')
    const [filter , setFilter] = useState(null)

    useEffect(() => {
        const search = async () => {
            const token = localStorage.getItem('token')
            const getData = await axios({
                method : 'get',
                url : `https://bank-gilad.herokuapp.com/api/`,
                headers : {
                    'Authorization':`Bearer ${token}`
                }
            })
            setData(getData.data)
        }
        search();
    }, [data])

    return (
        <div>
            <div className="upperPage" style={{height:'15%'}}>
                <h1 style={{ textAlign: 'center' }}>Welcome, Mr. Manager</h1>
            </div>
            <div className="searchBAr">
            <Input type="text" name="Search By Name or Passport :" onChange={(e)=> setSearch(e.target.value)}/>
            </div>
            <div className="filterBar">
            <Input type="number" name="Filter By Amount :" onChange={(e)=> setFilter(e.target.value)}/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Passport</th>
                        <th>Name</th>
                        <th>Credit Line</th>
                        <th>Balance</th>
                        <th>More</th>
                    </tr>
                </thead>
                <Table data={data.filter(account => {
                    return account.name.toLowerCase().includes(search.toLowerCase()) ||
                            account.passport.toLowerCase().includes(search.toLowerCase())
                }).filter(user => {
                    if(filter) {
                        return user.balance >= filter
                    }
                    else {
                        return user.isActive === true
                    }
                })} />
            </table>
            {data.length === 0 &&
                <h2 style={{ textAlign: 'center' }}>There are no Accounts Avalable to show</h2>}
        </div>
    )
}
