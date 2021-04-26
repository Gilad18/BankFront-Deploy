import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Bank from '../allAcounts/thebank'
import Login from '../login'
import Account from '../singleAccount/account'

export default function Router() {
    return (
        <div>
            <BrowserRouter>
            <div>
                <Route path="/" exact component={Login}/>
                <Route path="/accounts" exact component={Bank}/>
                <Route path="/account/:passport" component={Account}/>
            </div>
            </BrowserRouter>
        </div>
    )
}
