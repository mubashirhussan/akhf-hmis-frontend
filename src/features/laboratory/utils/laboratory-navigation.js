export function buildSampleReceivingHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/sample-receiving${query ? `?${query}` : ''}`;
}

export function buildSampleCollectionHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/sample-collection${query ? `?${query}` : ''}`;
}

export function buildResultEntryHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/result-entry${query ? `?${query}` : ''}`;
}

export function buildTestConductedHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/test-conducted${query ? `?${query}` : ''}`;
}

export function buildUndeliveredReportHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/undelivered-reports${query ? `?${query}` : ''}`;
}

export function buildDeliveredReportHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/delivered-reports${query ? `?${query}` : ''}`;
}
