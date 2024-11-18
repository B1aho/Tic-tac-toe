// Cell module
export const Cell = () => {
    let value = defaultSymbol

    const getValue = () => {
        return value;
    }
    
    const setValue = (x) => {
        value = x
    }

    return {
        getValue,
        setValue,
    }
} 
