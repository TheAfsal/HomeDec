import React from 'react';

const TextInput = ({ type,label, placeholder, register, error }) => {
    return (
        <div className="my-2">
            <label className="text-green_900">{label}</label>
            <input
                type={type}
                className="peer h-full w-full rounded-[7px] mt-1 border border-blue-gray-200 bg-inputField px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-green_500"
                placeholder={placeholder}
                {...register}
            />
            {error && <p className="text-errorRed text-xs mt-1">{error.message}</p>}
        </div>
    );
};

export default TextInput;
