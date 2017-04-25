export const handleHttpError = (actionName, error,) => {
    console.log(`#{actionName} Error`)
    if (error.response) 
    {
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
    } 
    else 
    {
        console.log(error.message)
    }
    console.log(error.config)
}