export const environment = {
    production: false,
    authorize_uri: 'http://localhost:9000/oauth2/authorize?',
    client_id: 'client-angular',
    redirect_uri: 'http://localhost:4200/authorize',
    scope: 'openid profile',
    response_type: 'code',
    response_mode: 'form_post',
    code_challenge_method: 'S256',
    /* Con el Mock
    code_verifier: 'lJoczNsB9lCJ2hVG174AtaXjYcIxLxbIVQ2La7Yxk4d',
    code_challenge: '5t796pVGz5Nq3tPIfZo2XCAq28_Hc8QCWJqwY_Po7LQ',*/
    token_url: 'http://127.0.0.1:9000/oauth2/token',
    grant_type: 'authorization_code',
    logout_url: 'http://localhost:8090/logout',
    secret_pkce: '12345',
    hostname_port_local: 'http://localhost:8090',
    hostname_port_local_fe: 'http://localhost:4200'
};