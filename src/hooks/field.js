import { useEffect, useState } from "react";

function useField(form, deps) {
    const { name = '', type = 'text', validation = {}, defaultValue } = deps;
    const { setValue: setFormValue = () => {}, getDefaults = () => ({}), value = {} } = form || {};
    
    const validationString = JSON.stringify(validation);

    const defaults = getDefaults();
    // const _defaultValue = defaults[name] || defaultValue || '';

    // const [fieldValue, setFieldValue] = useState(_defaultValue);

    const setValue = (name, value) => {
        setFormValue(name, value);
        // setFieldValue(value);
    };

    useEffect(() => {
        if (typeof form.setDefault === 'function') {
            form.setDefault(name, type, validation);
        }
    }, [name, type, validationString]);

    return {
        defaultValue,
        fieldValue: value[name],
        setValue
    };
}

export default useField;
