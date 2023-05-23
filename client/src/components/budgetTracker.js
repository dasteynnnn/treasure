import React, {useState, useEffect} from "react";
import { Stack, Button } from 'react-bootstrap'

import axios from 'axios';

function BudgetTracker() {
    const [limit, setLimit] = useState('')
    const [expenses, setExpenses] = useState('')
    const [overSpend, setOverSpend] = useState('')
    const [overSpendAmount, setOverSpendAmount] = useState('')

    useEffect(() => {
        axios.get('/api/budget/expense/tracker/summary')
        .then((res) => {
            const data = res.data;
            setLimit(data.limit)
            setExpenses(data.expenses)
            setOverSpend(data.overSpend)
            setOverSpendAmount(data.overSpendAmount)
        })
    }, [])
    return(
        <Stack gap={2} className="col-md-6 mx-auto">
            <p style={{"fontSize":"30px"}}>Budget Tracker</p>
            <span>
                Current Limit : { limit }
            </span>
            <Button variant="primary"> Update Limit </Button>
            <span>
                Current Expenses : { expenses }
            </span>
            <Button variant="primary"> Add New Expense </Button>
            <Button variant="danger"> Remove Expense </Button>
            <span>
                Over Spending : { overSpend ? "Yes" : "No" }
            </span>
            <span>
                Over Spending Amount : { overSpendAmount }
            </span>
        </Stack>
    )
}

export default BudgetTracker;