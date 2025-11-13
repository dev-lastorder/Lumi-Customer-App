// Interfaces
import { IToastMessageFunctionProps } from "../interfaces/toast"

// Toastify
import { toast } from "react-toastify"

// React Native



export const showMessage = ({message, type, position}:IToastMessageFunctionProps) => {
    try {
       return toast(message)
    } catch (error) {
        
    }
}