const fs = require('fs');
const path = require('path');
require ('dotenv').config();
const { google } = require('googleapis');


//extract id frome link (parceque api yas7ak l id machi link)
const getFolderId = (url) => {
  const parts = url.split('/');
  return parts[7]?.split('?')[0];
};
// auth l google service 
async function authorizeDrive() {
  const scopes = ['https://www.googleapis.com/auth/drive'];
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes
  );
  await auth.authorize();
  return google.drive({ version: "v3", auth });
}

// Trouver l'ID d'un sous-dossier (ex: TD, Cours)
async function getCategoryFolderId(parentId, category) {
  const drive = await authorizeDrive();

  const query = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${category}' and trashed = false`;

  const response = await drive.files.list({
    q: query,
    fields: "files(id, name)",
  });

  return response.data.files[0]?.id;
}

// Upload d’un fichier dans un sous-dossier
async function uploadToDrive(file, parentlink, category) {
  const drive = await authorizeDrive();
  const parentId = getFolderId(parentlink);
  

  
    const subId = await getCategoryFolderId(parentId, category);
   

  const metadata = {
    name: file.originalname,
    parents: [subId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };
// mana 3adi ncreo l file 
  const result = await drive.files.create({
    requestBody: metadata,
    media,
    fields: "id, name",
  });

  fs.unlinkSync(file.path); // nsuprimo l fichier temporair 

  
}

module.exports = {
  uploadToDrive,
};