export interface settingSetterProps {
    name: string,
    newValue: string,
};

export const settingSetter = (props: settingSetterProps) => {
    console.log(`Settings: Set ${props.name} in localstorage to\nValue: ${props.newValue}`);
    localStorage.setItem(props.name, props.newValue)
};

export interface settingGetterProps {
    name: string,
    defaultValue: string,
};

export const settingGetter = (props: settingGetterProps) => {
    let storedValue = localStorage.getItem(props.name);
    console.log(`Settings: Get ${props.name} from localstorage\nValue: ${storedValue}`);
    if (storedValue === null) {
        console.log(`Settings: Got null from ${props.name} in localstorage\ndefaulting value to ${props.defaultValue} in localStorage`);
        settingSetter({
            name: props.name,
            newValue: props.defaultValue,
        })
        return props.defaultValue;
    }
    return storedValue;
};