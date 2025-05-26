"use client";
// React

import 'react-toastify/dist/ReactToastify.css';

import FormCliente from "../components/cliente-form-create";

const CreateCliente = ({ }) => {

    return (
        <>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Cadastra Cliente
            </h4>
            <div className="md:max-w-[520px] w-[90%]">
                <FormCliente />
            </div>
        </>
    );
};

export default CreateCliente;
