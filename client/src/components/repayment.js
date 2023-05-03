import React, {useState, useEffect} from 'react';
import { Stack, Button, Form, Modal, Table } from 'react-bootstrap'

import axios from 'axios';

function Repayment() {
    const [bank, setBank] = useState('')
    const [balance, setBalance] = useState('')
    const [payment, setPayment] = useState('')
    const [interest, setInterest] = useState('0.02')
    const [mad, setMad] = useState('0.03')

    const [result, setResult] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const [apiData, setApiData] = useState([])

    //handle Error modal
    const [showError, setShowError] = useState(false);
    const handleErrorClose = () => setShowError(false);
    const handleErrorShow = () => setShowError(true);
    
    //handle Computation modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //render payments table
    const renderData = (data, index) => {
        return (
            <tr key={data.month}>
                <td>{data.month}</td>
                <td>
                    <div className="d-grid gap-2">
                        <small>Outstanding Balance : { data.outstandingBalance }</small> 
                        <small>Minimum Amount Due (MAD) : { data.minimumAmountDue }</small> 
                        <small>Payment : { data.payment }</small> 
                        <small>Interest : { data.interest }</small> 
                        <small>New Balance : { data.newBalance }</small> 
                    </div>
                </td>
            </tr>
        )
    }

    const submitData = (balance, interest, mad, payment) => {
        if(bank != '' && balance != '' && interest != '' && mad != '' && payment != ''){
            axios.post('/api/credit/card/repayment', [{ "bank": bank, "payment": payment, "balance": balance, "rate": interest, "mad": mad }] )
                .then((res) => {
                    if(res.data.creditCards[0].hasOwnProperty('error')){
                        setErrorMessage(res.data.creditCards[0].error.message)
                        handleErrorShow()
                    } else {
                        setResult(res.data)
                        setApiData(res.data.creditCards[0].payments)
                        handleShow()
                    }
                })
        }
    }

    const handleResult = (type, property) => {
        if(Object.keys(result).length){
            if(type == "details"){
                return result.creditCards[0][property]
            }

            if(type == "summary"){
                return result.creditCards[0]["summary"][0][property]
            }
        }
    }

    return (
        <Stack gap={2} className="col-md-6 mx-auto">
            <p style={{"fontSize":"30px"}}>Credit Card Repayment Calculator</p>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Bank Name" onChange={data => { 
                        setBank(data.target.value) 
                        // submitData(balance, interest, payment, res => {
                        //     setApiData(res)
                        // })
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Outstanding Balance</Form.Label>
                    <Form.Control type="number" placeholder="Enter Outstanding balance" onChange={data => { 
                        setBalance(data.target.value) 
                        // submitData(balance, interest, payment, res => {
                        //     setApiData(res)
                        // })
                    }} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Interest Rate (Monthly)</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => { 
                        setInterest(data.target.value) 
                        // submitData(balance, interest, payment, res => {
                        //     setApiData(res)
                        // })
                    }}>
                        <option value="0.02">2%</option>
                        <option value="0.03">3%</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Minimum Amount Due Rate (MAD)</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={data => { 
                        setMad(data.target.value) 
                        // submitData(balance, interest, payment, res => {
                        //     setApiData(res)
                        // })
                    }}>
                        <option value="0.03">3%</option>
                        <option value="0.04">4%</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Monthly Payment</Form.Label>
                    <Form.Control type="number" placeholder="Enter Monthly Payment"  onChange={data => { 
                        setPayment(data.target.value) 
                        // submitData(balance, interest, payment, res => {
                        //     setApiData(res)
                        // }) 
                    }}/>
                </Form.Group>
                <Stack gap={2} className="col-md-5 mx-auto">
                    <Button variant="success" onClick={()=>{submitData(balance, interest, mad, payment)}}> Calculate </Button>
                </Stack>
            </Form>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Computation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Credit Card Details</strong></p>
                    <span>
                        Bank Name : { handleResult("details", "bank") }
                    </span>
                    <br></br>
                    <span>
                        Outstanding Balance : { handleResult("details", "balance") } 
                    </span>
                    <br></br>
                    <span>
                        Interest Rate : { handleResult("details", "interest") } %
                    </span>
                    <br></br>
                    <span>
                        Minimum Amount Due Rate : { handleResult("details", "MAD") } %
                    </span>
                    <br></br>
                    <span>
                        Monthly Payment : { handleResult("details", "monthlyPayment") }
                    </span>
                    <br></br>
                    <br></br>
                    <p><strong>Payment Summary</strong></p>
                    <span>
                        Months to pay : { handleResult("summary", "months") } Months
                    </span>
                    <br></br>
                    <span>
                        Total Payment : { handleResult("summary", "paymentTotal") }
                    </span>
                    <br></br>
                    <span>
                        Total Interest : { handleResult("summary", "interestTotal") }
                    </span>
                    <br></br>
                    <br></br>
                    <p><strong>Payments Table</strong></p>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiData.map(renderData)}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showError} onHide={handleErrorClose}>
                <Modal.Header closeButton>
                <Modal.Title>Oh no!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleErrorClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </Stack>
    );
}

export default Repayment;
