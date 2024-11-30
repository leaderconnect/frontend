import useField from '../../hooks/field';

const AppSelect = ({ value, label = '', options = [], name = '', onChange = (value) => { }, validation = {}, form = {}, placeholder = '', showNone = false, multiple = false, ...props } = { name: '' }) => {
    const { setValue, fieldValue } = useField(form, { name, type: "string", validation, defaultValue: multiple ? [] : '' });

    const handleChange = ({ target }) => {
        const value = target.value || '';

        setValue(name, value);
        onChange(value);
    };

    return (
        <div className="form-group">
            <label for="type">{label}</label>
            <select className='custom-select'
                value={value || fieldValue}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                placeholder={placeholder || ''}
                multiple={multiple}
                {...props}
            >
                {(fieldValue === '' && showNone === true) && (
                    <option value="">None</option>
                )}

                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    );
};

export { AppSelect };