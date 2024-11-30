import useField from '../../hooks/field';

const AppInput = ({
    type = 'text',
    className = '',
    form = {},
    name = '',
    value = '',
    onChange = () => { },
    validation = {},
    ...props
}) => {
    const { setValue, fieldValue } = useField(form, { name, type, validation });

    const onValueChange = ({ target: { value = '', valueAsNumber = 0 } }) => {
        let inputValue = type === 'number' ? valueAsNumber : value;
        setValue(name, inputValue);
        onChange(value);
    };

    return (
        <input type={type} className={className} name={name} value={fieldValue} onChange={onValueChange} {...props} />
    );
};

export default AppInput;