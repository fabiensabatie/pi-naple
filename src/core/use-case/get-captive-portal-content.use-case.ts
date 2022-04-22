import crypto from 'crypto';

interface Dependencies {}
interface Props { fasQuery : string, iv: string };

const decrypt = (textBase64, keyBase64, ivBase64) => {
    const algorithm = 'aes-256-cbc';
    const ivBuffer = Buffer.from(ivBase64, 'utf8');
    const keyBuffer = Buffer.from(keyBase64, 'utf8');

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    decipher.setAutoPadding(false);

    let decrypted = decipher.update(textBase64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const getCaptivePortalContent =  ({ fasQuery, iv }: Props) => {

    const key = 'abcdef';

    // the message comes from the bytes AFTER the IV - this is what you should decrypt
    const message = Buffer.from(fasQuery, 'base64').slice(16);

    const result = decrypt(message, key, iv);

    const fas = result;
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