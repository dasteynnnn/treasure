exports.formatCurreny = val => {
    return (val).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
    })
}

exports.cardRepayment = async (body) => {

    let total = { balance : 0, payment : 0, interest : 0, monthlyPayment : 0 }
    let cards = [];

    for(let _body of body){
        let bank = _body.bank;
        let balance = parseFloat(_body.balance);
        let rate = parseFloat(_body.rate);
        let mad = parseFloat(_body.mad);
        let payment = parseFloat(_body.payment)
        
        let interest = balance * rate
        if(payment <= interest){
            cards.push({ bank : bank, error : { message : `The payment amount you entered is not large enough to cover the ${this.formatCurreny(interest)} in interest charges for the current period. Please increase the payment to more than ${this.formatCurreny(interest)} and recalculate.`}})
        } else {
            let card = {
                "bank" : bank,
                "balance" : this.formatCurreny(balance),
                "interest" : rate,
                "MAD" : mad,
                "monthlyPayment" : this.formatCurreny(payment),
                "summary" : [],
                "payments" : []
            }
    
            let result = await this.getResult(payment, rate, mad, balance, 0, 0, 0, [])
            if(result){
                let months = result.months;
                let paymentTotal = result.paymentTotal;
                let interestTotal = result.interestTotal;

                total.balance += balance;
                total.payment += paymentTotal;
                total.interest += interestTotal;
                total.monthlyPayment += payment;
                
                card.summary.push({"months" : months, "paymentTotal" : this.formatCurreny(paymentTotal), "interestTotal": this.formatCurreny(interestTotal)})
                result.transactions.forEach(tran => {
                    card.payments.push(tran)
                })
            }
            cards.push(card)
        }
    }
    let response = {
        "totalBalance" : this.formatCurreny(total.balance),
        "totalMonthlyPayment" : this.formatCurreny(total.monthlyPayment),
        "totalPaymentSettled" : this.formatCurreny(total.payment),
        "totalInterestSettled" : this.formatCurreny(total.interest),
        "creditCards" : cards
    }
    return response;
}

exports.getResult = (payment, rate, mad, balance, paymentTotal, interestTotal, months, transactions) => {
    let interest, chargedBalance, minimumAmountDue, newBalance;

    if(balance === 0){
        return { paymentTotal, interestTotal, months, transactions }
    }

    if(balance < payment){
        transactions.push({"month" : months + 1, "outstandingBalance" : this.formatCurreny(balance), "minimumAmountDue" : this.formatCurreny(balance), "payment" : this.formatCurreny(balance), "interest" : this.formatCurreny(0), newBalance : this.formatCurreny(0)});

        return this.getResult(payment, rate, mad, 0, paymentTotal + balance, interestTotal, months + 1, transactions)
    }

    interest = balance * rate;
    chargedBalance = interest + balance;
    minimumAmountDue = balance * mad;
    newBalance = chargedBalance - payment;

    transactions.push({"month" : months + 1, "outstandingBalance" : this.formatCurreny(balance), "minimumAmountDue" : this.formatCurreny(minimumAmountDue), "payment" : this.formatCurreny(payment), "interest" : this.formatCurreny(interest), newBalance : this.formatCurreny(newBalance)});

    return this.getResult(payment, rate, mad, newBalance, paymentTotal + payment, interestTotal + interest, months + 1, transactions)
}