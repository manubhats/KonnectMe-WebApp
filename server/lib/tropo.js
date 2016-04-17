import http from 'http';

const url = 'https://api.tropo.com/1.0/sessions?action=create&token=';

const voice_token = '6d7544544c72524d48587069476b4f477071646e626b4c736e4363696c426665586e784774464f51656d6f53';
const text_token = '6155544f726d63414552784e754352665a68425266645743616a666d6262624d6d6f68514a65494d4171655a';

export let call = (initiator_name, recipient_name, recipient_phone_number, message) => {
	let request = http.get(`${url}${voice_token}&initiator_name=${initiator_name}&recipient_name=${recipient_name}&recipient_phone_number=${recipient_phone_number}&message=${message}`);
	request.end();
}
