"use client";
// React
import React from "react";

import 'react-toastify/dist/ReactToastify.css';

import FormCliente from "../components/cliente-form-create";

const CreateCliente = ({ }) => {

    return (
        <>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Cadastra Cliente
            </h4>
            <FormCliente></FormCliente>
        </>
    );
};

export default CreateCliente;
