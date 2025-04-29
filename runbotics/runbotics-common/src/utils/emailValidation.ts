export const isEmailValid = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
}