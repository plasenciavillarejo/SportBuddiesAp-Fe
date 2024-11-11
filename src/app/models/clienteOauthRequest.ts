
export class ClienteOauthRequest {

    idClienteOauth!: number;

    clientId!: string;
  
    clientSecret!: string;
  
    clientName!: string;
    
    authenticationMethods= [] as string [];
    
    authorizationGrantTypes = [] as string [];
  
    redirectUris = [] as string [];
    
    postLogoutRedirectUris = [] as string [];
    
    scopes = [] as string [];
  
    timeAccesToken!: number;
    
    timeRefrehsToken!: number;

}