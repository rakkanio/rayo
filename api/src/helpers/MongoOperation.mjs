'use strict'

const create = async (collection, createDraft) => {
    try {
        console.log('Draft', createDraft)
        const draft = await db.collection(collection).insertOne(createDraft)
        return draft
    } catch (err) {
        console.log(`Error while saving record, collection  name ${collection}`, err)
        throw new Error('Error while creating record, please try after sometime')
    }
}

const list = async (collection, query) => {
    try {
        const list = await db.collection(collection).find(query).sort({ createdAt: -1 }).toArray()
        return list
    } catch (err) {
        console.log(`Error while fetching list, collection name ${collection}`, err)
        throw new Error('Error while fetching list, please try after sometime')
    }
}
const search = async (collection, query) => {
    try {
        const record = await db.collection(collection).findOne(query)
        return record
    } catch (err) {
        console.log(`Error while fetching record, collection name ${collection}`, err)
        throw new Error('Error while searching record, please try after sometime')
    }
}

const update = async (collection, reqObj) => {
    try {
        console.log('requested update details', reqObj)
        const { query, payload } = reqObj
        const update = { $set: payload }
        const res = await db.collection(collection).updateOne(query, update)
        return res
    } catch (err) {
        console.log(`Error while updating record, collection name ${collection}`, err)
        throw new Error('Error while updating record, please try after sometime')
    }
}
const remove = async (collection, reqObj) => {
    try {
        console.log('draft remove details', reqObj)
        const { id } = reqObj
        const query = { _id: ObjectId(id) }
        const res = await db.collection(collection).removeOne(query)
        return res
    } catch (err) {
        console.log(`Error while removing record, collection name ${collection}`, err)
        throw new Error('Error while removing record, please try after sometime')
    }
}

const lookupCollections = async (reqObj) => {
    try {
        console.log('requested lookup details', reqObj)
        const { sourceCollection, foreignCollection, localField: local, foreignField: foreign, alias, query } = reqObj
        const result = await db.collection(sourceCollection).aggregate([
            { $match: query },
            { $set: { offerId: { $toObjectId: "$offerId" } } },
            {
                $lookup: {
                    from: foreignCollection, localField: local,
                    foreignField: foreign, as: alias
                }
            },
        ]).toArray()
        return result
    } catch (err) {
        console.log(`Error while looking up collection `, err)
        throw new Error('Error while searching offers, please try after sometime')
    }
}


const MongoOperationModel = {
    create,
    list,
    search,
    update,
    remove,
    lookupCollections

}

export default MongoOperationModel
