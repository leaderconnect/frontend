import { useRef, useState } from "react";
import { getValidator, getSchema } from "../utils/validator";

const validator = getValidator();

function useForm(defaultFormValue = {}) {
    const [formValue, setFormValue] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [typeAndValidation, setTypeAndValidation] = useState({});
    const [_defaults, setDefaults] = useState(defaultFormValue);

    const schema = useRef({});
    const checkRef = useRef({});
    const fields = useRef([]);

    const isFormValid = () => {
        const errors = Object.values(formErrors);
        return errors.filter((error) => error.length > 0).length <= 0;
    };

    const setErrorsAndValues = (name, value) => {
        const newValues = { ...formValue, [name]: value };
        const valid = checkRef.current(newValues);

        setFormValue(prevValues => ({ ...prevValues, [name]: value }));

        const errors = (valid === true ? [] : valid).reduce((a, c) => {
            const { field } = c;
            a[field] ? a[field].push(c) : (a[field] = [c]);
            return a;
        }, {});

        setFormErrors(fields.current.reduce((a, c) => {
            a[c] = errors[c] || [];
            return a;
        }, {}));
    };

    return {
        formValue,
        setValue(name, value) {
            setTouched(prevTouched => ({ ...prevTouched, [name]: true }));
            setErrorsAndValues(name, value);
        },

        value: formValue,
        errors: formErrors,
        getDefaults: () => _defaults,
        touched,

        valid: isFormValid(),

        setFormValues(value) {
            setFormValue(value);
        },

        reset(newDefaults = {}) {
            console.log(newDefaults);
            setFormValue({});
            setFormErrors({});
            setTouched({});
            setDefaults(newDefaults);

            for (const name in newDefaults) {
                const _typeAndValidation = typeAndValidation[name] || {};
                this.setDefault(name, _typeAndValidation.fieldType || 'string', _typeAndValidation.validation || {}, true);
            }
        },

        setDefault(name, fieldType, validation = {}, skipSettingTypeAndValidation = false) {
            schema.current[name] = getSchema({ fieldType, validation });
            checkRef.current = validator.compile(schema.current);

            if (!skipSettingTypeAndValidation) {
                setTypeAndValidation(prevTouched => ({ ...prevTouched, [name]: { fieldType, validation } }));
            }

            if (fields.current.indexOf(name) < 0) {
                fields.current.push(name);
            }

            let value;
            const _defaultValue = _defaults[name];

            switch (fieldType) {
                case 'array':
                    value = (_defaultValue || []).map(({ value }) => value);
                    break;

                case 'boolean':
                    value = !!_defaultValue || false;
                    break;

                default:
                    value = _defaultValue || '';
                    break;
            }

            setErrorsAndValues(name, value);
        }
    };
}

export default useForm;