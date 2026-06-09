export function buildSampleCollectionHref(recordId) {
  const params = new URLSearchParams();
  if (recordId) {
    params.set('recordId', recordId);
  }
  const query = params.toString();
  return `/laboratory/sample-collection${query ? `?${query}` : ''}`;
}
