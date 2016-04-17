import https from 'https';

const url = 'https://api.tropo.com/1.0/sessions?action=create&token=';

const voice_token = '6d7544544c72524d48587069476b4f477071646e626b4c736e4363696c426665586e784774464f51656d6f53';
const text_token = '704d6954464c6e4a505971775a5064556e654b4672715448504f6e4a73696d69474342744462624a54616158';

export let call = (initiator_name, initiator_phone_number, event_id, recipient_id, recipient_name, recipient_phone_number, message) => {
	let request = https.get(`${url}${voice_token}&initiator_name=${initiator_name}&initiator_phone_number=${initiator_phone_number}&event_id=${event_id}&recipient_id=${recipient_id}&recipient_name=${recipient_name}&recipient_phone_number=${recipient_phone_number}&message=${message}`);
	request.end();
}
