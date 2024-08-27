import axiosInstance from "./axiosInstance";

const Authentication = {
    signup: async (payload) => {
        try {

            const response = await axiosInstance.post('/signup', payload)
            return response.data
        }
        catch (error) {
            throw error.response.data
        }
    },
    login: async (payload) => {
        try {
            const response = await axiosInstance.post('/login', payload)
            return response.data
        }
        catch (error) {
            throw error.response.data
        }
    },
}

export default Authentication
