import React from 'react';
import { useForm, useStep } from 'react-hooks-helper';

import PersonalDetails from './stepforms/personalDetails';
import Credentials from './stepforms/credentials';
import Summary from './stepforms/summary';

import Web3 from 'web3';

require('dotenv').config();

/* 
---------------------------------------Register Component---------------------------------------------------------
Used to create form data and set navigation routes for registration pages.
Registration pages: personal details, credentials and summary.
Also creates web3 account for voters.
----------------------------------------------------------------------------------------------------------------
*/
let web3 = new Web3(process.env.REACT_APP_URL_INFURA);

var acc = web3.eth.accounts.create();

const defaultData = {
    firstname: "",
    lastname: "",
    middlename: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    college: "",
    department: "",
    prNumber: "",
    rollNumber: "",
    year: "",
    password: "",
    walletAddress: acc.address,
    privateKey: acc.privateKey,
    isAdmin: false
};

const steps = [
    { id: "personaldetails" },
    { id: "credentials" },
    { id: "summary" },
    { id: "submit" }
]

function Register() {

    const [formData, setForm] = useForm(defaultData);
    const { step, navigation } = useStep({
        steps,
        initialStep: 0,
    })

    const props = { formData, setForm, navigation }

    // eslint-disable-next-line default-case
    switch (step.id) {
        case "personaldetails":
            return <PersonalDetails {...props} />;
        case "credentials":
            return <Credentials {...props} />;
        case "summary":
            return <Summary {...props} />;
    }
}

export default Register;