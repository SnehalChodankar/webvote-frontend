import React from 'react';
import {Form, Button} from 'react-bootstrap';

function RegBtn(){
    return(
        <Form inline className="offset-3">
            <Button href="/register" variant="outline-success"><span className="fa fa-user-plus"></span> Register</Button>
        </Form>
    );
}

export default RegBtn;