const Curl = require('../curl');
const Util = require('../util');

var configCap = {
	url: 'https://2captcha.com',
	key: ''
};

module.exports = function(value) {
	
	const Utill = new Util();

	const curl = new Curl();

    configCap = Object.assign(configCap, value);

	const send = async (img) => {
		const data = {
		    'method': 'base64',
		    'key':  configCap.key,
		    'body': img,
		    'phrase':   0,
		    'regsense': 0,
		    'numeric':  0,
		    'min_len':  0,
		    'max_len':  4,
		    'language': 0
		};

		
		curl.setUrl(`${configCap.url}/in.php`);
		curl.setPost(data);

		let dados = await curl.run();
		dados = Utill.trataRes(dados.body);
		return dados;
	};

	const check = async (id) => {

		let url = (`${configCap.url}/res.php?key=${configCap.key}&action=get&id=${id}`);
		curl.setUrl(url);

		for (let index = 0; index < 20; index++) {

			let dados = await curl.run();
			dados = Utill.trataRes(dados.body);
			if(dados === false) {
				let xx = await Utill.sleep(5);
				continue;
			}else{
				return dados;
				break;
			}
		}
		return false;
	};

	return {send, check, Util: Util};
};