/*
    In Lightning Web Components (LWC), independent components can communicate with each other using a publish-subscribe (pub-sub) model. 
    This approach allows components to exchange information without the need for a direct parent-child relationship. 
    The pub-sub model is particularly useful when you have components that are not closely related but still need to share data or trigger actions.
*/

/*
1. Pub-Sub Service: To facilitate communication, you create a pub-sub service, which is essentially a JavaScript module. This service provides methods for components to publish and subscribe to events (or topics).
2. Publishing: Components that want to share information or trigger actions "publish" events by specifying a topic and providing any associated data. These published events are broadcasted to anyone who has subscribed to the same topic.
3. Subscribing: Components that are interested in receiving specific events "subscribe" to one or more topics. When an event is published on a subscribed topic, the service notifies all subscribers, allowing them to react accordingly.
*/

/*
1. Publish: A component sends data to a specific topic using the pub-sub service's `publish` method.
2. Subscribe: Another component subscribes to one or more topics of interest using the pub-sub service's `subscribe` method. It specifies a callback function to handle the data when an event is published on a subscribed topic.
3. Topic: A topic is a unique identifier for a category of events. It acts as a channel through which components communicate. Components that want to share information or trigger actions use the same topic.
4. Data: Data can be associated with an event when it's published. Subscribed components receive this data through their callback functions.
*/



// pubSubService.js

/* eslint-disable no-console */
const store = {};
/**
 * subscribers a callback for an event
 * @param {string} eventName - Name of the event to listen for.
 * @param {function} callback - Function to invoke when said event is fired.
 */

const subscribe = (eventName, callback) => {
    if (!store[eventName]) {
        store[eventName] = new Set();
    }
    store[eventName].add(callback);
};

/**
 * unsubscribe a callback for an event
 * @param {string} eventName - Name of the event to unsubscribe from.
 * @param {function} callback - Function to unsubscribe.
 */
const unsubscribe = (eventName, callback) => {
    if (store[eventName]) {
        store[eventName].delete(callback);
    }
};

/**
 * Publish an event to listeners.
 * @param {string} eventName - Name of the event to publish.
 * @param {*} payload - Payload of the event to publish.
 */

const publish = (eventName, payload) => {
    if (store[eventName]) {
        store[eventName].forEach(callback => {
            try {
                callback(payload);
            } catch (error) {
                console.error(error);
            }
        });
    }
};

export default {
    subscribe,
    unsubscribe,
    publish
};