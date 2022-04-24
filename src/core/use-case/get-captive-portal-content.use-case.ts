import { OpenNds } from "../domain/opennds";

interface Props { fasQuery : string, iv: string };

export const getCaptivePortalContent =  async ({ fasQuery, iv }: Props) => {
    const opennds = OpenNds.create({ fasQuery, iv });
    console.log(opennds)
    await opennds.upsertAuthCommunicationChannelDir();
    return opennds.form;
}