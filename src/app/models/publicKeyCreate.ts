
export class PublicKeyCreate {
    challenge!: ArrayBuffer;
    rp!: any;
    user!: {
        id: ArrayBuffer;
        name: string;
        displayName: string;
    };
    pubKeyCredParams!: Array<{ type: string, alg: number }>;
    timeout!: number;
    excludeCredentials!: Array<{ id: ArrayBuffer, type: string }>;
    authenticatorSelection!: any;
    attestation!: any;
    extensions!: any;
}