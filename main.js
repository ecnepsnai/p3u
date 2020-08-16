const path = require('path');
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const https = require('https');
const xml2js = require('xml2js');

let mainWindow;
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});



////////////////////////////////////////////////////////////////////////////
// PlayStation Title Lookup                                               //
//                                                                        //
// This needs to be done in the main process as Chromium will (correctly) //
// refuse connecting to this specific PlayStation API as it uses a        //
// self-signed SHA-1 certificate (double ouch!).                          //
// By doing this in the main process we can control the https connection  //
// that Node uses, and pin the expected root certificate.                 //
////////////////////////////////////////////////////////////////////////////

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


function getTitleXML(titleID) {
  const options = {
    host: 'a0.ww.np.dl.playstation.net',
    port: 443,
    path: '/tpl/np/' + titleID + '/' + titleID + '-ver.xml',
    method: 'GET',
    ca: [ ca ],
  };
  options.agent = new https.Agent(options);
  return new Promise((resolve, reject) => {
    let request = https.request(options, resp => {
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

ipcMain.handle('lookup_title', async (event, args) => {
  const titleID = args[0];
  const xmlData = await getTitleXML(titleID);
  const parser = new xml2js.Parser();
  const title = {
    title_id: titleID,
    name: '',
    packages: [],
  };
  parser.parseString(xmlData, function (err, result) {
    if (!result || !result.titlepatch) {
      throw new Error('No updates for package');
    }

    try {
      result.titlepatch.tag[0].package.forEach(elm => {
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
});

ipcMain.on('alert', () => {
  app.dock.bounce();
  mainWindow.once('focus', () => { mainWindow.flashFrame(false); })
  mainWindow.flashFrame(true);
  shell.beep();
});
