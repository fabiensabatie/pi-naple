import crypto from 'crypto';
import fs  from 'sudo-fs-promise';


interface Props {
    readonly fasQuery: string;
    readonly iv: string;
    readonly gateway?: string;
    readonly gatewayname?: string;
    readonly gatewayurl?: string;
    readonly hid?: string;
}

const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const AUTH_CHANNEL_DIR = "/run/";


export class OpenNds {

    private decryptedFas:string = "";
    private constructor(private props: Props) { }

    get gateway() { return this.props.gateway; }
    get gatewayname() { return this.props.gatewayname; }
    get gatewayurl() { return this.props.gatewayurl; }
    get hid() { return this.props.hid; }
    get hidHash() { return crypto.createHash('sha256').update(this.props.hid + ENC_KEY).digest('hex') }
    get gatewaynameHash() { return crypto.createHash('sha256').update(decodeURIComponent(this.props.gatewayname)).digest('hex'); }
    get form() { return `<form action="http://${this.props.gateway}/opennds_auth/" method="get"> <input type="hidden" name="tok" value="${this.hidHash}"> <input type="hidden" name="redir" value="https://google.fr"><br> <input type="submit" value="Continue" ></form>`; }

    static create(props: Props) {
        return new OpenNds(props).decryptFas(props.fasQuery, props.iv);
    }

    public update(props: Partial<Props>) {
        this.props = { ...this.props, ...props };
    }

    public decryptFas(encrypted: string, iv: string) {
        const fasData = Buffer.from(encrypted, 'base64').toString('utf8');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
        const decrypted = decipher.update(fasData, 'base64', 'utf8');
        this.decryptedFas = decrypted + decipher.final('utf8');
        this.update({
            hid : this.decryptedFas.match(/hid=\w+/g).pop().replace("hid=", ""),
            gateway : this.decryptedFas.match(/gatewayaddress=([\w\.:])+/g).pop().replace("gatewayaddress=", ""),
            gatewayname : this.decryptedFas.match(/gatewayname=([\w\.%])+/g).pop().replace("gatewayname=", ""),
            gatewayurl : this.decryptedFas.match(/gatewayurl=([\w\.:%])+/g).pop().replace("gatewayurl=", ""),
        });
        return this;
    }

    public async upsertAuthCommunicationChannelDir() {
        const dir = `${AUTH_CHANNEL_DIR}${this.gatewaynameHash}`;
        try {
            await fs.exists(dir);
        } catch (error) {
          await fs.mkdir(dir)
        }
        await this.upsertAuthCommunicationChannelFile(`${dir}/${this.hidHash}`, "");
    }

    public async upsertAuthCommunicationChannelFile(filePath: string, data: string) {
        try {
          await fs.readFile(filePath)
        } catch (error) {
          await fs.writeFile(filePath, data)
        }
    }
}
