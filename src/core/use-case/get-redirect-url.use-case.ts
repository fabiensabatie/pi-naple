export const getRedirectUrl =  (redir: string, token: string) => `http://10.3.141.1:2050/opennds_auth/?tok=${token}&redir=${redir}`