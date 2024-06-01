export type AuthResponseError = {
    error: boolean;
    message: string;
    validation?: {
        key: string;
        message: string;
    }
};