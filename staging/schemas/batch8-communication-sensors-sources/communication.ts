// Generated from SignalK specification master - do not edit manually
// Source: https://raw.githubusercontent.com/SignalK/specification/master/schemas/groups/communication.json
import { Type } from 'typebox'

export const CommunicationSchema = Type.Object({
    "callsignHf": Type.Optional(Type.String({"description":"Callsign for HF communication","examples":["ZL3RTH"]})),
    "callsignVhf": Type.Optional(Type.String({"description":"Callsign for VHF communication","examples":["ZL1234"]})),
    "crewNames": Type.Optional(Type.Tuple([Type.String({"description":"Name of a crew member of the vessel.","examples":["Catherine"]})])),
    "email": Type.Optional(Type.String({"description":"Regular email for the skipper","examples":["robert@xxx.co.nz"]})),
    "emailHf": Type.Optional(Type.String({"description":"Email address to be used for HF email (Winmail, Airmail, Sailmail)","examples":["motu@xxx.co.nz"]})),
    "phoneNumber": Type.Optional(Type.String({"description":"Phone number of skipper","examples":["+64xxxxxx"]})),
    "satPhoneNumber": Type.Optional(Type.String({"description":"Satellite phone number for vessel.","examples":["+64xxxxxx"]})),
    "skipperName": Type.Optional(Type.String({"description":"Full name of the skipper of the vessel.","examples":["Fabian Tollenaar"]}))
  }, {"$id":"signalk://schemas/groups/communication","description":"Schema describing the communication child-object of a Vessel.","title":"communication"})
export type Communication = Type.Static<typeof CommunicationSchema>
