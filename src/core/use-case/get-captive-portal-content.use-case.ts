import crypto from 'crypto';

interface Dependencies {}
interface Props { fasQuery : string, iv: string };


const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');




export const getCaptivePortalContent =  ({ fasQuery, iv }: Props) => {
    const fasData = Buffer.from(fasQuery, 'base64').toString('utf8');
      var decrypt = ((encrypted) => {
        let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        return (decrypted + decipher.final('utf8'));
      });
    const fas = decrypt(fasData);
    const hid = fas.match(/hid=\w+/g).pop().replace("hid=", "")
    const gateway = fas.match(/gatewayaddress=([\w\.:])+/g).pop().replace("gatewayaddress=", "")
    const gatewayurl = fas.match(/gatewayurl=([\w\.:%])+/g).pop().replace("gatewayurl=", "")
    const hash = crypto.createHash('sha256').update(hid + "bf3c199c2470cb477d907b1e0917c17b").digest('hex');	
    console.log(fas, hid, gateway, gatewayurl, hash)
    return `
        <form action="http://${gateway}/opennds_auth/" method="get">
                <input type="hidden" name="tok" value="${hash}">
                <input type="hidden" name="redir" value="https://google.fr"><br>
                <input type="submit" value="Continue" >
        </form>
    `
}