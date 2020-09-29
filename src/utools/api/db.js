/* eslint-disable no-return-await */
export default {
  put: (upxId, params) => global.services.DBClient.put(upxId, params),
  get: (upxId, params) => global.services.DBClient.get(upxId, params),
  remove: (upxId, params) => global.services.DBClient.remove(upxId, params),
  bulkDocs: (upxId, params) => global.services.DBClient.bulkDocs(upxId, params),

  allDocs: (upxId, params) => global.services.DBClient.allDocs(upxId, params),
  getAttachment: (upxId, { docId, attachmentId }) => global.services.DBClient.getAttachment(upxId, docId, attachmentId)
}
