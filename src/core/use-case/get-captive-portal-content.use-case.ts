import crypto from 'crypto';

interface Dependencies {}
interface Props { fasQuery : string };

export const getCaptivePortalContent =  ({ fasQuery }: Props) => {
    const fas = Buffer.from(fasQuery, 'base64').toString('utf8')
    const hid = fas.match(/hid=\w+/g).pop().replace("hid=", "")
    const gateway = fas.match(/gatewayaddress=([\w\.:])+/g).pop().replace("gatewayaddress=", "")
    const gatewayurl = fas.match(/gatewayurl=([\w\.:%])+/g).pop().replace("gatewayurl=", "")
    const hash = crypto.createHash('sha256').update(hid);	
    console.log(fas, hid, gateway, gatewayurl, hash)
    return `
        <form action="http://${gateway}/opennds_auth/" method="get">
                <input type="hidden" name="tok" value="${hash}">
                <input type="hidden" name="fas" value="${fas}">
                <input type="hidden" name="redir" value="https://google.fr"><br>
                <input type="submit" value="Continue" >
        </form>
    `
}