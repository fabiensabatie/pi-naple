import crypto from 'crypto';

interface Dependencies {}
interface Props { fasQuery : string, iv: string };


export const getCaptivePortalContent =  ({ fasQuery, iv }: Props) => {

    const decrypter = crypto.createDecipheriv("aes-256-cbc", "coucoulesamis", iv);

    // decrypt the message
    // set the input encoding
    // and the output encoding
    let decryptedMsg = decrypter.update(fasQuery, "hex", "utf8");
    
    // stop the decryption using
    // the final method and set
    // output encoding to utf8
    decryptedMsg += decrypter.final("utf8");
    
    console.log("Decrypted message: " + decryptedMsg);

    const fas = decryptedMsg;
    const hid = fas.match(/hid=\w+/g).pop().replace("hid=", "")
    const gateway = fas.match(/gatewayaddress=([\w\.:])+/g).pop().replace("gatewayaddress=", "")
    const gatewayurl = fas.match(/gatewayurl=([\w\.:%])+/g).pop().replace("gatewayurl=", "")
    const hash = crypto.createHash('sha256').update(hid + "coucoulesamis").digest('base64');	
    console.log(fas, hid, gateway, gatewayurl, hash)
    return `
        <form action="http://${gateway}/opennds_auth/" method="get">
                <input type="hidden" name="tok" value="${hash}">
                <input type="hidden" name="redir" value="https://google.fr"><br>
                <input type="submit" value="Continue" >
        </form>
    `
}