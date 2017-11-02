'use strict';

const assert = require('assert');
const watson = require('../../index');
const nock = require('nock');
const fs = require('fs');

describe('language_translator', function() {
  const noop = function() {};

  const service = {
    username: 'batman',
    password: 'bruce-wayne',
    url: 'http://ibm.com:80',
    version: 'v2'
  };

  before(function() {
    nock.disableNetConnect();
  });

  after(function() {
    nock.cleanAll();
  });

  const language_translator = watson.language_translator(service);

  const missingParameter = function(err) {
    assert.ok(err instanceof Error && /required parameters/.test(err));
  };

  describe('VCAP_SERVICES', function() {
    let env;
    before(function() {
      env = process.env;
      process.env = {};
    });
    after(function() {
      process.env = env;
    });

    const details = [
      {
        credentials: {
          password: 'FAKE_PASSWORD',
          url: 'https://gateway.watsonplatform.net/language-translator/api',
          username: 'FAKE_USERNAME'
        },
        label: 'language_translator',
        name: 'Language Translator-4t',
        plan: 'standard',
        provider: null,
        syslog_drain_url: null,
        tags: ['watson', 'ibm_created', 'ibm_dedicated_public']
      }
    ];

    it('should initialize with old-style VCAP_SERVICES credentials', function() {
      process.env.VCAP_SERVICES = JSON.stringify({
        language_translator: details
      });
      const instance = watson.language_translator({
        version: 'v2',
        version_date: '2016-07-01'
      });
      assert(instance._options.headers.Authorization);
    });

    it('should initialize with new-style VCAP_SERVICES credentials', function() {
      process.env.VCAP_SERVICES = JSON.stringify({
        language_translator: details
      });
      const instance = watson.language_translator({
        version: 'v2',
        version_date: '2016-07-01'
      });
      assert(instance._options.headers.Authorization);
    });
  });

  describe('listModels()', function() {
    it('should generate a valid payload', function() {
      const corpus = {};
      const path = '/v2/models';

      nock(service.url)
        .persist()
        .get(path)
        .reply(200, corpus);

      const req = language_translator.listModels(null, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'GET');
    });
  });

  describe('translate()', function() {
    it('should check no parameters provided', function() {
      language_translator.translate({ source: '' }, missingParameter);
      language_translator.translate({ target: '' }, missingParameter);
      language_translator.translate({ text: '' }, missingParameter);
      language_translator.translate({ model_id: '' }, missingParameter);
    });

    it('should generate a valid payload', function() {
      const path = '/v2/translate';
      const service_request = {
        text: 'bar',
        model_id: 'foo'
      };
      nock(service.url)
        .persist()
        .post(path, service_request)
        .reply(200);

      const req = language_translator.translate(service_request, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'POST');
      const body = Buffer.from(req.body).toString('ascii');
      assert.equal(body, JSON.stringify(service_request));
    });
  });

  describe('listIdentifiableLanguages()', function() {
    it('should generate a valid payload', function() {
      const path = '/v2/identifiable_languages';

      nock(service.url)
        .persist()
        .get(path)
        .reply(200);

      const req = language_translator.listIdentifiableLanguages(null, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'GET');
    });
  });

  describe('identify()', function() {
    it('should check no parameters provided', function() {
      language_translator.identify({}, missingParameter);
      language_translator.identify(null, missingParameter);
      language_translator.identify(undefined, missingParameter);
    });

    it('should generate a valid payload', function() {
      const path = '/v2/identify';
      const service_request = { text: 'foo' };
      nock(service.url)
        .persist()
        .post(path, service_request)
        .reply(200);

      const req = language_translator.identify(service_request, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'POST');
      const body = JSON.parse(req.body).text.toString('ascii');
      assert.equal(body, service_request.text);
    });
  });

  describe('createModel()', function() {
    it('should check no parameters provided', function() {
      language_translator.createModel({}, missingParameter);
      language_translator.createModel(null, missingParameter);
      language_translator.createModel(undefined, missingParameter);
    });

    it('should generate a valid payload', function() {
      const path = '/v2/models';
      const service_request = {
        base_model_id: 'foo',
        forced_glossary: fs.createReadStream(__dirname + '/../resources/glossary.tmx'),
        parallel_corpus: fs.createReadStream(__dirname + '/../resources/glossary.tmx'),
        monolingual_corpus: fs.createReadStream(__dirname + '/../resources/glossary.tmx')
      };

      nock(service.url)
        .persist()
        .post(path, service_request)
        .reply(200);

      const req = language_translator.createModel(service_request, noop);
      assert.equal(req.uri.href, service.url + path + '?base_model_id=foo');
      assert.equal(req.method, 'POST');
    });
  });

  describe('deleteModel()', function() {
    it('should check no parameters provided', function() {
      language_translator.deleteModel({}, missingParameter);
      language_translator.deleteModel(null, missingParameter);
      language_translator.deleteModel(undefined, missingParameter);
    });

    it('should generate a valid payload', function() {
      const path = '/v2/models/foo';
      const service_request = {
        model_id: 'foo'
      };

      nock(service.url)
        .persist()
        .delete(path, service_request)
        .reply(200);

      const req = language_translator.deleteModel(service_request, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'DELETE');
    });
  });

  describe('getModel()', function() {
    it('should check no parameters provided', function() {
      language_translator.getModel({}, missingParameter);
      language_translator.getModel(null, missingParameter);
      language_translator.getModel(undefined, missingParameter);
    });

    it('should generate a valid payload', function() {
      const path = '/v2/models/foo';
      const service_request = {
        model_id: 'foo'
      };

      nock(service.url)
        .persist()
        .get(path, service_request)
        .reply(200);

      const req = language_translator.getModel(service_request, noop);
      assert.equal(req.uri.href, service.url + path);
      assert.equal(req.method, 'GET');
    });
  });
});
