import axios from "axios";


const params = new URLSearchParams()
// params.append('grant_type', grant_type)
// params.append('resource', resource)
// params.append('client_id', client_id)
// params.append('client_secret', client_secret)

function getToken() {
    return axios.post("https://accounts.accesscontrol.windows.net/9f6a57fa-dde1-4400-a1f5-92364f43ed31/tokens/OAuth/2", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    });
}
export default getToken;