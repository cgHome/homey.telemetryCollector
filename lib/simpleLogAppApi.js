'use strict';

const Homey = require('homey');

const QUEUE_MAX = 100;

module.exports = class SimpleLogAppApi extends Homey.SimpleClass {

  // Singleton
  static getInstance(...args) {
    if (!this.instance) {
      this.instance = new this(...args);
      this.instance.logDebug('Singleton created');
    }
    return this.instance;
  }

  static isConnected() {
    return this.instance && this.instance.isConnected();
  }

  #appApi = null;
  #connected = false;
  #getQueue = [];
  #putQueue = [];

  constructor(homey) {
    super(homey);

    this.homey = homey;

    // Homey events
    this.homey
      .on('unload', this.#disconnect.bind(this));

    this.#appApi = this.homey.api.getApiApp('nl.nielsdeklerk.log');
    this.#appApi
      .on('install', this.#onInstall.bind(this))
      .on('uninstall', this.#onUninstall.bind(this))
      .on('realtime', this.#onRealtime.bind(this));

    this.#connect();
  }

  #onInstall(result) {
    this.logDebug('install event received');

    this.homey.setTimeout(() => {
      this.#connect();
    }, 2000); // Wait 2 sec. until app is ready
  }

  #onUninstall() {
    this.logDebug('uninstall event received');
    this.#disconnect();
  }

  #onRealtime(event, data) {
    // this.logDebug(`realtime received > event: ${event} data: ${Array.isArray(data) ? JSON.stringify(data) : data}`);
    this.emit(event, data);
  }

  async #connect() {
    if (this.isConnected()) return;

    this.logDebug('API connect');

    await this.#appApi.getInstalled()
      .then(async (isInstalled) => {
        if (!isInstalled) return;
        this.logDebug('App installed');

        this.#connected = true;
        await this.#handleGetQueue();
        await this.#handlePutQueue();
      })
      .catch((err) => this.logError(err));
  }

  async #disconnect() {
    if (!this.isConnected()) return;

    this.logDebug('API disconnect');
    this.#appApi.unregister();
    this.#connected = false;
  }

  isConnected() {
    return this.#connected;
  }

  async get(uri) {
    if (this.#getQueue.length < QUEUE_MAX) {
      await this.#getQueue.push(uri);
      await this.#handleGetQueue();
    }
  }

  async #handleGetQueue() {
    while (this.isConnected() && this.#getQueue.length > 0) {
      const uri = this.#getQueue.shift();
      // this.logDebug(`get() > uri: "${uri}"`);
      await this.#appApi.get(uri)
        .catch((error) => this.logError(`get() > ${error}`));
    }
  }

  async put(uri, data) {
    if (this.#putQueue.length < QUEUE_MAX) {
      await this.#putQueue.push({ uri, body: data });
      await this.#handlePutQueue();
    }
  }

  async #handlePutQueue() {
    while (this.isConnected() && this.#putQueue.length > 0) {
      const item = this.#putQueue.shift();
      // this.logDebug(`put() > uri: "${item.uri}", body: ${JSON.stringify(item.body)}`);
      await this.#appApi.put(item.uri, item.body)
        .catch((error) => this.logError(`put() > ${error}`));
    }
  }

};
