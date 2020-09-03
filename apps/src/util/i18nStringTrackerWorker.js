// Returns the Web Worker which buffers and records I18n string usage information.
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
// @param studioUrl [String] The URL of studio.code.org to send data to e.g. staging-studio.code.org, studio.code.org, etc.
// @return [Object] The i18n string tracker Web Worker.
export function getI18nStringTrackerWorker(studioUrl) {
  if (window.Worker && studioUrl) {
    return initializeWorker(studioUrl);
  } else {
    // If Web Workers are not supported, return a stubbed version.
    return {
      postMessage: function(message) {}
    };
  }
}

// Creates a singleton Web Worker if doesn't already exist
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
// @return [Object] The i18n string tracker Web Worker.
function initializeWorker(studioUrl) {
  // Initialize the worker if it doesn't already exist
  if (!window.i18nStringTrackerWorkerInstance) {
    // The Web Worker runs the given javascript file in a background thread. Since we want to use inline javascript
    // instead of a separate file, we will generate a Blob of binary data from `i18nStringTrackerWorker.toString()` and
    // generate a temporary URL for the Blob. This URL is then passed to the worker
    const blob = new Blob(
      [`(${i18nStringTrackerWorker.toString()})('${studioUrl}')`],
      {
        type: 'application/javascript'
      }
    );
    const blobURL = URL.createObjectURL(blob);
    window.i18nStringTrackerWorkerInstance = new Worker(blobURL);
    URL.revokeObjectURL(blobURL); // clean up
  }
  return window.i18nStringTrackerWorkerInstance;
}

// Background worker thread which buffers I18n string usage data and records it periodically.
// @param studioUrl [String] The URL of studio.code.org of the code.org page which started this worker. This is needed
// because the worker needs to make API calls to the studio.code.org API.
function i18nStringTrackerWorker(studioUrl) {
  const self = this;

  // A buffer of records so we can send them in batches.
  // It should have the following structure:
  // {
  //   'http://studio.code.org/s/20-hour/stage/2/puzzle/4': {
  //     'common_locale': [ 'curriculum', 'teacherForum', 'professionalLearning', ...]
  //   }
  // }
  self.buffer = {};

  // The Web Worker API onmessage handler which receives data sent using `worker.PostMessage`.
  // @param record [Object] The I18n string usage information. It should have the following structure:
  // {
  //   data: {
  //     url: 'http://studio.code.org/s/20-hour/stage/2/puzzle/4',
  //     source: 'common_locale',
  //     stringKey: 'professionalLearning',
  // }
  self.onmessage = function(record) {
    if (!record) {
      return;
    }

    const url = record.data.url;
    const source = record.data.source;
    const stringKey = record.data.stringKey;
    self.buffer[url] = self.buffer[url] || {};
    self.buffer[url][source] = self.buffer[url][source] || new Set();
    self.buffer[url][source].add(stringKey);

    // schedule a buffer flush if there isn't already one.
    if (!self.pendingFlush) {
      setTimeout(flush, 3000);
    }
  };

  // Sends all the buffered records
  function flush() {
    // Do nothing if there are no records to record.
    if (Object.keys(self.buffer).length === 0) {
      return;
    }

    // Grab the contents of the current buffer and clear the buffer.
    const records = self.buffer;
    self.buffer = {};
    self.pendingFlush = null;

    // Record the i18n string usage data.
    sendRecords(records);
  }

  // Sends the given i18n string usage records to the /i18n/track_string_usage API.
  // @param records [Object] It should have the following structure:
  // {
  //   'http://studio.code.org/s/20-hour/stage/2/puzzle/4': {
  //     'common_locale': [ 'curriculum', 'teacherForum', 'professionalLearning', ...]
  //   }
  // }
  function sendRecords(records) {
    Object.keys(records).forEach(url => {
      Object.keys(records[url]).forEach(source => {
        const stringKeys = Array.from(records[url][source]);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${studioUrl}/i18n/track_string_usage`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        const data = {
          url: url,
          source: source,
          string_keys: stringKeys
        };
        xhr.send(JSON.stringify(data));
      });
    });
  }
}
