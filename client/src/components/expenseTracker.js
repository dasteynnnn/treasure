import React, {useState, useEffect} from "react";
import { Stack, Button, Modal, Form } from 'react-bootstrap'

import axios from 'axios';

function BudgetTracker() {
    //summary variables
    const [limit, setLimit] = useState('')
    const [expenses, setExpenses] = useState('')
    const [overSpend, setOverSpend] = useState('')
    const [overSpendAmount, setOverSpendAmount] = useState('')

    //form variables
    const [formLimit, setFormLimit] = useState('')

    //handle limit modal
    const [showLimit, setShowLimit] = useState(false);
    const handleCloseLimit = () => setShowLimit(false);
    const handleShowLimit = () => setShowLimit(true);

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
            <Stack direction="horizontal" gap={2}>
                <div>
                    <span>
                        Expense Limit : { limit }
                    </span>
                </div>
                <div>
                    <Button variant="primary" size="sm" onClick={()=>{handleShowLimit()}}> Update Limit </Button>
                </div>
            </Stack>
            <Stack direction="horizontal" gap={2}>
                <div>
                    <span>
                        Current Expenses : { expenses }
                    </span>
                </div>
                <div>
                    <Button variant="primary" size="sm"> Add Expense </Button>{' '}
                    <Button variant="danger" size="sm"> Remove Expense </Button>
                </div>
            </Stack>
            <span>
                Over Spending : { overSpend ? "Yes" : "No" }
            </span>
            <span>
                Over Spending Amount : { overSpendAmount }
            </span>
            <Modal show={showLimit} onHide={handleCloseLimit}>
                <Modal.Header closeButton>
                <Modal.Title>Update Expense Limit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>New Expense Limit</Form.Label>
                            <Form.Control type="number" placeholder="Enter New Expense Limit" onChange={data => { 
                                setFormLimit(data.target.value) 
                                // submitData(balance, interest, payment, res => {
                                //     setApiData(res)
                                // })
                            }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleCloseLimit}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </Stack>
    )
}

export default BudgetTracker;