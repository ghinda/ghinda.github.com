/* pouchdb view management
 */

// declare the views
var views = {
  pills: {
    blue: {
      map: function (doc) {
        if (doc.color === 'blue') {
          emit(doc._id)
        }
      }.toString()
    },
    red: {
      map: function (doc) {
        if (doc.color === 'red') {
          emit(doc._id)
        }
      }.toString()
    }
  },
  agents: {
    agents: {
      map: function (doc) {
        if (doc.type === 'agent') {
          emit(doc._id)
        }
      }.toString()
    }
  }
}

// query couchdb views
function query (db, view, params) {
  var namespace = view.split('/')[0]

  return db
  .query(view, params)
  .catch(function (err) {
    if (!views[namespace]) {
      throw new Error('View ' + namespace + ' is not defined.')
    }

    // if view doesn't exist, create it, and try again
    if (err.status === 404) {
      return db
      .put({
        _id: '_design/' + namespace,
        views: views[namespace]
      })
      .then(function () {
        return query(db, view, params)
      })
    }
  })
}

var db = new PouchDB('db')

// db is ready
function ready () {
  // get agents
  query(db, 'agents', {
    include_docs: true
  }).then(function (res) {
    res.rows.forEach(function (row) {
      document.getElementById('agents').innerHTML += '<li>' +
        row.doc.name +
        '</li>'
    })
  })

  // get red pills
  query(db, 'pills/red', {
    include_docs: true
  }).then(function (res) {
    res.rows.forEach(function (row) {
      document.getElementById('pills').innerHTML += '<li style="color:' + row.doc.color + '">' +
      row.doc.color +
      '</li>'
    })
  })

  // get blue pills
  query(db, 'pills/blue', {
    include_docs: true
  }).then(function (res) {
    res.rows.forEach(function (row) {
      document.getElementById('pills').innerHTML += '<li style="color:' + row.doc.color + '">' +
      row.doc.color +
      '</li>'
    })
  })
}

// add some docs to the db,
// for the demo.
db.bulkDocs([
  {
    _id: 'pill1',
    type: 'pill',
    color: 'red'
  },
  {
    _id: 'pill2',
    type: 'pill',
    color: 'blue'
  },
  {
    _id: 'agent1',
    type: 'agent',
    name: 'Smith'
  }
]).then(ready)
