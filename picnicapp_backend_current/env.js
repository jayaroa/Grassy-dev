module.exports = {
    PORT: 3132,
    SOCKET_PORT: 3232,
    API_VERSION : '1.0.0',
    VERSION_HISTORY : {
        '1.0.0' : 'v1'
    },
    secretAccessKey: "",
    accessKeyId: "",
    region: '', // region of your bucket
    
    public_path:{
        "PolicyEN": "./public/policy/en/", 
        "PolicyES": "./public/policy/es/",
        "TermsEN": "./public/terms/es/",
        "TermsES": "./public/terms/en/",
        "AgreementEN": "./public/agreement/en/",
        "AgreementES": "./public/agreement/es/",
    }
}

