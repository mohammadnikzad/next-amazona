import mongoose from 'mongoose'

const connection = {}

async function connect() {
  if (connection.isConncted) {
    console.log('Alredy connected')
    return
  }

  if (mongoose.connections.length > 0) {
    connection.isConncted = mongoose.connections[0].readyState
    if (connection.isConncted === 1) {
      console.log('Use previous connection')
      return
    }

    await mongoose.disconnect()
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('New connection')
  connection.isConncted = db.connections[0].readyState
}

async function disconnect() {
  if (connection.isConncted) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect()
      connection.isConncted = false
    } else {
      console.log('Not disconnect')
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString()
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

const db = { connect, disconnect, convertDocToObj }
export default db
