"use client";
// React

import 'react-toastify/dist/ReactToastify.css';

import FormRepresentante from "../components/representante-form-create";

const CreateRepresentante = ({ }) => {

    return (
        <>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Cadastra Representante
            </h4>
            <div className="md:max-w-[520px] w-[90%]">
                <FormRepresentante />
            </div>
        </>
    );
};

export default CreateRepresentante;
