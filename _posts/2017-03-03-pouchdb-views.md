---
title: Simple PouchDB view management
layout: post
theme: theme-pouchdb
---

PouchDB is a JavaScript database that can sync with a remote CouchDB, among other things. Syncing gets all the documents in a database, including views and other design documents.

## View code

A common question is how to manage the code for the views.

A good approach is to keep them with the rest of the source code. You can then add them to the database on create, or on demand.

## Querying views

Another problem you can hit is trying to query a view before syncing is done.

This can happen when the view is available only in the remote database, and no internet connection is available.

Since the view is not yet synced with the local database, it will return a 404 error.

## Solution

To resolve these issues I created a function that tries to query a view and, if it doesn't exist, creates it and retries the query.

This also solves the view code management issue, by keeping the views in the source code as a map.

```javascript
// declare views
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
  .catch((err) => {
    if (!views[namespace]) {
      throw new Error(`View ${namespace} is not defined.`)
    }

    // if view doesn't exist, create it, and try again
    if (err.status === 404) {
      return db
      .put({
        _id: `_design/${namespace}`,
        views: views[namespace]
      })
      .then(() => {
        return query(db, view, params)
      })
    }
  })
}

// can be used as
var db = new PouchDB('db')
query(db, 'agents')
query(db, 'pills/red')
query(db, 'pills/blue')
```

## Demo

Here's a demo of how it works.

<div class="editor-demo" data-html="/media/demos/pouchdb-views/pouchdb-views.html" data-js="/media/demos/pouchdb-views/pouchdb-views.js"></div>

## CouchDB

The method can be adapted to use CouchDB directly, by replacing the PouchDB `query` and `put` methods with HTTP calls to the CouchDB API.
