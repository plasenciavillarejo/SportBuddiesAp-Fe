
export class CredentialPasskeys {
    id!: string;
    rawId!: string;
    type!: string;
    response!: {
        attestationObject: string;
        clientDataJSON: string;
    };
    clientExtensionResults: any;
    nombreUsuario!: string;
}