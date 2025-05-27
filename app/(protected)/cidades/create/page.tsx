"use client";
// React

import 'react-toastify/dist/ReactToastify.css';

import FormCidade from "../components/cidade-form-create";

const CreateCidade = ({ }) => {

    return (
        <>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Cadastra Cidade
            </h4>
            <div className="md:max-w-[450px] w-[90%]">
                <FormCidade />
            </div>
        </>
    );
};

export default CreateCidade;
