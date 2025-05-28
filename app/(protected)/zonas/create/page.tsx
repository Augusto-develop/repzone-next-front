"use client";
// React

import 'react-toastify/dist/ReactToastify.css';

import FormZona from "../components/zona-form-create";

const CreateZona = ({ }) => {

    return (
        <>
            <h4 className="flex-none font-medium lg:text-2xl text-xl capitalize text-default-900">
                Cadastra Zona de Atuação
            </h4>
            <div className="md:max-w-[520px] w-[90%]">
                <FormZona />
            </div>
        </>
    );
};

export default CreateZona;
