const mongoose = require('mongoose');
const Model = require('../models/company');
const { map } = require('lodash');

function handleError(res) {
    return function(err) {
        res.send(500, err);
        return Promise.reject(err);
    };
}

function handleOk(res, status = 200) {
    return function(data) {
        return res.status(status).json(data);
    };
}

module.exports.list = function(req, res) {
    Model.find({})
        .then(toObject)
        .then(makeTree)
        .then(computeChildEarn)
        .then(handleOk(res))
        .catch(handleError(res));

};

module.exports.create = function(req, res) {
    const {name, earnings, parentId} = req.body || {};
    const company = {
        name,
        earnings,
        parentId: parentId || null
    };
    Model.create(company).then(handleOk(res, 201)).catch(handleError(res));
};

module.exports.update = function(req, res) {
    const {_id, name, earnings, parentId} = req.body || {};
    const company = {
        name,
        earnings,
        parentId: parentId || null
    };
    if (_id) {
        if (_id === parentId) {
            handleError(res, 400)({error: '_id should not be equal to parentId'});
        } else {
            Model.update({_id: _id}, company).then(handleOk(res, 201)).catch(handleError(res));
        }
    } else {
        handleError(res, 400)({error: '_id is required'});
    }
};

module.exports.remove = function(req, res) {
    // Cascade deletion - get all items, make tree and than extract ids for deletion
    Model.find({}, '_id', 'parentId')
        .then(toObject)
        .then(makeTree)
        .then(collectIdsRecursive4Remove(req.params.id))
        .then(ids => {
            Model.remove({_id: {$in: ids}})
                .then(() => handleOk(res, 200)(ids))
                .catch(handleError(res));
        });

    function collectIdsRecursive4Remove(id) {
        return function(tree) {
            const result = [];

            const traverse = (company, addToResult) => {
                if (company._id == id) {
                    addToResult = true;
                }
                if (addToResult) {
                    result.push(company._id);
                }
                company.childrens.forEach((it) => traverse(it, addToResult));
            }

            tree.forEach((it) => traverse(it, false));

            return result;
        };
        
    }
};


// Convert mongoose obj to Object
function toObject(arr) {
    return map(arr, (it) => {
        it = it.toObject();
        it._id = it._id.toString();
        return it;
    });
};

// Use parentId of item to create childs. Also Calculate childEarnings
function makeTree(array, parent) {
    let tree = [];
    parent = parent || {};

    var children = array.filter(function(child) {
        return child.parentId == parent._id;
    });

    if (children.length) {
        if (!parent._id) {
            tree = children;
        } else {
            parent.childrens = children;
        }
        children.forEach(function(child) {
            makeTree(array, child);
        });
    } else {
        parent.childrens = [];
    }

    return tree;
}

function computeChildEarn(tree) {
    populateChildEarnings(tree);
    return tree;
}

function populateChildEarnings(tree) {
    return tree.map((it) => {
        const childEarnings = populateChildEarnings(it.childrens) || 0;
        it.childEarnings = it.earnings + childEarnings;
        return it.childEarnings;
    }).reduce(((sum, cur) => sum + cur), 0);
}
