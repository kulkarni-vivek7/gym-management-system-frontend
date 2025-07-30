import { encryptJWT } from "../cryptoUtils";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    name: string,
    email: string,
    jwt: string,
}

const initialState: AuthState = {
    name: '',
    email: '',
    jwt: '',
}

const authSclice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setNameSclice(state, action: PayloadAction<string>) {
            state.name = action.payload
        },
        setEmailSclice(state, action: PayloadAction<string>) {
            state.email = action.payload
        },
        setJWTSclice(state, action: PayloadAction<string>) {
            state.jwt = encryptJWT(action.payload)
        },
        clearAuth(state) {
            state.name = ''
            state.email = ''
            state.jwt = ''
        }
    }
})

export const { setNameSclice, setEmailSclice, setJWTSclice, clearAuth } = authSclice.actions
export default authSclice.reducer