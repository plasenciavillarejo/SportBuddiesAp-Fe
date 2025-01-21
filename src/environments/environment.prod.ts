export const environment = {
    production: true,
    authorize_uri: 'https://www.sportbuddies.es/oauth2/authorize?',
    client_id: 'client-angular',
    redirect_uri: 'https://www.sportbuddies.es/authorize',
    scope: 'openid profile',
    response_type: 'code',
    response_mode: 'form_post',
    code_challenge_method: 'S256',
    /* Con el Mock
    code_verifier: 'lJoczNsB9lCJ2hVG174AtaXjYcIxLxbIVQ2La7Yxk4d',
    code_challenge: '5t796pVGz5Nq3tPIfZo2XCAq28_Hc8QCWJqwY_Po7LQ',*/
    token_url: 'https://www.sportbuddies.es/oauth2/token',
    grant_type: 'authorization_code',
    logout_url: 'http://200.234.230.76:8090/logout',
    secret_pkce: '12345',
    hostname_port_local_gtw: 'https://www.sportbuddies.es',
    hostname_port_local_fe: 'https://www.sportbuddies.es',
    hostname_port_local_oauth: 'https://www.sportbuddies.es',
    key_stripe: 'pk_test_51QHLE5KPTU50YCkCu2PCHKCHyjTj0tgu0oUvbvQQQCLiDJkiw0xoaGmJ1rDiV7glZvtbxzIbyn30LAOwn5IVhJ8f008GoACgYJ',
    username_cobardo: 'pro-1962508930052348487',
    secret_id_cobardo: 'corbado1_gTYNCwuJSxGw3dmAnyDGjJAwLnYANK'
};
