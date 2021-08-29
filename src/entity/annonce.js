class Annonce {
    _id;
    title;

    constructor(title, _id = null) {
        this.title = title;
        this._id = _id;
    }


}

module.exports = Annonce;