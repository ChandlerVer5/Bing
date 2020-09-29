/* eslint-disable unicorn/catch-error-name */
import path from 'path'
import Db from 'pouchdb'
import { DB_PATH } from './app-configs'

const DEFAULT_DBNAME = 'default'

class BingDB {
  db = null

  constructor(dbName) {
    // this.db = new Db(`${global.DB_PATH}/${dbName || DEFAULT_DBNAME}`, { auto_compaction: true })
    this.db = new Db(path.join(DB_PATH, dbName || DEFAULT_DBNAME), { auto_compaction: true })
  }

  close() {
    this.db.close()
    this.db = null
  }

  getUniqueDocId(pluginId, docId) {
    return `${pluginId}/${docId}`
  }

  /**
   * pluginId, docId
   */
  getNormalId(pluginId, uniqueDocId) {
    return uniqueDocId.replace(`${pluginId}/`, '')
  }

  errorInfo(name, message) {
    console.log('errorInfo', name, message)
    return {
      error: true,
      name,
      message
    }
  }

  /**
   * @param {object}  doc
   */
  async put(pluginId, doc) {
    if (typeof doc !== 'object') return this.errorInfo('Error', 'param is not a object!')
    if (!doc._id) return this.errorInfo('Error', 'param has no not _id defined!')
    doc._id = this.getUniqueDocId(pluginId, doc._id)
    try {
      const res = await this.db.put(doc)
      res.id = this.getNormalId(pluginId, res.id)
      console.log('db.put', pluginId, res)
      return res
    } catch ({ name, message }) {
      return {
        id: this.getNormalId(pluginId, doc._id),
        name,
        error: !0,
        message
      }
    }
  }

  async get(pluginId, docId) {
    try {
      const res = await this.db.get(this.getUniqueDocId(pluginId, docId))
      res._id = this.getNormalId(pluginId, res._id)
      return res
    } catch (e) {
      return null
    }
  }

  /**
   * @param {object|id} doc|docId
   */
  async remove(pluginId, docId) {
    let doc = null
    if (typeof docId === 'string') {
      doc = this.db.get(pluginId, docId)
    } else {
      doc = docId
      doc._id = this.getUniqueDocId(pluginId, doc._id)
    }
    try {
      const res = await this.db.remove(doc)
      res.id = this.getNormalId(pluginId, res.id)
      return res
    } catch ({ name, message }) {
      return this.errorInfo(name, message)
    }
  }

  async bulkDocs(pluginId, docArray) {
    let res = null
    try {
      if (!Array.isArray(docArray)) return this.errorInfo('Error', 'param is not a array!')
      if (new Set(docArray.map((e) => e._id)).size !== docArray.length) return this.errorInfo('Error', 'param item has same _id!')
      docArray.forEach((doc) => {
        doc._id = this.getUniqueDocId(pluginId, doc._id)
      })
      res = await this.db.bulkDocs(docArray)
      res.map((doc) => {
        doc.id = this.getNormalId(pluginId, doc.id)
        return doc.error
          ? {
              id: doc.id,
              name: doc.name,
              error: true,
              message: doc.message
            }
          : doc
      })
    } catch (e) {}
    return res
  }

  /**
   * @description 执行该方法将会获取所有数据库文档!
   * 传入字符串，则会返回以字符串开头的文档，
   * 传入指定ID的数组，
   * 不传入则为获取所有文档。
   * @param {string|array}
   */
  allDocs(pluginId, key) {
    let res = null
    const options = {
      include_docs: true // Include the document itself in each row in the doc field.
    }
    switch (typeof key) {
      case 'object':
        if (!Array.isArray(key)) return this.errorInfo('Error', 'param should be keys(Array[string])')
        options.keys = key.map((id) => this.getUniqueDocId(pluginId, id))
        break
      case 'string':
        options.startkey = this.getUniqueDocId(pluginId, key)
        break
      default:
        options.startkey = this.getUniqueDocId(pluginId, key)
        break
    }
    try {
      // each row in the doc field.
      res = this.db.allDocs(options).then(({ rows }) =>
        rows.map((docs) => {
          if (!docs.error) {
            docs.doc._id = this.getNormalId(pluginId, docs.doc._id)
          }
          return docs.doc
        })
      )
    } catch (e) {}
    return res
  }

  getAttachment(pluginId, docId, attachmentId) {
    if (!docId || !attachmentId) return null
    try {
      return this.db.getAttachment(this.getUniqueDocId(pluginId, docId), attachmentId)
    } catch (error) {
      return null
    }
  }

  async dbStatistics() {
    const e = await this.db.allDocs()
    const t = {}
    return (
      e.rows.forEach((e) => {
        let i
        if (e.id.startsWith('//feature/')) {
          const t = e.id.replace('//feature/', '')
          i = t.slice(0, t.indexOf('/'))
        } else i = e.id.slice(0, e.id.indexOf('/'))
        i in t ? (t[i] += 1) : (t[i] = 1)
      }),
      t
    )
  }

  clearPluginData(upxId) {
    console.log(upxId)
  }
}

/* const open = (pluginId, dbName) => new BingDB(pluginId, dbName)
const get = (pluginId, docId) => new BingDB().get(pluginId, docId)
const put = (pluginId, doc) => new BingDB().put(pluginId, doc)
const remove = (pluginId, docId) => new BingDB().remove(pluginId, docId)
const bulkDocs = (pluginId, docArray) => new BingDB().bulkDocs(pluginId, docArray)
const allDocs = (pluginId, key) => new BingDB().allDocs(pluginId, key)
const getAttachment = (pluginId, docId, attachmentId) => new BingDB().getAttachment(pluginId, docId, attachmentId)
const close = () => new BingDB().db.close() */

/**
 * @param {string} db_name  other dbname for your self!
 */
export default BingDB
