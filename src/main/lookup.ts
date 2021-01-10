import https = require('https');
import xml2js = require('xml2js');

interface Package {
    version: string,
    size: number,
    sha1_sum: string,
    url: string,
}

interface Title {
    title_id: string,
    name: string,
    packages: Package[],
}

const ca = '-----BEGIN CERTIFICATE-----\n' +
    'MIID0jCCArqgAwIBAgIBADANBgkqhkiG9w0BAQUFADBUMQswCQYDVQQGEwJKUDEp\n' +
    'MCcGA1UEChMgU29ueSBDb21wdXRlciBFbnRlcnRhaW5tZW50IEluYy4xGjAYBgNV\n' +
    'BAMTEVNDRUkgRE5BUyBSb290IDA1MB4XDTA0MDcxMjA5MDExOVoXDTM3MTIwNjA5\n' +
    'MDExOVowVDELMAkGA1UEBhMCSlAxKTAnBgNVBAoTIFNvbnkgQ29tcHV0ZXIgRW50\n' +
    'ZXJ0YWlubWVudCBJbmMuMRowGAYDVQQDExFTQ0VJIEROQVMgUm9vdCAwNTCCASIw\n' +
    'DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANmPeza8PwCqlI7esOGIkoSESnIN\n' +
    'g72ZD3Ut63jy7SdothPIvGBqVZWYkIpqJYJd1I4Nh//IpXQCQL0PnJLrh9BBeowq\n' +
    'Muf5NNq3Us80Ihiu9CvNEAEO18g3OFV1TYdSwQ5zUsk33OUeI7h4aBPDVcZXYeHt\n' +
    'dbPLqe4K8igian5prrAD5S6h28t8aAm+qMWRo+bW25B/841XwDGBP7/IxZv8Yoio\n' +
    'rCo80CVYe6lGoU08eeqQiaHI5zAF281DWZSoVfLjJUEWmEnxqr8aOhszRGePi+Ei\n' +
    '7UQjHDuZX9rLhDI1zAND+BA259tn/iwOqVXe20OccJllHJcG4Ecmd98f5qMCAwEA\n' +
    'AaOBrjCBqzAdBgNVHQ4EFgQUxlahM1tPzoN3YgVEhm0gV7Wv2twwfAYDVR0jBHUw\n' +
    'c4AUxlahM1tPzoN3YgVEhm0gV7Wv2tyhWKRWMFQxCzAJBgNVBAYTAkpQMSkwJwYD\n' +
    'VQQKEyBTb255IENvbXB1dGVyIEVudGVydGFpbm1lbnQgSW5jLjEaMBgGA1UEAxMR\n' +
    'U0NFSSBETkFTIFJvb3QgMDWCAQAwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUF\n' +
    'AAOCAQEACZPihjwXA27wJ03tEKcHAeFLi8aBw2ysH4GwuH1dWb3UpuznWOB0iQT1\n' +
    'wQocnEFYCJx5XFEnj4aLWpSHLEq/sSO+my+aPoTEsy20ajF+YLYZm0bZxH50CJYh\n' +
    'rkET4C2aC0XvhGp9k1JQ1o0W6+cFT5LTlXapsq8Btt31t+XDPX7RqGV4WGekt3hM\n' +
    'T7xRc7JWXdAQijIrbYi8mtbM07KEGnPU6IT8C47+0mSurpwLOoWL1tPgo6ePpLNi\n' +
    'c4quUMgh9RXVjeTyXOMmyYdeUm2gt7qErvQONli+6Epmhm0A2khpIMHSpQjTE8gV\n' +
    'rZp42a6+zg1iYy2vFBOmiQ17GRUl0A==\n' +
    '-----END CERTIFICATE-----';

export class Lookup {
    private static getTitleXML = (titleID: string) => {
        const options: https.RequestOptions = {
            host: 'a0.ww.np.dl.playstation.net',
            port: 443,
            path: '/tpl/np/' + titleID + '/' + titleID + '-ver.xml',
            method: 'GET',
            ca: [ ca ],
        };
        options.agent = new https.Agent(options as https.AgentOptions);
        return new Promise((resolve, reject) => {
            console.log('HTTP GET https://' + options.host + options.path);
            const request = https.request(options, resp => {
                resp.setEncoding('utf8');
                let rawData = '';
                resp.on('data', chunk => { rawData += chunk; });
                resp.on('end', () => {
                    resolve(rawData);
                });
            });
            request.on('error', e => {
                reject(e);
            });
            request.end();
        });
    }


    public static async title(titleID: string): Promise<Title> {
        const xmlData = await Lookup.getTitleXML(titleID);
        const parser = new xml2js.Parser();
        const title: Title = {
            title_id: titleID,
            name: '',
            packages: [],
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parser.parseString(xmlData, function(err: Error, result: any) {
            if (!result || !result.titlepatch) {
                throw new Error('No updates for package');
            }

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result.titlepatch.tag[0].package.forEach((elm: any) => {
                    const pkg = elm.$;
                    title.packages.push({
                        version: pkg.version,
                        size: parseInt(pkg.size),
                        sha1_sum: pkg.sha1sum,
                        url: pkg.url,
                    });
                    if (elm.paramsfo) {
                        const info = elm.paramsfo[0];
                        title.name = info.TITLE[0];
                    }
                });
            } catch (e) {
                console.error('Error parsing XML for title', e);
                throw e;
            }
        });
        return title;
    }
}