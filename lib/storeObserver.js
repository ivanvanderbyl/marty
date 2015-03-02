var log = require('./logger');
var _ = require('underscore');

class StoreObserver {
  constructor(component, stores) {
    this.component = component;
    this.listeners = _.map(stores, _.partial(
      _.bind(this.listenToStore, this), _, component
    ));
  }

  dispose() {
    _.invoke(this.listeners, 'dispose');
  }

  listenToStore(store, component) {
    var storeDisplayName = store.displayName || store.id;
    var listener = _.partial(this.onStoreChanged, _, _, component);

    log.trace(
      `The ${component.displayName} component  (${component.__id}) is listening to the ${storeDisplayName} store`
    );

    return store.for(component).addChangeListener(listener);
  }

  onStoreChanged(state, store, component) {
    var storeDisplayName = store.displayName || store.id;

    log.trace(
      `${storeDisplayName} store has changed. The ${component.displayName} component (${component.__id}) is updating`
    );

    if (component._lifeCycleState === 'UNMOUNTED') {
      log.warn(
        `Warning: Trying to set the state of ${component.displayName} component (${component.__id}) which is unmounted`
      );
    } else {
      component.setState(tryGetState(component, store));
    }
  }
}

function tryGetState(component, store) {
  var handler;
  var displayName = component.displayName;

  if (store && store.action) {
    handler = store.action.addViewHandler(displayName, component);
  }

  try {
    return component.getState();
  } catch (e) {
    var errorMessage = `An error occured while trying to get the latest state in the view ${component.displayName}`;

    log.error(errorMessage, e, component);

    if (handler) {
      handler.failed(e);
    }

    return {};
  } finally {
    if (handler) {
      handler.dispose();
    }
  }
}

module.exports = StoreObserver;