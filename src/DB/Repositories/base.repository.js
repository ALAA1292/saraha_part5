export default class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }

    CreateDocument(data) {
        return this.model.create(data)
    }

    FindDocumentById(_id) {
        return this.model.findById(_id)
    }

    FindOneDocument(filters = {}) {
        return this.model.findOne(filters)

    }

    FindOneAndUpdateDocument(filters, updates, options) {
        return this.model.findOneAndUpdate(filters, updates, options)

    }
    DeleteOneDocument(filters = {}) {
        return this.model.deleteOne(filters);
    }

    FindDocuments(filters = {}) {
        return this.model.find(filters);
    }

    UpdateDocumentById(_id, data, options) {
        return this.model.findByIdAndUpdate(_id, data, options)
    }
}
