import api from "./api";

export const getAttacks = async () => {

    const response = await api.get("/attacks");

    return response.data;

};