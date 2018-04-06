export const handleHttpError = (actionName, error,) => {
    console.warn(`${actionName} Error: `)
    if (error.response) 
    {
        console.warn('HTTP Error')
        console.warn('Data: ', error.response.data)
        console.warn('Status: ', error.response.status)
        console.warn('Headers: ', error.response.headers)
        console.warn('Config: ', error.config)
    } 
    else 
    {
        throw error;
    }
}